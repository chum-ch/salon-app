// src/stores/user.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import helperFun from '@/helpers/helperFun';
import constanceVariable from '@/helpers/constanceVariable';
const useUserStore = defineStore('user', () => {
  const userInfo = ref({});
  const loggedIn = ref(false);

  const login = (info) => {
    userInfo.value = info;
    loggedIn.value = true;
    helperFun.setSessionItem(constanceVariable.SessionStorageKey.UserInfo, info);
  };
  
  const logout = () => {
    loggedIn.value = false;
    helperFun.clearSession();
    userInfo.value = {};
  };

  const getInfoUser = () => {
    return helperFun.getSessionItem(constanceVariable.SessionStorageKey.UserInfo);
  }

  return { userInfo, loggedIn, login, logout, getInfoUser };
});
export default {
  useUserStore
}