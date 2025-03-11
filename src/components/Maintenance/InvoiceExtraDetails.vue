<template>
    <div class="section-wrapper">
        <div class="m-section">
            <div class="m-section-header">
                Invoice Details
            </div>
            <div class="m-section-detail">
                <div class="m-section-subheader">
                    Invoice Number
                </div>
                <div>
                    {{ inv.invoice_no}}
                </div>
            </div>
            <div class="m-section-detail">
                <div class="m-section-subheader">
                    Invoice Description
                </div>
                <div>
                    {{ inv.description }}
                </div>
            </div>
            <div class="m-section-detail">
                <table class="w-1/3 border-2 border-collapse">
                    <tr class="border-2">
                        <td class="p-4 border-2 font-bold">GST</td>
                        <td class="p-4 border-2 text-end">${{ inv.gst }}</td>
                    </tr>
                    <tr class="bg-gray">
                        <td class="p-4 border-2 bg-gray-300 font-bold text-white">Total</td>
                        <td class="p-4 border-2 text-end">${{ inv.total_amount}}</td>
                    </tr>
                </table>
            </div>
            <div class="m-section-detail">
                <div class="m-section-subheader">
                    Personal Message
                </div>
                <div>
                    No Message
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
	inv: {
		type: Object,
		required: true
	}
})
</script>
