import Swal from 'sweetalert2';

class Signal {
    static show = (msg = '', type = 'success', timer = 5000) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: timer,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            width: 'auto',
            padding: '10px 20px',
        });
    }

	static confirm = (title, message, buttonText = "Yes", showCancel = true) => {
		return Swal.fire({
			title: title,
			text: message,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: buttonText
		})
	}

    static error = (msg, timer = 5000) => {
        Signal.show(msg, 'error', timer)
    }

    static success = (msg, timer = 5000) => {
        Signal.show(msg, 'success', timer)
    }
};

export default Signal;
