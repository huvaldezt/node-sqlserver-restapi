import { Router } from 'express'
import { authenticateToken } from '../helpers/validateAuth.js'

import {
  postLogin,
  postLogout
} from '../controllers/account.controller.js'

import {
  getSubsistemasId,
  getFolioPeoe,
  getEscuelas,
  getFoliosXNombre,
  getFoliosXEscuela
} from '../controllers/peoe.controller.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('<h3>Bienvenido a la API PEOE<h3>')
})

router.post('/login', postLogin)

router.post('/logout', postLogout)

router.get('/subsistemas/:id', authenticateToken, getSubsistemasId)

router.get('/buscaFolio', authenticateToken, getFolioPeoe)

router.get('/getEscuelas', authenticateToken, getEscuelas)

router.get('/getFoliosXNombre', authenticateToken, getFoliosXNombre)

router.get('/getFoliosXEscuela/:id', authenticateToken, getFoliosXEscuela)

export default router
