import { Request, Response } from "express";
import { LibroMayorService } from "../services/LibroMayorService";

const service = new LibroMayorService();

export class LibroMayorController {
  async get(req: Request, res: Response) {
    try {
      const { empresa, desde, hasta, cuenta } = req.query;

      if (!empresa || !desde || !hasta) {
        return res.status(400).json({
          message:
            "Parámetros requeridos: empresa, desde (YYYY-MM-DD), hasta (YYYY-MM-DD)",
        });
      }

      const data = await service.consultar({
        empresa: Number(empresa),
        desde: String(desde),
        hasta: String(hasta),
        cuenta: cuenta ? Number(cuenta) : undefined,
      });

      res.json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: "Error al consultar libro mayor",
          error: error?.message ?? error,
        });
    }
  }
}
