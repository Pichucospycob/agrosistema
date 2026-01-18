import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Calculator } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface NewOrderFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function NewOrderForm({ onSuccess, onCancel }: NewOrderFormProps) {
    const [lots, setLots] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    // Order State
    const [contractor, setContractor] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [crop, setCrop] = useState("");
    const [labor, setLabor] = useState("");

    const [selectedLots, setSelectedLots] = useState<number[]>([]);
    const [items, setItems] = useState<{ productId: string, dose: string }[]>([{ productId: "", dose: "" }]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        // We'll need to fetch lots and products here.
        // Assuming we pass them or fetch them. Let's fetch using our window.db
        try {
            const l = await window.db.getLots();
            const p = await window.db.getProducts();
            setLots(l);
            setProducts(p);
        } catch (e) {
            console.error(e);
        }
    }

    // Calculations
    const totalSurface = selectedLots.reduce((acc, lotId) => {
        const lot = lots.find(l => l.id === lotId);
        return acc + (lot ? lot.surface : 0);
    }, 0);

    const calculatedItems = items.map(item => {
        const prod = products.find(p => p.id === parseInt(item.productId));
        const dose = parseFloat(item.dose) || 0;
        const total = dose * totalSurface;
        return { ...item, prod, total };
    });

    function toggleLot(id: number) {
        if (selectedLots.includes(id)) {
            setSelectedLots(selectedLots.filter(l => l !== id));
        } else {
            setSelectedLots([...selectedLots, id]);
        }
    }

    function addItem() {
        setItems([...items, { productId: "", dose: "" }]);
    }

    function updateItem(index: number, field: string, value: string) {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    }

    function removeItem(index: number) {
        setItems(items.filter((_, i) => i !== index));
    }

    async function handleSubmit() {
        if (selectedLots.length === 0 || items.length === 0) {
            alert("Selecciona al menos un lote y un producto");
            return;
        }

        // This functionality needs backend support implemented next
        console.log("Saving order...");
        // Call backend createOrder
    }

    return (
        <div className="flex flex-col h-[80vh]">
            <div className="flex-1 overflow-y-auto pr-2">

                {/* Header Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <Label>Fecha</Label>
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <Label>Contratista</Label>
                        <Input placeholder="Nombre" value={contractor} onChange={e => setContractor(e.target.value)} />
                    </div>
                    <div>
                        <Label>Cultivo / Labor</Label>
                        <div className="flex gap-2">
                            <Input placeholder="Cultivo" className="w-1/2" value={crop} onChange={e => setCrop(e.target.value)} />
                            <Input placeholder="Labor" className="w-1/2" value={labor} onChange={e => setLabor(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Lot Selection */}
                <div className="mb-6">
                    <Label className="mb-2 block">Selección de Lotes (Total: {totalSurface.toFixed(1)} ha)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {lots.map(lot => (
                            <div
                                key={lot.id}
                                onClick={() => toggleLot(lot.id)}
                                className={`cursor-pointer border rounded p-2 text-sm flex justify-between items-center ${selectedLots.includes(lot.id) ? 'bg-green-100 border-green-500' : 'bg-white hover:bg-slate-50'}`}
                            >
                                <span>{lot.name}</span>
                                <span className="text-gray-500 font-mono">{lot.surface}ha</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Items */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label>Insumos y Dosis</Label>
                        <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Agregar Insumo</Button>
                    </div>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="w-24">Dosis/Ha</TableHead>
                                    <TableHead className="w-32 text-right">Total Calculado</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calculatedItems.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <select
                                                className="w-full p-2 border rounded text-sm bg-transparent"
                                                value={item.productId}
                                                onChange={e => updateItem(idx, 'productId', e.target.value)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.presentation})</option>
                                                ))}
                                            </select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.dose}
                                                onChange={e => updateItem(idx, 'dose', e.target.value)}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {item.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Generar Orden</Button>
            </div>
        </div>
    );
}
