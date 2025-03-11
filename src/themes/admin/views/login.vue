<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
        </div>
        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">

            <div
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">

                <div  class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 ">
                    
                    <div class="md:w-1/2  w-full bg-white/60 backdrop-blur-lg dark:bg-black/50 p-10 md:p-20">

                        <div class=" w-full">
                            <div class="mb-10">
                                <img src="/assets/images/logo.png" alt="Logo" class="mx-auto" />
                            </div>

                            <FormKit type="form" #default="{ value }" @submit="login" submit-label="Sign In"
		                        :config="{
									classes: {
									  outer: '$remove:max-w-[20em] w-[none]',
									},
								  }"
                            >
                                <FormKit v-model="user.email" class="relative text-black-dark"
                                    type="email"
                                    label="Email"
                                    validation="required|email"
                                    prefix-icon="email"
                                />
                                
                                <FormKit v-model="user.password"
                                    type="password"
                                    label="Password"
                                    validation="required"
                                    validation-visibility="live"
                                    prefix-icon="password"
                                />

								<!--
                                <FormKit v-model="user.remember"
                                    type="checkbox"
                                    label="Remember me"
                                    validation-visibility="dirty"
                                />
                                -->
                            </FormKit>
                        </div>
                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear()
                        }}.RecurPay All Rights
                        Reserved.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import appSetting from '../app-setting';
import { useAppStore } from '@/stores/index';
import { useRouter } from 'vue-router';
import { useMeta } from '@/composables/use-meta';

import IconMail from '@/components/icon/icon-mail.vue';
import IconLockDots from '@/components/icon/icon-lock-dots.vue';

import useApiRequest from '@/composables/request';
import Signal from "@/composables/signal";

useMeta({ title: 'Login' });
const router = useRouter();
const store = useAppStore();
const request = useApiRequest();

// multi language
const i18n = reactive(useI18n());
const changeLanguage = (item: any) => {
    i18n.locale = item.code;
    appSetting.toggleLanguage(item);
};

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
