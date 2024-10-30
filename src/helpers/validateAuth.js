import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config() // Carga las variables de entorno

const JWT_KEY = process.env.JWT_KEY

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken // Leer el token desde la cookie
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' })
  }

  jwt.verify(token, JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' })
    }
    req.user = user // Guardar los datos del usuario en la solicitud
    next() // Continuar hacia el controlador
  })
}
