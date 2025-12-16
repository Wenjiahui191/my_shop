import { reactive, toRefs } from 'vue';
import { login as loginApi, getMe, wechatLogin as wechatLoginApi } from '../api/auth';

const state = reactive({
  token: '',
  user: null,
  inited: false,
});

function setToken(token) {
  state.token = token || '';
  if (token) {
    uni.setStorageSync('token', token);
  } else {
    uni.removeStorageSync('token');
  }
}

async function initFromStorage() {
  if (state.inited) return;
  const token = uni.getStorageSync('token');
  if (token) {
    state.token = token;
    try {
      const data = await getMe();
      state.user = data;
    } catch (e) {
      setToken('');
    }
  }
  state.inited = true;
}

async function login(payload) {
  const res = await loginApi(payload);
  if (res?.token) {
    setToken(res.token);
    state.user = res.user;
  }
  return res;
}

async function wechatLogin(payload) {
  const res = await wechatLoginApi(payload);
  if (res?.token) {
    setToken(res.token);
    state.user = res.user;
  }
  return res;
}

function logout() {
  setToken('');
  state.user = null;
}

export function useUserStore() {
  return {
    ...toRefs(state),
    initFromStorage,
    login,
    wechatLogin,
    logout,
  };
}


