import request from '@/utils/request';

export const login = (data) => request({ url: '/auth/login', method: 'POST', data });
export const register = (data) => request({ url: '/auth/register', method: 'POST', data });
export const getMe = () => request({ url: '/auth/me', method: 'GET' });
