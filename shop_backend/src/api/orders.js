import request from '../utils/request';

export const fetchOrders = (params) => request.get('/admin/orders', { params });
export const fetchOrderDetail = (id) => request.get(`/admin/orders/${id}`);
export const shipOrder = (id, data) => request.post(`/admin/orders/${id}/ship`, data);

