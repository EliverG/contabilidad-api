// services/ExportacionService.ts - NUEVO ARCHIVO
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { BalanceGeneral } from '../types/BalanceGeneral';
import { ReporteDetallado, ReporteSeccion } from '../types/Reportes';

export class ExportacionService {

  
  // 📈 EXPORTAR BALANCE GENERAL A EXCEL
  async exportarBalanceGeneralExcel(balance: BalanceGeneral, res: Response): Promise<void> {
  try {
    console.log('📊 Iniciando exportación Excel de Balance General...');
    console.log('📈 Datos recibidos:', {
      empresaId: balance.empresaId,
      periodoId: balance.periodoId,
      totalActivos: balance.totalActivos,
      totalPasivos: balance.totalPasivos,
      totalPatrimonio: balance.totalPatrimonio
    });

    const workbook = new ExcelJS.Workbook();
    
    // Agregar metadata al workbook
    workbook.creator = 'Sistema Contable';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Balance General');

    // Estilos
    const headerStyle: Partial<ExcelJS.Style> = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1976D2' } },
      font: { bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center' }
    };

    // Título
    worksheet.mergeCells('A1:C1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'BALANCE GENERAL';
    titleCell.style = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center' }
    };

    // Información
    worksheet.getCell('A2').value = 'Empresa ID:';
    worksheet.getCell('B2').value = balance.empresaId;
    worksheet.getCell('A3').value = 'Periodo ID:';
    worksheet.getCell('B3').value = balance.periodoId;
    worksheet.getCell('A4').value = 'Fecha:';
    worksheet.getCell('B4').value = new Date().toLocaleDateString('es-GT');

    // SECCIÓN ACTIVOS
    let row = 6;
    worksheet.mergeCells(`A${row}:C${row}`);
    const activosTitle = worksheet.getCell(`A${row}`);
    activosTitle.value = 'ACTIVOS';
    activosTitle.style = headerStyle;
    row++;

    // Encabezados activos
    worksheet.getCell(`A${row}`).value = 'Código';
    worksheet.getCell(`B${row}`).value = 'Nombre de Cuenta';
    worksheet.getCell(`C${row}`).value = 'Saldo';
    
    // Aplicar estilo a encabezados
    ['A', 'B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3F2FD' } },
        font: { bold: true },
        border: {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        }
      };
    });
    row++;

    // Datos activos
    balance.activos.forEach(cuenta => {
      worksheet.getCell(`A${row}`).value = cuenta.codigo;
      worksheet.getCell(`B${row}`).value = cuenta.nombreCuenta;
      worksheet.getCell(`C${row}`).value = cuenta.saldo;
      
      // Formato numérico para saldo
      const saldoCell = worksheet.getCell(`C${row}`);
      saldoCell.numFmt = '#,##0.00';
      
      row++;
    });

    // Total activos
    worksheet.getCell(`B${row}`).value = 'TOTAL ACTIVOS:';
    worksheet.getCell(`C${row}`).value = balance.totalActivos;
    worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
    
    // Estilo para total
    ['B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BBDEFB' } },
        font: { bold: true }
      };
    });
    row += 2;

    // SECCIÓN PASIVOS
    worksheet.mergeCells(`A${row}:C${row}`);
    const pasivosTitle = worksheet.getCell(`A${row}`);
    pasivosTitle.value = 'PASIVOS';
    pasivosTitle.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC004E' } },
      font: { bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center' }
    };
    row++;

    // Encabezados pasivos
    worksheet.getCell(`A${row}`).value = 'Código';
    worksheet.getCell(`B${row}`).value = 'Nombre de Cuenta';
    worksheet.getCell(`C${row}`).value = 'Saldo';
    
    ['A', 'B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCE4EC' } },
        font: { bold: true },
        border: {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        }
      };
    });
    row++;

    // Datos pasivos
    balance.pasivos.forEach(cuenta => {
      worksheet.getCell(`A${row}`).value = cuenta.codigo;
      worksheet.getCell(`B${row}`).value = cuenta.nombreCuenta;
      worksheet.getCell(`C${row}`).value = cuenta.saldo;
      worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
      row++;
    });

    // Total pasivos
    worksheet.getCell(`B${row}`).value = 'TOTAL PASIVOS:';
    worksheet.getCell(`C${row}`).value = balance.totalPasivos;
    worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
    
    ['B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8BBD0' } },
        font: { bold: true }
      };
    });
    row += 2;

    // SECCIÓN PATRIMONIO
    worksheet.mergeCells(`A${row}:C${row}`);
    const patrimonioTitle = worksheet.getCell(`A${row}`);
    patrimonioTitle.value = 'PATRIMONIO';
    patrimonioTitle.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E7D32' } },
      font: { bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center' }
    };
    row++;

    // Encabezados patrimonio
    worksheet.getCell(`A${row}`).value = 'Código';
    worksheet.getCell(`B${row}`).value = 'Nombre de Cuenta';
    worksheet.getCell(`C${row}`).value = 'Saldo';
    
    ['A', 'B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E8' } },
        font: { bold: true },
        border: {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        }
      };
    });
    row++;

    // Datos patrimonio
    balance.patrimonio.forEach(cuenta => {
      worksheet.getCell(`A${row}`).value = cuenta.codigo;
      worksheet.getCell(`B${row}`).value = cuenta.nombreCuenta;
      worksheet.getCell(`C${row}`).value = cuenta.saldo;
      worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
      row++;
    });

    // Total patrimonio
    worksheet.getCell(`B${row}`).value = 'TOTAL PATRIMONIO:';
    worksheet.getCell(`C${row}`).value = balance.totalPatrimonio;
    worksheet.getCell(`C${row}`).numFmt = '#,##0.00';
    
    ['B', 'C'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C8E6C9' } },
        font: { bold: true }
      };
    });

    // Ajustar anchos de columna
    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 40;
    worksheet.getColumn('C').width = 15;

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=balance-general-${Date.now()}.xlsx`);

    console.log('✅ Excel generado exitosamente, escribiendo respuesta...');
    
    // Escribir el workbook al response
    const buffer = await workbook.xlsx.writeBuffer();
    console.log(`📊 Tamaño del buffer Excel: ${buffer.byteLength} bytes`);
    
    res.write(Buffer.from(buffer));
    res.end();
    
    console.log('📤 Respuesta Excel enviada al cliente');
    
  } catch (error: any) {
    console.error('❌ Error CRÍTICO al exportar a Excel:', error);
    console.error('Stack trace:', error.stack);
    throw new Error(`Error al exportar a Excel: ${error.message}`);
  }
}

  // 📋 EXPORTAR REPORTE DETALLADO A EXCEL
  async exportarReporteDetalladoExcel(reporte: ReporteDetallado, res: Response): Promise<void> {
  try {
    console.log('📊 Iniciando exportación Excel de Reporte Detallado...');

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema Contable';
    
    const worksheet = workbook.addWorksheet('Reporte Detallado');

    // Título
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = 'REPORTE DETALLADO - BALANCE GENERAL';
    worksheet.getCell('A1').style = { 
      font: { bold: true, size: 16 }, 
      alignment: { horizontal: 'center' } 
    };

    // Información
    worksheet.getCell('A2').value = 'Empresa ID:';
    worksheet.getCell('B2').value = reporte.empresaId;
    worksheet.getCell('A3').value = 'Período ID:';
    worksheet.getCell('B3').value = reporte.periodoId;

    // Encabezados
    const encabezados = ['Asiento', 'Fecha', 'Cuenta', 'Descripción', 'Débito', 'Crédito', 'Centro Costo', 'Proyecto'];
    let row = 5;
    
    encabezados.forEach((encabezado, index) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}${row}`);
      cell.value = encabezado;
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } },
        font: { bold: true, color: { argb: 'FFFFFF' } },
        alignment: { horizontal: 'center' }
      };
    });
    row++;

    // Datos
    reporte.asientos.forEach(asiento => {
      worksheet.getCell(`A${row}`).value = asiento.numeroAsiento;
      worksheet.getCell(`B${row}`).value = new Date(asiento.fecha).toLocaleDateString('es-GT');
      worksheet.getCell(`C${row}`).value = `${asiento.codigoCuenta} - ${asiento.nombreCuenta}`;
      worksheet.getCell(`D${row}`).value = asiento.descripcionMovimiento || asiento.descripcionAsiento;
      worksheet.getCell(`E${row}`).value = asiento.debito;
      worksheet.getCell(`E${row}`).numFmt = '#,##0.00';
      worksheet.getCell(`F${row}`).value = asiento.credito;
      worksheet.getCell(`F${row}`).numFmt = '#,##0.00';
      worksheet.getCell(`G${row}`).value = asiento.centroCosto?.codigo || '-';
      worksheet.getCell(`H${row}`).value = asiento.proyecto?.codigo || '-';
      row++;
    });

    // Ajustar anchos
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      worksheet.getColumn(col).width = col === 'C' || col === 'D' ? 30 : 15;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-detallado-${Date.now()}.xlsx`);

    const buffer = await workbook.xlsx.writeBuffer();
    console.log(`📊 Tamaño del buffer Excel Detallado: ${buffer.byteLength} bytes`);
    
    res.write(Buffer.from(buffer));
    res.end();
    
  } catch (error: any) {
    console.error('❌ Error al exportar reporte detallado a Excel:', error);
    throw error;
  }
}

async exportarReporteSeccionExcel(reporte: ReporteSeccion, res: Response): Promise<void> {
  try {
    console.log('📊 Iniciando exportación Excel de Reporte por Sección...');

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema Contable';
    
    const worksheet = workbook.addWorksheet(`Reporte ${reporte.seccion}`);

    // Título
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `REPORTE DE ${reporte.seccion}`;
    worksheet.getCell('A1').style = { 
      font: { bold: true, size: 16 }, 
      alignment: { horizontal: 'center' } 
    };

    // Información
    worksheet.getCell('A2').value = 'Empresa ID:';
    worksheet.getCell('B2').value = reporte.empresaId;
    worksheet.getCell('A3').value = 'Período ID:';
    worksheet.getCell('B3').value = reporte.periodoId;

    // Encabezados
    const encabezados = ['Asiento', 'Fecha', 'Cuenta', 'Descripción', 'Débito', 'Crédito'];
    let row = 5;
    
    encabezados.forEach((encabezado, index) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}${row}`);
      cell.value = encabezado;
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: reporte.seccion === 'ACTIVO' ? '1976D2' : reporte.seccion === 'PASIVO' ? 'DC004E' : '2E7D32' } },
        font: { bold: true, color: { argb: 'FFFFFF' } },
        alignment: { horizontal: 'center' }
      };
    });
    row++;

    // Datos
    reporte.movimientos.forEach(movimiento => {
      worksheet.getCell(`A${row}`).value = movimiento.numeroAsiento;
      worksheet.getCell(`B${row}`).value = new Date(movimiento.fecha).toLocaleDateString('es-GT');
      worksheet.getCell(`C${row}`).value = `${movimiento.codigoCuenta} - ${movimiento.nombreCuenta}`;
      worksheet.getCell(`D${row}`).value = movimiento.descripcionMovimiento || movimiento.descripcionAsiento;
      worksheet.getCell(`E${row}`).value = movimiento.debito;
      worksheet.getCell(`E${row}`).numFmt = '#,##0.00';
      worksheet.getCell(`F${row}`).value = movimiento.credito;
      worksheet.getCell(`F${row}`).numFmt = '#,##0.00';
      row++;
    });

    // Ajustar anchos
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
      worksheet.getColumn(col).width = col === 'C' || col === 'D' ? 30 : 15;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-${reporte.seccion.toLowerCase()}-${Date.now()}.xlsx`);

    const buffer = await workbook.xlsx.writeBuffer();
    console.log(`📊 Tamaño del buffer Excel Sección: ${buffer.byteLength} bytes`);
    
    res.write(Buffer.from(buffer));
    res.end();
    
  } catch (error: any) {
    console.error('❌ Error al exportar reporte de sección a Excel:', error);
    throw error;
  }
}

  // 🛠️ MÉTODOS AUXILIARES
  private aplicarEstiloEncabezado(worksheet: ExcelJS.Worksheet, range: string): void {
    const [start, end] = range.split(':');
    worksheet.getCell(start).style = {
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'F5F5F5' } },
      font: { bold: true },
      border: {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      }
    };
  }









// 📄 EXPORTAR BALANCE GENERAL A PDF - MÉTODO COMPLETO
// 📄 EXPORTAR BALANCE GENERAL A PDF - MÉTODO CORREGIDO
async exportarBalanceGeneralPDF(balance: BalanceGeneral, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log('📊 Iniciando exportación PDF de Balance General...');
      console.log('📈 Datos recibidos:', {
        empresaId: balance.empresaId,
        periodoId: balance.periodoId,
        totalActivos: balance.totalActivos,
        totalPasivos: balance.totalPasivos,
        totalPatrimonio: balance.totalPatrimonio,
        activosCount: balance.activos.length,
        pasivosCount: balance.pasivos.length,
        patrimonioCount: balance.patrimonio.length
      });

      const doc = new PDFDocument({ margin: 50 });
      
      // Configurar headers ANTES de pipe
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=balance-general-${Date.now()}.pdf`);
      
      // Pipe el documento a la respuesta
      doc.pipe(res);

      // TÍTULO PRINCIPAL
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('BALANCE GENERAL', { align: 'center' });
      doc.moveDown(0.5);

      // INFORMACIÓN
      doc.fontSize(10).font('Helvetica').fillColor('#000000')
         .fillColor('#000000').text(`Empresa ID: ${balance.empresaId}`)
         .fillColor('#000000').text(`Periodo ID: ${balance.periodoId}`)
         .fillColor('#000000').text(`Fecha de generación: ${new Date(balance.fechaGeneracion).toLocaleDateString('es-GT')}`);
      doc.moveDown();

      let yPosition = doc.y;

      // SECCIÓN ACTIVOS
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').fillColor('#1976D2')
         .fillColor('#000000').text('ACTIVOS', 50, yPosition);
      yPosition += 25;

      // Encabezados activos
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
         .rect(50, yPosition, 500, 20).fill('#1976D2')
         .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
         .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
         .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
         .fillColor('#000000');
      
      yPosition += 25;

      // Datos activos
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      
      if (balance.activos.length === 0) {
        doc.fillColor('#000000').text('No hay cuentas de activos', 55, yPosition);
        yPosition += 20;
      } else {
        balance.activos.forEach((cuenta, index) => {
          // Verificar si necesitamos nueva página
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
            
            // Redibujar encabezados en nueva página
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
               .rect(50, yPosition, 500, 20).fill('#1976D2')
               .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
               .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
               .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
               .fillColor('#000000');
            
            yPosition += 25;
            doc.fontSize(8).font('Helvetica').fillColor('#000000');
          }

          // Fondo alternado para mejor legibilidad
          if (index % 2 === 0) {
            doc.rect(50, yPosition, 500, 15).fill('#F5F5F5');
          }

          // Mostrar datos de la cuenta
          doc.fillColor('#000000').text(cuenta.codigo || 'N/A', 55, yPosition + 3)
             .fillColor('#000000').text(cuenta.nombreCuenta || 'Sin nombre', 120, yPosition + 3, { width: 300 })
             .fillColor('#000000').text(this.formatearMoneda(cuenta.saldo || 0), 430, yPosition + 3, { width: 60, align: 'right' });

          yPosition += 18;
        });
      }

      // Total activos
      if (yPosition > 680) {
        doc.addPage();
        yPosition = 50;
      }

      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('TOTAL ACTIVOS:', 300, yPosition, { width: 120, align: 'right' })
         .fillColor('#000000').text(this.formatearMoneda(balance.totalActivos || 0), 430, yPosition, { width: 60, align: 'right' });

      yPosition += 30;

      // SECCIÓN PASIVOS
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').fillColor('#DC004E')
         .fillColor('#000000').text('PASIVOS', 50, yPosition);
      yPosition += 25;

      // Encabezados pasivos
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
         .rect(50, yPosition, 500, 20).fill('#DC004E')
         .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
         .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
         .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
         .fillColor('#000000');
      
      yPosition += 25;

      // Datos pasivos
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      
      if (balance.pasivos.length === 0) {
        doc.fillColor('#000000').text('No hay cuentas de pasivos', 55, yPosition);
        yPosition += 20;
      } else {
        balance.pasivos.forEach((cuenta, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
            
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
               .rect(50, yPosition, 500, 20).fill('#DC004E')
               .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
               .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
               .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
               .fillColor('#000000');
            
            yPosition += 25;
            doc.fontSize(8).font('Helvetica').fillColor('#000000');
          }

          if (index % 2 === 0) {
            doc.rect(50, yPosition, 500, 15).fill('#F5F5F5');
          }

          doc.fillColor('#000000').text(cuenta.codigo || 'N/A', 55, yPosition + 3)
             .fillColor('#000000').text(cuenta.nombreCuenta || 'Sin nombre', 120, yPosition + 3, { width: 300 })
             .fillColor('#000000').text(this.formatearMoneda(cuenta.saldo || 0), 430, yPosition + 3, { width: 60, align: 'right' });

          yPosition += 18;
        });
      }

      // Total pasivos
      if (yPosition > 680) {
        doc.addPage();
        yPosition = 50;
      }

      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('TOTAL PASIVOS:', 300, yPosition, { width: 120, align: 'right' })
         .fillColor('#000000').text(this.formatearMoneda(balance.totalPasivos || 0), 430, yPosition, { width: 60, align: 'right' });

      yPosition += 30;

      // SECCIÓN PATRIMONIO
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').fillColor('#2E7D32')
         .fillColor('#000000').text('PATRIMONIO', 50, yPosition);
      yPosition += 25;

      // Encabezados patrimonio
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
         .rect(50, yPosition, 500, 20).fill('#2E7D32')
         .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
         .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
         .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
         .fillColor('#000000');
      
      yPosition += 25;

      // Datos patrimonio
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      
      if (balance.patrimonio.length === 0) {
        doc.fillColor('#000000').text('No hay cuentas de patrimonio', 55, yPosition);
        yPosition += 20;
      } else {
        balance.patrimonio.forEach((cuenta, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
            
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#FFFFFF')
               .rect(50, yPosition, 500, 20).fill('#2E7D32')
               .fillColor('#000000').text('CÓDIGO', 55, yPosition + 5)
               .fillColor('#000000').text('NOMBRE DE CUENTA', 120, yPosition + 5)
               .fillColor('#000000').text('SALDO', 430, yPosition + 5, { width: 60, align: 'right' })
               .fillColor('#000000');
            
            yPosition += 25;
            doc.fontSize(8).font('Helvetica').fillColor('#000000');
          }

          if (index % 2 === 0) {
            doc.rect(50, yPosition, 500, 15).fill('#F5F5F5');
          }

          doc.fillColor('#000000').text(cuenta.codigo || 'N/A', 55, yPosition + 3)
             .fillColor('#000000').text(cuenta.nombreCuenta || 'Sin nombre', 120, yPosition + 3, { width: 300 })
             .fillColor('#000000').text(this.formatearMoneda(cuenta.saldo || 0), 430, yPosition + 3, { width: 60, align: 'right' });

          yPosition += 18;
        });
      }

      // Total patrimonio
      if (yPosition > 680) {
        doc.addPage();
        yPosition = 50;
      }

      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('TOTAL PATRIMONIO:', 300, yPosition, { width: 120, align: 'right' })
         .fillColor('#000000').text(this.formatearMoneda(balance.totalPatrimonio || 0), 430, yPosition, { width: 60, align: 'right' });

      yPosition += 30;

      // RESUMEN FINAL
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      doc.rect(50, yPosition, 500, 60).fill('#E8F5E8').stroke('#2E7D32');
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('RESUMEN DEL BALANCE', 60, yPosition + 5);

      doc.fontSize(10).font('Helvetica').fillColor('#000000')
         .fillColor('#000000').text(`Total Activos: ${this.formatearMoneda(balance.totalActivos || 0)}`, 60, yPosition + 25)
         .fillColor('#000000').text(`Total Pasivos: ${this.formatearMoneda(balance.totalPasivos || 0)}`, 250, yPosition + 25)
         .fillColor('#000000').text(`Total Patrimonio: ${this.formatearMoneda(balance.totalPatrimonio || 0)}`, 400, yPosition + 25);

      // Verificar ecuación contable
      const ecuacionCuadra = Math.abs(
        (balance.totalActivos || 0) - ((balance.totalPasivos || 0) + (balance.totalPatrimonio || 0))
      ) < 0.01;
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text(ecuacionCuadra ? '✓ ECUACIÓN CONTABLE CUADRADA' : '✗ ECUACIÓN CONTABLE NO CUADRADA', 
               60, yPosition + 45, { width: 400, align: 'left' });

      console.log('✅ PDF de Balance General generado exitosamente');
      
      // Finalizar documento
      doc.end();
      
      // Manejar eventos del documento
      doc.on('end', () => {
        console.log('📤 PDF de Balance General completamente enviado');
        resolve();
      });
      
      doc.on('error', (error) => {
        console.error('❌ Error en PDF de Balance General:', error);
        reject(error);
      });
        
    } catch (error: any) {
      console.error('❌ Error CRÍTICO al exportar Balance General a PDF:', error);
      console.error('Stack trace:', error.stack);
      reject(new Error(`Error al exportar Balance General a PDF: ${error.message}`));
    }
  });
}









  // 📄 EXPORTAR BALANCE GENERAL DETALLADO A PDF
  async exportarReporteDetalladoPDF(reporte: ReporteDetallado, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log('📊 Iniciando exportación PDF de Reporte Detallado...');
      console.log('📈 Total de asientos:', reporte.asientos.length);

      const doc = new PDFDocument({ margin: 50 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-detallado-${Date.now()}.pdf`);
      
      doc.pipe(res);

      // Título principal
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('REPORTE DETALLADO - BALANCE GENERAL', { align: 'center' });
      doc.moveDown(0.5);

      // Información del reporte
      doc.fontSize(10).font('Helvetica').fillColor('#000000')
         .fillColor('#000000').text(`Empresa ID: ${reporte.empresaId}`)
         .fillColor('#000000').text(`Período ID: ${reporte.periodoId}`)
         .fillColor('#000000').text(`Fecha de generación: ${new Date(reporte.fechaGeneracion).toLocaleDateString('es-GT')}`)
         .fillColor('#000000').text(`Total de asientos: ${reporte.asientos.length}`);
      doc.moveDown();

      // Verificar que hay datos
      if (reporte.asientos.length === 0) {
        doc.fillColor('#000000').text('No hay asientos contables para mostrar.', { align: 'center' });
        doc.end();
        resolve();
        return;
      }

      // ENCABEZADOS DE TABLA
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000');
      let yPosition = doc.y;
      
      // Dibujar fondo de encabezados
      doc.rect(50, yPosition, 500, 20).fill('#2E7D32');
      
      // Texto de encabezados
      doc.fillColor('#FFFFFF')
         .fillColor('#000000').text('ASIENTO', 55, yPosition + 5)
         .fillColor('#000000').text('FECHA', 120, yPosition + 5)
         .fillColor('#000000').text('CUENTA', 170, yPosition + 5)
         .fillColor('#000000').text('DESCRIPCIÓN', 270, yPosition + 5)
         .fillColor('#000000').text('DÉBITO', 430, yPosition + 5, { width: 60, align: 'right' })
         .fillColor('#000000').text('CRÉDITO', 495, yPosition + 5, { width: 60, align: 'right' });
      
      doc.fillColor('#000000');
      yPosition += 25;

      // DATOS DE ASIENTOS
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      
      reporte.asientos.forEach((asiento, index) => {
        // Verificar si necesitamos nueva página
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
          
          // Redibujar encabezados en nueva página
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
             .rect(50, yPosition, 500, 20).fill('#2E7D32')
             .fillColor('#FFFFFF')
             .fillColor('#000000').text('ASIENTO', 55, yPosition + 5)
             .fillColor('#000000').text('FECHA', 120, yPosition + 5)
             .fillColor('#000000').text('CUENTA', 170, yPosition + 5)
             .fillColor('#000000').text('DESCRIPCIÓN', 270, yPosition + 5)
             .fillColor('#000000').text('DÉBITO', 430, yPosition + 5, { width: 60, align: 'right' })
             .fillColor('#000000').text('CRÉDITO', 495, yPosition + 5, { width: 60, align: 'right' })
             .fillColor('#000000');
          
          yPosition += 25;
        }

        // Fondo alternado para mejor legibilidad
        if (index % 2 === 0) {
          doc.rect(50, yPosition, 500, 15).fill('#F5F5F5');
        }

        // Formatear fecha
        const fecha = new Date(asiento.fecha);
        const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        // Mostrar datos
        doc.fillColor('#000000').text(asiento.numeroAsiento || 'N/A', 55, yPosition + 3)
           .fillColor('#000000').text(fechaStr, 120, yPosition + 3)
           .fillColor('#000000').text(asiento.codigoCuenta, 170, yPosition + 3, { width: 90 })
           .fillColor('#000000').text(asiento.descripcionMovimiento || asiento.descripcionAsiento || 'Sin descripción', 270, yPosition + 3, { width: 150 })
           .fillColor('#000000').text(asiento.debito > 0 ? this.formatearMoneda(asiento.debito) : '-', 430, yPosition + 3, { width: 60, align: 'right' })
           .fillColor('#000000').text(asiento.credito > 0 ? this.formatearMoneda(asiento.credito) : '-', 495, yPosition + 3, { width: 60, align: 'right' });

        yPosition += 18;
      });

      // CALCULAR TOTALES
      const totalDebito = reporte.asientos.reduce((sum, a) => sum + a.debito, 0);
      const totalCredito = reporte.asientos.reduce((sum, a) => sum + a.credito, 0);
      const diferencia = totalDebito - totalCredito;

      // Nueva página si es necesario para los totales
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      // Línea separadora
      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      // MOSTRAR TOTALES
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('TOTALES:', 270, yPosition, { width: 150, align: 'left' })
         .fillColor('#000000').text(this.formatearMoneda(totalDebito), 430, yPosition, { width: 60, align: 'right' })
         .fillColor('#000000').text(this.formatearMoneda(totalCredito), 495, yPosition, { width: 60, align: 'right' });

      yPosition += 20;

      // RESUMEN FINAL
      doc.rect(50, yPosition, 500, 40).fill('#E8F5E8');
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('RESUMEN DEL REPORTE', 60, yPosition + 5)
         .fontSize(8).font('Helvetica').fillColor('#000000')
         .fillColor('#000000').text(`• Total asientos procesados: ${reporte.asientos.length}`, 60, yPosition + 15)
         .fillColor('#000000').text(`• Total débito: ${this.formatearMoneda(totalDebito)}`, 60, yPosition + 25)
         .fillColor('#000000').text(`• Total crédito: ${this.formatearMoneda(totalCredito)}`, 250, yPosition + 25)
         .fillColor('#000000').text(`• Diferencia: ${this.formatearMoneda(diferencia)}`, 400, yPosition + 25)
         .fillColor('#000000').text(diferencia === 0 ? '✓ BALANCE CUADRADO' : '✗ BALANCE NO CUADRADO', 400, yPosition + 15);

      console.log('✅ PDF de reporte detallado generado exitosamente');
      doc.end();
      
      doc.on('end', () => {
        console.log('📤 PDF de reporte detallado completamente enviado');
        resolve();
      });
      
      doc.on('error', (error) => {
        console.error('❌ Error en PDF de reporte detallado:', error);
        reject(error);
      });
        
    } catch (error: any) {
      console.error('❌ Error CRÍTICO al exportar reporte detallado a PDF:', error);
      console.error('Stack trace:', error.stack);
      reject(new Error(`Error al exportar reporte detallado a PDF: ${error.message}`));
    }
  });
}





  // 📄 EXPORTAR REPORTE POR SECCIÓN A PDF
  async exportarReporteSeccionPDF(reporte: ReporteSeccion, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`📊 Iniciando exportación PDF de Reporte de ${reporte.seccion}...`);

      const doc = new PDFDocument({ margin: 50 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-${reporte.seccion.toLowerCase()}-${Date.now()}.pdf`);
      
      doc.pipe(res);

      // Color según sección
      const color = reporte.seccion === 'ACTIVO' ? '#1976D2' : 
                   reporte.seccion === 'PASIVO' ? '#DC004E' : '#2E7D32';

      // Título
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000').fillColor(color)
         .fillColor('#000000').text(`REPORTE DE ${reporte.seccion}`, { align: 'center' });
      doc.moveDown(0.5);

      // Información
      doc.fontSize(10).font('Helvetica').fillColor('#000000').fillColor('#000000')
         .fillColor('#000000').text(`Empresa ID: ${reporte.empresaId}`)
         .fillColor('#000000').text(`Período ID: ${reporte.periodoId}`)
         .fillColor('#000000').text(`Fecha: ${new Date(reporte.fechaGeneracion).toLocaleDateString('es-GT')}`)
         .fillColor('#000000').text(`Movimientos: ${reporte.movimientos.length}`);
      doc.moveDown();

      if (reporte.movimientos.length === 0) {
        doc.fillColor('#000000').text('No hay movimientos en esta sección.', { align: 'center' });
        doc.end();
        resolve();
        return;
      }

      let yPosition = doc.y;

      // ENCABEZADOS
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
         .rect(50, yPosition, 500, 20).fill(color)
         .fillColor('#FFFFFF')
         .fillColor('#000000').text('ASIENTO', 55, yPosition + 5)
         .fillColor('#000000').text('FECHA', 120, yPosition + 5)
         .fillColor('#000000').text('CUENTA', 200, yPosition + 5)
         .fillColor('#000000').text('DESCRIPCIÓN', 320, yPosition + 5)
         .fillColor('#000000').text('DÉBITO', 470, yPosition + 5, { width: 40, align: 'right' })
         .fillColor('#000000').text('CRÉDITO', 520, yPosition + 5, { width: 40, align: 'right' })
         .fillColor('#000000');
      
      yPosition += 25;

      // DATOS
      doc.fontSize(8).font('Helvetica').fillColor('#000000');
      
      reporte.movimientos.forEach((movimiento, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        if (index % 2 === 0) {
          doc.rect(50, yPosition, 500, 15).fill('#F5F5F5');
        }

        const fecha = new Date(movimiento.fecha);
        const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        doc.fillColor('#000000').text(movimiento.numeroAsiento || 'N/A', 55, yPosition + 3)
           .fillColor('#000000').text(fechaStr, 120, yPosition + 3)
           .fillColor('#000000').text(movimiento.codigoCuenta, 200, yPosition + 3, { width: 110 })
           .fillColor('#000000').text(movimiento.descripcionMovimiento || movimiento.descripcionAsiento || '-', 320, yPosition + 3, { width: 140 })
           .fillColor('#000000').text(movimiento.debito > 0 ? this.formatearMoneda(movimiento.debito) : '-', 470, yPosition + 3, { width: 40, align: 'right' })
           .fillColor('#000000').text(movimiento.credito > 0 ? this.formatearMoneda(movimiento.credito) : '-', 520, yPosition + 3, { width: 40, align: 'right' });

        yPosition += 18;
      });

      // TOTALES
      const totalDebito = reporte.movimientos.reduce((sum, m) => sum + m.debito, 0);
      const totalCredito = reporte.movimientos.reduce((sum, m) => sum + m.credito, 0);

      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
         .fillColor('#000000').text('TOTALES:', 320, yPosition, { width: 140, align: 'left' })
         .fillColor('#000000').text(this.formatearMoneda(totalDebito), 470, yPosition, { width: 40, align: 'right' })
         .fillColor('#000000').text(this.formatearMoneda(totalCredito), 520, yPosition, { width: 40, align: 'right' });

      doc.end();
      
      doc.on('end', () => resolve());
      doc.on('error', (error) => reject(error));
        
    } catch (error: any) {
      console.error(`❌ Error al exportar reporte ${reporte.seccion} a PDF:`, error);
      reject(error);
    }
  });
}

  // 🛠️ MÉTODOS AUXILIARES PDF
  private agregarTablaCuentasPDF(doc: PDFKit.PDFDocument, cuentas: any[]): void {
    const startY = doc.y;
    
    // Encabezados
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').fillColor('#ffffff');
    doc.rect(50, startY, 80, 20).fillAndStroke('#666666', '#666666');
    doc.rect(130, startY, 300, 20).fillAndStroke('#666666', '#666666');
    doc.rect(430, startY, 120, 20).fillAndStroke('#666666', '#666666');
    
    doc.fillColor('#000000').text('Código', 55, startY + 5, { width: 70, align: 'left' });
    doc.fillColor('#000000').text('Nombre de Cuenta', 135, startY + 5, { width: 290, align: 'left' });
    doc.fillColor('#000000').text('Saldo', 435, startY + 5, { width: 110, align: 'right' });
    
    let currentY = startY + 20;
    doc.fillColor('#000000').font('Helvetica').fillColor('#000000').fontSize(8);
    
    cuentas.forEach((cuenta, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
      
      // Fondo alternado
      if (index % 2 === 0) {
        doc.rect(50, currentY, 500, 20).fill('#f8f9fa');
      }
      
      doc.fillColor('#000000').text(cuenta.codigo, 55, currentY + 5, { width: 70, align: 'left' });
      doc.fillColor('#000000').text(cuenta.nombreCuenta, 135, currentY + 5, { width: 290, align: 'left' });
      doc.fillColor('#000000').text(this.formatearMoneda(cuenta.saldo), 435, currentY + 5, { width: 110, align: 'right' });
      
      currentY += 20;
    });
    
    doc.y = currentY;
  }

  private calcularAlturaFilaPDF(asiento: any, anchoDescripcion: number): number {
    const descripcion = asiento.descripcionMovimiento || asiento.descripcionAsiento;
    const lineas = Math.ceil(descripcion.length / (anchoDescripcion / 6)); // Aproximación
    return Math.max(25, lineas * 12);
  }

  private formatearMoneda(monto: number): string {
  if (isNaN(monto) || !isFinite(monto) || monto === null || monto === undefined) {
    return 'Q 0.00';
  }
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2
  }).format(monto);
}









































