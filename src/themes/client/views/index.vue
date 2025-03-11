<template>
    <!-- screen loader -->
    <div>
       	<div v-show="PageComp == null" class="fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[1] grid place-content-center animate__animated">
			<img src="/assets/images/loader.gif"/>
		</div>

		<component v-show="PageComp != null" :is="PageComp"></component>
    </div>
</template>
<script lang="ts" setup>
    import { watch, ref, shallowRef } from 'vue';
    import { useAppStore } from '@/stores/index';
    import { useMeta } from '@/composables/use-meta';
    import { useRoute, useRouter } from 'vue-router';
    import useApiRequest from '@/composables/request';

    const route = useRoute();
    const router = useRouter();
    const PageComp = shallowRef();
    const store = useAppStore();
    const request = useApiRequest();
    let moduleCache = {};
    let isLoading = ref(false);

    const views = import.meta.glob('../views/**/*.vue');
console.log('views', views)
    watch(
        () => route.params.pageName,
        async pageName => {
            try {
            	PageComp.value = null;
                //pageName = (pageName == null) ? '' : pageName.toString().replace(/-/g, "_").replace(/\/$/, '');
                pageName = (pageName == null) ? '' : pageName.toString().replace(/\/$/, '');
                if (store.user.token != null) {
	                if (pageName == '' || pageName == 'login')
                		pageName = 'dashboard';
                } else if (store.userPages.indexOf(pageName) == -1) {
                	if (store.guestPages.indexOf(pageName) == -1) {
                		router.push('/login')
                		return;
                	}

					let response = await request.post('/guest-token');
					if (response.error) {
						router.push('/login')
						return;
					}

					store.setUser(response.data.user);
					store.setToken(response.data.token);
					store.setGuest('1');
				}

				if (store.user.guest == '1' && store.guestPages.indexOf(pageName) == -1 && pageName != 'login') {
					store.setUser(null);
					store.setToken(null);
					router.push('/login')
                	return;
				}

                pageName = `./${pageName}.vue`;
                console.log('StartLoading.. ', pageName);
                isLoading.value = true;

				if (!views.hasOwnProperty(pageName))
					pageName = `./error404.vue`;

				moduleCache[pageName] = await views[pageName]();  // Cache the loaded component
				PageComp.value = moduleCache[pageName].default

                isLoading.value = false;

                setTimeout(() => {
                    store.toggleComponent(true);
                }, 500)
            } catch (error) {
                console.log('pageError:', error);
                router.push('/error404')
            }
        },
        { immediate: true }
    )
    useMeta({ title: 'RecurPay' });
</script>
