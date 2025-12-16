import { post, get } from '../utils/request';

export function login(data) {
  return post('/auth/login', data);
}

export function register(data) {
  return post('/auth/register', data);
}

export function getMe() {
  return get('/auth/me');
}

export function wechatLogin(data) {
  return post('/auth/wechat-login', data);
}


