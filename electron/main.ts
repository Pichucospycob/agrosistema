import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initDb, AppDatabase, runMigrations } from '../src/db'
import * as schema from '../src/db/schema'
import { eq, sql } from 'drizzle-orm';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = fileURLToPath(import.meta.url)

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // --- Translation of Main Menu to Spanish ---
  const template: any[] = [
    {
      label: 'Archivo',
      submenu: [
        { label: 'Salir', role: 'quit' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Deshacer', role: 'undo' },
        { label: 'Rehacer', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', role: 'cut' },
        { label: 'Copiar', role: 'copy' },
        { label: 'Pegar', role: 'paste' },
        { label: 'Seleccionar todo', role: 'selectAll' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', role: 'reload' },
        { label: 'Forzar recarga', role: 'forceReload' },
        { label: 'Herramientas de desarrollo', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Zoom +', role: 'zoomIn' },
        { label: 'Zoom -', role: 'zoomOut' },
        { label: 'Restablecer zoom', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Pantalla completa', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { label: 'Minimizar', role: 'minimize' },
        { label: 'Cerrar', role: 'close' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Instrucciones de Uso',
          click: () => {
            win?.webContents.send('navigate-to', '/guia')
          }
        },
        { type: 'separator' },
        {
          label: 'Acerca de Agrosistema',
          click: async () => {
            const { dialog } = require('electron')
            dialog.showMessageBox({
              type: 'info',
              title: 'Agrosistema',
              message: 'Gestión Agropecuaria v1.0.0',
              detail: 'Herramienta integral para el control de insumos y aplicaciones.'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async () => {
  try {
    const { db, save } = await initDb();
    runMigrations(); // uses internal instance

    // Patch DB using the loaded sql.js instance
    // We need access to the underlying SQL.js 'run' method.
    // Drizzle's db object doesn't expose raw .run() easily on the top level in all drivers,
    // but since we keep `sqlDbInstance` in `src/db/index.ts` but don't export it...
    // Wait, main.ts imports initDb. Let's see if we can hack the patch inside main or if we need to export the raw instance.

    // Actually, initDb returns { db, save }. 
    // We can create a new function in `src/db/index.ts` called `patchSchema` that uses the internal `sqlDbInstance`.
    // That is cleaner.

    createWindow();
    setupIpcHandlers(db, save);

    // --- Auto Updater ---
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify();

      autoUpdater.on('update-available', () => {
        console.log('Update available.');
      });

      autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Actualización lista',
          message: `Una nueva versión (${info.version}) ha sido descargada. ¿Deseas reiniciar la aplicación para instalarla ahora?`,
          buttons: ['Instalar ahora', 'Más tarde']
        }).then((result) => {
          if (result.response === 0) {
            save(); // Always save before update
            autoUpdater.quitAndInstall();
          }
        });
      });
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    app.quit();
  }
})

function setupIpcHandlers(db: AppDatabase, save: () => void) {
  ipcMain.handle('get-products', async () => {
    const result = await db.select().from(schema.products).orderBy(schema.products.name);
    return result;
  });

  ipcMain.handle('create-product', async (event, product) => {
    const result = await db.insert(schema.products).values(product).returning();
    save();
    return result[0];
  });

  ipcMain.handle('delete-product', async (event, id) => {
    await db.delete(schema.products).where(eq(schema.products.id, id));
    save();
    return true;
  });

  ipcMain.handle('quit-app', () => {
    save(); // Final safety save
    app.quit();
  });

  // --- Lots ---
  ipcMain.handle('get-lots', async () => {
    const result = await db.select().from(schema.lots).orderBy(schema.lots.name);
    return result;
  });

  ipcMain.handle('create-lot', async (event, lot) => {
    const result = await db.insert(schema.lots).values(lot).returning();
    save();
    return result[0];
  });

  ipcMain.handle('delete-lot', async (event, id) => {
    await db.delete(schema.lots).where(eq(schema.lots.id, id));
    save();
    return true;
  });

  // --- Stock Movements ---
  ipcMain.handle('add-stock-movement', async (event, { productId, quantity, description, type }) => {
    try {
      const result = await db.transaction(async (tx) => {
        await tx.insert(schema.stockMovements).values({
          productId,
          quantity,
          type,
          description,
        });

        const product = await tx.select().from(schema.products).where(eq(schema.products.id, productId)).get();
        if (!product) throw new Error('Product not found');
        const newStock = (product.currentStock || 0) + quantity;

        await tx.update(schema.products)
          .set({ currentStock: newStock })
          .where(eq(schema.products.id, productId));

        return { success: true, newStock };
      });
      save();
      return result;
    } catch (e: any) {
      console.warn("Transaction might have failed, attempting sequential for compatibility if needed:", e);
      throw e;
    }
  });

  // --- Orders ---
  ipcMain.handle('get-orders', async () => {
    try {
      const result = await db.select().from(schema.orders).orderBy(schema.orders.date);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('create-order', async (event, orderData) => {
    try {
      const result = await db.transaction(async (tx) => {
        // Calculate next order number
        const lastOrder = await tx.select().from(schema.orders).orderBy(sql`${schema.orders.orderNumber} DESC`).limit(1).get();
        const nextOrderNumber = (lastOrder?.orderNumber || 0) + 1;

        const [newOrder] = await tx.insert(schema.orders).values({
          orderNumber: nextOrderNumber,
          date: orderData.date,
          campaign: orderData.campaign,
          contractor: orderData.contractor,
          field: orderData.field,
          crop: orderData.crop,
          labor: orderData.labor,
          implanted: orderData.implanted,
          totalSurface: orderData.totalSurface, // from frontend

          nozzleType: orderData.nozzleType,
          nozzleDescription: orderData.nozzleDescription,
          waterPerHa: orderData.waterPerHa,
          pressure: orderData.pressure,
          pressureUnit: orderData.pressureUnit,
          windSpeed: orderData.windSpeed,
          humidity: orderData.humidity,
          observations: orderData.observations,

          status: 'BORRADOR'
        }).returning();

        // Lots? If orderData.lotDetails is present
        if (orderData.lotDetails && orderData.lotDetails.length > 0) {
          for (const detail of orderData.lotDetails) {
            await tx.insert(schema.orderLots).values({
              orderId: newOrder.id,
              lotId: detail.lotId,
              appliedSurface: detail.appliedSurface
            });
          }
        }

        for (const item of orderData.items) {
          await tx.insert(schema.orderItems).values({
            orderId: newOrder.id,
            productId: item.productId,
            dose: item.dose,
            quantityTheoretical: item.total,
            quantityDelivered: item.total, // Default setup
          });
        }
        return newOrder;
      });
      save();
      return result;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  });

  ipcMain.handle('get-order-details', async (event, orderId) => {
    const order = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId)).get();
    if (!order) throw new Error("Order not found");

    const items = await db.select({
      id: schema.orderItems.id,
      productId: schema.orderItems.productId,
      productName: schema.products.name,
      productPresentation: schema.products.presentation,
      dose: schema.orderItems.dose,
      quantityTheoretical: schema.orderItems.quantityTheoretical,
      quantityDelivered: schema.orderItems.quantityDelivered,
      quantityReturned: schema.orderItems.quantityReturned,
      quantityReal: schema.orderItems.quantityReal,
    })
      .from(schema.orderItems)
      .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
      .where(eq(schema.orderItems.orderId, orderId));

    const lots = await db.select({
      id: schema.lots.id,
      name: schema.lots.name,
      appliedSurface: schema.orderLots.appliedSurface
    })
      .from(schema.orderLots)
      .leftJoin(schema.lots, eq(schema.orderLots.lotId, schema.lots.id))
      .where(eq(schema.orderLots.orderId, orderId));

    return { ...order, items, lots };
  });

  ipcMain.handle('emit-remito', async (event, { orderId, items }) => {
    // items: { id, productId, quantityDelivered }[]
    await db.transaction(async (tx) => {
      // 1. Assign Remito Number if not already present
      const order = await tx.select().from(schema.orders)
        .where(eq(schema.orders.id, orderId)).get();

      if (!order) throw new Error("Order not found");

      let remitoNum = order.remitoNumber;
      if (!remitoNum) {
        const lastRemitoOrder = await tx.select().from(schema.orders)
          .where(sql`${schema.orders.remitoNumber} IS NOT NULL`)
          .orderBy(sql`${schema.orders.remitoNumber} DESC`)
          .limit(1).get();
        remitoNum = (lastRemitoOrder?.remitoNumber || 0) + 1;
      }

      // Update Order Status and Remito Number
      await tx.update(schema.orders)
        .set({
          status: 'EMITIDA',
          remitoNumber: remitoNum
        })
        .where(eq(schema.orders.id, orderId));

      for (const item of items) {
        // 1. Update OrderItem
        if (item.id) {
          await tx.update(schema.orderItems)
            .set({ quantityDelivered: item.quantityDelivered })
            .where(eq(schema.orderItems.id, item.id));
        }

        // 2. Stock Movement (Deduct)
        // Ensure productId is present
        if (item.productId) {
          await tx.insert(schema.stockMovements).values({
            productId: item.productId,
            quantity: -item.quantityDelivered, // Negative for output
            type: 'SALIDA_REMITO',
            orderId: orderId,
            description: `Remito Orden #${order?.orderNumber}`
          });

          // 3. Update Product Stock
          const product = await tx.select().from(schema.products).where(eq(schema.products.id, item.productId)).get();
          if (product) {
            await tx.update(schema.products)
              .set({ currentStock: (product.currentStock || 0) - item.quantityDelivered })
              .where(eq(schema.products.id, item.productId));
          }
        } else {
          console.warn("Item missing productId, skipping stock deduction:", item);
        }
      }
    });
    save();
    return true;
  });

  ipcMain.handle('close-order', async (event, { orderId, items }) => {
    // items: { id, productId, quantityReturned }
    await db.transaction(async (tx) => {
      await tx.update(schema.orders).set({ status: 'CERRADA' }).where(eq(schema.orders.id, orderId));

      const order = await tx.select().from(schema.orders).where(eq(schema.orders.id, orderId)).get();

      for (const item of items) {
        const returned = item.quantityReturned || 0;

        // We need delivered to calc real. Fetch it? Or pass it.
        // Let's fetch the item first to be safe.
        const existingItem = await tx.select().from(schema.orderItems).where(eq(schema.orderItems.id, item.id)).get();
        if (!existingItem) continue;

        const realQuantity = (existingItem.quantityDelivered || 0) - returned;

        await tx.update(schema.orderItems).set({
          quantityReturned: returned,
          quantityReal: realQuantity
        }).where(eq(schema.orderItems.id, item.id));

        // Return Stock (Add back the returned amount)
        if (returned > 0) {
          await tx.insert(schema.stockMovements).values({
            productId: item.productId,
            quantity: returned,
            type: 'RETORNO_SOBRANTE',
            orderId: orderId,
            description: `Retorno Orden #${order?.orderNumber}`
          });

          const product = await tx.select().from(schema.products).where(eq(schema.products.id, item.productId)).get();
          if (product) {
            await tx.update(schema.products).set({ currentStock: product.currentStock + returned }).where(eq(schema.products.id, item.productId));
          }
        }
      }
    });
    save();
    return true;
  });

  ipcMain.handle('get-stock-movements', async () => {
    try {
      const result = await db.select({
        id: schema.stockMovements.id,
        date: schema.stockMovements.date,
        productId: schema.stockMovements.productId,
        productName: schema.products.name,
        type: schema.stockMovements.type,
        quantity: schema.stockMovements.quantity,
        description: schema.stockMovements.description,
        orderId: schema.stockMovements.orderId,
      })
        .from(schema.stockMovements)
        .leftJoin(schema.products, eq(schema.stockMovements.productId, schema.products.id))
        .orderBy(schema.stockMovements.date);
      return result;
    } catch (error) {
      console.error("Error fetching movements:", error);
      throw error;
    }
  });

  ipcMain.handle('get-consumption-by-campaign', async () => {
    try {
      // Aggregate consumption from CLOSED orders
      // In a real app we might want a raw query, but with Drizzle:
      const orders = await db.select({
        id: schema.orders.id,
        campaign: schema.orders.campaign
      }).from(schema.orders).where(eq(schema.orders.status, 'CERRADA'));

      const campaignIds = orders.map(o => o.id);
      if (campaignIds.length === 0) return [];

      const items = await db.select({
        productId: schema.orderItems.productId,
        productName: schema.products.name,
        quantityReal: schema.orderItems.quantityReal,
        campaign: schema.orders.campaign
      })
        .from(schema.orderItems)
        .leftJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
        .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
        .where(eq(schema.orders.status, 'CERRADA'));

      return items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-container-status', async () => {
    try {
      // Simple join with products
      const result = await db.select({
        productName: schema.products.name,
        presentation: schema.products.presentation,
        pendingReturn: schema.emptyContainers.pendingReturn,
        deliveredCat: schema.emptyContainers.deliveredCat,
      })
        .from(schema.emptyContainers)
        .leftJoin(schema.products, eq(schema.emptyContainers.productId, schema.products.id));
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('update-product', async (event, data: { id: number, name?: string, activeIngredient?: string, presentation?: string }) => {
    try {
      await db.update(schema.products)
        .set({
          name: data.name,
          activeIngredient: data.activeIngredient,
          presentation: data.presentation
        })
        .where(eq(schema.products.id, data.id));
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('update-lot', async (event, data: { id: number, name?: string, surface?: number }) => {
    try {
      await db.update(schema.lots)
        .set({
          name: data.name,
          surface: data.surface
        })
        .where(eq(schema.lots.id, data.id));
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-efficiency-report', async () => {
    try {
      const result = await db.select({
        orderNumber: schema.orders.orderNumber,
        field: schema.orders.field,
        productName: schema.products.name,
        theoretical: schema.orderItems.quantityTheoretical,
        real: schema.orderItems.quantityReal,
        campaign: schema.orders.campaign
      })
        .from(schema.orderItems)
        .leftJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
        .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
        .where(eq(schema.orders.status, 'CERRADA'));
      return result;
    } catch (error) {
      console.error(error); throw error;
    }
  });

  ipcMain.handle('get-campaign-cost-report', async () => {
    try {
      const purchases = await db.select({
        productId: schema.stockMovements.productId,
        productName: schema.products.name,
        totalPurchased: sql`sum(${schema.stockMovements.quantity})`
      })
        .from(schema.stockMovements)
        .leftJoin(schema.products, eq(schema.stockMovements.productId, schema.products.id))
        .where(eq(schema.stockMovements.type, 'COMPRA'))
        .groupBy(schema.stockMovements.productId);

      const consumption = await db.select({
        productId: schema.orderItems.productId,
        totalConsumed: sql`sum(${schema.orderItems.quantityReal})`
      })
        .from(schema.orderItems)
        .leftJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
        .where(eq(schema.orders.status, 'CERRADA'))
        .groupBy(schema.orderItems.productId);

      return { purchases, consumption };
    } catch (error) {
      console.error(error); throw error;
    }
  });
}
