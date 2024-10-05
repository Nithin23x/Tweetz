import { Router } from "express";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";


const notificationRouter = Router()

notificationRouter.route("/all").get(jwtVerification,getNotifications)
notificationRouter.route("/delete").delete(jwtVerification,deleteNotifications)

export {notificationRouter} 