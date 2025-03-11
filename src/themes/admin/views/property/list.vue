<template>
    <div class="flex gap-5">
    	<!-- <pre>{{propertyList.selected_ids}}</pre> -->
        <list-table class="w-full" ref="propertyList" checkbox="id" :title="'Properties List'" :headers="propertyFields" 
        	:data-url="'list/Properties:listing'" :sortBy="'address1'" :sortOrder="'asc'" :page-limit="10">

            <template #filter="{filter}">
            </template>
            
            <template #row-address="{item}">
            	<span @click="openPage(item)" :title="item.address">{{item.address.length > 100 ? item.address.substring(0, 100) + '...' : item.address}}</span>
            </template>

            <template #row-managers="{item}">
            	<Contact :items = "item.managers"></Contact>
            </template>

            <template #row-owners="{item}">
            	<Contact title="Owner Detail" :items = "item.owners"></Contact>
            </template>

            <template #row-tenants="{item}">
            	<Contact title="Tenant Detail" :items = "item.tenants"></Contact>
            </template>

        </list-table>

		<!--
        <list-table class="w-full md:w-1/2" search-label="Keyword" search-place-holder="My name.." :title="'Users List'" :headers="columnFields2" :data-url="'list/Users'" :sortBy="'id'" :sortOrder="'asc'" :page-limit="10">
        </list-table>
		-->
        
    </div>
</template>



<!-- script -->
<script lang="ts" setup>
    import { ref } from 'vue';
    import { useMeta } from '@/composables/use-meta';
    import ListTable from '@/components/List/Table.vue';
    import Contact from '@/components/User/Contact.vue';
    //import SelectBox from '@/components/elements/SelectBox.vue';
    import DropDown from '@/components/elements/Dropdown.vue';

    useMeta({ title: 'Property List' });

    const propertyList = ref(null);

    const propertyFields = ref([
        { field: 'id', title: '#', sortField: 'id', sortDirection: 'asc', link: "/user/edit/{{item.id}}", width: 5 },
        { field: 'address', title: 'Address', sortField: 'address', sticky: true, width: '20%' },
        { field: 'managers', title: 'Manager(s)', sortField: 'manager_ids', width: '15%' },
        { field: 'owners', title: 'Owner/Landlord', sortField: 'owner_ids', width: '30%' },
        { field: 'tenants', title: 'Tenants', sortField: 'tenant_ids', width: '30%' },
    ])
</script>
