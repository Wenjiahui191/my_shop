import request from '../utils/request';

export const login = (data) => request.post('/admin/auth/login', data);
export const getProfile = () => request.get('/admin/auth/me');

