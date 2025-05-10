// src/directives/skeleton.js

export default {
  async mounted(el, binding) {
    await handleBinding(el, binding)
  },
  async updated(el, binding) {
    await handleBinding(el, binding)
  },
  unmounted(el) {
    removeSkeleton(el)
  }
}

async function handleBinding(el, binding) {
  const modifiers = binding.modifiers || {}
  const delay = modifiers.delay ? 400 : 0 // optional delay

  if (isPromise(binding.value)) {
    applySkeleton(el, true, modifiers)
    try {
      const result = await binding.value
      setTimeout(() => applySkeleton(el, !result, modifiers), delay)
    } catch (e) {
      setTimeout(() => applySkeleton(el, false, modifiers), delay)
    }
  } else {
    setTimeout(() => applySkeleton(el, binding.value, modifiers), delay)
  }
}

function applySkeleton(el, loading, modifiers = {}) {
  const wrapperClass = 'skeleton-wrapper-relative'
  const skeletonId = `skeleton-${el.dataset.skeletonId || Math.random().toString(36).slice(2)}`
  el.dataset.skeletonId = skeletonId

  if (loading) {
    el.classList.add('relative', wrapperClass, 'pointer-events-none', 'opacity-0')
    removeSkeleton(el)

    const children = Array.from(el.children)
    if (children.length > 0 && modifiers.deep) {
      children.forEach((child, i) => {
        const childRect = child.getBoundingClientRect()
        const shapeClass = resolveShape(modifiers)
        const mask = document.createElement('div')
        mask.className = `skeleton-mask absolute ${shapeClass} animate-skeleton-shimmer z-10`
        mask.style.top = `${child.offsetTop}px`
        mask.style.left = `${child.offsetLeft}px`
        mask.style.width = `${childRect.width}px`
        mask.style.height = `${childRect.height}px`
        mask.style.backgroundSize = '400% 100%'
        mask.dataset.skeletonId = `${skeletonId}-child-${i}`
        el.appendChild(mask)
      })
    } else {
      const rect = el.getBoundingClientRect()
      const shapeClass = resolveShape(modifiers)
      const skeleton = document.createElement('div')
      skeleton.className = `skeleton-mask absolute ${shapeClass} animate-skeleton-shimmer z-10`
      skeleton.style.top = '0'
      skeleton.style.left = '0'
      skeleton.style.width = `${rect.width}px`
      skeleton.style.height = `${rect.height}px`
      skeleton.style.backgroundSize = '400% 100%'
      skeleton.dataset.skeletonId = skeletonId
      el.parentElement.insertBefore(skeleton, el.nextSibling)
    }
  } else {
    el.classList.remove('opacity-0', 'pointer-events-none', wrapperClass)
    removeSkeleton(el)
  }
}

function resolveShape(modifiers) {
  if (modifiers.avatar) return 'rounded-full bg-gray-300'
  if (modifiers.title) return 'rounded bg-gray-300 h-4'
  if (modifiers.card) return 'rounded-lg bg-gray-200'
  return 'rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200'
}

function removeSkeleton(el) {
  const skeletonId = el.dataset.skeletonId
  if (!skeletonId) return
  const masks = document.querySelectorAll(`.skeleton-mask[data-skeleton-id^='${skeletonId}']`)
  masks.forEach(mask => mask.remove())
  delete el.dataset.skeletonId
}

function isPromise(val) {
  return !!val && typeof val.then === 'function'
}

// Add this in global CSS:
// @keyframes skeleton-shimmer {
//   0% { background-position: 100% 0; }
//   100% { background-position: -100% 0; }
// }
// .animate-skeleton-shimmer {
//   animation: skeleton-shimmer 1.2s ease-in-out infinite;
//   background-size: 400% 100%;
//   background-repeat: no-repeat;
// }
