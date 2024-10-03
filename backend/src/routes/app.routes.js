import {Router} from "express";
import { getUserProfile ,followUnfollowuser, getSuggestedusers} from "../controllers/app.controller.js";
import { jwtVerification } from "../middlewares/jwtVerification.js";

const appRouter = Router()

appRouter.route("/getProfile/:username").get(jwtVerification,getUserProfile);
appRouter.route("/follow/:userId").get(jwtVerification,followUnfollowuser) 
appRouter.route("/suggested").get(jwtVerification,getSuggestedusers)

export  {appRouter}