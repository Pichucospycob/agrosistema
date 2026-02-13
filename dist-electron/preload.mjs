"use strict";
const electron = require("electron");
console.log("PRELOAD SCRIPT RUNNING");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("db", {
  getProducts: () => electron.ipcRenderer.invoke("get-products"),
  createProduct: (product) => electron.ipcRenderer.invoke("create-product", product),
  deleteProduct: (id) => electron.ipcRenderer.invoke("delete-product", id),
  // Lots
  getLots: () => electron.ipcRenderer.invoke("get-lots"),
  createLot: (lot) => electron.ipcRenderer.invoke("create-lot", lot),
  deleteLot: (id) => electron.ipcRenderer.invoke("delete-lot", id),
  // Stock
  addStockMovement: (data) => electron.ipcRenderer.invoke("add-stock-movement", data),
  getStockMovements: () => electron.ipcRenderer.invoke("get-stock-movements"),
  // Orders
  getOrders: () => electron.ipcRenderer.invoke("get-orders"),
  createOrder: (data) => electron.ipcRenderer.invoke("create-order", data),
  updateOrder: (data) => electron.ipcRenderer.invoke("update-order", data),
  getOrderDetails: (id) => electron.ipcRenderer.invoke("get-order-details", id),
  emitRemito: (data) => electron.ipcRenderer.invoke("emit-remito", data),
  closeOrder: (data) => electron.ipcRenderer.invoke("close-order", data),
  // Remitos Consolidados
  getRemitos: () => electron.ipcRenderer.invoke("get-remitos"),
  getAggregatedItemsForOrders: (ids) => electron.ipcRenderer.invoke("get-aggregated-items-for-orders", ids),
  createConsolidatedRemito: (data) => electron.ipcRenderer.invoke("create-consolidated-remito", data),
  getRemitoDetails: (id) => electron.ipcRenderer.invoke("get-remito-details", id),
  closeConsolidatedRemito: (data) => electron.ipcRenderer.invoke("close-consolidated-remito", data),
  getConsumptionByCampaign: () => electron.ipcRenderer.invoke("get-consumption-by-campaign"),
  getContainerStatus: () => electron.ipcRenderer.invoke("get-container-status"),
  updateProduct: (data) => electron.ipcRenderer.invoke("update-product", data),
  updateLot: (data) => electron.ipcRenderer.invoke("update-lot", data),
  getEfficiencyReport: () => electron.ipcRenderer.invoke("get-efficiency-report"),
  getCampaignCostReport: () => electron.ipcRenderer.invoke("get-campaign-cost-report"),
  undoCloseConsolidatedRemito: (id) => electron.ipcRenderer.invoke("undo-close-consolidated-remito", id),
  deleteConsolidatedRemito: (id) => electron.ipcRenderer.invoke("delete-consolidated-remito", id),
  // Supplier Remitos
  getSupplierRemitos: () => electron.ipcRenderer.invoke("get-supplier-remitos"),
  createSupplierRemito: (data) => electron.ipcRenderer.invoke("create-supplier-remito", data),
  getSupplierRemitoDetails: (id) => electron.ipcRenderer.invoke("get-supplier-remito-details", id),
  getProductHistory: (id) => electron.ipcRenderer.invoke("get-product-history", id),
  quitApp: () => electron.ipcRenderer.invoke("quit-app")
});
