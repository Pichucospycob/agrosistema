import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
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

                // First compare by active/finalized groups
                const groupA = orderA <= 1 ? 0 : 1;
                const groupB = orderB <= 1 ? 0 : 1;

                if (groupA !== groupB) {
                    return groupA - groupB;
                }

                // Within same group, sort by date descending
                if (a.date !== b.date) {
                    return b.date.localeCompare(a.date);
                }

                // If dates are same, sort by ID descending
                return b.id - a.id;
            });

            setOrders(sortedData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Órdenes de Trabajo</h1>
                    <p className="text-slate-500 text-xs font-semibold">Registro histórico y gestión de labores agrícolas</p>
                </div>
                <Button onClick={() => navigate('/ordenes/nueva')} className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Orden
                </Button>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Nro Orden</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Fecha</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Campaña</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Contratista</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Labor</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Estado</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FileText className="h-8 w-8 opacity-20" />
                                        <span className="text-xs">No hay órdenes registradas.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-slate-50/80 transition-colors border-b last:border-0 border-slate-100">
                                    <TableCell className="font-bold text-slate-900 py-4 px-6">
                                        <span className="text-primary tracking-tighter">#{order.orderNumber.toString().padStart(8, '0')}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 font-medium">{order.date}</TableCell>
                                    <TableCell className="text-xs text-slate-500 font-bold">{order.campaign}</TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-800">{order.contractor}</TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{order.labor}</span>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeStatus status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6">
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
