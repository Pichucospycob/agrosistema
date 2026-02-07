import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Truck, Package, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function RemitoEmissionPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderIds = searchParams.get('ids')?.split(',').map(Number) || [];
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [contractor, setContractor] = useState("");
    const [showZeroAlert, setShowZeroAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: "", message: "" });

    const loadRequirements = useCallback(async () => {
        try {
            const aggregated = await window.db.getAggregatedItemsForOrders(orderIds);
            setItems(aggregated.map((i: any) => ({
                ...i,
                quantityDeliveredInput: "0", // Default to zero as requested
            })));

            const orders = await window.db.getOrders();
            const selected = orders.find(o => orderIds.includes(o.id));
            if (selected) setContractor(selected.contractor);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [orderIds.join(',')]);

    useEffect(() => {
        if (orderIds.length === 0) {
            navigate('/ordenes');
            return;
        }
        loadRequirements();
    }, [navigate, orderIds.length, loadRequirements]);

    const handleEmit = async () => {
        try {
            const deliveredItems = items.map(i => {
                const val = parseFloat(i.quantityDeliveredInput || "0");
                if (isNaN(val)) return null;
                return { productId: i.productId, quantityDelivered: val };
            });

            if (deliveredItems.includes(null)) {
                setAlertConfig({ open: true, title: "Error de Validación", message: "Por favor, ingrese valores numéricos válidos en las cantidades." });
                return;
            }

            const totalQty = (deliveredItems as any[]).reduce((acc, i) => acc + i.quantityDelivered, 0);
            if (totalQty === 0) {
                setShowZeroAlert(true);
                return;
            }

            const res = await window.db.createConsolidatedRemito({
                orderIds,
                date: new Date().toISOString(),
                contractor,
                observations: `Salida consolidada de ${orderIds.length} órdenes.`,
                deliveredItems: deliveredItems as any[]
            });
            navigate(`/remitos/${res.id}`);
        } catch (error) {
            console.error(error);
            setAlertConfig({ open: true, title: "Error de Emisión", message: "Hubo un problema al intentar generar el remito." });
        }
    };

    if (loading) return <div className="p-8 text-center text-xs font-bold uppercase tracking-widest animate-pulse text-slate-400">Cargando Requerimientos...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4 border-b pb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/ordenes')} className="h-10 w-10">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Emisión de Remito (Apertura)</h1>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Paso 1: Definir entrega física de insumos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-blue-100 bg-blue-50/20 shadow-none overflow-hidden">
                        <div className="bg-blue-600 px-6 py-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Información de Destino</span>
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Contratista / Aplicador Responsable</label>
                                    <Input
                                        value={contractor}
                                        onChange={(e) => setContractor(e.target.value)}
                                        className="bg-white border-blue-200 h-10 font-bold uppercase text-xs"
                                        placeholder="EJ: GATTI FACUNDO / PEPE CUENCA"
                                    />
                                </div>
                                <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-blue-100/50 text-[11px] text-blue-700 leading-relaxed font-medium">
                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>Indique la cantidad exacta del producto que sale hacia el campo. El stock se descontará según el valor de <b>"ENTREGADO REAL"</b>.</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
                        <div className="bg-slate-800 border-b px-6 py-3">
                            <div className="grid grid-cols-6 gap-4 text-[10px] font-bold uppercase text-white tracking-widest">
                                <div className="col-span-2">Producto / Presentación</div>
                                <div className="text-right">Objetivo (OTs)</div>
                                <div className="text-right px-2">Entregado REAL</div>
                                <div className="text-right">Dev. Teórica</div>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {items.map((item, idx) => {
                                    const deliveredVal = parseFloat(item.quantityDeliveredInput) || 0;
                                    const expectedReturn = deliveredVal - item.quantityTheoretical;

                                    return (
                                        <div key={item.productId} className="grid grid-cols-6 gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg shrink-0 border border-slate-200">
                                                        <Package className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-xs text-slate-900 truncate">
                                                            {item.productName || `[P-${item.productId}] PRODUCTO ELIMINADO`}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                                                            {item.productName ? item.productPresentation : `ID: P-${item.productId}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono text-slate-400 text-xs font-bold">
                                                {item.quantityTheoretical.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            <div className="px-2">
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    className="text-right font-mono font-bold border-blue-300 focus:ring-blue-500 h-9 bg-white shadow-sm"
                                                    value={item.quantityDeliveredInput}
                                                    onFocus={(e) => {
                                                        const target = e.target;
                                                        setTimeout(() => target.select(), 0);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const inputs = document.querySelectorAll('input[type="text"]');
                                                            const index = Array.from(inputs).indexOf(e.currentTarget);
                                                            if (index < inputs.length - 1) {
                                                                (inputs[index + 1] as HTMLInputElement).focus();
                                                            } else {
                                                                handleEmit();
                                                            }
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(',', '.');
                                                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                                            setItems(prev => prev.map((it, i) =>
                                                                i === idx ? { ...it, quantityDeliveredInput: val } : it
                                                            ));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className={cn(
                                                "text-right font-mono text-xs font-bold",
                                                expectedReturn > 0 ? "text-orange-600" : "text-slate-300"
                                            )}>
                                                {expectedReturn > 0 ? expectedReturn.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-white sticky top-20">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resumen de Emisión</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Órdenes Vinculadas</span>
                                        <span className="text-xs font-bold text-slate-900">{orderIds.length} OTs</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Propósito</span>
                                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">Salida Depósito</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Button onClick={handleEmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md h-12">
                                    <Truck className="mr-2 h-4 w-4" /> GENERAR Y EMITIR
                                </Button>
                                <Button variant="ghost" onClick={() => navigate('/ordenes')} className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">
                                    CANCELAR
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showZeroAlert} onOpenChange={setShowZeroAlert}>
                <DialogContent className="max-w-md border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-orange-500 h-1.5 w-full" />
                    <div className="p-6 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                                <AlertCircle className="h-6 w-6 text-orange-500" />
                                Validación de Carga
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-600 leading-relaxed pt-2">
                                No se puede emitir un remito con cantidades en **CERO**.
                                <br /><br />
                                Por favor, verifique los valores ingresados en la columna **"Entregado REAL"** antes de continuar.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                            <Button
                                onClick={() => setShowZeroAlert(false)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 shadow-md"
                            >
                                ENTENDIDO, VOLVER A CARGAR
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={alertConfig.open} onOpenChange={(val) => setAlertConfig({ ...alertConfig, open: val })}>
                <DialogContent className="max-w-sm border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-orange-500 h-1.5 w-full" />
                    <div className="p-6 space-y-4 text-center">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 uppercase">{alertConfig.title}</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500">
                                {alertConfig.message}
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setAlertConfig({ ...alertConfig, open: false })} className="w-full bg-slate-900 text-white font-bold h-10">
                            ENTENDIDO
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
