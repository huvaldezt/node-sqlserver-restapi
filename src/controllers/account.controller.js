import { getConnection, sql } from "../database/connection.js";
import jwt from 'jsonwebtoken';

export const postLogin = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body; // Supone que los parámetros vienen en el body
        if (!usuario || !contrasena) {
            return res.status(400).json({
                error: 'Params invalids',
            });
        }

        const pool = await getConnection();

        const request = new sql.Request();

        request.input('Usuario', sql.VarChar, usuario);
        request.input('Passw', sql.VarChar, contrasena);

        // Ejecutar el procedimiento almacenado
        const result = await request.execute('ProgramaEmergente.PAS_ObtInfoUsuario');

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                error: "Usuario o contraseña incorrectos" 
            });
        }

        const token = jwt.sign(result.recordset[0], process.env.JWT_KEY, { expiresIn: '1h' });
        const maxAge = 1000 * 60 * 30 //30 minutos

        res.cookie('authenticated', true, { maxAge: maxAge });

        res.cookie('accessToken', token, {
            httpOnly: true, //La cookie solo se puede acceder en el servidor
            maxAge: maxAge, //La cookie tiene un tiempo de validez de 1 hora
            sameSite: 'strict' //La cookie solo se puede acceder en el mismo dominio
        });

        res.status(200).json({
            data: result.recordset[0],
            acces_token: token,
            expires: maxAge
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const postLogout = async (req, res) => {
    res.cookie('accessToken', null, { maxAge: 0})
    res.cookie('authenticated', false, { maxAge: 0})
    res.status(200).json( {message: 'Logout successfull'})
}