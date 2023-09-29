import { Router } from "express"
import viewsRouter from "./views.router/views.router.js"

const router = Router();

const viewRouter = new viewsRouter()

router.use('/', viewRouter.getRouter())

export default router