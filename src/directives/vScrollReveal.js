export default {
  mounted(el, binding) {
    const defaultOptions = {
      animation: 'fade-up', // fade-up, zoom-in, scale, rotate
      repeat: false, // true = animates every time in view
    }

    const options = { ...defaultOptions, ...binding.value }

    const baseClasses = [
      'opacity-0',
      'transition-all',
      'duration-700',
      'ease-out',
    ]

    const animationMap = {
      'fade-up': ['translate-y-6'],
      'fade-down': ['-translate-y-6'],
      'fade-left': ['translate-x-6'],
      'fade-right': ['-translate-x-6'],
      'zoom-in': ['scale-95'],
      'scale': ['scale-50'],
      'rotate': ['rotate-6'],
    }

    el.classList.add(...baseClasses, ...(animationMap[options.animation] || []))

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', ...(animationMap[options.animation] || []))
          el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100', 'rotate-0')

          if (!options.repeat) {
            observer.unobserve(el)
          }
        } else if (options.repeat) {
          el.classList.add('opacity-0', ...(animationMap[options.animation] || []))
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  },
}
