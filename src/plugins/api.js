import useApiRequest from '@/composables/request';

export default {
  install(app) {
    app.config.globalProperties.$api = useApiRequest();
  }
};