import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Leaf, Package, ClipboardList, Settings, LogOut, BarChart3, HelpCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Layout() {
    const navigate = useNavigate();
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);

    // Listen for navigation requests from the main process (Electron menu)
    useEffect(() => {
        const handleNavigate = (_: any, path: string) => {
            navigate(path);
        };

        if ((window as any).ipcRenderer) {
            (window as any).ipcRenderer.on('navigate-to', handleNavigate);
        }

        return () => {
            if ((window as any).ipcRenderer) {
                (window as any).ipcRenderer.off('navigate-to', handleNavigate);
            }
        };
    }, [navigate]);

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] flex flex-col z-20">
                <div className="p-6 flex flex-col items-center gap-4 border-b border-white/10">
                    <div className="w-48 h-24 flex items-center justify-center overflow-hidden">
                        <img src="/logo_maragu.ico" alt="Logo Maragu" className="h-full w-full object-contain scale-110" />
                    </div>
                    <div className="text-center">
                        <h1 className="font-bold text-lg text-white tracking-tight leading-none">AGROSISTEMA</h1>
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-2">Control de Gestión</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold text-white/40 uppercase tracking-widest mt-4 mb-2">
                        Menú Principal
                    </div>
                    <NavItem to="/guia" icon={<HelpCircle size={20} />} label="Guía de Uso" />
                    <NavItem to="/stock" icon={<Package size={20} />} label="Stock de Insumos" />
                    <NavItem to="/lotes" icon={<Leaf size={20} />} label="Lotes" />
                    <NavItem to="/ordenes" icon={<ClipboardList size={20} />} label="Órdenes de Trabajo" />
                    <NavItem to="/remitos" icon={<Truck size={20} />} label="Remitos" />
                    <NavItem to="/remitos-entrada" icon={<Package size={20} />} label="Entrada Insumos" />
                    <NavItem to="/informes" icon={<BarChart3 size={20} />} label="Informes" />
                    <NavItem to="/ajustes" icon={<Settings size={20} />} label="Ajustes de Stock" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavItem to="/config" icon={<Settings size={20} />} label="Parámetros Sistema" />
                    <button
                        onClick={() => setShowQuitConfirm(true)}
                        className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold text-red-400 hover:bg-white/5 transition-all"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background">
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-semibold text-slate-500 tracking-tight text-xs uppercase flex items-center gap-2">
                        Agrosistema <span className="text-slate-300">/</span> <span className="text-slate-900">Guía de Inicio</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-900 uppercase">Admin Usuario</p>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Administrador</p>
                            </div>
                            <div className="h-8 w-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                                AD
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <Dialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
                <DialogContent className="max-w-sm border shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="bg-red-600 h-1.5 w-full" />
                    <div className="p-6 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">Cerrar Agrosistema</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                                ¿Estás seguro de que deseas salir del programa?
                                <span className="block mt-1">Se cerrarán todas las tareas pendientes.</span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0 sm:justify-between">
                            <Button variant="ghost" onClick={() => setShowQuitConfirm(false)} className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                                CANCELAR
                            </Button>
                            <Button
                                onClick={() => (window as any).db.quitApp()}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 shadow-md h-10"
                            >
                                SALIR DEL PROGRAMA
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-colors",
                isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            <span className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")}>{icon}</span>
            {label}
        </Link>
    );
}
