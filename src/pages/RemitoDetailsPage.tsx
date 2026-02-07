import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, CheckCheck, AlertCircle, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { generateConsolidatedRemitoPDF } from "@/lib/pdf-generator";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function RemitoDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [remito, setRemito] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [showUndoConfirm, setShowUndoConfirm] = useState(false);
    const [cierreStep, setCierreStep] = useState(1);
    const [alertConfig, setAlertConfig] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: "", message: "" });

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            const data = await window.db.getRemitoDetails(parseInt(id));
            // Add input state for returns - Allow empty string for better editing
            data.items = data.items.map((i: any) => ({
                ...i,
                quantityDeliveredInput: i.quantityDelivered ? i.quantityDelivered.toString() : "",
                quantityReturnedInput: i.quantityReturned ? i.quantityReturned.toString() : ""
            }));
            setRemito(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCloseRemito = async () => {
        try {
            const itemsReturn = remito.items.map((i: any) => {
                const val = parseFloat(i.quantityReturnedInput);
                return {
                    productId: i.productId,
                    quantityReturned: isNaN(val) ? 0 : val
                };
            });

            await window.db.closeConsolidatedRemito({
                remitoId: remito.id,
                itemsReturn,
                // Also send updated delivered quantities just in case they were corrected
                itemsDelivered: remito.items.map((i: any) => ({
                    productId: i.productId,
                    quantityDelivered: parseFloat(i.quantityDeliveredInput) || 0
                }))
            });
            setShowCloseConfirm(false);
            setCierreStep(1);
            loadData();
            setAlertConfig({ open: true, title: "Éxito", message: "Remito cerrado y órdenes liquidadas correctamente." });
        } catch (error) {
            console.error(error);
            setAlertConfig({ open: true, title: "Error", message: "Hubo un problema al intentar cerrar el remito." });
        }
    };

    const handleUndoClose = async () => {
        setLoading(true);
        try {
            await window.db.undoCloseConsolidatedRemito(remito.id);
            setShowUndoConfirm(false);
            loadData();
            setAlertConfig({ open: true, title: "Éxito", message: "Cierre anulado. El remito ahora está abierto para edición." });
        } catch (error) {
            console.error(error);
            setAlertConfig({ open: true, title: "Error", message: "No se pudo anular el cierre del remito." });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Cargando historial...</div>;
    if (!remito) return <div className="p-8">Remito no encontrado.</div>;

    const isDefinitive = remito.status === 'CERRADO';

    return (
        <>
            <div className="space-y-6 pb-20 max-w-6xl mx-auto">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/remitos')} className="h-10 w-10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                                REMITO CONSOLIDADO <span className="font-mono text-primary">R-{remito.remitoNumber.toString().padStart(8, '0')}</span>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                                    isDefinitive ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"
                                )}>{isDefinitive ? 'Cierre Definitivo' : 'Remito Abierto'}</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Emitido el {format(new Date(remito.date), 'dd/MM/yyyy HH:mm')} - Contratista: {remito.contractor}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isDefinitive && (
                            <Button variant="ghost" onClick={() => setShowUndoConfirm(true)} className="text-slate-400 hover:text-red-500 font-bold border-transparent transition-colors">
                                <RotateCcw className="mr-2 h-4 w-4" /> ANULAR CIERRE
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => generateConsolidatedRemitoPDF(remito, remito.items)} className="font-bold border-slate-200">
                            <Printer className="mr-2 h-4 w-4" /> IMPRIMIR PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Linked Orders Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-slate-200 shadow-none bg-white">
                            <div className="bg-slate-50 border-b px-4 py-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Órdenes a las que liquida</span>
                            </div>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    {remito.orders.map((order: any) => (
                                        <div
                                            key={order.id}
                                            onClick={() => navigate(`/ordenes/${order.id}`)}
                                            className="p-3 border border-slate-100 rounded-lg hover:border-primary/40 hover:bg-slate-50 cursor-pointer transition-all group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-xs text-slate-900 group-hover:text-primary transition-colors">#{order.orderNumber.toString().padStart(8, '0')}</p>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">{order.labor}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-1 font-medium">{order.field}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {!isDefinitive && (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>INSTRUCCIONES DE CIERRE</span>
                                </div>
                                <p className="text-[11px] leading-relaxed font-medium">
                                    Una vez que el aplicador regrese del campo, ingrese la <b>DEVOLUCIÓN REAL</b> en el cuadro de edición más a la derecha.
                                    <br /><br />
                                    El stock retornará automáticamente al depósito.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Main Product Table */}
                    <Card className="md:col-span-3 border-slate-200 shadow-none bg-white overflow-hidden">
                        <div className="bg-slate-800 border-b px-6 py-3">
                            <div className="grid grid-cols-7 gap-4 text-[10px] font-bold uppercase text-white tracking-widest">
                                <div className="col-span-2">Insumo</div>
                                <div className="text-right">A Aplicar</div>
                                <div className="text-right">Entregado</div>
                                <div className="text-right">Dev. Teórica</div>
                                <div className="text-right">Dev. REAL</div>
                                <div className="text-right">Final</div>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {remito.items.map((item: any, idx: number) => {
                                    const theoretical = item.quantityTheoretical || 0;
                                    const delivered = item.quantityDelivered || 0;
                                    const expectedReturn = delivered - theoretical;
                                    const returnedReal = parseFloat(item.quantityReturnedInput) || 0;
                                    const consumption = delivered - returnedReal;

                                    return (
                                        <div key={item.productId} className="grid grid-cols-7 gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="col-span-2">
                                                <p className="font-bold text-xs text-slate-900">
                                                    {item.productName || `[P-${item.productId}] PRODUCTO ELIMINADO`}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    {item.productName ? item.productPresentation : `ID: P-${item.productId}`}
                                                </p>
                                            </div>
                                            <div className="text-right font-mono text-slate-400 text-xs font-bold">
                                                {theoretical.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-right px-1">
                                                {isDefinitive ? (
                                                    <div className="text-right font-mono text-slate-900 text-xs font-bold px-2 bg-slate-50 py-1 rounded">
                                                        {delivered.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        className="text-right font-mono font-bold border-blue-200 focus:ring-blue-500 h-8 bg-white shadow-sm"
                                                        value={item.quantityDeliveredInput}
                                                        onFocus={(e) => {
                                                            const target = e.target;
                                                            setTimeout(() => target.select(), 0);
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(',', '.');
                                                            if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                                                setRemito((prev: any) => ({
                                                                    ...prev,
                                                                    items: prev.items.map((it: any, i: number) =>
                                                                        i === idx ? { ...it, quantityDeliveredInput: val } : it
                                                                    )
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="text-right font-mono text-xs font-bold text-orange-400">
                                                {expectedReturn > 0 ? expectedReturn.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                            </div>
                                            <div className="px-1 text-right">
                                                {isDefinitive ? (
                                                    <span className="font-mono text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                                                        {item.quantityReturned.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        className="text-right font-mono font-bold border-slate-300 focus:ring-slate-900 h-8 bg-white shadow-sm"
                                                        value={item.quantityReturnedInput}
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
                                                                    setShowCloseConfirm(true);
                                                                }
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(',', '.');
                                                            // Allow numbers and at most one dot
                                                            if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                                                setRemito((prev: any) => ({
                                                                    ...prev,
                                                                    items: prev.items.map((it: any, i: number) =>
                                                                        i === idx ? { ...it, quantityReturnedInput: val } : it
                                                                    )
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="text-right font-mono text-xs font-bold text-green-600">
                                                {consumption.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!isDefinitive && (
                                <div className="bg-orange-50 p-6 border-t border-orange-100 flex justify-between items-center shadow-inner">
                                    <div className="flex items-center gap-3 text-orange-700">
                                        <AlertCircle className="h-5 w-5 animate-pulse" />
                                        <div className="text-[11px] font-bold leading-tight">
                                            ESTADO: PENDIENTE DE DEVOLUCIONES<br />
                                            <span className="font-medium">El stock del galpón no se actualizará hasta que cierre el remito.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!showCloseConfirm ? (
                                            <Button onClick={() => setShowCloseConfirm(true)} className="bg-green-600 hover:bg-green-700 font-bold shadow-md px-8 text-white">
                                                <CheckCheck className="mr-2 h-4 w-4" /> REGISTRAR DEVOLUCIÓN Y CERRAR
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                                                <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3" /> ¿Confirmar liquidación definitiva?
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setShowCloseConfirm(false)} className="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase">Cancelar</Button>
                                                <Button onClick={handleCloseRemito} size="sm" className="bg-red-600 hover:bg-red-700 font-bold px-6 text-white shadow-xl">SÍ, CERRAR AHORA</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Multi-step Cierre Dialog */}
            <Dialog open={showCloseConfirm} onOpenChange={(val) => { setShowCloseConfirm(val); if (!val) setCierreStep(1); }}>
                <DialogContent className="max-w-md border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-red-600 h-1.5 w-full" />
                    <div className="p-8 space-y-6">
                        {cierreStep === 1 ? (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-red-600">
                                        <AlertCircle className="h-6 w-6" />
                                        <h2 className="text-xl font-bold uppercase tracking-tight">Atención: Cierre de Remito</h2>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        Está por <b>liquidar definitivamente</b> el stock de este remito. Esta acción:
                                    </p>
                                    <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                                        <li>Deducirá el consumo real del stock del galpón.</li>
                                        <li>Dará por finalizadas todas las órdenes vinculadas.</li>
                                        <li>Generará movimientos de retorno automáticos.</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="ghost" onClick={() => setShowCloseConfirm(false)} className="flex-1 font-bold text-slate-400 uppercase h-11">Cancelar</Button>
                                    <Button onClick={() => setCierreStep(2)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase h-11 shadow-lg">Entiendo, Continuar</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-orange-600">
                                        <CheckCheck className="h-6 w-6" />
                                        <h2 className="text-xl font-bold uppercase tracking-tight">Confirmación Final</h2>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        ¿Está <b>absolutamente seguro</b> de que las devoluciones informadas coinciden con lo que volvió del campo?
                                    </p>
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                                        <p className="text-[10px] text-orange-700 font-bold leading-tight">
                                            Si cierra sin informar lo real, el stock del sistema no coincidirá con el stock físico del galpón.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="ghost" onClick={() => setCierreStep(1)} className="flex-1 font-bold text-slate-400 uppercase h-11">Volver</Button>
                                    <Button onClick={handleCloseRemito} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold uppercase h-11 shadow-lg">Sí, Confirmar Cierre</Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Undo Confirmation Dialog */}
            <Dialog open={showUndoConfirm} onOpenChange={setShowUndoConfirm}>
                <DialogContent className="max-w-md border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-slate-900 h-1.5 w-full" />
                    <div className="p-8 space-y-6">
                        <div className="space-y-4 text-center">
                            <div className="flex justify-center">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                                    <RotateCcw className="h-6 w-6" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">Anular Cierre de Remito</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                ¿Desea anular el cierre? El remito y sus órdenes volverán al estado <b>Abierto</b> y se revertirán los movimientos de stock.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setShowUndoConfirm(false)} className="flex-1 font-bold text-slate-400 uppercase h-11">Cancelar</Button>
                            <Button onClick={handleUndoClose} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase h-11 shadow-lg">Anular Cierre</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={alertConfig.open} onOpenChange={(val) => setAlertConfig({ ...alertConfig, open: val })}>
                <DialogContent className="max-w-sm border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-slate-900 h-1.5 w-full" />
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
        </>
    );
}
