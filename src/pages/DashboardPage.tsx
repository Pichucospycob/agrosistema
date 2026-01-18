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
                            Carga la **Nueva Orden de Trabajo (OT)** seleccionando los lotes y definiendo la receta (productos y dosis).
                        </p>
                        <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                            Ir a Órdenes <ArrowRight size={10} />
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
                            Una vez creada, abre los detalles de la orden y emite el **Remito de Salida**. Esto descontará automáticamente el stock del galpón.
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
