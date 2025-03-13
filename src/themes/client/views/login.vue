<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input
              v-model="user.email"
              type="email"
              id="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              v-model="user.password"
              type="password"
              id="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account?
          <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import appSetting from '../app-setting';
  import { useAppStore } from '@/stores/index';
  import { useRouter } from 'vue-router';
  import { useMeta } from '@/composables/use-meta';
  
  import useApiRequest from '@/composables/request';
  import Signal from "@/composables/signal";
  
  useMeta({ title: 'Login' });
  const router = useRouter();
  const store = useAppStore();
  const request = useApiRequest();
  
  // multi language
  const i18n = reactive(useI18n());
  let loading = ref(false);
  
  const user = {
      email: '',
      password: '',
      remember: false
  }
  
  async function login() {
      loading.value = true;
      let response = await request.post('/login', user);
      if (response.error) {
          Signal.error(response.message);
          return;
      }
  
      store.setUser(response.data.user);
      store.setToken(response.data.token);
      store.setGuest('0');
      store.isShowMainLoader = true;
  
      router.push('/dashboard');
  }
  </script>