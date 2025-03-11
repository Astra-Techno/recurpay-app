<template>
    <div :class="{ 'dark text-white-dark':store.semidark}">
        <nav class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300">
            <div :class="{ 'h-full bg-RecurPay':store.background }">
                <div class="flex justify-between items-center px-4 py-3">
                    <router-link to="/" class="main-logo flex items-center shrink-0">
                        <img class="w-8 ml-[5px] flex-none" src="/assets/images/logo.png" alt="" />
                        <span class="text-xl ltr:ml-2.5 rtl:mr-1.5  align-middle lg:inline dark:text-white-light">RecurPay</span>
                    </router-link>
                    <a
                        href="javascript:;"
                        class="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180 hover:text-primary"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <perfect-scrollbar
                    :options="{
                        swipeEasing: true,
                        wheelPropagation: false,
                    }"
                    class="h-[calc(100vh-80px)] relative"
                >
                <ul class="relative font-semibold space-y-0.5 p-4 py-0">
                    <li class="menu nav-item">
                         <button
                            type="button"
                            class="nav-link group w-full"
                            :class="{ active: activeDropdown === 'dashboard' }"
                            @click="activeDropdown === 'dashboard' ? (activeDropdown = null) : (activeDropdown = 'dashboard')"
                        >
                            <div class="flex items-center">
                                <icon-menu-dashboard class="group-hover:!text-nav shrink-0" />
                                <span class="ltr:pl-3 rtl:pr-3 text-nav">
                                    Admin
                                </span>
                            </div>
                            <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== 'dashboard' }">
                                <icon-caret-down />
                            </div>
                        </button>
                        <vue-collapsible :isOpen="activeDropdown === 'dashboard'">
                            <ul class="sub-menu">
                                <li>
                                    <router-link class="text-white" to="/property/list" @click="toggleMobileMenu">Properties</router-link>
                                </li>
                                <li>
                                    <router-link class="text-white" to="/Job/list" @click="toggleMobileMenu">All Jobs</router-link>
                                </li>
                                <li>
                                    <router-link class="text-white" to="/Job/Request" @click="toggleMobileMenu">Job Request</router-link>
                                </li>                                
                                <li class="hidden">
                                    <router-link class="text-white" to="/analytics" @click="toggleMobileMenu">Tenants</router-link>
                                </li>
                                <li class="hidden">
                                    <router-link class="text-white" to="/finance" @click="toggleMobileMenu">Landlords</router-link>
                                </li class="hidden">
                                <li class="hidden">
                                    <router-link class="text-white" to="/crypto" @click="toggleMobileMenu">Office Admins</router-link>
                                </li>
                                <li class="hidden">
                                    <router-link class="text-white" to="/crypto" @click="toggleMobileMenu">Property Managers</router-link>
                                </li>
                            </ul>
                        </vue-collapsible>
						<button
                            type="button"
                            class="nav-link group w-full"
                            :class="{ active: activeDropdown === 'inspection' }"
                            @click="activeDropdown === 'inspection' ? (activeDropdown = null) : (activeDropdown = 'inspection')"
                        >
                            <div class="flex items-center">
                                <icon-inspection class="group-hover:!text-nav shrink-0" />
                                <span class="ltr:pl-3 rtl:pr-3 text-nav">
                                    Inspections
                                </span>
                            </div>
                            <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== 'inspection' }">
                                <icon-caret-down />
                            </div>
                        </button>
						<vue-collapsible :isOpen="activeDropdown === 'inspection'">
                            <ul class="sub-menu">
                                <li>
                                    <router-link class="text-white" to="/inspection/list" @click="toggleMobileMenu">360° Inspections</router-link>
                                </li>
                            </ul>
                        </vue-collapsible>
                        </li>
                </ul>
                </perfect-scrollbar>
            </div>
        </nav>
    </div>
</template>

<script  setup>
    import { ref, onMounted } from "vue"

    import { useAppStore } from "@/stores/index"
    import VueCollapsible from 'vue-height-collapsible/vue3';

    import IconCaretsDown from '@/components/icon/icon-carets-down.vue';
    import IconMenuDashboard from '@/components/icon/icon-menu-dashboard.vue';
    import IconCaretDown from '@/components/icon/icon-caret-down.vue';
	import iconInspection from '@/components/icon/icon-inspection.vue';

    const store = useAppStore()
    const activeDropdown = ref("")
    const subActive = ref("")

    onMounted(() => {
        const selector = document.querySelector(
            '.sidebar ul a[href="' + window.location.pathname + '"]'
        )
        if (selector) {
            selector.classList.add("active")
            const ul = selector.closest("ul.sub-menu")
            if (ul) {
                let ele = ul.closest("li.menu").querySelectorAll(".nav-link") || []
                if (ele.length) {
                    ele = ele[0]
                    setTimeout(() => {
                        ele.click()
                    })
                }
            }
        }
    })
    const toggleMobileMenu = () => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar()
        }
    }
</script>
