<template>
	<div v-if="!badge">{{ status.label || job.status }}</div>
	<div v-else :class="status.class" class="inline-flex flex-1 px-1 mt-1 min-w-10 w-auto text-center rounded">
		{{ status.label || job.status }}
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	job: {
		type: Object,
		required: true
	},
	badge: {
		type: Boolean,
		default: false
	}
});

const statusList = {
	"draft": {
		"label": "Draft",
		"class": "bg-gray-400 text-gray-900"
	},
	"submitted": {
		"label": "Tenant Request PM Approval",
		"class": "bg-blue-400 text-white"
	},
	"offered": {
		"label": "Offered",
		"class": "bg-green-400 text-white"
	},
	"quote": {
		"label": "Quote Requested",
		"class": "bg-yellow-400 text-secondry"
	},
	"rejected": {
		"label": "Rejected",
		"class": "bg-red-500 text-white"
	},
	"future": {
		"label": "Future",
		"class": "bg-gray-500 text-white"
	},
	"active": {
		"label": "Active",
		"class": "bg-green-600 text-white"
	},
	"disputed": {
		"label": "Disputed",
		"class": "bg-orange-500 text-white"
	},
	"complete": {
		"label": "Invoice submitted",
		"class": "bg-indigo-500 text-white"
	},
	"finalised": {
		"label": "Invoice approved",
		"class": "bg-purple-500 text-white"
	},
	"request-rejected": {
		"label": "Request rejected",
		"class": "bg-red-600 text-white"
	},
	"request-draft": {
		"label": "Request Draft",
		"class": "bg-gray-500 text-white"
	},
	"offer-draft": {
		"label": "Offer Draft",
		"class": "bg-gray-700 text-white"
	},
	"quote-draft": {
		"label": "Quote Draft",
		"class": "bg-gray-400 text-secondry"
	},
	"tradie-confirm": {
		"label": "Tradie confirm",
		"class": "bg-green-700 text-white"
	},
	"payment-confirmed": {
		"label": "Payment Confirmed",
		"class": "bg-green-800 text-white"
	},
	"manager-approval": {
		"label": "Invoice waiting for manager approval",
		"class": "bg-blue-700 text-white"
	},
	"offer-expired": {
		"label": "Offer expired",
		"class": "bg-red-700 text-white"
	},
	"quote-expired": {
		"label": "Quote expired",
		"class": "bg-red-700 text-white"
	},
	"landlord-approval": {
		"label": "Waiting for Landlord Approval",
		"class": "bg-blue-600 text-white"
	},
	"landlord-requests": {
		"label": "Landlord Requested",
		"class": "bg-yellow-600 text-secondry"
	},
	"landlord-approved": {
		"label": "Landlord Approved",
		"class": "bg-green-700 text-white"
	},
	"cancelled": {
		"label": "Cancelled",
		"class": "bg-gray-700 text-white"
	},
	"landlord-payment": {
		"label": "Invoice waiting Landlord payment",
		"class": "bg-blue-600 text-white"
	},
	"cc-approval": {
		"label": "Waiting for Committee chairman Approval",
		"class": "bg-blue-700 text-white"
	},
	"cc-requests": {
		"label": "Committee chairman Requested",
		"class": "bg-yellow-700 text-secondry"
	},
	"cc-approved": {
		"label": "Committee chairman Approved",
		"class": "bg-green-700 text-white"
	},
	"tenant-to-pay": {
		"label": "Tenant to pay",
		"class": "bg-red-500 text-white"
	},
	"take-from-bond": {
		"label": "Approved from Bond",
		"class": "bg-green-600 text-white"
	},
	"investigate": {
		"label": "Investigate",
		"class": "bg-orange-500 text-white"
	},
	"cancel-request": {
		"label": "Cancel request",
		"class": "bg-gray-500 text-white"
	},
	"reconciled": {
		"label": "Reconciled",
		"class": "bg-green-600 text-white"
	},
	"unsuccess": {
		"label": "Rejected",
		"class": "bg-red-500 text-white"
	},
	"ll-responsibility": {
		"label": "Landlord responsibility",
		"class": "bg-blue-600 text-white"
	},
	"info-request": {
		"label": "Information Request",
		"class": "bg-yellow-500 text-secondry"
	},
	"waiting-on-pm": {
		"label": "Waiting on PM",
		"class": "bg-blue-700 text-white"
	},
	"accept": {
		"label": "Accepted",
		"class": "bg-green-500 text-white"
	},
	"deferred": {
		"label": "Deferred",
		"class": "bg-gray-600 text-white"
	},
	"waiting-for-disburse": {
		"label": "Waiting for Disbursement",
		"class": "bg-yellow-600 text-secondry"
	},
	"offer-refer": {
		"label": "Offer Refer to Landlord",
		"class": "bg-blue-500 text-white"
	},
	"waiting-for-payment": {
		"label": "Waiting for Payment",
		"class": "bg-yellow-500 text-secondry"
	},
	"third-party-to-pay": {
		"label": "Third party to pay",
		"class": "bg-blue-500 text-white"
	},
	"pm-responsibility": {
		"label": "PM will repair",
		"class": "bg-green-500 text-white"
	},
	"tr-responsibility": {
		"label": "Landlords tradie responsibility",
		"class": "bg-blue-700 text-white"
	},
	"st-responsibility": {
		"label": "Strata responsibility",
		"class": "bg-gray-500 text-white"
	},
	"paid": {
		"label": "Paid",
		"class": "bg-green-600 text-white"
	},
	"approved": {
		"label": "Approved",
		"class": "bg-green-500 text-white"
	},
	"awaiting-payment": {
		"label": "Awaiting payment",
		"class": "bg-yellow-600 text-secondry"
	},
	"landlord-to-pay": {
		"label": "Landlord to pay",
		"class": "bg-blue-600 text-white"
	},
	"exported": {
		"label": "Exported",
		"class": "bg-purple-500 text-white"
	},
	"landlord-paid": {
		"label": "Landlord has paid",
		"class": "bg-green-500 text-white"
	},
	"tenant-paid": {
		"label": "Tenant has paid",
		"class": "bg-green-600 text-white"
	},
	"sub:cancel-request": {
		"label": "Cancel request",
		"class": "bg-red-500 text-white"
	},
	"sub:invoiced": {
		"label": "Invoiced",
		"class": "bg-purple-500 text-white"
	},
	"sub:customer-paid": {
		"label": "Customer Paid",
		"class": "bg-green-500 text-white"
	},
	"sub:third-party-to-pay": {
		"label": "Third party to pay",
		"class": "bg-blue-500 text-white"
	},
	"sub:attended": {
		"label": "Attended",
		"class": "bg-green-400 text-white"
	},
	"sub:phoned": {
		"label": "Phoned",
		"class": "bg-yellow-500 text-secondry"
	},
	"sub:waiting-on-parts": {
		"label": "Waiting on Parts",
		"class": "bg-orange-500 text-white"
	},
	"sub:waiting-on-callback": {
		"label": "Waiting on Call back",
		"class": "bg-blue-400 text-white"
	},
	"sub:waiting-on-access": {
		"label": "Waiting on access",
		"class": "bg-gray-500 text-white"
	},
	"sub:quotes-requested": {
		"label": "Quotes requested",
		"class": "bg-yellow-500 text-secondry"
	},
	"sub:first-quote-submitted": {
		"label": "First quote submitted",
		"class": "bg-blue-400 text-white"
	},
	"sub:all-quotes-submitted": {
		"label": "All quotes submitted",
		"class": "bg-green-500 text-white"
	},
	"sub:waiting-on-landlord": {
		"label": "Waiting on landlord",
		"class": "bg-blue-600 text-white"
	},
	"sub:waiting-tradie-date-confirmation": {
		"label": "Waiting tradie date confirmation",
		"class": "bg-yellow-700 text-secondry"
	},
	"sub:waiting-on-committee-chairman": {
		"label": "Waiting on Committee chairman",
		"class": "bg-blue-700 text-white"
	},
	"sub:landlord-requested-quote-review": {
		"label": "Landlord requested quote review",
		"class": "bg-purple-500 text-white"
	},
	"sub:waiting-on-pm": {
		"label": "Waiting on PM",
		"class": "bg-gray-600 text-white"
	},
	"sub:returned-by-landlord": {
		"label": "Returned by Landlord",
		"class": "bg-red-500 text-white"
	},
	"quote-waiting": {
		"label": "Waiting",
		"class": "bg-yellow-500 text-secondry"
	},
	"quote-submitted": {
		"label": "Submitted",
		"class": "bg-blue-500 text-white"
	},
	"quote-rejected": {
		"label": "Quote Rejected",
		"class": "bg-red-600 text-white"
	},
	"quote-declined": {
		"label": "Declined",
		"class": "bg-red-700 text-white"
	},
	"quote-quote-resubmitted": {
		"label": "Quote resubmitted",
		"class": "bg-blue-600 text-white"
	},
	"quote-awaiting-subbies": {
		"label": "Awaiting Subbies",
		"class": "bg-yellow-600 text-secondry"
	},
	"quote-awaiting-approval": {
		"label": "Awaiting Approval",
		"class": "bg-blue-600 text-white"
	},
	"quote-before-quote": {
		"label": "Before Quote",
		"class": "bg-purple-600 text-white"
	},
	"quote-": {
		"label": "Empty",
		"class": "bg-gray-200 text-secondry"
	},
	"wait-bond-process": {
		"label": "Waiting for bond processing",
		"class": "bg-yellow-400 text-secondry"
	},
	"wait-bond-disburse": {
		"label": "Waiting for bond disbursement",
		"class": "bg-yellow-500 text-secondry"
	},
	"paid-from-bond": {
		"label": "Paid from bond",
		"class": "bg-green-600 text-white"
	},
	"wait-tenant-process": {
		"label": "Waiting for tenant processing",
		"class": "bg-yellow-400 text-secondry"
	},
	"wait-tenant-disburse": {
		"label": "Waiting for tenant disbursement",
		"class": "bg-yellow-500 text-secondry"
	},
	"paid-from-tenant": {
		"label": "Paid from tenant",
		"class": "bg-green-600 text-white"
	},
	"take-from-landlord": {
		"label": "Take from landlord",
		"class": "bg-blue-600 text-white"
	}
};
const status = computed(() => {
	var tmp_status = props.job.status;
	var sub_status = '';
	if (props.job.status != 'finalised') {
		if (props.job.status == 'offer-refer') {
			if (props.job.sub_status == 'll_request_to_quote' || props.job.sub_status == 'll_request_offer_to_quote')
				tmp_status = "LL requests quotes";
			else if (props.job.sub_status != '')
				sub_status = props.job.sub_status;
		} else if (props.job.status == 'offer-draft') {
			tmp_status = "Saved offer";
			if (props.job.sub_status == 'Waiting on PM')
				tmp_status = "Offer Waiting on LL PM";
			else if (props.job.sub_status == 'landlord return offer')
				tmp_status = "Returned by the landlord";
		} else if (props.job.sub_status == 'Third party to pay')
			tmp_status = "Third party to pay";
		else if (props.job.status == 'quote' && props.job.send_to_ll == 1)
			tmp_status = "Quotes sent to Landlord";
		else if (props.job.sub_status == 'll_request_to_quote' || props.job.sub_status == 'll_request_offer_to_quote')
			tmp_status = "LL requests quotes";
		else if (props.job.sub_status != '')
			sub_status = props.job.sub_status;
	}

	props.job.status = tmp_status;
	if (sub_status != '' && sub_status != null && sub_status != 'NULL' && sub_status != 'no sub status')
		props.job.status += ' - ' + sub_status

	return statusList[props.job.status] ?? { label: props.job.status, class: "bg-gray-300 text-secondry" };
});
</script>
