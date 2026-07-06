import request from './request';

export const register = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);
export const getCurrentUser = () => request.get('/users/me');
export const getUserList = () => request.get('/users');
export const deleteUser = (id) => request.delete(`/users/${id}`);
