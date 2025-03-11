<template>
    <td class="t-col" :title="column.title">
        <slot>
            <template  v-if="column.link != null">
                <router-link :to="column.link">{{ item[`${column.field}`] }}</router-link>
            </template>
            <template v-else>
                <span>{{ item[`${column.field}`] }}</span>
            </template>
        </slot>
    </td>
  </template>

  <script setup>
  import {compile} from "vue";

  const {column, item} = defineProps({
    column: Object,
    item: Object
  })

  function render(str)
  {
      return str;
  }

  const emit = defineEmits(['click'])

  </script>

  <style scoped>

  </style>
