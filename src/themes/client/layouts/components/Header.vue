<template>
    <header class="z-40" :class="{ dark: store.semidark}">
        <div class="shadow-sm">
            <div class="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-RecurPay">
                <div class="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                    <router-link to="/" class="main-logo flex items-center shrink-0">
                        <img class="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo.png" alt="" />
                        <span
                            class="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300"
                            >RecurPay</span
                        >
                    </router-link>

                    <a
                        href="javascript:;"
                        class="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                        @click="store.toggleSidebar()"
                    >
                        <icon-menu class="w-5 h-5" />
                    </a>
                </div>

                <div class="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]" >
                    <div class="sm:ltr:mr-auto sm:rtl:ml-auto">
                        <form
                            class="sm:relative absolute inset-x-0 sm:top-0 top-1/2 sm:translate-y-0 -translate-y-1/2 sm:mx-0 mx-4 z-10 sm:block hidden"
                            :class="{ '!block': search }"
                            @submit.prevent="search = false"
                        >
                            <div class="relative hidden" >
                                <input
                                    type="text"
                                    class="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:bg-transparent bg-gray-100 placeholder:tracking-widest"
                                    placeholder="Search..."
                                />
                                <button type="button" class="absolute w-9 h-9 inset-0 ltr:right-auto rtl:left-auto appearance-none peer-focus:text-white">
                                    <icon-search class="mx-auto" />
                                </button>
                                <button
                                    type="button"
                                    class="hover:opacity-80 sm:hidden block absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2"
                                    @click="search = false"
                                >
                                    <icon-x-circle />
                                </button>
                            </div>
                        </form>

                        <button
                            type="button"
                            class="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            @click="search = !search"
                        >
                            <icon-search class="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" />
                        </button>
                    </div>
                    <div class="dropdown shrink-0">
                        <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'" offsetDistance="8" class="!block">
                            <button type="button" class="relative group block">
                                <img
                                    class="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                    src="/assets/images/user-profile.jpeg"
                                    alt=""
                                />
                            </button>
                            <template #content="{ close }">
                                <ul class="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <div class="flex items-center px-4 py-4">
                                            <div class="flex-none">
                                                <img class="rounded-md w-10 h-10 object-cover" src="/assets/images/user-profile.jpeg" alt="" />
                                            </div>
                                            <div class="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 class="text-base">
                                                    {{user.name}}
                                                </h4>
                                                <a class="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white" href="javascript:;"
                                                    >{{user.email}}</a
                                                >
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <router-link to="/users/profile" class="dark:hover:text-white" @click="close()">
                                            <icon-user class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />

                                            Profile
                                        </router-link>
                                    </li>
                                    <li class="border-t border-white-light dark:border-white-light/10">
                                        <a class="text-danger !py-3" @click.stop.prevent="logout()">
                                            <icon-logout class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />

                                            Sign Out
                                        </a>
                                    </li>
                                </ul>
                            </template>
                        </Popper>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue"
import { useI18n } from "vue-i18n"

import appSetting from "../../app-setting"

import { useRoute, useRouter } from "vue-router"
import { useAppStore } from "@/stores/index"

import IconMenu from '@/components/icon/icon-menu.vue';
import IconSearch from '@/components/icon/icon-search.vue';
import IconXCircle from '@/components/icon/icon-x-circle.vue';
import IconUser from '@/components/icon/icon-user.vue';
import IconLogout from '@/components/icon/icon-logout.vue';

const store = useAppStore()
const route = useRoute()
const search = ref(false)
const router = useRouter()

const user = store.getUser();

// multi language
const i18n = reactive(useI18n())
const changeLanguage = item => {
    i18n.locale = item.code
    appSetting.toggleLanguage(item)
}

onMounted(() => {
    setActiveDropdown()
})

watch(route, (to, from) => {
    setActiveDropdown()
})

function logout() {
    store.setUser(null);
    store.setToken(null);
    router.push('/login')
}

const setActiveDropdown = () => {
    const selector = document.querySelector(
        'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    )
    if (selector) {
        selector.classList.add("active")
        const all = document.querySelectorAll("ul.horizontal-menu .nav-link.active")
        for (let i = 0; i < all.length; i++) {
            all[0]?.classList.remove("active")
        }
        const ul = selector.closest("ul.sub-menu")
        if (ul) {
            let ele = ul.closest("li.menu").querySelectorAll(".nav-link")
            if (ele) {
                ele = ele[0]
                setTimeout(() => {
                    ele?.classList.add("active")
                })
            }
        }
    }
}
</script>
