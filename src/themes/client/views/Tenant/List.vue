<template>

    <div class="flex space-x-2 mb-4">
		<Icon name="IconTenant"></Icon><h1 class="text-2xl font-bold">My Tenants</h1>
	</div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tenant in tenants"
        :key="tenant.id"
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
          <h3 class="text-lg font-medium text-gray-800">{{ tenant.name }}</h3>
          <p class="text-sm text-gray-500">{{ tenant.property }}</p>
          <p class="text-sm text-gray-400">{{ tenant.address }}</p>

          <!-- Status -->
          <span
            :class="[
              'text-xs mt-2 inline-block rounded-full px-2 py-1',
              tenant.status === 'Active'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600',
            ]"
          >
            {{ tenant.status }}
          </span>
        </div>
      </div>
    </div>
  
</template>

<script setup>
const tenants = [
  {
    id: 1,
    name: 'John Doe',
    property: '2BHK - Green Valley Apt',
    address: '123 Main Street, Mumbai',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/100?img=1',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    property: '1RK - Sunrise Plaza',
    address: '45 Rose Ave, Bangalore',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/100?img=2',
    status: 'Inactive',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    property: '3BHK - Palm Residency',
    address: '88 Garden Road, Pune',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/100?img=3',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Sarah Lee',
    property: 'Studio - City View Tower',
    address: '7th Cross Street, Chennai',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/100?img=4',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Arjun Mehta',
    property: '2BHK - Skyview Heights',
    address: 'Plot 21, Jubilee Hills, Hyderabad',
    email: 'arjun@example.com',
    avatar: 'https://i.pravatar.cc/100?img=5',
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Priya Kaur',
    property: '1BHK - Lotus Garden',
    address: 'Block C, Sector 14, Gurgaon',
    email: 'priya@example.com',
    avatar: 'https://i.pravatar.cc/100?img=6',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Daniel Fernandes',
    property: '3BHK - Ocean Breeze Villa',
    address: 'Beach Road, Goa',
    email: 'daniel@example.com',
    avatar: 'https://i.pravatar.cc/100?img=7',
    status: 'Inactive',
  },
  {
    id: 8,
    name: 'Ritu Sharma',
    property: 'Studio - Maple Residency',
    address: 'Hill Top, Dehradun',
    email: 'ritu@example.com',
    avatar: 'https://i.pravatar.cc/100?img=8',
    status: 'Active',
  },
  {
    id: 9,
    name: 'Rohan Khanna',
    property: '2BHK - Blue Stone',
    address: 'Sector 62, Noida',
    email: 'rohan@example.com',
    avatar: 'https://i.pravatar.cc/100?img=9',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Ananya Roy',
    property: '1RK - Harmony Towers',
    address: 'Park Street, Kolkata',
    email: 'ananya@example.com',
    avatar: 'https://i.pravatar.cc/100?img=10',
    status: 'Pending',
  },
  {
    id: 11,
    name: 'Krishna Patel',
    property: '2BHK - Green Fields',
    address: 'Ellis Bridge, Ahmedabad',
    email: 'krishna@example.com',
    avatar: 'https://i.pravatar.cc/100?img=11',
    status: 'Active',
  },
  {
    id: 12,
    name: 'Meera Nair',
    property: '1BHK - Coconut Grove',
    address: 'MG Road, Kochi',
    email: 'meera@example.com',
    avatar: 'https://i.pravatar.cc/100?img=12',
    status: 'Active',
  },
  {
    id: 13,
    name: 'Vikram Sethi',
    property: 'Studio - Skyline Edge',
    address: 'Gachibowli, Hyderabad',
    email: 'vikram@example.com',
    avatar: 'https://i.pravatar.cc/100?img=13',
    status: 'Inactive',
  },
  {
    id: 14,
    name: 'Neha Kapoor',
    property: '3BHK - Prestige Manor',
    address: 'Indiranagar, Bangalore',
    email: 'neha@example.com',
    avatar: 'https://i.pravatar.cc/100?img=14',
    status: 'Active',
  },
  {
    id: 15,
    name: 'Amit Trivedi',
    property: '2BHK - Royal Residency',
    address: 'Civil Lines, Jaipur',
    email: 'amit@example.com',
    avatar: 'https://i.pravatar.cc/100?img=15',
    status: 'Pending',
  },
];
</script>
