import defaultImage from '@/assets/images/default-52.png'
export default {
	beforeMount(el, binding) {
		el.onerror = () => {
			el.src = binding.value || defaultImage
		}
	},
}
