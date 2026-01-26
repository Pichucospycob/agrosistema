import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderCreatePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [lots, setLots] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toLocaleDateString('en-CA'), // Returns YYYY-MM-DD in local time
        campaign: "2025/2026",
        contractor: "",
        field: "",
        crop: "",
        labor: "Pulverización",
        implanted: false,
        totalSurface: 0,

        // Tech
        nozzleType: "",
        nozzleDescription: "",
        waterPerHa: 0,
        pressure: 3.0,
        pressureUnit: "Bares",
        windSpeed: 0,
        humidity: 0,
        instructions: "ATENCIÓN: NO ALTERAR EL ORDEN DE LOS PRODUCTOS",
        observations: ""
    });

    const [selectedLotIds, setSelectedLotIds] = useState<string[]>([]);
    const [lotAppliedSurfaces, setLotAppliedSurfaces] = useState<Record<string, string>>({});
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        window.db.getProducts().then(setProducts);
        window.db.getLots().then(setLots);

        if (isEditing) {
            setLoading(true);
            window.db.getOrderDetails(parseInt(id!))
                .then(data => {
                    const { items: fetchedItems, lots: fetchedLots, ...orderData } = data;
                    setFormData({
                        date: orderData.date,
                        campaign: orderData.campaign,
                        contractor: orderData.contractor,
                        field: orderData.field || "",
                        crop: orderData.crop || "",
                        labor: orderData.labor || "Pulverización",
                        implanted: !!orderData.implanted,
                        totalSurface: orderData.totalSurface || 0,
                        nozzleType: orderData.nozzleType || "",
                        nozzleDescription: orderData.nozzleDescription || "",
                        waterPerHa: orderData.waterPerHa || 0,
                        pressure: orderData.pressure || 3.0,
                        pressureUnit: orderData.pressureUnit || "Bares",
                        windSpeed: orderData.windSpeed || 0,
                        humidity: orderData.humidity || 0,
                        instructions: orderData.instructions || "",
                        observations: orderData.observations || ""
                    });

                    setSelectedLotIds(fetchedLots.map((l: any) => l.id.toString()));
                    const surfaces: Record<string, string> = {};
                    fetchedLots.forEach((l: any) => {
                        surfaces[l.id.toString()] = l.appliedSurface.toString();
                    });
                    setLotAppliedSurfaces(surfaces);

                    setItems(fetchedItems.map((i: any) => ({
                        productId: i.productId.toString(),
                        dose: i.dose.toString(),
                        total: i.quantityTheoretical
                    })));
                })
                .catch(err => setError("Error al cargar la orden: " + err.message))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    // Auto-calculate surface when lots change
    useEffect(() => {
        const totalSurface = selectedLotIds.reduce((sum, id) => {
            const val = parseFloat(lotAppliedSurfaces[id] || "0") || 0;
            return sum + val;
        }, 0);

        // Update both field description and total surface
        const lotNames = selectedLotIds
            .map(id => lots.find(l => l.id.toString() === id)?.name)
            .filter(Boolean)
            .join(", ");

        setFormData(prev => ({
            ...prev,
            field: lotNames,
            totalSurface: parseFloat(totalSurface.toFixed(2))
        }));

    }, [selectedLotIds, lots, lotAppliedSurfaces]);


    const toggleLot = (lotId: string) => {
        setSelectedLotIds(prev => {
            if (prev.includes(lotId)) {
                const newSurfaces = { ...lotAppliedSurfaces };
                delete newSurfaces[lotId];
                setLotAppliedSurfaces(newSurfaces);
                return prev.filter(id => id !== lotId);
            } else {
                const lot = lots.find(l => l.id.toString() === lotId);
                if (lot) {
                    setLotAppliedSurfaces(prevS => ({
                        ...prevS,
                        [lotId]: lot.surface.toString()
                    }));
                }
                return [...prev, lotId];
            }
        });
    };

    const handleUpdateLotSurface = (lotId: string, surface: string) => {
        const processed = surface.replace(',', '.');
        setLotAppliedSurfaces(prev => ({
            ...prev,
            [lotId]: processed
        }));
    };

    const handleAddItem = () => {
        setItems([...items, { tempId: Math.random(), productId: "", dose: "", total: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        let processedValue = value;

        if (field === 'dose' && typeof value === 'string') {
            processedValue = value.replace(',', '.');
        }

        // @ts-ignore - index-based access on items
        newItems[index][field] = processedValue;

        // Auto-calc total if dose changed or surface changed
        if (field === 'dose' || field === 'productId') {
            const doseNum = parseFloat(newItems[index].dose || "0") || 0;
            const calculatedTotal = doseNum * formData.totalSurface;
            newItems[index].total = parseFloat(calculatedTotal.toFixed(2));
        }
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Recalculate totals when surface changes (manual or auto)
    useEffect(() => {
        const newItems = items.map(item => ({
            ...item,
            total: (parseFloat(item.dose || "0") || 0) * formData.totalSurface
        }));
        setItems(newItems);
    }, [formData.totalSurface]);

    const handleUpdateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateNumericField = (field: string, value: string) => {
        const processed = value.replace(',', '.');
        setFormData(prev => ({ ...prev, [field]: processed }));
    };

    const applicatorInstructions = [
        "Triple lavado de envases vacíos (Norma IRAM 12069).",
        "Orden de carga: 1. Correctores -> 2. Polvos -> 3. Líquidos -> 4. Aceites.",
        "Verificar limpieza de filtros y estado de pastillas antes de iniciar.",
        "Suspender labor si el viento supera los 15 km/h o hay inversión térmica.",
        "Uso obligatorio de EPP (Mameluco, guantes, máscara y protección ocular).",
        "Respetar distancias de retiro de zonas sensibles y cursos de agua."
    ];

    const nozzleOptions = [
        "Abanico plano martillo",
        "Abanico plano (estándar)",
        "Abanico plano antideriva (AI)",
        "Doble abanico plano",
        "Cono hueco",
        "Cono lleno",
        "Inducción de aire (AIXR)"
    ];

    const pressurePresets = {
        "Bares": [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
        "Libras": [20, 30, 40, 50, 60, 70, 80],
        "Kg/cm2": [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
    };

    const [selectedInstruction, setSelectedInstruction] = useState("");

    async function handleSubmit() {
        if (!formData.contractor || selectedLotIds.length === 0 || items.length === 0) {
            setError("Completa los datos obligatorios (Contratista, Lotes) y agrega al menos un producto.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let result;
            if (isEditing) {
                result = await window.db.updateOrder({
                    id: parseInt(id!),
                    ...formData,
                    items: items.map(i => ({
                        productId: parseInt(i.productId),
                        dose: parseFloat(i.dose || "0") || 0,
                        total: i.total
                    })),
                    lotIds: selectedLotIds.map(id => parseInt(id)),
                    lotDetails: selectedLotIds.map(id => ({
                        lotId: parseInt(id),
                        appliedSurface: parseFloat(lotAppliedSurfaces[id] || "0") || 0
                    }))
                });
            } else {
                result = await window.db.createOrder({
                    ...formData,
                    items: items.map(i => ({
                        productId: parseInt(i.productId),
                        dose: parseFloat(i.dose || "0") || 0,
                        total: i.total
                    })),
                    lotIds: selectedLotIds.map(id => parseInt(id)),
                    lotDetails: selectedLotIds.map(id => ({
                        lotId: parseInt(id),
                        appliedSurface: parseFloat(lotAppliedSurfaces[id] || "0") || 0
                    }))
                });
            }

            if (result && result.id) {
                navigate(`/ordenes/${result.id}`);
            } else {
                navigate('/ordenes');
            }
        } catch (err: any) {
            console.error(err);
            setError("Error al crear la orden: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/ordenes')} className="hover:bg-slate-200">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEditing ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"}</h1>
                        <p className="text-slate-500 text-sm">Registro técnico y receta agronómica de labor</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/ordenes')} className="border-slate-300 hover:bg-slate-100 font-medium">Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-sm">
                        <Save className="mr-2 h-4 w-4" /> {isEditing ? "Actualizar Orden" : "Guardar Orden"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* General Data */}
                    <Card className="border shadow-none bg-white">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                <FileText className="h-4 w-4 text-primary" />
                                Información General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha de Emisión</Label>
                                    <Input type="date" value={formData.date} onChange={e => handleUpdateField('date', e.target.value)} className="h-10 border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campaña</Label>
                                    <Input value={formData.campaign} onChange={e => handleUpdateField('campaign', e.target.value)} className="h-10 border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cultivo Destino</Label>
                                    <Input value={formData.crop} onChange={e => handleUpdateField('crop', e.target.value)} className="h-10 border-slate-200" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contratista / Aplicador</Label>
                                    <Input placeholder="Nombre del contratista..." value={formData.contractor} onChange={e => handleUpdateField('contractor', e.target.value)} className="h-11 border-slate-200 font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Labor</Label>
                                    <Input value={formData.labor} onChange={e => handleUpdateField('labor', e.target.value)} className="h-11 border-slate-200" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="implanted" checked={formData.implanted} onChange={e => handleUpdateField('implanted', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                                <Label htmlFor="implanted" className="font-medium text-slate-700">Lote ya implantado</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Data */}
                    <Card className="border shadow-none bg-white">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                <Settings className="h-4 w-4 text-primary" />
                                Parámetros Técnicos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Pastilla</Label>
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.nozzleType}
                                            onChange={e => handleUpdateField('nozzleType', e.target.value)}
                                        >
                                            <option value="">Seleccionar pastilla...</option>
                                            {nozzleOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                            <option value="OTRA">Otra (Especificar abajo)...</option>
                                        </select>
                                        <Input
                                            placeholder="Modelo/Marca (Ej: AIXR 11002)"
                                            value={formData.nozzleType === "OTRA" ? "" : formData.nozzleType}
                                            onChange={e => handleUpdateField('nozzleType', e.target.value)}
                                            className={cn("h-10 border-slate-200 flex-1", formData.nozzleType !== "OTRA" && "hidden")}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detalles Adicionales de Labor</Label>
                                    <Input placeholder="Ej: Velocidad 8km/h, etc." value={formData.nozzleDescription} onChange={e => handleUpdateField('nozzleDescription', e.target.value)} className="h-10 border-slate-200" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Caudal (L/Ha)</Label>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        value={formData.waterPerHa.toString()}
                                        onFocus={(e) => e.target.select()}
                                        onChange={e => handleUpdateNumericField('waterPerHa', e.target.value)}
                                        className="h-10 border-primary/30 bg-primary/5 font-bold text-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Presión Trab.</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            inputMode="decimal"
                                            value={formData.pressure.toString()}
                                            onFocus={(e) => e.target.select()}
                                            onChange={e => handleUpdateNumericField('pressure', e.target.value)}
                                            className="h-10 border-slate-200 w-24"
                                        />
                                        <select
                                            className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.pressure}
                                            onChange={e => handleUpdateField('pressure', e.target.value)}
                                        >
                                            <option value="">Ajustes...</option>
                                            {pressurePresets[formData.pressureUnit as keyof typeof pressurePresets].map(p => (
                                                <option key={p} value={p}>{p} {formData.pressureUnit}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unidad Presión</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        value={formData.pressureUnit}
                                        onChange={e => {
                                            const newUnit = e.target.value;
                                            const oldPressure = parseFloat(formData.pressure.toString());

                                            if (isNaN(oldPressure)) {
                                                setFormData(prev => ({ ...prev, pressureUnit: newUnit }));
                                                return;
                                            }

                                            let newPressure = oldPressure;

                                            // Conversion logic
                                            const toBar = (val: number, unit: string) => {
                                                if (unit === "Bares") return val;
                                                if (unit === "Libras") return val / 14.5038;
                                                if (unit === "Kg/cm2") return val / 1.01972;
                                                return val;
                                            };

                                            const fromBar = (val: number, unit: string) => {
                                                if (unit === "Bares") return parseFloat(val.toFixed(1));
                                                if (unit === "Libras") return Math.round(val * 14.5038);
                                                if (unit === "Kg/cm2") return parseFloat((val * 1.01972).toFixed(1));
                                                return val;
                                            };

                                            const pressureInBar = toBar(oldPressure, formData.pressureUnit);
                                            newPressure = fromBar(pressureInBar, newUnit);

                                            setFormData(prev => ({
                                                ...prev,
                                                pressureUnit: newUnit,
                                                pressure: newPressure
                                            }));
                                        }}
                                    >
                                        <option value="Bares">Bares</option>
                                        <option value="Libras">Libras (PSI)</option>
                                        <option value="Kg/cm2">Kg / cm²</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Instrucciones para el Aplicador</Label>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                                            value={selectedInstruction}
                                            onChange={e => setSelectedInstruction(e.target.value)}
                                        >
                                            <option value="">Seleccionar recomendación...</option>
                                            {applicatorInstructions.map(instr => (
                                                <option key={instr} value={instr}>{instr}</option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            size="sm"
                                            disabled={!selectedInstruction}
                                            onClick={() => {
                                                const current = formData.instructions || "";
                                                const newVal = current ? `${current}\n- ${selectedInstruction}` : `- ${selectedInstruction}`;
                                                handleUpdateField('instructions', newVal);
                                                setSelectedInstruction("");
                                            }}
                                            className="h-10 px-4 border-primary text-primary hover:bg-primary/5 font-bold"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> AGREGAR
                                        </Button>
                                    </div>
                                    <textarea
                                        className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary font-medium"
                                        placeholder="Instrucciones específicas adicionales..."
                                        value={formData.instructions}
                                        onChange={e => handleUpdateField('instructions', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Observaciones Generales</Label>
                                <textarea
                                    className="w-full min-h-[60px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary shadow-inner"
                                    placeholder="Notas adicionales sobre la labor..."
                                    value={formData.observations}
                                    onChange={e => handleUpdateField('observations', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4 border-slate-100 opacity-60">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Viento - Anotación Secundario (km/h)</Label>
                                    <Input type="text" inputMode="decimal" value={formData.windSpeed.toString()} onChange={e => handleUpdateNumericField('windSpeed', e.target.value)} className="h-9 border-slate-100 bg-slate-50 text-slate-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Humedad (%)</Label>
                                    <Input type="text" inputMode="decimal" value={formData.humidity.toString()} onChange={e => handleUpdateNumericField('humidity', e.target.value)} className="h-9 border-slate-100 bg-slate-50 text-slate-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recipe Table - More compact */}
                    <Card className="border shadow-none bg-white">
                        <CardHeader className="flex flex-row items-center justify-between py-3 px-6 border-b bg-slate-50/50">
                            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Receta Agronómica</CardTitle>
                            <Button variant="outline" size="sm" onClick={handleAddItem} className="h-8 border-primary/40 text-primary hover:bg-primary/5 font-bold">
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Agregar Insumo
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="py-3 px-6">Producto / Insumo</th>
                                        <th className="py-3 px-4 w-32">Dosis (L/Ha)</th>
                                        <th className="py-3 px-4 w-40">Total Teórico</th>
                                        <th className="py-3 px-6 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border-b">
                                    {items.map((item, index) => (
                                        <tr key={item.id || item.tempId || index} className="hover:bg-slate-50/50 group">
                                            <td className="py-3 px-6">
                                                <select
                                                    className="w-full h-9 rounded border border-slate-200 bg-transparent px-3 py-1 text-sm outline-none focus:border-primary transition-colors"
                                                    value={item.productId}
                                                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.currentStock} disp.)</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={item.dose}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => updateItem(index, 'dose', e.target.value)}
                                                    className="h-9 border-slate-200 font-bold text-primary"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="h-9 flex items-center px-3 rounded bg-slate-100/50 text-sm font-bold text-slate-700 border">
                                                    {typeof item.total === 'number' ? item.total.toFixed(2) : "0.00"} Lts
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-8 w-8 text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-6 bg-slate-50/50 border-t flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/ordenes')}
                                    className="border-slate-300 hover:bg-slate-100 font-medium px-6"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 shadow-md"
                                >
                                    <Save className="mr-2 h-4 w-4" /> {isEditing ? "Actualizar Orden" : "Guardar Orden"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar: Compact Lot List */}
                <div className="space-y-6">
                    <Card className="border shadow-none bg-white overflow-hidden">
                        <CardHeader className="bg-slate-800 py-3 px-4">
                            <CardTitle className="text-xs font-bold text-white uppercase tracking-widest flex items-center justify-between">
                                Lotes Seleccionados
                                <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-[9px]">{selectedLotIds.length}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 border-b bg-slate-50">
                                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                                    {formData.totalSurface.toFixed(1)} <span className="text-xs font-medium text-slate-500">Ha</span>
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Superficie Total</div>
                            </div>

                            <div className="max-h-[450px] overflow-auto divide-y">
                                {lots.map(lot => {
                                    const isSelected = selectedLotIds.includes(lot.id.toString());
                                    return (
                                        <div
                                            key={lot.id}
                                            className={cn(
                                                "p-3 transition-colors text-sm border-b last:border-0",
                                                isSelected ? "bg-primary/5" : "hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleLot(lot.id.toString())}
                                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                    <span className={cn("font-medium", isSelected ? "text-primary" : "text-slate-700")}>
                                                        {lot.name}
                                                    </span>
                                                </label>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{lot.surface} ha (Total)</span>
                                            </div>

                                            {isSelected && (
                                                <div className="pl-7 space-y-1">
                                                    <Label className="text-[9px] font-bold text-slate-500 uppercase">Ha a Aplicar (Manchoneo)</Label>
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={lotAppliedSurfaces[lot.id.toString()] || ""}
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => handleUpdateLotSurface(lot.id.toString(), e.target.value)}
                                                        className="h-7 text-xs border-primary/20 bg-white font-bold text-primary"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {lots.length === 0 && (
                                <div className="p-6 text-center text-xs text-slate-400 italic">
                                    No hay lotes registrados.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Estado actual</div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300">
                            BORRADOR
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
