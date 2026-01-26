import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Plus, Search, Truck, Eye, Calendar, User, Hash, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function SupplierRemitosPage() {
    const navigate = useNavigate();
    const [remitos, setRemitos] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Detail state
    const [selectedRemito, setSelectedRemito] = useState<any | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const loadRemitos = useCallback(async () => {
        try {
            const data = await window.db.getSupplierRemitos();
            setRemitos(data);
        } catch (error) {
            console.error("Error loading remitos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRemitos();
    }, [loadRemitos]);

    const handleViewDetails = async (remitoId: number) => {
        setLoadingDetails(true);
        setSelectedRemito(null);
        setDetailsOpen(true);
        try {
            const data = await window.db.getSupplierRemitoDetails(remitoId);
            setSelectedRemito(data);
        } catch (error) {
            console.error(error);
            setDetailsOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const filteredRemitos = remitos.filter(r =>
        r.supplier.toLowerCase().includes(search.toLowerCase()) ||
        r.remitoNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Remitos de Entrada</h1>
                    <p className="text-slate-500 text-xs font-semibold">Registro histórico de ingresos de proveedores</p>
                </div>

                <Button onClick={() => navigate('/remitos-entrada/nuevo')} className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-9 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Cargar Remito de Entrada
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por proveedor o número..."
                        className="pl-9 h-9 border-slate-200 bg-white text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">
                                <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Fecha</span>
                            </TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">
                                <span className="flex items-center gap-2"><User className="h-3 w-3" /> Proveedor</span>
                            </TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">
                                <span className="flex items-center gap-2"><Hash className="h-3 w-3" /> Nro Remito</span>
                            </TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-400 text-xs">Cargando...</TableCell>
                            </TableRow>
                        ) : filteredRemitos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center text-slate-400 italic text-xs">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Truck className="h-8 w-8 opacity-20" />
                                        <span>No se encontraron remitos de entrada.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRemitos.map((r) => (
                                <TableRow key={r.id} className="hover:bg-slate-50/50 border-b last:border-0 border-slate-100 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div className="font-bold text-slate-800 tracking-tight">{format(new Date(r.date), 'dd/MM/yyyy')}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Recibido</div>
                                    </TableCell>
                                    <TableCell className="py-4 font-bold text-slate-700 uppercase text-xs">
                                        {r.supplier}
                                    </TableCell>
                                    <TableCell className="py-4 font-mono text-xs text-slate-500">
                                        {r.remitoNumber}
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewDetails(r.id)}
                                                className="h-7 w-7 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-900 transition-colors">
                                                <FileDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl border shadow-lg bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Detalle de Remito de Entrada</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">Información técnica de la mercadería recibida</DialogDescription>
                    </DialogHeader>

                    {loadingDetails ? (
                        <div className="h-48 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : selectedRemito && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proveedor</p>
                                    <p className="text-sm font-bold text-slate-800 uppercase">{selectedRemito.supplier}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Número de Remito</p>
                                    <p className="text-sm font-mono font-bold text-primary">{selectedRemito.remitoNumber}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fecha Recepción</p>
                                    <p className="text-sm font-bold text-slate-700">{format(new Date(selectedRemito.date), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Observaciones</p>
                                    <p className="text-xs text-slate-600 italic">{selectedRemito.observations || 'Sin observaciones'}</p>
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="text-[9px] font-black uppercase px-6 py-3">Insumo / Presentación</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase py-3 text-right px-6">Cantidad</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedRemito.items.map((item: any, idx: number) => (
                                            <TableRow key={idx} className="border-b last:border-0 border-slate-100">
                                                <TableCell className="px-6 py-3">
                                                    <div className="font-bold text-slate-800 text-xs uppercase">{item.productName}</div>
                                                    <div className="text-[9px] text-slate-500 font-medium italic">{item.productPresentation}</div>
                                                </TableCell>
                                                <TableCell className="py-3 text-right px-6">
                                                    <div className="font-mono font-bold text-slate-900">
                                                        {item.quantity.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                                                        <span className="text-[9px] text-slate-400 ml-1 uppercase">Uts</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
