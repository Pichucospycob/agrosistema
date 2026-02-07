import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, Target, Wallet, History, Search, Package, TrendingDown, TrendingUp, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generateConsumptionReportPDF, generateProductHistoryPDF, generateEfficiencyReportPDF } from "@/lib/pdf-generator";

export default function ReportsPage() {
    const [consumptionData, setConsumptionData] = useState<any[]>([]);
    const [movementsData, setMovementsData] = useState<any[]>([]);
    const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCampaign, setSelectedCampaign] = useState<string>("TODAS");
    const [campaigns, setCampaigns] = useState<string[]>([]);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

    // Product Deep Dive
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [productHistory, setProductHistory] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        try {
            const [consumption, efficiency, movements, prods] = await Promise.all([
                window.db.getConsumptionByCampaign(),
                window.db.getEfficiencyReport(),
                window.db.getStockMovements(),
                window.db.getProducts()
            ]);

            setConsumptionData(consumption);
            setEfficiencyData(efficiency);
            setMovementsData(movements);
            setProducts(prods);

            const uniqueCampaigns = Array.from(new Set(consumption.map((c: any) => c.campaign))).filter(Boolean) as string[];
            setCampaigns(uniqueCampaigns.sort().reverse());

            if (uniqueCampaigns.length > 0 && selectedCampaign === "TODAS") {
                setSelectedCampaign(uniqueCampaigns[0]);
            }
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedCampaign]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Fetch history when product changes
    useEffect(() => {
        if (selectedProductId) {
            window.db.getProductHistory(parseInt(selectedProductId)).then(setProductHistory);
        }
    }, [selectedProductId]);

    // Memoized Filtered Data
    const filteredMovements = useMemo(() => {
        return movementsData.filter(m => {
            const dateFromMatch = !dateFrom || m.date >= dateFrom;
            const dateToMatch = !dateTo || m.date <= dateTo;
            return dateFromMatch && dateToMatch;
        });
    }, [movementsData, dateFrom, dateTo]);

    const filteredConsumption = useMemo(() => {
        return consumptionData.filter(c => {
            const campMatch = selectedCampaign === "TODAS" || c.campaign === selectedCampaign;
            const dateFromMatch = !dateFrom || c.date >= dateFrom;
            const dateToMatch = !dateTo || c.date <= dateTo;
            return campMatch && dateFromMatch && dateToMatch;
        });
    }, [consumptionData, selectedCampaign, dateFrom, dateTo]);

    // 1. Balance Campaign (For Supplier Negotiation)
    const campaignBalance = useMemo(() => {
        const prodData: Record<string, any> = {};

        // Sum Purchases
        filteredMovements.forEach(m => {
            if (m.type === 'COMPRA') {
                if (!prodData[m.productId]) prodData[m.productId] = { productId: m.productId, name: m.productName, bought: 0, used: 0 };
                prodData[m.productId].bought += m.quantity;
            }
        });

        // Sum Usage (from closed orders)
        filteredConsumption.forEach(c => {
            if (!prodData[c.productId]) prodData[c.productId] = { productId: c.productId, name: c.productName, bought: 0, used: 0 };
            prodData[c.productId].used += c.quantityReal || 0;
        });

        return Object.values(prodData).sort((a, b: any) => b.bought - a.bought);
    }, [filteredMovements, filteredConsumption]);

    if (loading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest text-xs">Generando Informes de Gestión...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                        <BarChart3 className="text-primary h-7 w-7" /> Historial de Gestión
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">Herramientas de análisis para negociación y control de stock</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 px-3 border-r">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="bg-transparent text-[10px] font-bold uppercase outline-none text-slate-700 font-mono"
                        >
                            <option value="TODAS">Todas las Campañas</option>
                            {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 px-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Desde</span>
                            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-[10px] w-32 border-slate-100 font-mono" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Hasta</span>
                            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-[10px] w-32 border-slate-100 font-mono" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); }} className="h-8 text-[9px] font-bold text-slate-400 hover:text-primary">LIMPIAR</Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="balance" className="space-y-6">
                <TabsList className="bg-slate-100/50 border p-1 rounded-lg h-12">
                    <TabsTrigger value="balance" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">
                        <Wallet size={14} /> Balance Campaña
                    </TabsTrigger>
                    <TabsTrigger value="product" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">
                        <History size={14} /> Ficha de Producto
                    </TabsTrigger>
                    <TabsTrigger value="efficiency" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">
                        <Target size={14} /> Eficiencia Aplicación
                    </TabsTrigger>
                </TabsList>

                {/* --- 1. Balance de Campaña (Negociación) --- */}
                <TabsContent value="balance" className="space-y-6 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Insumos Comprados"
                            value={campaignBalance.reduce((acc, curr) => acc + curr.bought, 0).toLocaleString()}
                            subtitle="Volumen total ingresado"
                            icon={<Package className="text-blue-500" />}
                        />
                        <StatsCard
                            title="Total Insumos Aplicados"
                            value={campaignBalance.reduce((acc, curr) => acc + curr.used, 0).toLocaleString()}
                            subtitle="Consumo real validado"
                            icon={<Target className="text-orange-500" />}
                        />
                        <StatsCard
                            title="Stock en Depósito"
                            value={campaignBalance.reduce((acc, curr) => acc + (curr.bought - curr.used), 0).toLocaleString()}
                            subtitle="Remanente estimado"
                            icon={<Wallet className="text-green-500" />}
                            trend={campaignBalance.length > 0 ? "OK" : "NO DATA"}
                        />
                        <StatsCard
                            title="Variedad de Productos"
                            value={campaignBalance.length.toString()}
                            subtitle="Insumos activos"
                            icon={<Search className="text-slate-400" />}
                        />
                    </div>

                    <Card className="border shadow-none overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b py-4">
                            <CardTitle className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center justify-between">
                                Resumen de Compras vs Consumo Real
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => generateConsumptionReportPDF(selectedCampaign, campaignBalance)}
                                        className="h-8 text-[9px] font-black uppercase tracking-tighter border-slate-200 hover:bg-slate-50"
                                    >
                                        <FileDown className="mr-2 h-3.5 w-3.5 text-primary" /> Exportar PDF
                                    </Button>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-black">{selectedCampaign}</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30">
                                    <TableHead className="py-4 px-8 text-[10px] font-black uppercase text-slate-500">Insumo / Producto</TableHead>
                                    <TableHead className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 text-right">Compras (Ingreso)</TableHead>
                                    <TableHead className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 text-right">Uso Real (Salida)</TableHead>
                                    <TableHead className="py-4 px-8 text-[10px] font-black uppercase text-slate-500 text-right">Faltante / Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaignBalance.map((item, idx) => {
                                    const diff = item.bought - item.used;
                                    return (
                                        <TableRow key={idx} className="hover:bg-slate-50/50 group transition-colors">
                                            <TableCell className="py-5 px-8">
                                                <p className="font-extrabold text-slate-900 text-xs uppercase group-hover:text-primary transition-colors">
                                                    {item.name || `[P-${item.productId}] PRODUCTO ELIMINADO`}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: P-{item.productId}</p>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 text-right font-mono font-bold text-blue-600">
                                                {item.bought.toLocaleString('es-AR', { minimumFractionDigits: 1 })}
                                            </TableCell>
                                            <TableCell className="py-5 px-6 text-right font-mono font-bold text-orange-600">
                                                {item.used.toLocaleString('es-AR', { minimumFractionDigits: 1 })}
                                            </TableCell>
                                            <TableCell className={cn(
                                                "py-5 px-8 text-right font-mono font-black",
                                                diff < 0 ? "text-red-600 bg-red-50/30" : "text-slate-900 bg-slate-50/30"
                                            )}>
                                                {diff.toLocaleString('es-AR', { minimumFractionDigits: 1 })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* --- 2. Ficha de Producto --- */}
                <TabsContent value="product" className="space-y-6">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                        <Package className="text-slate-400" />
                        <div className="flex-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Seleccionar Insumo para Ver Historial</label>
                            <select
                                value={selectedProductId}
                                onChange={e => setSelectedProductId(e.target.value)}
                                className="w-full bg-transparent text-sm font-bold uppercase outline-none text-slate-700 h-10 border-none px-0"
                            >
                                <option value="">Seleccione un producto...</option>
                                {products.map(p => <option key={p.id} value={p.id}>[P-{p.id}] {p.name}</option>)}
                            </select>
                        </div>
                        {selectedProductId && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const productName = products.find(p => p.id === parseInt(selectedProductId))?.name || "Producto";
                                    generateProductHistoryPDF(productName, productHistory);
                                }}
                                className="h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 px-6"
                            >
                                <FileDown className="mr-2 h-4 w-4 text-primary" /> Descargar Ficha PDF
                            </Button>
                        )}
                    </div>

                    {selectedProductId && (
                        <Card className="border shadow-none overflow-hidden bg-white">
                            <CardHeader className="bg-slate-900 border-b py-4">
                                <CardTitle className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                                    <History size={14} className="text-primary" /> Cronología de Movimientos {selectedProductId && `(ID: P-${selectedProductId})`}
                                </CardTitle>
                            </CardHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead className="py-3 px-6 text-[10px] font-black uppercase text-slate-500">Fecha</TableHead>
                                        <TableHead className="py-3 px-6 text-[10px] font-black uppercase text-slate-500">Tipo de Movimiento</TableHead>
                                        <TableHead className="py-3 px-6 text-[10px] font-black uppercase text-slate-500">Detalle / ID</TableHead>
                                        <TableHead className="py-3 px-8 text-[10px] font-black uppercase text-slate-500 text-right">Cantidad (L/Kg)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productHistory.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="h-40 text-center text-slate-400 italic text-xs">No hay movimientos registrados para este producto.</TableCell></TableRow>
                                    ) : (
                                        productHistory.map((m, idx) => (
                                            <TableRow key={idx} className="hover:bg-slate-50/30">
                                                <TableCell className="py-4 px-6 text-[11px] font-bold text-slate-500 font-mono">
                                                    {m.date ? format(new Date(m.date), 'dd/MM/yyyy HH:mm') : '-'}
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border",
                                                        m.type === 'COMPRA' && "bg-blue-50 text-blue-700 border-blue-100",
                                                        m.type === 'SALIDA_REMITO' && "bg-orange-50 text-orange-700 border-orange-100",
                                                        m.type === 'RETORNO_SOBRANTE' && "bg-green-50 text-green-700 border-green-100",
                                                        m.type === 'AJUSTE' && "bg-slate-100 text-slate-700 border-slate-200"
                                                    )}>
                                                        {m.type.replace('_', ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[10px] font-medium text-slate-600 italic">
                                                    {m.description}
                                                </TableCell>
                                                <TableCell className={cn(
                                                    "py-4 px-8 text-right font-mono font-bold text-sm",
                                                    m.quantity > 0 ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </TabsContent>

                {/* --- 3. Eficiencia de Aplicación --- */}
                <TabsContent value="efficiency" className="space-y-6">
                    <Card className="border shadow-none overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center justify-between py-4">
                            <div className="space-y-1">
                                <CardTitle className="text-[11px] font-extrabold uppercase text-slate-800 tracking-tight">Precisión de Aplicación (Real vs Teórico)</CardTitle>
                                <p className="text-[9px] text-slate-500 font-bold uppercase italic">Detecta ahorro o exceso en el uso de insumos en el campo</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => generateEfficiencyReportPDF(selectedCampaign, efficiencyData.filter(e => selectedCampaign === "TODAS" || e.campaign === selectedCampaign))}
                                    className="h-8 text-[9px] font-black uppercase tracking-tighter border-slate-200 hover:bg-slate-50"
                                >
                                    <FileDown className="mr-2 h-3.5 w-3.5 text-primary" /> Exportar Informe PDF
                                </Button>
                                <Target className="h-5 w-5 text-primary opacity-30" />
                            </div>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100/30">
                                    <TableHead className="py-4 px-8 text-[10px] font-black uppercase text-slate-500">Orden / Parcela</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-500">Insumo</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-500 text-right">Receta (Teórico)</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-500 text-right">Consumo (REAL)</TableHead>
                                    <TableHead className="py-4 px-8 text-[10px] font-black uppercase text-slate-500 text-right">Desvío %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {efficiencyData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="h-40 text-center italic text-slate-400">Sin datos de eficiencia registrados.</TableCell></TableRow>
                                ) : (
                                    efficiencyData.filter(e => selectedCampaign === "TODAS" || e.campaign === selectedCampaign).map((e, idx) => {
                                        const diff = e.real - e.theoretical;
                                        const perc = (diff / (e.theoretical || 1)) * 100;

                                        return (
                                            <TableRow key={idx} className="hover:bg-slate-50/50">
                                                <TableCell className="py-4 px-8">
                                                    <div className="text-[11px] font-black text-slate-900 group-hover:text-primary transition-colors">#{e.orderNumber.toString().padStart(8, '0')}</div>
                                                    <div className="text-[9px] text-slate-400 font-bold uppercase">{e.field}</div>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-extrabold text-slate-700 uppercase">
                                                    {e.productName || `[P-${e.productId}] PRODUCTO ELIMINADO`}
                                                    <div className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">ID: P-{e.productId}</div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[11px] text-slate-400">{e.theoretical.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono text-[11px] font-black text-slate-900">{e.real.toLocaleString()}</TableCell>
                                                <TableCell className="text-right px-8">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[11px] shadow-sm",
                                                        perc > 0.01 ? "bg-red-50 text-red-600 border-red-100" :
                                                            perc < -0.01 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                "bg-green-50 text-green-700 border-green-200"
                                                    )}>
                                                        {perc > 0.01 ? <TrendingUp size={12} /> : perc < -0.01 ? <TrendingDown size={12} /> : null}
                                                        {perc > 0 ? '+' : ''}{perc.toFixed(2)}%
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StatsCard({ title, value, subtitle, icon, trend }: { title: string, value: string, subtitle: string, icon: React.ReactNode, trend?: string }) {
    return (
        <Card className="border shadow-none bg-white hover:border-primary/20 transition-colors">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
                    {trend && <span className="text-[8px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-tighter">{trend}</span>}
                </div>
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
                <div className="text-xl font-bold text-slate-900 mt-0.5 font-mono">{value}</div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1 italic">{subtitle}</p>
            </CardContent>
        </Card>
    );
}
