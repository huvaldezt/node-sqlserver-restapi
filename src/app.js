import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import peoeRoutes from './routes/peoe.routes.js'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 40 // Total de solicitudes por minuto
})

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(helmet())
app.use(limiter)
// Usa cookie-parser para poder leer las cookies en las solicitudes
app.use(cookieParser())

app.use('/api', peoeRoutes)

app.get('/', (req, res) => {
  res.send('<h3>Bienvenido a la API PEOE<h3>')
})

export default app
