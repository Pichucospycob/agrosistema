import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MapPin, Trash2, Edit2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function LotesPage() {
    const [lots, setLots] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingLot, setEditingLot] = useState<any | null>(null);
    const [formData, setFormData] = useState({ name: "", surface: "" });

    useEffect(() => {
        loadLots();
    }, []);

    async function loadLots() {
        try {
            const data = await window.db.getLots();
            setLots(data);
        } catch (error) {
            console.error("Error loading lots:", error);
        }
    }

    async function handleSave() {
        if (!formData.name || !formData.surface) return;
        setLoading(true);
        try {
            if (editingLot) {
                await window.db.updateLot({
                    id: editingLot.id,
                    name: formData.name,
                    surface: parseFloat(formData.surface) || 0
                });
            } else {
                await window.db.createLot({
                    name: formData.name,
                    surface: parseFloat(formData.surface) || 0
                });
            }
            setOpen(false);
            setEditingLot(null);
            setFormData({ name: "", surface: "" });
            loadLots();
        } catch (error) {
            console.error("Error saving lot:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(lot: any) {
        setEditingLot(lot);
        setFormData({ name: lot.name, surface: lot.surface.toString() });
        setOpen(true);
    }

    async function handleDelete(id: number) {
        if (!confirm("¿Seguro que deseas eliminar este lote?")) return;
        try {
            await window.db.deleteLot(id);
            loadLots();
        } catch (error) {
            console.error("Error deleting lot:", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Lotes / Campos</h1>
                    <p className="text-slate-500 text-xs font-semibold">Gestión de superficies y catastro productivo</p>
                </div>

                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) {
                        setEditingLot(null);
                        setFormData({ name: "", surface: "" });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-9 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Lote
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md border shadow-lg bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 uppercase">
                                {editingLot ? "Editar Lote" : "Agregar Lote"}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500">
                                {editingLot ? "Modifica los datos del lote seleccionado." : "Define el nombre y la superficie neta del nuevo lote."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase">Nombre / Identificación</Label>
                                <Input
                                    placeholder="Ej: Lote 1 - La Cañada"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-10 border-slate-200"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase">Superficie (Ha)</Label>
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="Ej: 50.5"
                                    value={formData.surface}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setFormData({ ...formData, surface: e.target.value.replace(',', '.') })}
                                    className="h-10 border-slate-200 font-bold text-primary"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2 pt-2">
                            <Button variant="ghost" disabled={loading} onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-900 font-bold text-xs">CANCELAR</Button>
                            <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 font-bold px-6 text-white transition-all">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingLot ? "ACTUALIZAR" : "REGISTRAR LOTE"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards - More discrete */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border shadow-none bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Superficie Operativa</CardTitle>
                        <MapPin className="h-4 w-4 text-slate-300" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl font-bold text-slate-900">
                            {lots.reduce((acc, lot) => acc + lot.surface, 0).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-tighter">Hectáreas Totales</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Identificación del Lote</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Superficie Neta</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-48 text-center text-slate-400 italic text-xs">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <MapPin className="h-8 w-8 opacity-20" />
                                        <span>No hay lotes configurados.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            lots.map((lot) => (
                                <TableRow key={lot.id} className="hover:bg-slate-50/50 border-b last:border-0 border-slate-100">
                                    <TableCell className="py-4 px-6">
                                        <div className="font-bold text-slate-800 tracking-tight">{lot.name}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Estancia / Sector</div>
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="text-lg font-bold text-slate-900 tracking-tighter">
                                            {lot.surface.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                            <span className="text-[9px] font-bold text-slate-400 ml-1.5 uppercase">Hectáreas</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(lot)} className="h-7 w-7 text-slate-400 hover:text-primary transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(lot.id)} className="h-7 w-7 text-slate-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
