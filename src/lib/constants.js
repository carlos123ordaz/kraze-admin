export const ORDER_STATUSES = {
    pendiente_pago: { label: 'Pendiente pago', color: 'warning' },
    confirmado: { label: 'Confirmado', color: 'info' },
    procesando: { label: 'Procesando', color: 'info' },
    enviado: { label: 'Enviado', color: 'primary' },
    en_transito: { label: 'En tránsito', color: 'primary' },
    en_reparto: { label: 'En reparto', color: 'primary' },
    entregado: { label: 'Entregado', color: 'success' },
    cancelado: { label: 'Cancelado', color: 'error' },
    devolucion_solicitada: { label: 'Devolución solicitada', color: 'warning' },
    devuelto: { label: 'Devuelto', color: 'default' },
    reembolsado: { label: 'Reembolsado', color: 'default' },
};

export const PAYMENT_METHODS = {
    contra_entrega: 'Contra entrega',
    yape: 'Yape',
    mercado_pago: 'Mercado Pago',
    transferencia: 'Transferencia bancaria',
};

export const PAYMENT_STATUSES = {
    pendiente: { label: 'Pendiente', color: 'warning' },
    pagado: { label: 'Pagado', color: 'success' },
    fallido: { label: 'Fallido', color: 'error' },
    reembolsado: { label: 'Reembolsado', color: 'default' },
};

export const PRODUCT_STATUSES = {
    borrador: { label: 'Borrador', color: 'default' },
    activo: { label: 'Activo', color: 'success' },
    agotado: { label: 'Agotado', color: 'error' },
    descontinuado: { label: 'Descontinuado', color: 'default' },
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', 'UNICA'];

export const GENDERS = [
    { value: 'hombre', label: 'Hombre' },
    { value: 'mujer', label: 'Mujer' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'nino', label: 'Niño' },
    { value: 'nina', label: 'Niña' },
];

export const USER_ROLES = {
    cliente: 'Cliente',
    vendedor: 'Vendedor',
    administrador: 'Administrador',
};

export const DASHBOARD_ITEMS_PER_PAGE = 10;
export const PRODUCTS_PER_PAGE = 20;