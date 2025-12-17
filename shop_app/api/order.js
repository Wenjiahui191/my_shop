import request from '@/utils/request';

export const createOrder = (data) => request({ url: '/orders', method: 'POST', data });
export const getOrders = () => request({ url: '/orders', method: 'GET' });
