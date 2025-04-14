<template>
  <div class="flex space-x-2 mb-4">
    <Icon name="IconTenant" />
    <h1 class="text-2xl font-bold">My Tenants</h1>
  </div>

 

  <list
    class="w-full"
    tmpl="custom"
    :data-url="'list/Tenants'"
    :sortBy="'pt.id'"
    :sortOrder="'desc'"
    :filter-toggle="false"
    :messages="{ empty: 'There are no tenants added!' }"
    :page-limit="10"
    :search="false"
  >
    <template #body="{ rows }">
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="tenant in rows"
          :key="tenant.id"
          :to="{ name: 'TenantDetail', params: { id: tenant.id } }"
        >
          <div
            class="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <!-- Avatar -->
            <img
              :src="tenant.avatar"
              alt="Avatar"
              class="w-16 h-16 rounded-full object-cover"
            />

            <!-- Tenant Info -->
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-black italic ">
                {{ tenant.name }}
              </h3>
              <p >{{ tenant.property }}</p>
              <p >{{ tenant.address }}</p>

              <!-- Status -->
              <span
                :class="[
                  'text-xs mt-2 inline-block rounded-full px-2 py-1',
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : tenant.status === 'vacated'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600',
                ]"
              >
                {{ tenant.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </list>
</template>

<script setup>
import { useMeta } from '@/composables/use-meta'
import List from '@/components/List/List.vue'
useMeta({ title: 'My Tenants' })
</script>
