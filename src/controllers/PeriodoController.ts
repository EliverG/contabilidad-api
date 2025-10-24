// controllers/PeriodoController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export class PeriodoController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log('📥 Obteniendo lista de periodos...');
      
      const query = `
        SELECT 
          id_periodo as id,
          nombre_periodo as nombre,
          fecha_inicio as "fechaInicio",
          fecha_fin as "fechaFin",
          estado
        FROM PERIODO_CONTABLE 
        ORDER BY fecha_inicio DESC
      `;
      
      const periodos = await AppDataSource.query(query);
      
      console.log('✅ Periodos obtenidos:', periodos.length);
      res.json(periodos);
    } catch (error: any) {
      console.error('❌ Error al obtener periodos:', error);
      res.status(500).json({ 
        message: "Error al obtener los periodos contables", 
        error: error.message 
      });
    }
  }
}