// MÉTODO DE PRUEBA - PDF MUY SIMPLE
  async exportarPDFPrueba(res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🧪 Generando PDF de prueba...');
        
        const doc = new PDFDocument();
        
        // Configurar headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=prueba.pdf');
        
        doc.pipe(res);
        
        // Contenido MUY simple
        doc.fontSize(25).fillColor('#000000').text('¡PDF DE PRUEBA!', 100, 100);
        doc.fillColor('#000000').text('Si puedes ver esto, el PDF funciona.', 100, 150);
        doc.fillColor('#000000').text(`Generado: ${new Date().toISOString()}`, 100, 200);
        
        doc.end();
        
        doc.on('end', () => {
          console.log('✅ PDF de prueba generado exitosamente');
          resolve();
        });
        
        doc.on('error', (error) => {
          console.error('❌ Error en PDF de prueba:', error);
          reject(error);
        });
        
      } catch (error: any) {
        console.error('❌ Error al generar PDF de prueba:', error);
        reject(error);
      }
    });
  }

  // MÉTODO DE PRUEBA - EXCEL MUY SIMPLE
  async exportarExcelPrueba(res: Response): Promise<void> {
    try {
      console.log('🧪 Generando Excel de prueba...');
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Prueba');
      
      // Datos simples
      worksheet.getCell('A1').value = '¡EXCEL DE PRUEBA!';
      worksheet.getCell('A2').value = 'Si puedes ver esto, el Excel funciona.';
      worksheet.getCell('A3').value = `Generado: ${new Date().toISOString()}`;
      
      // Configurar respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=prueba.xlsx');
      
      console.log('✅ Excel de prueba generado, escribiendo respuesta...');
      await workbook.xlsx.write(res);
      console.log('📤 Excel de prueba enviado al cliente');
      
    } catch (error: any) {
      console.error('❌ Error al generar Excel de prueba:', error);
      throw error;
    }
  }












private async generarPDFBasico(titulo: string, contenido: string[], res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${titulo.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
      
      doc.pipe(res);
      
      // Título
      doc.fontSize(16).fillColor('#000000').text(titulo, { align: 'center' });
      doc.moveDown();
      
      // Contenido
      doc.fontSize(10);
      contenido.forEach(linea => {
        doc.fillColor('#000000').text(linea);
      });
      
      doc.end();
      
      doc.on('end', () => resolve());
      doc.on('error', (error) => reject(error));
      
    } catch (error) {
      reject(error);
    }
  });
}







  private aplicarEstiloFila(worksheet: ExcelJS.Worksheet, range: string, style: any): void {
    const [start, end] = range.split(':');
    worksheet.getCell(start).style = style;
  }
}