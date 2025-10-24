// controllers/EmpresaController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export class EmpresaController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log('📥 Obteniendo lista de empresas...');
      
      const query = `
        SELECT 
          id_empresa as id,
          nombre,
          ruc_nit as ruc,
          estado
        FROM EMPRESA 
        WHERE estado = 'ACTIVO'
        ORDER BY nombre
      `;
      
      const empresas = await AppDataSource.query(query);
      
      console.log('✅ Empresas obtenidas:', empresas.length);
      res.json(empresas);
    } catch (error: any) {
      console.error('❌ Error al obtener empresas:', error);
      res.status(500).json({ 
        message: "Error al obtener las empresas", 
        error: error.message 
      });
    }
  }
}