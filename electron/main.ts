import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { initDb, AppDatabase, runMigrations } from '../src/db'
import * as schema from '../src/db/schema'
import { eq, sql } from 'drizzle-orm';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC || '', 'logo_maragu.ico'),
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
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'local.db');
    const legacyDbPath = path.join(process.cwd(), 'local.db');

    // Migration Logic: If DB doesn't exist in userData but does in working dir, copy it.
    if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
      console.log('Migrating legacy database from:', legacyDbPath);
      try {
        fs.copyFileSync(legacyDbPath, dbPath);
        console.log('Migration successful.');
        // We keep the old one as backup for now, just in case.
      } catch (err) {
        console.error('Migration failed:', err);
      }
    }

    const { db, save } = await initDb(dbPath);
    runMigrations(); // uses internal instance

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

  ipcMain.handle('create-product', async (_event, product) => {
    const result = await db.insert(schema.products).values(product).returning();
    save();
    return result[0];
  });

  ipcMain.handle('delete-product', async (_event, id) => {
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

  ipcMain.handle('create-lot', async (_event, lot) => {
    const result = await db.insert(schema.lots).values(lot).returning();
    save();
    return result[0];
  });

  ipcMain.handle('delete-lot', async (_event, id) => {
    await db.delete(schema.lots).where(eq(schema.lots.id, id));
    save();
    return true;
  });

  // --- Stock Movements ---
  ipcMain.handle('add-stock-movement', async (_event, { productId, quantity, description, type }) => {
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
      const orders = await db.select().from(schema.orders).orderBy(schema.orders.date);
      const result = [];
      for (const order of orders) {
        const orderLots = await db.select({
          name: schema.lots.name
        })
          .from(schema.orderLots)
          .leftJoin(schema.lots, eq(schema.orderLots.lotId, schema.lots.id))
          .where(eq(schema.orderLots.orderId, order.id));

        const lotNames = orderLots.map(l => l.name).join(', ');
        result.push({ ...order, lotNames });
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('create-order', async (_event, orderData) => {
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

  ipcMain.handle('update-order', async (_event, { id, ...orderData }) => {
    try {
      const result = await db.transaction(async (tx) => {
        // 1. Update main order data
        const [updatedOrder] = await tx.update(schema.orders)
          .set({
            date: orderData.date,
            campaign: orderData.campaign,
            contractor: orderData.contractor,
            field: orderData.field,
            crop: orderData.crop,
            labor: orderData.labor,
            implanted: orderData.implanted,
            totalSurface: orderData.totalSurface,
            nozzleType: orderData.nozzleType,
            nozzleDescription: orderData.nozzleDescription,
            waterPerHa: orderData.waterPerHa,
            pressure: orderData.pressure,
            pressureUnit: orderData.pressureUnit,
            windSpeed: orderData.windSpeed,
            humidity: orderData.humidity,
            instructions: orderData.instructions,
            observations: orderData.observations,
          })
          .where(eq(schema.orders.id, id))
          .returning();

        // 2. Refresh items (Delete old, insert new)
        await tx.delete(schema.orderItems).where(eq(schema.orderItems.orderId, id));
        for (const item of orderData.items) {
          await tx.insert(schema.orderItems).values({
            orderId: id,
            productId: item.productId,
            dose: item.dose,
            quantityTheoretical: item.total,
            quantityDelivered: item.total,
          });
        }

        // 3. Refresh lots (Delete old, insert new)
        await tx.delete(schema.orderLots).where(eq(schema.orderLots.orderId, id));
        for (const lot of orderData.lotDetails) {
          await tx.insert(schema.orderLots).values({
            orderId: id,
            lotId: lot.lotId,
            appliedSurface: lot.appliedSurface,
          });
        }

        return updatedOrder;
      });
      save();
      return result;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  });

  ipcMain.handle('get-order-details', async (_event, orderId) => {
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

  ipcMain.handle('emit-remito', async (_event, { orderId, items }) => {
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

  ipcMain.handle('close-order', async (_event, { orderId, items }) => {
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
        campaign: schema.orders.campaign,
        date: schema.orders.date
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

  ipcMain.handle('update-product', async (_event, data: { id: number, name?: string, activeIngredient?: string, presentation?: string }) => {
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

  ipcMain.handle('update-lot', async (_event, data: { id: number, name?: string, surface?: number }) => {
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

  // --- Remitos Consolidados ---
  ipcMain.handle('get-remitos', async () => {
    try {
      return await db.select().from(schema.remitos).orderBy(sql`${schema.remitos.remitoNumber} DESC`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-aggregated-items-for-orders', async (_event, orderIds: number[]) => {
    try {
      const rawItems = await db.select({
        productId: schema.orderItems.productId,
        productName: schema.products.name,
        productPresentation: schema.products.presentation,
        quantityTheoretical: schema.orderItems.quantityTheoretical,
      })
        .from(schema.orderItems)
        .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
        .where(sql`${schema.orderItems.orderId} IN (${sql.join(orderIds, sql`, `)})`);

      const aggregatedMap: Map<number, any> = new Map();
      rawItems.forEach(item => {
        if (!aggregatedMap.has(item.productId)) {
          aggregatedMap.set(item.productId, { ...item, quantityTheoretical: 0 });
        }
        const existing = aggregatedMap.get(item.productId);
        existing.quantityTheoretical += (item.quantityTheoretical || 0);
      });

      return Array.from(aggregatedMap.values());
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('create-consolidated-remito', async (_event, { orderIds, date, contractor, observations, deliveredItems }) => {
    // deliveredItems: { productId: number, quantityDelivered: number }[]
    try {
      const result = await db.transaction(async (tx) => {
        // 1. Get next remito number
        const lastRemito = await tx.select().from(schema.remitos).orderBy(sql`${schema.remitos.remitoNumber} DESC`).limit(1).get();
        const nextRemitoNumber = (lastRemito?.remitoNumber || 0) + 1;

        // 2. Create entry in remitos
        const [newRemito] = await tx.insert(schema.remitos).values({
          remitoNumber: nextRemitoNumber,
          date,
          contractor,
          observations,
          status: 'EMITIDO'
        }).returning();

        // 3. Link orders
        await tx.update(schema.orders)
          .set({
            status: 'EMITIDA',
            remitoId: newRemito.id,
            remitoNumber: nextRemitoNumber
          })
          .where(sql`${schema.orders.id} IN (${sql.join(orderIds, sql`, `)})`);

        // 4. Distribute delivered quantities and generate stock movements
        for (const dItem of deliveredItems) {
          let remainingToDistribute = dItem.quantityDelivered;

          // Find all orderItems for this product across these orders
          const items = await tx.select().from(schema.orderItems)
            .where(sql`${schema.orderItems.orderId} IN (${sql.join(orderIds, sql`, `)}) AND ${schema.orderItems.productId} = ${dItem.productId}`);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let assign = 0;

            if (i === items.length - 1) {
              // Last one gets all remaining (surplus included)
              assign = remainingToDistribute;
            } else {
              // Others get exactly what they asked for (if possible)
              assign = Math.min(remainingToDistribute, item.quantityTheoretical);
            }

            await tx.update(schema.orderItems)
              .set({ quantityDelivered: assign })
              .where(eq(schema.orderItems.id, item.id));

            remainingToDistribute -= assign;
          }

          // Stock Movement for total product delivery
          await tx.insert(schema.stockMovements).values({
            productId: dItem.productId,
            quantity: -dItem.quantityDelivered,
            type: 'SALIDA_REMITO',
            description: `Remito Consolidado #${nextRemitoNumber}`
          });

          // Update product stock
          const product = await tx.select().from(schema.products).where(eq(schema.products.id, dItem.productId)).get();
          if (product) {
            await tx.update(schema.products)
              .set({ currentStock: (product.currentStock || 0) - dItem.quantityDelivered })
              .where(eq(schema.products.id, dItem.productId));
          }
        }
        return newRemito;
      });
      save();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-remito-details', async (_event, remitoId) => {
    try {
      const remito = await db.select().from(schema.remitos).where(eq(schema.remitos.id, remitoId)).get();
      if (!remito) throw new Error("Remito not found");

      const orders = await db.select().from(schema.orders).where(eq(schema.orders.remitoId, remitoId));

      const rawItems = await db.select({
        productId: schema.orderItems.productId,
        productName: schema.products.name,
        productPresentation: schema.products.presentation,
        quantityTheoretical: schema.orderItems.quantityTheoretical,
        quantityDelivered: schema.orderItems.quantityDelivered,
        quantityReturned: schema.orderItems.quantityReturned,
        quantityReal: schema.orderItems.quantityReal,
      })
        .from(schema.orderItems)
        .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
        .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
        .where(eq(schema.orders.remitoId, remitoId));

      const aggregatedMap: Map<number, any> = new Map();
      rawItems.forEach(item => {
        if (!aggregatedMap.has(item.productId)) {
          aggregatedMap.set(item.productId, { ...item });
        } else {
          const existing = aggregatedMap.get(item.productId);
          existing.quantityTheoretical += (item.quantityTheoretical || 0);
          existing.quantityDelivered += (item.quantityDelivered || 0);
          existing.quantityReturned += (item.quantityReturned || 0);
          existing.quantityReal += (item.quantityReal || 0);
        }
      });

      return {
        ...remito,
        orders,
        items: Array.from(aggregatedMap.values())
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('close-consolidated-remito', async (_event, { remitoId, itemsReturn, itemsDelivered }) => {
    try {
      const result = await db.transaction(async (tx) => {
        await tx.update(schema.remitos).set({ status: 'CERRADO' }).where(eq(schema.remitos.id, remitoId));
        const remito = await tx.select().from(schema.remitos).where(eq(schema.remitos.id, remitoId)).get();

        await tx.update(schema.orders).set({ status: 'CERRADA' }).where(eq(schema.orders.remitoId, remitoId));
        const linkedOrders = await tx.select().from(schema.orders).where(eq(schema.orders.remitoId, remitoId));

        // 1. Handle Delivery Corrections (Optional but useful for UX)
        if (itemsDelivered) {
          for (const dItem of itemsDelivered) {
            // Find current total delivered for this product in this remito
            const currentItems = await tx.select().from(schema.orderItems)
              .where(sql`${schema.orderItems.orderId} IN (${sql.join(linkedOrders.map(o => o.id), sql`, `)}) AND ${schema.orderItems.productId} = ${dItem.productId}`);

            const currentTotal = currentItems.reduce((acc, it) => acc + (it.quantityDelivered || 0), 0);
            const diff = dItem.quantityDelivered - currentTotal;

            if (Math.abs(diff) > 0.0001) {
              // Update Stock
              const product = await tx.select().from(schema.products).where(eq(schema.products.id, dItem.productId)).get();
              if (product) {
                await tx.update(schema.products)
                  .set({ currentStock: (product.currentStock || 0) - diff })
                  .where(eq(schema.products.id, dItem.productId));
              }

              // Update Stock Movement (Adjustment)
              await tx.insert(schema.stockMovements).values({
                productId: dItem.productId,
                quantity: -diff,
                type: 'AJUSTE',
                description: `Corrección entrega Remito #${remito?.remitoNumber}`
              });

              // Redistribute dItem.quantityDelivered among orderItems
              let remaining = dItem.quantityDelivered;
              for (let i = 0; i < currentItems.length; i++) {
                const item = currentItems[i];
                let assign = 0;
                if (i === currentItems.length - 1) assign = remaining;
                else assign = Math.min(remaining, item.quantityTheoretical);

                await tx.update(schema.orderItems).set({ quantityDelivered: assign }).where(eq(schema.orderItems.id, item.id));
                remaining -= assign;
              }
            }
          }
        }

        // 2. Handle Returns (Normal Closure)
        for (const itemRet of itemsReturn) {
          if (itemRet.quantityReturned > 0) {
            // Re-fetch linked orders items to have latest quantityDelivered (after correction)
            await tx.insert(schema.stockMovements).values({
              productId: itemRet.productId,
              quantity: itemRet.quantityReturned,
              type: 'RETORNO_SOBRANTE',
              description: `Retorno Consolidado #${remito?.remitoNumber}`
            });

            const product = await tx.select().from(schema.products).where(eq(schema.products.id, itemRet.productId)).get();
            if (product) {
              await tx.update(schema.products)
                .set({ currentStock: (product.currentStock || 0) + itemRet.quantityReturned })
                .where(eq(schema.products.id, itemRet.productId));
            }

            let remainingToReturn = itemRet.quantityReturned;
            for (const order of linkedOrders) {
              const orderItem = await tx.select().from(schema.orderItems)
                .where(sql`${schema.orderItems.orderId} = ${order.id} AND ${schema.orderItems.productId} = ${itemRet.productId}`)
                .get();

              if (orderItem) {
                // Re-fetch updated quantity (important!)
                const currentDelivered = (await tx.select().from(schema.orderItems).where(eq(schema.orderItems.id, orderItem.id)).get())?.quantityDelivered || 0;

                const returnForThisOrder = Math.min(remainingToReturn, currentDelivered);
                const quantityReturned = itemRet.quantityReturned > 0 ? returnForThisOrder : 0;

                await tx.update(schema.orderItems)
                  .set({
                    quantityReturned: quantityReturned,
                    quantityReal: currentDelivered - quantityReturned
                  })
                  .where(eq(schema.orderItems.id, orderItem.id));

                remainingToReturn -= returnForThisOrder;
              }
            }
          } else {
            // If return is 0, still calculate quantityReal = quantityDelivered
            for (const order of linkedOrders) {
              const orderItem = await tx.select().from(schema.orderItems)
                .where(sql`${schema.orderItems.orderId} = ${order.id} AND ${schema.orderItems.productId} = ${itemRet.productId}`)
                .get();
              if (orderItem) {
                await tx.update(schema.orderItems).set({ quantityReal: orderItem.quantityDelivered }).where(eq(schema.orderItems.id, orderItem.id));
              }
            }
          }
        }
        return true;
      });
      save();
      return result;
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
        campaign: schema.orders.campaign,
        date: schema.orders.date
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

  ipcMain.handle('truncate-orders', async () => {
    try {
      await db.delete(schema.orderItems);
      await db.delete(schema.orderLots);
      await db.delete(schema.orders);
      save();
      return true;
    } catch (error) {
      console.error("Error truncating orders:", error);
      throw error;
    }
  });

  // --- Supplier Remitos ---
  ipcMain.handle('get-supplier-remitos', async () => {
    try {
      const result = await db.select().from(schema.supplierRemitos).orderBy(sql`${schema.supplierRemitos.createdAt} DESC`);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('create-supplier-remito', async (_event, data) => {
    // data: { remitoNumber, date, supplier, observations, items: { productId, quantity }[] }
    try {
      const result = await db.transaction(async (tx) => {
        const [newRemito] = await tx.insert(schema.supplierRemitos).values({
          remitoNumber: data.remitoNumber,
          date: data.date,
          supplier: data.supplier,
          observations: data.observations
        }).returning();

        for (const item of data.items) {
          await tx.insert(schema.supplierRemitoItems).values({
            remitoId: newRemito.id,
            productId: item.productId,
            quantity: item.quantity
          });

          // Stock Movement
          await tx.insert(schema.stockMovements).values({
            productId: item.productId,
            quantity: item.quantity,
            type: 'COMPRA',
            description: `Remito Proveedor #${data.remitoNumber} (${data.supplier})`
          });

          // Update Product Stock
          const product = await tx.select().from(schema.products).where(eq(schema.products.id, item.productId)).get();
          if (product) {
            await tx.update(schema.products)
              .set({ currentStock: (product.currentStock || 0) + item.quantity })
              .where(eq(schema.products.id, item.productId));
          }
        }
        return newRemito;
      });
      save();
      return result;
    } catch (error) {
      console.error("Error creating supplier remito:", error);
      throw error;
    }
  });

  ipcMain.handle('get-supplier-remito-details', async (_event, remitoId) => {
    try {
      const remito = await db.select().from(schema.supplierRemitos).where(eq(schema.supplierRemitos.id, remitoId)).get();
      if (!remito) throw new Error("Remito not found");

      const items = await db.select({
        productId: schema.supplierRemitoItems.productId,
        productName: schema.products.name,
        productPresentation: schema.products.presentation,
        quantity: schema.supplierRemitoItems.quantity,
      })
        .from(schema.supplierRemitoItems)
        .leftJoin(schema.products, eq(schema.supplierRemitoItems.productId, schema.products.id))
        .where(eq(schema.supplierRemitoItems.remitoId, remitoId));

      return { ...remito, items };
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  ipcMain.handle('get-product-history', async (_event, productId) => {
    try {
      const result = await db.select()
        .from(schema.stockMovements)
        .where(eq(schema.stockMovements.productId, productId))
        .orderBy(sql`${schema.stockMovements.date} DESC`);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

}
