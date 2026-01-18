import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Package, Trash2, Edit2, Loader2 } from "lucide-react";
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

export default function StockPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [openEntry, setOpenEntry] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [formData, setFormData] = useState({ name: "", activeIngredient: "", presentation: "" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();

        const onFocus = () => loadProducts();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    async function loadProducts() {
        try {
            const data = await window.db.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    async function handleSave() {
        if (!formData.name) {
            setError("El nombre del producto es obligatorio.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            if (editingProduct) {
                await window.db.updateProduct({
                    id: editingProduct.id,
                    ...formData
                });
            } else {
                await window.db.createProduct(formData);
            }
            setOpen(false);
            setEditingProduct(null);
            setFormData({ name: "", activeIngredient: "", presentation: "" });
            loadProducts();
        } catch (error: any) {
            console.error("Error saving product:", error);
            setError(`Error: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(product: any) {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            activeIngredient: product.activeIngredient || "",
            presentation: product.presentation || ""
        });
        setOpen(true);
    }

    async function handleDelete(id: number) {
        if (!confirm("¿Seguro que deseas eliminar este producto? Se perderá el historial de movimientos.")) return;
        try {
            await window.db.deleteProduct(id);
            loadProducts();
        } catch (error: any) {
            console.error("Error deleting product:", error);
            alert("Error al eliminar el producto.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Stock de Insumos</h1>
                    <p className="text-slate-500 text-xs font-semibold">Control de inventario y trazabilidad de productos</p>
                </div>

                <div className="flex gap-2">
                    <Dialog open={openEntry} onOpenChange={setOpenEntry}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-4 h-9 transition-all">
                                <Package className="mr-2 h-4 w-4" /> Registrar Entrada
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md border shadow-lg bg-white">
                            <StockEntryForm key={products.length} products={products} onSuccess={() => {
                                loadProducts();
                                setOpenEntry(false);
                            }} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val);
                        if (!val) {
                            setEditingProduct(null);
                            setFormData({ name: "", activeIngredient: "", presentation: "" });
                            setError(null);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-9 shadow-sm">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Insumo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md border shadow-lg bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-slate-900 uppercase">
                                    {editingProduct ? "Editar Insumo" : "Agregar Insumo"}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500">
                                    {editingProduct ? "Modifica los datos técnicos del producto." : "Configura los datos técnicos del nuevo producto."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Nombre Comercial</Label>
                                    <Input
                                        placeholder="Ej: Glifosato Premium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-10 border-slate-200"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Principio Activo</Label>
                                    <Input
                                        placeholder="Ej: Glifosato 62%"
                                        value={formData.activeIngredient}
                                        onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                                        className="h-10 border-slate-200 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Presentación</Label>
                                    <Input
                                        placeholder="Ej: Bidón 20L"
                                        value={formData.presentation}
                                        onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                                        className="h-10 border-slate-200 text-sm"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-xs font-bold text-red-600 text-center bg-red-50 py-2 rounded">⚠️ {error}</p>}
                            <DialogFooter className="gap-2 pt-2">
                                <Button variant="ghost" disabled={loading} onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-900 font-bold text-xs">CANCELAR</Button>
                                <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 font-bold px-6 text-white transition-all">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingProduct ? "ACTUALIZAR" : "GUARDAR"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards - More discrete */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border shadow-none bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Insumos Totales</CardTitle>
                        <Package className="h-4 w-4 text-slate-300" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl font-bold text-slate-900">{products.length}</div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-tighter">Items en Catálogo</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center py-2 gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar insumos..." className="pl-9 h-9 border-slate-200 bg-white text-sm" />
                </div>
            </div>

            <Card className="border shadow-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Insumo / Detalle</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">P. Activo</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Envase</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 text-slate-500">Stock Actual</TableHead>
                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider py-4 px-6 text-slate-500">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-400 italic text-xs">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Package className="h-8 w-8 opacity-20" />
                                        <span>No hay productos en inventario.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((p) => (
                                <TableRow key={p.id} className="hover:bg-slate-50/50 border-b last:border-0 border-slate-100">
                                    <TableCell className="py-4 px-6">
                                        <div className="font-bold text-slate-800 tracking-tight">{p.name}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: P-{p.id}</div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-xs font-semibold">{p.activeIngredient}</TableCell>
                                    <TableCell className="text-slate-500 text-xs font-medium italic">{p.presentation}</TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="text-lg font-bold text-slate-900 tracking-tighter">
                                            {p.currentStock?.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                            <span className="text-[9px] font-bold text-slate-400 ml-1.5 uppercase">Uts</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-6">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="h-7 w-7 text-slate-400 hover:text-primary transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-7 w-7 text-slate-400 hover:text-red-600 transition-colors">
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

function StockEntryForm({ products, onSuccess }: { products: any[], onSuccess: () => void }) {
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const qtyRef = useRef<HTMLInputElement>(null);

    // Auto-focus quantity when product is selected
    useEffect(() => {
        if (productId && qtyRef.current) {
            qtyRef.current.focus();
        }
    }, [productId]);

    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!productId || !quantity) return;
        setLoading(true);
        setSuccess(false);
        setError(null);
        try {
            await window.db.addStockMovement({
                productId: parseInt(productId),
                quantity: parseFloat(quantity.replace(',', '.')),
                description,
                type: 'COMPRA'
            });
            onSuccess();
            // Clear inputs for next entry
            setProductId("");
            setQuantity("");
            setDescription("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000); // Clear success message after 3s
        } catch (err: any) {
            console.error(err);
            setError("Error al actualizar stock: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid gap-4 py-4">
            <DialogHeader>
                <DialogTitle>Registrar Entrada de Stock</DialogTitle>
                <DialogDescription>
                    Suma stock a un producto existente (Compras).
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
                <Label>Producto</Label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                >
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.presentation})</option>
                    ))}
                </select>
            </div>
            <div className="grid gap-2">
                <Label>Cantidad (Entrada)</Label>
                <Input
                    ref={qtyRef}
                    type="text"
                    inputMode="decimal"
                    placeholder="Cantidad a sumar"
                    autoComplete="off"
                    value={quantity}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setQuantity(e.target.value.replace(',', '.'))}
                />
            </div>
            <div className="grid gap-2">
                <Label>Observación / Nro Remito</Label>
                <Input
                    placeholder="Opcional"
                    autoComplete="off"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 text-center animate-in fade-in duration-300">
                    ✓ Entrada registrada correctamente
                </div>
            )}
            <Button onClick={handleSubmit} disabled={loading} className="w-full mt-2">
                {loading ? "Guardando..." : "Registrar Entrada"}
            </Button>
        </div>
    );
}
