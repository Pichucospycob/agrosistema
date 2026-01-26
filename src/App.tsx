import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "./components/Layout";
import StockPage from "./pages/StockPage";
import LotesPage from "./pages/LotesPage";
import OrdersPage from './pages/OrdersPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import RemitoDetailsPage from './pages/RemitoDetailsPage';
import RemitoEmissionPage from './pages/RemitoEmissionPage';
import RemitosPage from './pages/RemitosPage';
import AdjustmentPage from "./pages/AdjustmentPage";
import ReportsPage from "./pages/ReportsPage";
import DashboardPage from "./pages/DashboardPage";
import EmptyConfigPage from "./pages/EmptyConfigPage";
import SupplierRemitosPage from "./pages/SupplierRemitosPage";
import SupplierRemitoCreatePage from "./pages/SupplierRemitoCreatePage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StockPage />} />
            <Route path="guia" element={<DashboardPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="ordenes" element={<OrdersPage />} />
            <Route path="ordenes/nueva" element={<OrderCreatePage />} />
            <Route path="ordenes/editar/:id" element={<OrderCreatePage />} />
            <Route path="ordenes/:id" element={<OrderDetailsPage />} />
            <Route path="remitos/:id" element={<RemitoDetailsPage />} />
            <Route path="remitos/emision" element={<RemitoEmissionPage />} />
            <Route path="remitos" element={<RemitosPage />} />
            <Route path="remitos-entrada" element={<SupplierRemitosPage />} />
            <Route path="remitos-entrada/nuevo" element={<SupplierRemitoCreatePage />} />
            <Route path="lotes" element={<LotesPage />} />
            <Route path="ajustes" element={<AdjustmentPage />} />
            <Route path="informes" element={<ReportsPage />} />
            <Route path="config" element={<EmptyConfigPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
