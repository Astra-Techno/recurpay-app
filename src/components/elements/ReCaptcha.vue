<template>
	<div v-if="isRecaptchaEnabled" id="recaptcha-container" class="flex justify-center items-center mt-8"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, defineEmits } from 'vue';
import { $themeConfig } from '@/themes/landlord/theme.config.js';

const props = defineProps<{ enabled: boolean }>();
const emit = defineEmits(['verified']);

const isRecaptchaEnabled = ref(props.enabled);
const isRecaptchaLoaded = ref(false);
const recaptchaToken = ref<string | null>(null);

const onVerify = (response: string) => {
	recaptchaToken.value = response;
	emit('verified', response); // Emit the token to the parent component
};

onMounted(() => {

	const ipPattern = /^(localhost|127\.0\.0\.1|192\.168\.3\.\d+)$/;
	const hostname = window.location.hostname;

	if (ipPattern.test(hostname) || !$themeConfig.recaptchaEnabled) {
		isRecaptchaEnabled.value =false;
		return;
	}

	const script = document.createElement('script');
	script.src = 'https://www.google.com/recaptcha/api.js';
	script.async = true;
	script.defer = true;
	script.onload = () => {
		setTimeout(() => {
			if (window.grecaptcha) {
				isRecaptchaLoaded.value = true;
				const recaptchaElement = document.getElementById('recaptcha-container');
				if (recaptchaElement) {
					window.grecaptcha.render(recaptchaElement, {
						sitekey: $themeConfig.recaptchaSiteKey,
						callback: onVerify,
					});
				} else {
					console.error('reCAPTCHA container not found');
				}
			} else {
				console.error('grecaptcha is still not available.');
			}
		}, 500);
	};
	document.head.appendChild(script);
});
</script>
