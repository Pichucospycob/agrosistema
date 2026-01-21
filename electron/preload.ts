import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------
console.log("PRELOAD SCRIPT RUNNING");
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },
})

contextBridge.exposeInMainWorld('db', {
    getProducts: () => ipcRenderer.invoke('get-products'),
    createProduct: (product: any) => ipcRenderer.invoke('create-product', product),
    deleteProduct: (id: number) => ipcRenderer.invoke('delete-product', id),
    // Lots
    getLots: () => ipcRenderer.invoke('get-lots'),
    createLot: (lot: any) => ipcRenderer.invoke('create-lot', lot),
    deleteLot: (id: number) => ipcRenderer.invoke('delete-lot', id),
    // Stock
    addStockMovement: (data: any) => ipcRenderer.invoke('add-stock-movement', data),
    getStockMovements: () => ipcRenderer.invoke('get-stock-movements'),
    // Orders
    getOrders: () => ipcRenderer.invoke('get-orders'),
    createOrder: (data: any) => ipcRenderer.invoke('create-order', data),
    updateOrder: (data: any) => ipcRenderer.invoke('update-order', data),
    getOrderDetails: (id: number) => ipcRenderer.invoke('get-order-details', id),
    emitRemito: (data: { orderId: number, items: any[] }) => ipcRenderer.invoke('emit-remito', data),
    closeOrder: (data: { orderId: number, items: any[] }) => ipcRenderer.invoke('close-order', data),
    getConsumptionByCampaign: () => ipcRenderer.invoke('get-consumption-by-campaign'),
    getContainerStatus: () => ipcRenderer.invoke('get-container-status'),
    updateProduct: (data: any) => ipcRenderer.invoke('update-product', data),
    updateLot: (data: any) => ipcRenderer.invoke('update-lot', data),
    getEfficiencyReport: () => ipcRenderer.invoke('get-efficiency-report'),
    getCampaignCostReport: () => ipcRenderer.invoke('get-campaign-cost-report'),
    quitApp: () => ipcRenderer.invoke('quit-app'),
})
