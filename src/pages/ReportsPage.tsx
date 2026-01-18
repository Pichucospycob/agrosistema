import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, Info, Target, Wallet } from "lucide-react";

export default function ReportsPage() {
    const [consumptionData, setConsumptionData] = useState<any[]>([]);
    const [containerData, setContainerData] = useState<any[]>([]);
    const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
    const [costData, setCostData] = useState<{ purchases: any[], consumption: any[] }>({ purchases: [], consumption: [] });

    const [selectedCampaign, setSelectedCampaign] = useState<string>("TODAS");
    const [campaigns, setCampaigns] = useState<string[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [consumption, containers, efficiency, costs] = await Promise.all([
                window.db.getConsumptionByCampaign(),
                window.db.getContainerStatus(),
                window.db.getEfficiencyReport(),
                window.db.getCampaignCostReport()
            ]);

            setConsumptionData(consumption);
            setContainerData(containers);
            setEfficiencyData(efficiency);
            setCostData(costs);

            // Extract unique campaigns
            const uniqueCampaigns = Array.from(new Set(consumption.map((c: any) => c.campaign))).filter(Boolean) as string[];
            setCampaigns(uniqueCampaigns.sort().reverse());

            if (uniqueCampaigns.length > 0 && selectedCampaign === "TODAS") {
                setSelectedCampaign(uniqueCampaigns[0]);
            }
        } catch (error) {
            console.error("Error loading reports:", error);
        }
    }

    const filteredEfficiency = selectedCampaign === "TODAS"
        ? efficiencyData
        : efficiencyData.filter(e => e.campaign === selectedCampaign);

    const filteredConsumption = selectedCampaign === "TODAS"
        ? consumptionData
        : consumptionData.filter(c => c.campaign === selectedCampaign);

    const groupedByProduct = filteredConsumption.reduce((acc: any, curr: any) => {
        if (!acc[curr.productId]) {
            acc[curr.productId] = { id: curr.productId, name: curr.productName, total: 0 };
        }
        acc[curr.productId].total += curr.quantityReal || 0;
        return acc;
    }, {});

    const productList = Object.values(groupedByProduct).sort((a: any, b: any) => b.total - a.total);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-3">
                        <BarChart3 className="text-primary" /> Informes y Estadísticas
                    </h1>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider text-[9px]">Análisis de consumo, eficiencia y balance de stock</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border shadow-sm">
                    <Calendar className="ml-2 h-4 w-4 text-slate-400" />
                    <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="bg-transparent text-[10px] font-bold uppercase py-1.5 px-3 outline-none border-none text-slate-700 font-mono"
                    >
                        <option value="TODAS">Todas las Campañas</option>
                        {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="overview" className="text-[10px] font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary">General</TabsTrigger>
                    <TabsTrigger value="efficiency" className="text-[10px] font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary">Eficiencia de Aplicación</TabsTrigger>
                    <TabsTrigger value="balance" className="text-[10px] font-bold uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:text-primary">Balance de Campaña</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border shadow-none bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Insumos Aplicados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{productList.length}</div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Variedad de productos</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Volumen Total</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 font-mono">
                                    {productList.reduce((sum: number, p: any) => sum + p.total, 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                    <span className="text-xs ml-1 text-slate-400">UTS</span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Consumo real acumulado</p>
                            </CardContent>
                        </Card>
                        <Card className="border shadow-none bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Envases en Galpón</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600 font-mono">
                                    {containerData.reduce((sum: number, c: any) => sum + c.pendingReturn, 0)}
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Pendientes de entrega al CAT</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border shadow-none bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b py-3">
                                <CardTitle className="text-[10px] font-bold uppercase text-slate-700">Consumo Acumulado por Producto</CardTitle>
                            </CardHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="text-[9px] font-bold uppercase py-2 px-6">Producto</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase text-right py-2 px-6">Total Real</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productList.map((p: any) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="py-3 px-6 text-[11px] font-bold text-slate-800 uppercase leading-none">{p.name}</TableCell>
                                            <TableCell className="py-3 px-6 text-right font-mono font-bold text-slate-900">
                                                {p.total.toLocaleString('es-AR', { minimumFractionDigits: 1 })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="border shadow-none bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b py-3">
                                <CardTitle className="text-[10px] font-bold uppercase text-slate-700">Situación de Envases Vacíos</CardTitle>
                            </CardHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/30">
                                        <TableHead className="text-[9px] font-bold uppercase py-2 px-6">Envase</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase text-center py-2">En Galpón</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase text-center py-2">En CAT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {containerData.map((c: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="py-3 px-6 font-bold text-slate-800 text-[11px] uppercase leading-tight">
                                                {c.productName} <br /><span className="text-[9px] text-slate-400 font-bold italic">{c.presentation}</span>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-orange-600 font-mono text-xs">{c.pendingReturn}</TableCell>
                                            <TableCell className="text-center font-bold text-slate-400 font-mono text-xs">{c.deliveredCat}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="efficiency" className="mt-0">
                    <Card className="border shadow-none bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center justify-between py-4">
                            <div className="space-y-1">
                                <CardTitle className="text-[11px] font-extrabold uppercase text-slate-800 tracking-tight">Desvío de Consumo: Real vs Teórico</CardTitle>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Análisis de precisión del aplicador en órdenes cerradas</p>
                            </div>
                            <Target className="h-4 w-4 text-primary opacity-40" />
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30">
                                    <TableHead className="text-[9px] font-bold uppercase py-3 px-6">OT / Establecimiento</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase py-3">Insumo</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3">Teórico (L/K)</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3">Real (L/K)</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3 px-6">Eficiencia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEfficiency.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="h-48 text-center italic text-slate-400 text-xs">No hay datos suficientes para generar este informe.</TableCell></TableRow>
                                ) : (
                                    filteredEfficiency.map((e: any, idx: number) => {
                                        const theoretical = e.theoretical || 1;
                                        const diff = e.real - e.theoretical;
                                        const perc = (diff / theoretical) * 100;
                                        const isOver = diff > 0.01;
                                        const isUnder = diff < -0.01;

                                        return (
                                            <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-4 px-6">
                                                    <div className="text-[11px] font-black text-primary tracking-tighter">#{e.orderNumber.toString().padStart(8, '0')}</div>
                                                    <div className="text-[9px] text-slate-500 font-bold uppercase">{e.field}</div>
                                                </TableCell>
                                                <TableCell className="text-[10px] font-bold text-slate-700 uppercase">{e.productName}</TableCell>
                                                <TableCell className="text-right font-mono text-[11px] text-slate-400">{e.theoretical.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono text-[11px] font-bold text-slate-900">{e.real.toLocaleString()}</TableCell>
                                                <TableCell className="text-right px-6">
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded border shadow-sm ${isOver ? 'bg-red-50 text-red-600 border-red-100' :
                                                        isUnder ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-green-50 text-green-700 border-green-200'
                                                        }`}>
                                                        {perc > 0 ? '+' : ''}{perc.toFixed(1)}%
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="balance" className="mt-0">
                    <Card className="border shadow-none bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/80 border-b flex flex-row items-center justify-between py-4">
                            <div className="space-y-1">
                                <CardTitle className="text-[11px] font-extrabold uppercase text-slate-800 tracking-tight">Balance Físico de Campaña</CardTitle>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Comparativa de ingresos de stock vs consumo real total</p>
                            </div>
                            <Wallet className="h-4 w-4 text-green-600 opacity-40" />
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/30">
                                    <TableHead className="text-[9px] font-bold uppercase py-3 px-6">Producto</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3">Total Ingresado (Compras)</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3">Total Aplicado (Cierre)</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase text-right py-3 px-6">Stock Final Estimado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {costData.purchases.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="h-48 text-center italic text-slate-400 text-xs">Cargue facturas de compra para ver el balance.</TableCell></TableRow>
                                ) : (
                                    costData.purchases.map((p: any) => {
                                        const c = costData.consumption.find((item: any) => item.productId === p.productId);
                                        const consumed = c?.totalConsumed || 0;
                                        const stock = p.totalPurchased - consumed;

                                        return (
                                            <TableRow key={p.productId} className="hover:bg-slate-50/50">
                                                <TableCell className="py-4 px-6 text-[11px] font-extrabold text-slate-900 uppercase leading-none">{p.productName}</TableCell>
                                                <TableCell className="text-right font-mono font-bold text-blue-600 text-sm tracking-tighter">{p.totalPurchased.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono font-bold text-orange-600 text-sm tracking-tighter">{consumed.toLocaleString()}</TableCell>
                                                <TableCell className="text-right px-6 font-mono font-black text-slate-900 bg-slate-50/60 shadow-inner text-sm tracking-tighter">{stock.toLocaleString()}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="border shadow-none bg-primary/5 border-primary/10 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <Info className="h-4 w-4 text-primary opacity-50" />
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Información de Gestión</h3>
                    <p className="text-[10px] text-primary/70 font-bold max-w-lg leading-tight">
                        Los consumos se calculan a partir de órdenes con estado "CERRADA".
                        La eficiencia permite detectar mermas o errores en la aplicación de campo.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
