import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "./components/Layout";
import StockPage from "./pages/StockPage";
import LotesPage from "./pages/LotesPage";
import OrdersPage from './pages/OrdersPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdjustmentPage from "./pages/AdjustmentPage";
import ReportsPage from "./pages/ReportsPage";
import DashboardPage from "./pages/DashboardPage";
import EmptyConfigPage from "./pages/EmptyConfigPage";

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
            <Route path="ordenes/:id" element={<OrderDetailsPage />} />
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
