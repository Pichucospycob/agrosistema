import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Helper for formatting doses (4 decimals)
const formatDose = (num: number | string) => {
    const val = typeof num === 'string' ? parseFloat(num) : num;
    return val.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

// Helper for formatting quantities (3 decimals)
const formatQuantity = (num: number | string) => {
    const val = typeof num === 'string' ? parseFloat(num) : num;
    return val.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
};

// Generic for others
// Generic for others
const formatNumber = (num: number) => num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Helper for 8-digit padding
const padNumber = (num: number | string, length = 8) => {
    return num.toString().padStart(length, '0');
};

export const generateWorkOrderPDF = (order: any, items: any[]) => {
    const doc = new jsPDF();
    const orderNumStr = padNumber(order.orderNumber || 0);

    // -- Header --
    doc.setFontSize(22);
    doc.text("ORDEN DE TRABAJO", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`N° Orden: ${orderNumStr}`, 150, 30);
    doc.text(`Fecha: ${format(new Date(order.date), 'dd/MM/yyyy')}`, 150, 35);
    doc.text(`Campaña: ${order.campaign}`, 150, 40);

    doc.setFontSize(12);
    doc.text("AGROSISTEMA", 15, 30);
    doc.setFontSize(8);
    doc.text("GESTIÓN AGROPECUARIA", 15, 34);

    // -- General Info --
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    doc.setFontSize(11);
    doc.text(`Contratista: ${order.contractor}`, 15, 55);
    doc.text(`Campo / Lote: ${order.field}`, 15, 62);
    doc.text(`Cultivo: ${order.crop}`, 100, 62);

    doc.text(`Labor: ${order.labor}`, 15, 69);
    doc.text(`Implantado: ${order.implanted ? 'SI' : 'NO'}`, 100, 69);
    doc.text(`Superficie Total: ${formatNumber(order.totalSurface)} Ha`, 150, 69);

    // -- Lots Breakdown --
    if (order.lots && order.lots.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const lotsText = order.lots.map((l: any) => `${l.name}: ${l.appliedSurface}ha`).join(' | ');
        doc.text(`Lotes: ${lotsText}`, 15, 74);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
    }

    // -- Technical Info --
    doc.text("DATOS TÉCNICOS DE APLICACIÓN", 15, 80);
    doc.setFontSize(10);
    doc.text(`Pastilla: ${order.nozzleType} ${order.nozzleDescription ? '(' + order.nozzleDescription + ')' : ''}`, 15, 87);

    const toBar = (val: number, unit: string) => {
        if (unit === "Bares") return val;
        if (unit === "Libras") return val / 14.5038;
        if (unit === "Kg/cm2") return val / 1.01972;
        return val;
    };
    const pBar = toBar(order.pressure, order.pressureUnit);
    const pPsi = Math.round(pBar * 14.5038);
    const pKg = (pBar * 1.01972).toFixed(1);

    doc.text(`Caudal: ${order.waterPerHa} L/Ha`, 150, 87);

    // Pressure in a small column
    doc.setFontSize(9);
    doc.text("Presión de Trabajo:", 100, 85);
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(`- ${pBar.toFixed(1)} Bar`, 100, 89);
    doc.text(`- ${pPsi} PSI`, 100, 93);
    doc.text(`- ${pKg} Kg/cm²`, 100, 97);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Nota: Viento ${order.windSpeed || 0} km/h - Humedad ${order.humidity || 0}%`, 15, 97);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // -- Table --
    autoTable(doc, {
        startY: 105,
        head: [['Producto', 'Dosis (L/Ha)', 'Total Teórico (L)']],
        body: items.map(item => [
            `${item.productName} (${item.productPresentation || ''})`,
            formatDose(item.dose),
            formatQuantity(item.quantityTheoretical)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] }
    });

    // -- Footer --
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // -- Instructions & Observations --
    doc.setFontSize(10);
    doc.text("Instrucciones para Aplicador:", 15, finalY);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const splitInstr = doc.splitTextToSize(order.instructions || "Sin instrucciones específicas.", 170);
    doc.text(splitInstr, 15, finalY + 5);

    const obsY = finalY + 5 + (splitInstr.length * 5) + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Observaciones Generales:", 15, obsY);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const splitObs = doc.splitTextToSize(order.observations || "Sin observaciones.", 170);
    doc.text(splitObs, 15, obsY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("__________________________           __________________________", 25, obsY + 40);
    doc.text("Firma Responsable                   Firma Contratista/Aplicador", 30, obsY + 45);

    // Filename: OT-NUM-LOTE-FECHA.pdf (clean LOTE name from spaces/special chars)
    const cleanField = (order.field || 'SIN-LOTE').replace(/[^a-z0-9]/gi, '-').substring(0, 15);
    const dateStr = format(new Date(order.date), 'yyyyMMdd');
    doc.save(`OT-${orderNumStr}-${cleanField}-${dateStr}.pdf`);
};

export const generateRemitoPDF = (order: any, items: any[]) => {
    const doc = new jsPDF();
    const isDefinitive = order.status === 'CERRADA';
    const remitoNumStr = padNumber(order.remitoNumber || 0);
    const orderNumStr = padNumber(order.orderNumber || 0);

    // -- Header --
    doc.setFontSize(22);
    doc.text(isDefinitive ? "REMITO DEFINITIVO" : "REMITO PROVISIONAL", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`N° Remito: ${remitoNumStr}`, 150, 25);
    doc.text(`N° Orden Vinc.: ${orderNumStr}`, 150, 30);
    doc.text(`Fecha Emisión: ${format(new Date(), 'dd/MM/yyyy')}`, 150, 35);

    doc.setFontSize(12);
    doc.text("AGROSISTEMA", 15, 30);
    doc.setFontSize(8);
    doc.text("GESTIÓN AGROPECUARIA", 15, 34);

    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    doc.setFontSize(11);
    doc.text(`Destino / Campo: ${order.field}`, 15, 55);
    doc.text(`Contratista: ${order.contractor}`, 15, 62);

    if (isDefinitive) {
        doc.setTextColor(0, 100, 0); // Greener for definitive
        doc.text("ESTADO: CONSUMO FINAL REGISTRADO", 15, 70);
        doc.setTextColor(0, 0, 0);
    } else {
        doc.setTextColor(200, 100, 0); // Orange for provincial
        doc.text("ESTADO: SALIDA DE DEPÓSITO (SUJETO A DEVOLUCIÓN)", 15, 70);
        doc.setTextColor(0, 0, 0);
    }

    // -- Table --
    autoTable(doc, {
        startY: 75,
        head: [['Producto', 'A Aplicar', 'Entregado', 'Remesa Real', 'Devolución']],
        body: items.map(item => {
            const theoretical = item.quantityTheoretical || 0;
            const delivered = item.quantityDelivered || 0;
            const returned = item.quantityReturned || 0;
            const real = isDefinitive ? (item.quantityReal || (delivered - returned)) : delivered;

            return [
                `${item.productName} (${item.productPresentation || ''})`,
                formatQuantity(theoretical),
                formatQuantity(delivered),
                formatQuantity(real),
                formatQuantity(returned)
            ];
        }),
        theme: 'striped',
        headStyles: { fillColor: isDefinitive ? [20, 80, 20] : [40, 40, 40] },
        styles: { fontSize: 9 }
    });

    // -- Footer --
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFontSize(10);
    doc.text("__________________________           __________________________", 25, finalY);
    doc.text("Firma Salida Depósito                 Recibí Conforme", 30, finalY + 5);

    // Filename: REMITO-[PROV/FINAL]-NUM-OT-NUM.pdf
    const typeTag = isDefinitive ? 'FINAL' : 'PROV';
    doc.save(`REMITO-${typeTag}-${remitoNumStr}-OT-${orderNumStr}.pdf`);
};
