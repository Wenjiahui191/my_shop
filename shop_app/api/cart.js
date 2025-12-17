import request from '@/utils/request';

export const getCart = () => request({ url: '/cart', method: 'GET' });
export const addToCart = (data) => request({ url: '/cart', method: 'POST', data });
export const updateCartItem = (id, data) => request({ url: `/cart/${id}`, method: 'PUT', data });
export const removeCartItem = (id) => request({ url: `/cart/${id}`, method: 'DELETE' });
