import { Request, Response } from "express";
import { User } from "../entities/User";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).send("Error al obtener los usuarios");
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    } catch (err) {
      res.status(500).send("Error al obtener el usuario");
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = new User();
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.age = req.body.age;
      const newUser = await userService.createUser(user);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send("Error al crear el usuario");
    }
  }
}