import { getConnection, sql } from '../database/connection.js'
import jwt from 'jsonwebtoken'

export const postLogin = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body // Supone que los parámetros vienen en el body
    if (!usuario || !contrasena) {
      return res.status(400).json({
        error: 'Params invalids'
      })
    }

    await getConnection()

    const request = new sql.Request()

    request.input('Usuario', sql.VarChar, usuario)
    request.input('Passw', sql.VarChar, contrasena)

    // Ejecutar el procedimiento almacenado
    const result = await request.execute('ProgramaEmergente.PAS_Login')

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Usuario o contraseña incorrectos'
      })
    }

    const token = jwt.sign({ ID_USUARIO: result.recordset[0].ID_USUARIO }, process.env.JWT_KEY, { expiresIn: '1h' })
    const maxAge = 60 * 60 * 1000 // 30 minutos
    res.cookie('authenticated', true, { maxAge })

    res.cookie('accessToken', token, {
      httpOnly: true, // La cookie solo se puede acceder en el servidor
      maxAge, // La cookie tiene un tiempo de validez de 1 hora
      sameSite: 'strict', // La cookie solo se puede acceder en el mismo dominio
      secure: process.env.NODE_ENV === 'production' // La cookie solo se puede acceder en https
    })

    res.status(200).json({
      data: result.recordset[0],
      accesToken: token,
      expires: maxAge
    })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const postLogout = async (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
  // res.cookie('accessToken', null, { maxAge: 0})
  res.clearCookie('authenticated', { maxAge: 0 })
  res.status(200).json({ message: 'Logout successfull' })
}
