import request from '../utils/request';

export const fetchUsers = (params) => request.get('/admin/users', { params });
export const fetchUserDetail = (id) => request.get(`/admin/users/${id}`);

