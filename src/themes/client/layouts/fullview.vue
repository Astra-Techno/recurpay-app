<template>
    <!--  BEGIN MAIN CONTAINER  -->
    <div class="relative">

        <!-- screen loader -->
        <div
            v-show="store.isShowMainLoader"
            class="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated"
        >
            <img src="/assets/images/loader.gif"/>
        </div>

        <!-- BEGIN APP SETTING LAUNCHER -->
        <!--<Setting />-->
        <!-- END APP SETTING LAUNCHER -->

        <div class="main-container text-black dark:text-white-dark min-h-screen" :class="[store.navbar]">

            <div class="main-content flex flex-col min-h-screen">
                <!--  BEGIN CONTENT AREA  -->
                <div class="p-6 animation">
                    <router-view></router-view>
                </div>
                <!--  END CONTENT AREA  -->

                <!-- BEGIN FOOTER -->
                <Footer />
                <!-- END FOOTER -->
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted } from 'vue';
    import Footer from './components/Footer.vue';
    import appSetting from '../app-setting';
    import { useAppStore } from '@/stores/index';

    const store = useAppStore();
    const showTopButton = ref(false);

    onMounted(() => {
        window.onscroll = () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                showTopButton.value = true;
            } else {
                showTopButton.value = false;
            }
        };

        const eleanimation = document.querySelector('.animation');
        eleanimation.addEventListener('animationend', function () {
            appSetting.changeAnimation('remove');
        });

        //store.toggleMainLoader();
    });

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
</script>
