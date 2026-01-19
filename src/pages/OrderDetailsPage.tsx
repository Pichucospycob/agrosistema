import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, Truck, CheckCheck, FileText, Settings } from "lucide-react";
import { generateWorkOrderPDF, generateRemitoPDF } from "@/lib/pdf-generator";
import { format } from "date-fns";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        console.log("OrderDetailsPage mounted. ID param:", id);
        if (!id) {
            console.error("No ID found in URL");
            return;
        }

        const parsedId = parseInt(id);
        console.log("Parsed ID:", parsedId);

        if (isNaN(parsedId)) {
            console.error("ID is NaN");
            return;
        }

        window.db.getOrderDetails(parsedId)
            .then((data) => {
                console.log("Fetched Order Data:", data);
                const { items: fetchedItems, lots: fetchedLots, ...orderData } = data;
                setOrder({ ...orderData, lots: fetchedLots });

                const safeItems = (fetchedItems || []).map((i: any) => ({
                    ...i,
                    quantityTheoretical: i.quantityTheoretical?.toString() || "0",
                    quantityDelivered: (i.quantityDelivered || i.quantityTheoretical)?.toString() || "0",
                    quantityReturned: (i.quantityReturned || 0).toString()
                }));
                setItems(safeItems);
            })
            .catch(err => {
                console.error("Error fetching order:", err);
                setActionError("Error cargando la orden.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Handle Remito Emission
    const handleEmitRemito = async () => {
        if (!confirm("¿Confirmar salida y descontar stock? Esta acción es irreversible.")) return;

        try {
            // FIX: Pass as object { orderId, items } and include productId
            await window.db.emitRemito({
                orderId: order.id,
                items: items.map(i => ({
                    id: i.id,
                    productId: i.productId, // Required for stock movement
                    quantityDelivered: parseFloat(i.quantityDelivered)
                }))
            });

            // Reload data
            const updated = await window.db.getOrderDetails(order.id);
            const { items: updatedItems, ...updatedOrder } = updated;
            setOrder(updatedOrder);
            setItems(updatedItems.map((i: any) => ({
                ...i,
                quantityTheoretical: i.quantityTheoretical?.toString() || "0",
                quantityDelivered: (i.quantityDelivered || i.quantityTheoretical)?.toString() || "0",
                quantityReturned: (i.quantityReturned || 0).toString()
            })));

            // Generate PDF
            await generateRemitoPDF(updatedOrder, updatedItems);

            setActionSuccess("Remito emitido y stock descontado.");
            setTimeout(() => setActionSuccess(null), 3000);
        } catch (err: any) {
            console.error(err);
            setActionError("Error al emitir remito: " + (err.message || err));
        }
    };

    // Handle Order Close (Return)
    const handleCloseOrder = async () => {
        try {
            // FIX: Pass as object { orderId, items } and include productId
            await window.db.closeOrder({
                orderId: order.id,
                items: items.map(i => ({
                    id: i.id,
                    productId: i.productId, // Required for stock return
                    quantityReturned: parseFloat(i.quantityReturned || "0")
                }))
            });

            const updated = await window.db.getOrderDetails(order.id);
            const { items: updatedItems, ...updatedOrder } = updated;
            setOrder(updatedOrder);
            setItems(updatedItems.map((i: any) => ({
                ...i,
                quantityTheoretical: i.quantityTheoretical?.toString() || "0",
                quantityDelivered: i.quantityDelivered?.toString() || "0",
                quantityReturned: i.quantityReturned?.toString() || "0"
            })));

            await generateRemitoPDF(updatedOrder, updatedItems);
            setShowCloseConfirm(false);
            alert("Orden cerrada correctamente.");
        } catch (error) {
            console.error(error);
            alert("Error al cerrar orden.");
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;
    if (!order) return <div className="p-8">Orden no encontrada.</div>;

    const safeDate = (dateStr: string) => {
        try {
            if (!dateStr) return "-";
            return format(new Date(dateStr), 'dd/MM/yyyy');
        } catch (e) {
            console.error("Date error:", e);
            return dateStr;
        }
    };

    console.log("Rendering OrderDetails. Order:", order);

    const statusColor =
        order.status === 'BORRADOR' ? 'bg-yellow-500' :
            order.status === 'EMITIDA' ? 'bg-blue-500' :
                'bg-green-600';

    return (
        <div className="space-y-6 pb-20">
            {actionError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                    {actionError}
                </div>
            )}
            {actionSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200 text-center animate-in fade-in slide-in-from-top-2">
                    {actionSuccess}
                </div>
            )}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/ordenes')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            {order.orderNumber ? `Orden #${order.orderNumber.toString().padStart(8, '0')}` : 'Borrador'}
                            <span className={`text-xs px-2 py-1 rounded text-white ${statusColor}`}>{order.status}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {safeDate(order.date)} - {order.contractor}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={async () => await generateWorkOrderPDF(order, items)}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimir Orden
                    </Button>
                </div>
            </div>

            {/* SECTION 1: DETAILS */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Detalle de la Orden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <Label className="text-muted-foreground">Campo / Lote</Label>
                            <p className="font-medium">{order.field}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Cultivo</Label>
                            <p className="font-medium">{order.crop || '-'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Labor</Label>
                            <p className="font-medium">{order.labor}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Superficie</Label>
                            <p className="font-bold text-primary">{order.totalSurface} Ha</p>
                        </div>
                    </div>

                    {/* Lots breakdown for manchoneo */}
                    {order.lots && order.lots.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Lotes Seleccionados (Manchoneo)</Label>
                            <div className="flex flex-wrap gap-2">
                                {order.lots.map((lot: any) => (
                                    <div key={lot.id} className="flex flex-col border rounded bg-slate-50 p-2 min-w-[120px]">
                                        <span className="text-xs font-bold text-slate-700">{lot.name}</span>
                                        <span className="text-[10px] text-primary font-bold italic">{lot.appliedSurface} ha aplicadas</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                <Settings className="h-3 w-3" /> Parámetros Técnicos
                            </h3>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div>
                                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Pastilla</Label>
                                    <p className="font-semibold text-slate-800">{order.nozzleType || '-'}</p>
                                    {order.nozzleDescription && <p className="text-[10px] text-slate-500">{order.nozzleDescription}</p>}
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Presión de Trabajo</Label>
                                    <p className="font-bold text-primary">
                                        {order.pressure} {order.pressureUnit}
                                        <div className="text-[10px] text-slate-400 font-normal space-x-1">
                                            <span>({order.pressureUnit === 'Bares' ? Math.round(order.pressure * 14.5038) : (order.pressureUnit === 'Kg/cm2' ? Math.round((order.pressure / 1.01972) * 14.5038) : order.pressure)} PSI)</span>
                                            <span>/</span>
                                            <span>({order.pressureUnit === 'Kg/cm2' ? order.pressure : (order.pressureUnit === 'Bares' ? (order.pressure * 1.01972).toFixed(1) : ((order.pressure / 14.5038) * 1.01972).toFixed(1))} Kg/cm²)</span>
                                        </div>
                                    </p>
                                </div>
                                <div className="col-span-2 flex gap-6 border-t pt-2 opacity-60">
                                    <div>
                                        <Label className="text-[10px] uppercase text-slate-400 font-bold">Viento</Label>
                                        <p className="text-xs font-semibold">{order.windSpeed || 0} km/h</p>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] uppercase text-slate-400 font-bold">Humedad</Label>
                                        <p className="text-xs font-semibold">{order.humidity || 0}%</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Label className="text-[10px] uppercase text-slate-400 font-bold">Caudal</Label>
                                        <p className="font-bold text-slate-900">{order.waterPerHa || 0} L/Ha</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Instrucciones y Observaciones
                            </h3>
                            <div className="space-y-3">
                                {order.instructions && (
                                    <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100/50">
                                        <Label className="text-[10px] uppercase text-amber-600 font-bold">Instrucciones Aplicador</Label>
                                        <p className="text-sm whitespace-pre-wrap font-medium text-amber-900 mt-1">{order.instructions}</p>
                                    </div>
                                )}
                                {order.observations && (
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <Label className="text-[10px] uppercase text-slate-400 font-bold">Observaciones Generales</Label>
                                        <p className="text-sm text-slate-700 mt-1">{order.observations}</p>
                                    </div>
                                )}
                                {!order.instructions && !order.observations && (
                                    <p className="text-sm text-slate-400 italic">Sin observaciones adicionales.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <h3 className="font-semibold border-b pb-2 pt-6 text-slate-800">Mezcla de Productos (Receta)</h3>
                    <div className="grid gap-2">
                        {items?.map((item, i) => (
                            <div key={i} className="flex justify-between p-3 bg-muted/50 rounded-md">
                                <div>
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">{item.productPresentation}</p>
                                    <p className="text-xs text-muted-foreground italic">Dosis: {item.dose} L/Ha</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{parseFloat(item.quantityTheoretical)?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} L</p>
                                    <p className="text-xs text-muted-foreground">Total Calculado</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 2: REMITO */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Generar Remito de Salida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {order.status !== 'BORRADOR' && (
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2">
                            <CheckCheck className="h-4 w-4" /> Remito ya emitido.
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="hidden md:grid grid-cols-5 gap-4 px-4 text-xs font-semibold text-muted-foreground">
                            <div className="col-span-1">Producto</div>
                            <div className="text-right">Teórico (T)</div>
                            <div className="text-right">Entregado</div>
                            <div className="text-right">A Devolver</div>
                            <div className="text-right">Acción</div>
                        </div>
                        {items?.map((item, index) => {
                            const totalT = item.quantityTheoretical || 0;
                            const entregado = parseFloat(item.quantityDelivered) || 0;
                            const aDevolver = Math.max(0, entregado - totalT);

                            return (
                                <div key={item.id || index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                    <div className="col-span-1">
                                        <p className="font-medium text-base">{item.productName}</p>
                                        <p className="text-xs text-muted-foreground">{item.productPresentation}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground md:hidden text-left">Teórico</p>
                                        <p className="font-mono">{parseFloat(totalT.toString()).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground md:hidden text-left">Entregado</p>
                                        <Input
                                            type="text"
                                            inputMode="decimal"
                                            className="text-right font-mono"
                                            disabled={order.status !== 'BORRADOR'}
                                            value={item.quantityDelivered}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(',', '.');
                                                const newItems = [...items];
                                                newItems[index].quantityDelivered = val;
                                                setItems(newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground md:hidden text-left">A Devolver</p>
                                        <p className="font-mono font-semibold text-blue-600">{aDevolver.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        {/* Status or simple label */}
                                        <span className="text-[10px] uppercase text-muted-foreground">Pendiente</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {order.status === 'BORRADOR' ? (
                            <Button onClick={handleEmitRemito} className="bg-blue-600 hover:bg-blue-700">
                                <Truck className="mr-2 h-4 w-4" /> Confirmar Salida
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={async () => await generateRemitoPDF(order, items)}>
                                <FileText className="mr-2 h-4 w-4" /> Reimprimir Remito
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 3: CLOSE */}
            <Card>
                <CardHeader>
                    <CardTitle>3. Cierre y Devolución</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {order.status === 'BORRADOR' ? (
                        <div className="text-center py-8 text-muted-foreground">Emitir Remito primero.</div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="hidden md:grid grid-cols-5 gap-4 px-4 text-xs font-semibold text-muted-foreground">
                                    <div className="col-span-1">Producto</div>
                                    <div className="text-right">Entregado</div>
                                    <div className="text-right">Esperado (AD)</div>
                                    <div className="text-right">Devuelto</div>
                                    <div className="text-right text-green-600">Usado</div>
                                </div>
                                {items?.map((item, index) => {
                                    const entregado = parseFloat(item.quantityDelivered) || 0;
                                    const devuelto = parseFloat(item.quantityReturned) || 0;
                                    const totalT = item.quantityTheoretical || 0;
                                    const aDevolver = Math.max(0, entregado - totalT);
                                    const usado = entregado - devuelto;

                                    return (
                                        <div key={item.id || index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg hover:bg-muted/30">
                                            <div className="col-span-1">
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">{item.productPresentation}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground md:hidden text-left">Entregado</p>
                                                <p className="font-mono">{(entregado).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground md:hidden text-left">A Devolver</p>
                                                <p className="font-mono text-blue-600 font-semibold">{aDevolver.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground md:hidden text-left">Devuelto</p>
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    className="text-right font-mono"
                                                    disabled={order.status === 'CERRADA'}
                                                    value={item.quantityReturned}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(',', '.');
                                                        const newItems = [...items];
                                                        newItems[index].quantityReturned = val;
                                                        setItems(newItems);
                                                    }}
                                                />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground md:hidden text-left">Usado Real</p>
                                                <p className="font-mono font-bold text-green-600">{usado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end pt-4">
                                {order.status === 'EMITIDA' && (
                                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg border border-slate-200">
                                        {!showCloseConfirm ? (
                                            <Button onClick={() => setShowCloseConfirm(true)} className="bg-green-600 hover:bg-green-700">
                                                <CheckCheck className="mr-2 h-4 w-4" /> Cerrar Orden
                                            </Button>
                                        ) : (
                                            <>
                                                <span className="text-xs font-bold text-slate-500 px-2 uppercase">¿Confirmar Cierre?</span>
                                                <Button variant="ghost" size="sm" onClick={() => setShowCloseConfirm(false)} className="text-slate-500 hover:text-slate-900 font-bold text-xs">CANCELAR</Button>
                                                <Button onClick={handleCloseOrder} size="sm" className="bg-green-600 hover:bg-green-700 font-bold px-4">SÍ, CERRAR</Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
