import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Guía de Gestión Agrosistema</h1>
                <p className="text-slate-500 text-sm font-semibold mt-1">Sigue estos tres pasos fundamentales para el control de tus aplicaciones</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Paso 1 */}
                <Card className="border-2 border-primary/10 shadow-sm hover:border-primary/30 transition-all group">
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                            Paso 1: Orden de Trabajo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Carga la **Nueva OT** con lotes, receta e **instrucciones técnicas**. Al guardar, el sistema te llevará **automáticamente** a los detalles.
                        </p>
                        <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                            ¡Novedad! Ahora puedes editar borradores <ArrowRight size={10} />
                        </div>
                    </CardContent>
                </Card>

                {/* Paso 2 */}
                <Card className="border-2 border-primary/10 shadow-sm hover:border-primary/30 transition-all group">
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <FileCheck size={24} />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                            Paso 2: Emitir Remito
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Al guardar la OT, verás los detalles. Allí podrás emitir el **Remito de Salida** para descontar el stock del galpón automáticamente.
                        </p>
                        <div className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1 italic">
                            Salida de Depósito
                        </div>
                    </CardContent>
                </Card>

                {/* Paso 3 */}
                <Card className="border-2 border-primary/10 shadow-sm hover:border-primary/30 transition-all group">
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                            Paso 3: Cierre y Sobrantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Al finalizar la aplicación, carga las **Devoluciones** si sobró producto y presiona **Cerrar Orden**. El stock regresará al galpón y la orden quedará como "Cerrada".
                        </p>
                        <div className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1 italic">
                            Consumo Final Real
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-8 mt-8 shadow-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <ArrowRight size={20} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-tight">Nuevos Informes Avanzados</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Análisis de Gestión</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Utiliza el **Balance de Campaña** para negociar con proveedores. Compara compras totales vs consumo real por producto.
                        </p>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-[10px] text-slate-400 font-mono">
                                TIP: Haz clic en cualquier producto para ver su **Ficha Histórica** completa.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Control de Eficiencia</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Mide la precisión de tus aplicadores con el reporte de **Eficiencia**. Visualiza porcentajes de desvío entre la receta y lo aplicado.
                        </p>
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <p className="text-[10px] text-green-400 font-mono">
                                ¡Importante! Requiere que todas las órdenes estén **Cerradas** para datos reales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/50 border border-slate-200 rounded-xl p-8 mt-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recordatorio Importante</h3>
                <div className="grid md:grid-cols-2 gap-8 text-xs text-slate-500 font-medium leading-relaxed">
                    <p>
                        El sistema utiliza un **Remito de Salida** para registrar qué se llevó el aplicador. Es una instancia provisional que asegura que el stock esté reservado pero sujeto a cambios.
                    </p>
                    <p>
                        Solo el **Cierre de Orden** garantiza que los informes de eficiencia (Teórico vs Real) sean precisos para tu análisis de costos al final de la campaña.
                    </p>
                </div>
            </div>

        </div>
    );
}
