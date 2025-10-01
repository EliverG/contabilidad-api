import { Router } from "express";
import { UserController } from "../controllers/userController";

const userController = new UserController();
const router = Router();

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);

export default router;