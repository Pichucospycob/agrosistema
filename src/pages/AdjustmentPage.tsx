import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings2, History, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function AdjustmentPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [productsData, movementsData] = await Promise.all([
                window.db.getProducts(),
                window.db.getStockMovements()
            ]);
            setProducts(productsData);
            // Latest first
            setMovements(movementsData.reverse());
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function handleAdjust() {
        if (!productId || !quantity || !description) {
            setError("Todos los campos (Producto, Cantidad y Motivo) son obligatorios.");
            return;
        }

        const qty = parseFloat(quantity.replace(',', '.'));
        if (isNaN(qty) || qty === 0) {
            setError("La cantidad debe ser un número válido distinto de cero.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await window.db.addStockMovement({
                productId: parseInt(productId),
                quantity: qty,
                description: description,
                type: 'AJUSTE'
            });

            setSuccess(true);
            setProductId("");
            setQuantity("");
            setDescription("");
            loadData();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Error al realizar el ajuste: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Ajustes de Stock</h1>
                    <p className="text-slate-500 text-xs font-semibold">Correcciones manuales, consumos internos y bajas de producto</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Adjustment Form */}
                <Card className="lg:col-span-1 border shadow-none bg-white self-start">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-bold uppercase text-slate-600 flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-primary" /> Nuevo Ajuste Manual
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Producto</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            >
                                <option value="">Seleccionar insumo...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.presentation}) - Stock: {Number(p.currentStock || 0).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Cantidad (Positivo suma, Negativo resta)</Label>
                            <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="Ej: -5.5 o 10"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="h-10 border-slate-200"
                            />
                            <p className="text-[10px] text-slate-400 italic">Usa el signo "-" para descontar stock.</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Motivo / Referencia</Label>
                            <textarea
                                className="w-full min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary shadow-inner"
                                placeholder="Ej: Error en remito, Uso para limpieza de patio, Producto vencido..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-50 border border-red-100 flex gap-2 items-start">
                                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs font-semibold text-red-600 leading-tight">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded bg-green-50 border border-green-100 text-center">
                                <p className="text-xs font-bold text-green-700">✓ Ajuste registrado correctamente</p>
                            </div>
                        )}

                        <Button
                            onClick={handleAdjust}
                            disabled={loading}
                            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold h-10 shadow-sm transition-all"
                        >
                            {loading ? "PROCESANDO..." : "REGISTRAR AJUSTE"}
                        </Button>
                    </CardContent>
                </Card>

                {/* History Table */}
                <Card className="lg:col-span-2 border shadow-none bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-sm font-bold uppercase text-slate-600 flex items-center gap-2">
                            <History className="h-4 w-4 text-slate-400" /> Historial de Movimientos Manuales
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/30 border-b">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-bold text-[10px] uppercase tracking-wider py-3 px-6 text-slate-500">Fecha / Hora</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-wider py-3 text-slate-500">Producto</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-wider py-3 text-slate-500 text-center">Cant.</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-wider py-3 px-6 text-slate-500">Motivo / Descripción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.filter(m => m.type === 'AJUSTE' || m.type === 'AJUSTE_MANUAL').length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center text-slate-400 italic text-xs">
                                            No hay ajustes manuales registrados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    movements.filter(m => m.type === 'AJUSTE' || m.type === 'AJUSTE_MANUAL').map((m) => (
                                        <TableRow key={m.id} className="hover:bg-slate-50/50 border-b last:border-0 border-slate-100">
                                            <TableCell className="py-4 px-6">
                                                <div className="text-xs font-bold text-slate-700">
                                                    {m.date ? format(new Date(m.date), 'dd/MM/yyyy HH:mm') : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-xs font-semibold text-slate-800">{m.productName}</div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <div className={`text-xs font-bold flex items-center justify-center gap-1 ${m.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {m.quantity > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                                                    {Math.abs(m.quantity).toLocaleString('es-AR', { minimumFractionDigits: 1 })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 font-medium text-slate-500 text-xs">
                                                {m.description}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
