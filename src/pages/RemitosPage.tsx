import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Truck, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function RemitosPage() {
    const [remitos, setRemitos] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadRemitos();
    }, []);

    async function loadRemitos() {
        try {
            const data = await window.db.getRemitos();
            setRemitos(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Historial de Remitos</h1>
                    <p className="text-slate-500 text-xs font-semibold">Gestión de entregas vinculadas a Órdenes de Trabajo</p>
                </div>
                <Button onClick={() => navigate('/ordenes')} className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm px-6">
                    Nueva Entrega (Desde OTs)
                </Button>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[150px] font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Nro Remito</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Fecha Emisión</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Contratista / Destino</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Estado</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {remitos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Truck className="h-8 w-8 opacity-20" />
                                        <span className="text-xs text-slate-400">No hay remitos registrados.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            remitos.map((remito) => (
                                <TableRow key={remito.id} className="group hover:bg-slate-50/80 transition-colors border-b last:border-0 border-slate-100">
                                    <TableCell className="font-bold text-slate-900 py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-primary tracking-tighter font-mono">R-{remito.remitoNumber.toString().padStart(8, '0')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {format(new Date(remito.date), 'dd/MM/yyyy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-800">
                                        <div className="flex items-center gap-2 uppercase tracking-tight">
                                            <User className="h-3.5 w-3.5 text-slate-400" />
                                            {remito.contractor}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <BadgeStatus status={remito.status} />
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/remitos/${remito.id}`)}
                                            className="h-8 rounded-md border-slate-200 text-slate-600 hover:text-primary hover:border-primary/40 font-bold text-[11px] transition-all px-3"
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1.5" /> VER DETALLES / CIERRE
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
        'EMITIDO': 'bg-blue-50 text-blue-700 border-blue-100',
        'CERRADO': 'bg-green-50 text-green-700 border-green-100',
        'ANULADO': 'bg-red-50 text-red-700 border-red-100',
    };
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
            styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'
        )}>
            {status}
        </span>
    );
}
