import request from '@/utils/request';

export const getCategories = () => request({ url: '/products/categories', method: 'GET' });
export const getProducts = (params) => request({ url: '/products', method: 'GET', data: params });
export const getProductById = (id) => request({ url: `/products/${id}`, method: 'GET' });
