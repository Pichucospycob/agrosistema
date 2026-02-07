import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, ArrowLeft, PackagePlus, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Item {
    productId: string;
    quantity: string;
    tempId: number;
}

export default function SupplierRemitoCreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

    // Header State
    const [header, setHeader] = useState({
        supplier: "",
        remitoNumber: "",
        date: new Date().toISOString().split('T')[0],
        observations: ""
    });

    // Items State
    const [items, setItems] = useState<Item[]>([
        { productId: "", quantity: "", tempId: Date.now() }
    ]);

    // New Product Dialog State
    const [showNewProduct, setShowNewProduct] = useState(false);
    const [newProductForm, setNewProductForm] = useState({ name: "", activeIngredient: "", presentation: "" });
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: "", message: "" });

    const lastRowRef = useRef<HTMLSelectElement>(null);

    const loadProducts = useCallback(async () => {
        try {
            const data = await window.db.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleAddItem = () => {
        setItems([...items, { productId: "", quantity: "", tempId: Date.now() }]);
    };

    const handleRemoveItem = (tempId: number) => {
        if (items.length === 1) return;
        setItems(items.filter(i => i.tempId !== tempId));
    };

    const updateItem = (tempId: number, field: keyof Item, value: string) => {
        setItems(items.map(i => i.tempId === tempId ? { ...i, [field]: value } : i));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && index === items.length - 1) {
            const currentItem = items[index];
            if (currentItem.productId && currentItem.quantity) {
                handleAddItem();
            }
        }
    };

    const handleSaveProduct = async () => {
        if (!newProductForm.name) return;
        setCreatingProduct(true);
        try {
            const newProd = await window.db.createProduct(newProductForm);
            await loadProducts();

            // Auto-select the new product in the last empty row or current row
            setItems(prev => {
                const last = prev[prev.length - 1];
                if (!last.productId) {
                    return prev.map((item, idx) => idx === prev.length - 1 ? { ...item, productId: newProd.id.toString() } : item);
                }
                return [...prev, { productId: newProd.id.toString(), quantity: "", tempId: Date.now() }];
            });

            setShowNewProduct(false);
            setNewProductForm({ name: "", activeIngredient: "", presentation: "" });
        } catch (error) {
            console.error(error);
        } finally {
            setCreatingProduct(false);
        }
    };

    const handleSaveRemito = async () => {
        if (!header.supplier || !header.remitoNumber) {
            setAlertConfig({ open: true, title: "Faltan Datos", message: "Proveedor y Número de Remito son obligatorios." });
            return;
        }

        const validItems = items.filter(i => i.productId && i.quantity);
        if (validItems.length === 0) {
            setAlertConfig({ open: true, title: "Insumos Vacíos", message: "Debe agregar al menos un producto con cantidad." });
            return;
        }

        setLoading(true);
        try {
            await window.db.createSupplierRemito({
                ...header,
                items: validItems.map(i => ({
                    productId: parseInt(i.productId),
                    quantity: parseFloat(i.quantity.replace(',', '.'))
                }))
            });
            navigate('/remitos-entrada');
        } catch (error) {
            console.error(error);
            setAlertConfig({ open: true, title: "Error", message: "Error al guardar el remito de entrada." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Cargar Remito de Entrada</h1>
                        <p className="text-slate-500 text-xs font-semibold">Registro de mercadería enviada por proveedores</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)} disabled={loading} className="font-bold text-xs uppercase h-9 px-6 border-slate-300">
                        CANCELAR
                    </Button>
                    <Button onClick={handleSaveRemito} disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase h-9 px-8 shadow-md">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        GUARDAR REMITO
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border shadow-none bg-white">
                    <CardHeader className="py-4 bg-slate-50/50 border-b">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cabezal de Remito</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Proveedor</Label>
                            <Input
                                placeholder="Ej: Atanor S.A."
                                value={header.supplier}
                                onChange={(e) => setHeader({ ...header, supplier: e.target.value })}
                                className="h-10 border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Nro Remito (Proveedor)</Label>
                            <Input
                                placeholder="Ej: 0001-00045678"
                                value={header.remitoNumber}
                                onChange={(e) => setHeader({ ...header, remitoNumber: e.target.value })}
                                className="h-10 border-slate-200 font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Fecha de Recepción</Label>
                            <Input
                                type="date"
                                value={header.date}
                                onChange={(e) => setHeader({ ...header, date: e.target.value })}
                                className="h-10 border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Observaciones Generales</Label>
                            <textarea
                                className="w-full min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary shadow-inner"
                                placeholder="Opcional..."
                                value={header.observations}
                                onChange={(e) => setHeader({ ...header, observations: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border shadow-none bg-white flex flex-col">
                    <CardHeader className="py-4 bg-slate-50/50 border-b flex flex-row items-center justify-between">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Detalle de Insumos</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setShowNewProduct(true)} className="h-7 text-[10px] font-bold uppercase text-primary hover:text-primary/80">
                            <PackagePlus className="h-3 w-3 mr-1" /> Nuevo Producto
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30 hover:bg-transparent">
                                    <TableHead className="text-[9px] font-black uppercase px-6 py-3 w-3/5">Producto / Presentación</TableHead>
                                    <TableHead className="text-[9px] font-black uppercase py-3 text-right">Cantidad</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.tempId} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="px-6 py-3">
                                            <select
                                                ref={index === items.length - 1 ? lastRowRef : null}
                                                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-[13px] outline-none focus:ring-1 focus:ring-primary shadow-sm font-bold text-slate-700"
                                                value={item.productId}
                                                onChange={(e) => updateItem(item.tempId, 'productId', e.target.value)}
                                            >
                                                <option value="">Seleccionar producto...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>[P-{p.id}] {p.name} ({p.presentation})</option>
                                                ))}
                                            </select>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                autoComplete="off"
                                                className="h-9 border-slate-200 text-right font-mono font-bold text-primary"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.tempId, 'quantity', e.target.value.replace(',', '.'))}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={items.length === 1}
                                                onClick={() => handleRemoveItem(item.tempId)}
                                                className="h-7 w-7 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 border-t">
                            <Button variant="ghost" onClick={handleAddItem} className="w-full h-10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-dashed border-2 hover:border-primary/50">
                                <Plus className="h-4 w-4 mr-2" /> Agregar Renglón (Enter)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* New Product Dialog */}
            <Dialog open={showNewProduct} onOpenChange={setShowNewProduct}>
                <DialogContent className="max-w-md border shadow-lg bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Alta Rápida de Producto</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">Agrega un insumo que no existe en el catálogo para este remito.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Nombre Comercial</Label>
                            <Input
                                placeholder="Ej: Glifosato Premium"
                                value={newProductForm.name}
                                onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                                className="h-10 border-slate-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Principio Activo</Label>
                            <Input
                                placeholder="Ej: Glifosato 62%"
                                value={newProductForm.activeIngredient}
                                onChange={(e) => setNewProductForm({ ...newProductForm, activeIngredient: e.target.value })}
                                className="h-10 border-slate-200 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase">Presentación</Label>
                            <Input
                                placeholder="Ej: Bidón 20L"
                                value={newProductForm.presentation}
                                onChange={(e) => setNewProductForm({ ...newProductForm, presentation: e.target.value })}
                                className="h-10 border-slate-200 text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="ghost" disabled={creatingProduct} onClick={() => setShowNewProduct(false)} className="text-slate-500 hover:text-slate-900 font-bold text-xs">CANCELAR</Button>
                        <Button onClick={handleSaveProduct} disabled={creatingProduct || !newProductForm.name} className="bg-primary hover:bg-primary/90 font-bold px-6 text-white transition-all">
                            {creatingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            DAR DE ALTA
                        </Button>
                    </DialogFooter>
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
