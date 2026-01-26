import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, FileText, Pencil, CheckSquare, Square, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showContractorWarning, setShowContractorWarning] = (useState as any)(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
        const onFocus = () => loadOrders();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    async function loadOrders() {
        try {
            const data = await window.db.getOrders();

            // Custom Sorting
            const sortedData = [...data].sort((a, b) => {
                const statusOrder: Record<string, number> = {
                    'BORRADOR': 0,
                    'EMITIDA': 1,
                    'CERRADA': 2,
                    'ANULADA': 3
                };

                const orderA = statusOrder[a.status] ?? 0;
                const orderB = statusOrder[b.status] ?? 0;

                const groupA = orderA <= 1 ? 0 : 1;
                const groupB = orderB <= 1 ? 0 : 1;

                if (groupA !== groupB) return groupA - groupB;
                if (a.date !== b.date) return b.date.localeCompare(a.date);
                return b.id - a.id;
            });

            setOrders(sortedData);
        } catch (error) {
            console.error(error);
        }
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCreateConsolidated = async () => {
        if (selectedIds.length === 0) return;

        const selectedOrders = orders.filter(o => selectedIds.includes(o.id));
        const contractors = new Set(selectedOrders.map(o => o.contractor));

        if (contractors.size > 1) {
            setShowContractorWarning(true);
            return;
        }

        proceedToEmission();
    };

    const proceedToEmission = () => {
        navigate(`/remitos/emision?ids=${selectedIds.join(',')}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Órdenes de Trabajo</h1>
                    <p className="text-slate-500 text-xs font-semibold">Registro histórico y gestión de labores agrícolas</p>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <Button onClick={handleCreateConsolidated} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md animate-in fade-in slide-in-from-right-2">
                            <Truck className="mr-2 h-4 w-4" /> Generar Remito ({selectedIds.length})
                        </Button>
                    )}
                    <Button onClick={() => navigate('/ordenes/nueva')} className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Orden
                    </Button>
                </div>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Nro Orden</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Fecha</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Lotes</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Labor</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Remito</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Estado</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FileText className="h-8 w-8 opacity-20" />
                                        <span className="text-xs">No hay órdenes registradas.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className={cn(
                                    "group hover:bg-slate-50/80 transition-colors border-b last:border-0 border-slate-100",
                                    selectedIds.includes(order.id) && "bg-blue-50/50"
                                )}>
                                    <TableCell className="py-4 pl-6">
                                        {order.status === 'BORRADOR' ? (
                                            <button onClick={() => toggleSelect(order.id)} className="text-slate-400 hover:text-primary transition-colors">
                                                {selectedIds.includes(order.id) ?
                                                    <CheckSquare className="h-5 w-5 text-primary" /> :
                                                    <Square className="h-5 w-5" />
                                                }
                                            </button>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900 py-4 px-6">
                                        <span className="text-primary tracking-tighter">#{order.orderNumber.toString().padStart(8, '0')}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 font-medium">
                                        {order.date ? format(new Date(order.date), 'dd/MM/yy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-800">{order.lotNames || order.field || '-'}</TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{order.labor}</span>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono text-slate-500">
                                        {order.remitoNumber ? (
                                            <button
                                                onClick={() => order.remitoId && navigate(`/remitos/${order.remitoId}`)}
                                                className="hover:text-primary hover:underline"
                                            >
                                                R-{order.remitoNumber.toString().padStart(8, '0')}
                                            </button>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <BadgeStatus status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6 flex justify-end gap-2">
                                        {order.status === 'BORRADOR' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/ordenes/editar/${order.id}`)}
                                                className="h-8 rounded-md border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 font-bold text-[11px] transition-all px-2"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/ordenes/${order.id}`)}
                                            className="h-8 rounded-md border-slate-200 text-slate-600 hover:text-primary hover:border-primary/40 font-bold text-[11px] transition-all px-3"
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1.5" /> VER DETALLES
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={showContractorWarning} onOpenChange={setShowContractorWarning}>
                <DialogContent className="max-w-md border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 w-full" />
                    <div className="p-6 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">Varios Contratistas</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                                Has seleccionado órdenes de **diferentes contratistas**.
                                <br /><br />
                                ¿Deseas continuar generando un **único remito consolidado** para todos ellos?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0 sm:justify-between pt-2">
                            <Button variant="ghost" onClick={() => setShowContractorWarning(false)} className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                                CANCELAR
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowContractorWarning(false);
                                    proceedToEmission();
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md h-10"
                            >
                                CONTINUAR
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function BadgeStatus({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'BORRADOR': 'bg-slate-100 text-slate-600 border-slate-200',
        'EMITIDA': 'bg-blue-50 text-blue-700 border-blue-100',
        'CERRADA': 'bg-green-50 text-green-700 border-green-100',
        'ANULADA': 'bg-red-50 text-red-700 border-red-100',
    };
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
            styles[status] || styles['BORRADOR']
        )}>
            {status}
        </span>
    );
}
