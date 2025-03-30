import Swal from 'sweetalert2';

class Signal {
	constructor() {
		this.darkMode = false;
	}

	static show(msg = '', type = 'success', timer = 5000) {
		const toast = Swal.mixin({
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: timer,
			customClass: { container: 'toast' },
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
				Object.assign(toast.style, {
					background: 'transparent',
					boxShadow: 'none',
					padding: '0',
					margin: '0',
					width: 'auto',
					top: '55px'
				});
			}
		});
		const colors = {
			success: [
				'bg-[var(--notification-success-background)]',
				'text-[var(--notification-success-text)]',
				'border-[var(--notification-success-outline)]'
			],
			error: [
				'bg-[var(--notification-error-background)]',
				'text-[var(--notification-error-text)]',
				'border-[var(--notification-error-outline)]'
			],
			warning: [
				'bg-[var(--notification-warning-background)]',
				'text-[var(--notification-warning-text)]',
				'border-[var(--notification-warning-outline)]'
			],
			normal: [
				'bg-[var(--notification-general-background)]',
				'text-[var(--notification-general-text)]',
				'border-[var(--notification-general-outline)]'
			]
		};
		// Default to 'normal' if type is invalid
		const color = (colors[type] || colors.normal).join(' ');

		toast.fire({
			html: `<div class="max-w-6xl p-2 text-md font-bold flex items-center justify-center min-w-[278px] w-full min-h-[40px] h-full text-center rounded-[5px] border border-solid text-[16px] leading-[24px]
			${color}">${msg}</div>`,
			width: '100%',
			padding: '0px',
			background: 'transparent',
		});
	}

	static confirm(title, message, buttonText = "Yes", showCancel = true) {
		return Swal.fire({
			title,
			text: message,
			icon: "warning",
			showCancelButton: showCancel,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: buttonText
		});
	}

	static error(msg, timer = 5000) {
		this.show(msg, 'error', timer);
	}

	static success(msg, timer = 5000) {
		this.show(msg, 'success', timer);
	}
	static normal(msg, timer = 5000) {
		this.show(msg, 'normal', timer);
	}
	static warning(msg, timer = 5000) {
		this.show(msg, 'warning', timer);
	}
}

export default Signal;
