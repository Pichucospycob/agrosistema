import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, FileText, Pencil, Droplets, Wind, MapPin } from "lucide-react";
import { generateWorkOrderPDF } from "@/lib/pdf-generator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial Load
    const loadOrder = useCallback(async () => {
        if (!id) return;
        try {
            const data = await window.db.getOrderDetails(parseInt(id));
            const { items: fetchedItems, lots: fetchedLots, ...orderData } = data;
            setOrder({ ...orderData, lots: fetchedLots });
            setItems(fetchedItems || []);
        } catch (err) {
            console.error(err);
            setError("Error cargando la orden.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!order) return <div className="p-8 text-center text-red-500">Orden no encontrada. {error}</div>;

    const safeDate = (dateStr: string) => {
        try {
            if (!dateStr) return "-";
            // The date is YYYY-MM-DD from the DB
            const [y, m, d] = dateStr.split('-').map(Number);
            return format(new Date(y, m - 1, d), 'dd/MM/yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const statusStyles: Record<string, string> = {
        'BORRADOR': 'bg-slate-100 text-slate-600 border-slate-200',
        'EMITIDA': 'bg-blue-50 text-blue-700 border-blue-200',
        'CERRADA': 'bg-green-50 text-green-700 border-green-200',
    };

    const formatQty = (num: number) => {
        return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDose = (num: number) => {
        return num.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 4 });
    };

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/ordenes')} className="hover:bg-slate-200">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-r pr-4">
                                {order.orderNumber ? `OT #${order.orderNumber.toString().padStart(6, '0')}` : 'Borrador'}
                            </h1>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                statusStyles[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                            )}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-semibold mt-1">
                            {safeDate(order.date)} • {order.contractor}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {order.status === 'BORRADOR' && (
                        <Button variant="outline" onClick={() => navigate(`/ordenes/editar/${order.id}`)} className="border-slate-300 hover:bg-slate-100 font-bold text-xs uppercase">
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Editar Orden
                        </Button>
                    )}
                    <Button onClick={async () => await generateWorkOrderPDF(order, items)} className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase shadow-sm">
                        <Printer className="mr-2 h-3.5 w-3.5" /> Imprimir OT
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* General & Technical Info combined or split */}
                    <Card className="border shadow-none bg-white">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-tight">
                                <FileText className="h-4 w-4 text-primary" />
                                Datos de la Labor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaña</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.campaign}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cultivo</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.crop}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo Labor</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.labor}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Superficie Total</Label>
                                    <div className="text-sm font-bold text-primary">{order.totalSurface} Ha</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Caudal</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.waterPerHa} Lts/Ha</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pastilla</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.nozzleType || '-'}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presión</Label>
                                    <div className="text-sm font-bold text-slate-700">{order.pressure} {order.pressureUnit}</div>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalles Labor</Label>
                                    <div className="text-sm text-slate-600">{order.nozzleDescription || '-'}</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Instrucciones / Receta de Carga</Label>
                                <div className="bg-slate-50/80 p-4 rounded border border-slate-200 text-sm italic text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {order.instructions || 'Sin instrucciones adicionales.'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recipe Table (The actual application order items) */}
                    <Card className="border shadow-none bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Receta Agronómica de Productos</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="py-3 px-6">Insumo / Producto</th>
                                        <th className="py-3 px-4 text-right">Dosis (L/Ha)</th>
                                        <th className="py-3 px-6 text-right">Total Teórico</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800">
                                                    {item.productName || `[P-${item.productId}] PRODUCTO ELIMINADO`}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-semibold">
                                                    {item.productName ? item.productPresentation : `ID: P-${item.productId}`}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right font-mono font-bold text-primary">
                                                {formatDose(item.dose)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="font-bold text-slate-900">{formatQty(item.quantityTheoretical)}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase">Litros / Kg</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-12 text-center text-slate-400 italic text-xs">
                                                No hay insumos cargados en esta receta.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Lots section */}
                    <Card className="border shadow-none bg-white">
                        <CardHeader className="bg-slate-800 py-3 px-4">
                            <CardTitle className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Lotes Aplicados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y">
                            {(order.lots || []).map((lot: any) => (
                                <div key={lot.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm uppercase">{lot.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Establecimiento</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-900">{lot.appliedSurface} Ha</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Superficie</div>
                                    </div>
                                </div>
                            ))}
                            {(!order.lots || order.lots.length === 0) && (
                                <div className="p-8 text-center text-slate-400 italic text-xs">
                                    No hay lotes vinculados.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Meteorological conditions (secondary) */}
                    <Card className="border shadow-none bg-slate-50/50">
                        <CardContent className="p-4 space-y-4">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">Condiciones Secundarias</div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Wind className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Viento</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{order.windSpeed || '0'} km/h</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Droplets className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Humedad</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{order.humidity || '0'} %</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* General observations */}
                    <Card className="border shadow-none bg-white">
                        <CardContent className="p-4">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Observaciones</div>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                {order.observations || 'Sin observaciones registradas.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
