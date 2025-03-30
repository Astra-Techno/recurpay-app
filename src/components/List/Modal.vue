<template>
	<!-- Modal Component -->
	<teleport to="body">
		<transition name="modal-fade">
			<div v-if="show" class="modal-mask" @click.self="handleOutsideClick">
				<transition name="modal-scale">
					<div class="modal-container">
						<div class="modal-header">
							<slot name="header"></slot>
							<button @click="$emit('close')" class="modal-close-btn">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div class="modal-content">
							<slot></slot>
						</div>

						<div class="modal-footer">
							<slot name="footer"></slot>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>

<script setup>
defineProps({
	show: Boolean,
	closeOnOutsideClick: { type: Boolean, default: true }
});

const emit = defineEmits(['close']);

const handleOutsideClick = () => {
	if (props.closeOnOutsideClick) {
		emit('close');
	}
};
</script>

<style scoped>
/* Modal Mask */
.modal-mask {
	@apply fixed inset-0 z-50 flex items-center justify-center;
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
}

/* Modal Container */
.modal-container {
	@apply relative bg-white rounded-xl shadow-2xl overflow-hidden;
	width: 90%;
	max-width: 600px;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
}

/* Modal Header */
.modal-header {
	@apply px-6 py-4 border-b border-gray-200 flex justify-between items-center;
}

.modal-close-btn {
	@apply text-gray-400 hover:text-gray-500 transition-colors;
}

/* Modal Content */
.modal-content {
	@apply p-6 overflow-y-auto flex-1;
}

/* Modal Footer */
.modal-footer {
	@apply px-6 py-4 border-t border-gray-200 flex justify-end space-x-3;
}

/* Transition Effects */
.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
	transform: scale(0.95);
	opacity: 0;
}

/* Smooth scroll for content */
.modal-content {
	scroll-behavior: smooth;
}

/* Custom scrollbar */
.modal-content::-webkit-scrollbar {
	width: 6px;
}

.modal-content::-webkit-scrollbar-track {
	@apply bg-gray-100;
}

.modal-content::-webkit-scrollbar-thumb {
	@apply bg-gray-300 rounded-full;
}

.modal-content::-webkit-scrollbar-thumb:hover {
	@apply bg-gray-400;
}
</style>
