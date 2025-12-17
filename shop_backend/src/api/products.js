import request from '../utils/request';

export const fetchProducts = (params) => request.get('/admin/products', { params });
export const fetchProductDetail = (id) => request.get(`/admin/products/${id}`);
export const createProduct = (data) => request.post('/admin/products', data);
export const updateProduct = (id, data) => request.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => request.delete(`/admin/products/${id}`);
export const updateProductStatus = (id, status) => request.patch(`/admin/products/${id}/status`, { status });

