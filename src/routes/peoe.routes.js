import { Router } from "express";

import { postLogin, postLogout } from "../controllers/account.controller.js"

import {
  getSubsistemasId,
  getFolioPeoe
} from "../controllers/peoe.controller.js";

const router = Router();

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.get('/subsistemas/:id', getSubsistemasId);

router.get('/buscaFolio', getFolioPeoe);

export default router;
