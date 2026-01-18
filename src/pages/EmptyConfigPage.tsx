import { Button } from "@/components/ui/button";
import { MoveLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyConfigPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Construction size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Sección en Desarrollo</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Los parámetros avanzados del sistema estarán disponibles en la próxima versión.
                    Por ahora, puedes seguir gestionando tus lotes e insumos desde los menús principales.
                </p>
            </div>
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="font-bold uppercase tracking-widest text-xs h-10 px-8"
            >
                <MoveLeft className="mr-2 h-4 w-4" /> Volver atrás
            </Button>
        </div>
    );
}
