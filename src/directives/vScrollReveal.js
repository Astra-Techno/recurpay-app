export default {
  mounted(el, binding) {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-500')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-6')
          el.classList.add('opacity-100', 'translate-y-0')
          observer.unobserve(el) // animate only once
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
  }
}
