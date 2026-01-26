import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Productos (Insumos) ---
export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    activeIngredient: text('active_ingredient'), // Principio activo
    presentation: text('presentation'), // Ej: Bidón 20L
    currentStock: real('current_stock').default(0).notNull(), // Stock actual calculado
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Lotes ---
export const lots = sqliteTable('lots', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    surface: real('surface').notNull(), // Hectareas
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Remitos (Consolidados) ---
export const remitos = sqliteTable('remitos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    remitoNumber: integer('remito_number').notNull(),
    date: text('date').notNull(),
    contractor: text('contractor'),
    observations: text('observations'),
    status: text('status').notNull().default('EMITIDO'), // EMITIDO, CERRADO, ANULADO
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Órdenes de Trabajo ---
export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderNumber: integer('order_number').notNull(), // Visible al usuario (ej: 604)
    remitoNumber: integer('remito_number'), // Numero de remito correlativo (LEGACY/VINCULADO)
    remitoId: integer('remito_id').references(() => remitos.id),
    date: text('date').notNull(), // Fecha emisión
    campaign: text('campaign'), // Ej: 2025/2026
    contractor: text('contractor'), // Contratista (Ej: Gatti Facundo)

    // Datos Lote/Labor
    field: text('field'), // Campo (Ej: Colaneri-Fiori)
    crop: text('crop'), // Cultivo (Ej: Soja 2da)
    labor: text('labor'), // Labor
    implanted: integer('implanted', { mode: 'boolean' }), // Implantado S/N
    totalSurface: real('total_surface'), // Hectareas totales de la orden

    status: text('status').notNull().default('BORRADOR'), // BORRADOR, EMITIDA, CERRADA, ANULADA

    // Datos Técnicos Pulverización
    nozzleType: text('nozzle_type'), // Pastilla
    nozzleDescription: text('nozzle_description'), // Ej: Abanico plano martillo
    waterPerHa: real('water_per_ha'), // Lts agua
    pressure: real('pressure'), // Presion (guardamos valor genérico o string si usa varias unidades)
    pressureUnit: text('pressure_unit'), // Bares, PSI, etc.
    windSpeed: real('wind_speed'), // Velocidad viento / Atmosferas
    humidity: real('humidity'), // Humedad (si aplica)

    instructions: text('instructions'),
    observations: text('observations'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Relación Orden-Lotes ---
export const orderLots = sqliteTable('order_lots', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id').references(() => orders.id).notNull(),
    lotId: integer('lot_id').references(() => lots.id).notNull(),
    appliedSurface: real('applied_surface').notNull(), // Superficie a aplicar en esta orden
});

// --- Items de Orden (Insumos) ---
export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id').references(() => orders.id).notNull(),
    productId: integer('product_id').references(() => products.id).notNull(),

    dose: real('dose').notNull(), // Dosis por ha
    quantityTheoretical: real('quantity_theoretical').notNull(), // Dosis Total (Teorico)

    // Remito / Devolución
    quantityDelivered: real('quantity_delivered').default(0), // Entreg. [lts]
    quantityReturned: real('quantity_returned').default(0), // Devuelto [lts]
    quantityReal: real('quantity_real').default(0), // Consumo real final
});

// --- Movimientos de Stock ---
export const stockMovements = sqliteTable('stock_movements', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').default(sql`CURRENT_TIMESTAMP`),
    productId: integer('product_id').references(() => products.id).notNull(),
    orderId: integer('order_id').references(() => orders.id), // Opcional, si viene de una orden

    type: text('type').notNull(), // COMPRA, SALIDA_REMITO, RETORNO_SOBRANTE, AJUSTE
    quantity: real('quantity').notNull(), // Positivo suma, Negativo resta

    description: text('description'),
});

// --- Envases Vacíos ---
export const emptyContainers = sqliteTable('empty_containers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id').references(() => products.id).notNull(),
    pendingReturn: integer('pending_return').default(0).notNull(), // En el campo/galpón
    deliveredCat: integer('delivered_cat').default(0).notNull(), // Entregados al CAT
});

// --- Remitos de Entrada (Proveedores) ---
export const supplierRemitos = sqliteTable('supplier_remitos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    remitoNumber: text('remito_number').notNull(), // Número del remito del proveedor
    date: text('date').notNull(),
    supplier: text('supplier').notNull(),
    observations: text('observations'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const supplierRemitoItems = sqliteTable('supplier_remito_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    remitoId: integer('remito_id').references(() => supplierRemitos.id).notNull(),
    productId: integer('product_id').references(() => products.id).notNull(),
    quantity: real('quantity').notNull(),
});
