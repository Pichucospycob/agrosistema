/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />
/// <reference types="vite-plugin-electron-renderer/client" />

interface Window {
    ipcRenderer: import('electron').IpcRenderer
    db: {
        getProducts: () => Promise<any[]>
        createProduct: (product: any) => Promise<any>
        deleteProduct: (id: number) => Promise<boolean>
        // Lots
        getLots: () => Promise<any[]>
        createLot: (lot: { name: string, surface: number }) => Promise<any>
        deleteLot: (id: number) => Promise<boolean>
        // Stock
        addStockMovement: (data: { productId: number, quantity: number, description: string, type: string }) => Promise<{ success: boolean, newStock: number }>
        getStockMovements: () => Promise<any[]>
        // Orders
        getOrders: () => Promise<any[]>
        createOrder: (data: any) => Promise<any>
        updateOrder: (data: any) => Promise<any>
        getOrderDetails: (id: number) => Promise<any>
        emitRemito: (data: { orderId: number, items: any[] }) => Promise<boolean>
        closeOrder: (data: { orderId: number, items: any[] }) => Promise<boolean>
        // Remitos
        getRemitos: () => Promise<any[]>
        getAggregatedItemsForOrders: (ids: number[]) => Promise<any[]>
        createConsolidatedRemito: (data: any) => Promise<any>
        getRemitoDetails: (id: number) => Promise<any>
        closeConsolidatedRemito: (data: any) => Promise<boolean>
        getConsumptionByCampaign: () => Promise<any[]>
        getContainerStatus: () => Promise<any[]>
        updateProduct: (data: { id: number, name?: string, activeIngredient?: string, presentation?: string }) => Promise<boolean>
        updateLot: (data: { id: number, name?: string, surface?: number }) => Promise<boolean>
        getEfficiencyReport: () => Promise<any[]>
        getCampaignCostReport: () => Promise<{ purchases: any[], consumption: any[] }>
        getSupplierRemitos: () => Promise<any[]>
        createSupplierRemito: (data: any) => Promise<any>
        getSupplierRemitoDetails: (id: number) => Promise<any>
        getProductHistory: (id: number) => Promise<any[]>
        truncateOrders: () => Promise<boolean>
    }
}
