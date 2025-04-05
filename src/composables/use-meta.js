import { useHead } from '@unhead/vue'
import { unref, computed, ref } from 'vue'

let siteTitle = ''
let separator = '|'
const currentTitle = ref('')

export const usePageTitle = pageTitle => {
  const title = computed(() => `${unref(pageTitle)} ${separator} ${siteTitle}`)
  currentTitle.value = pageTitle
  return useHead({
    title: title
  })
}

export const useMeta = data => {
  const title = `${data.title} ${separator} ${siteTitle}`
  currentTitle.value = data.title
  return useHead({
    ...data,
    title: title,
  })
}

export const useCurrentTitle = () => currentTitle