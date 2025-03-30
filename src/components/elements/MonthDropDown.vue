<template>
    <SelectBox v-if="monthRecordsCnt>0" v-bind="attrs.all" :options="monthRecords" :key="key" :classes="{
                        inner: 'border-1',
                        selector: 'secondary',
                        outer: 'max-w-[30em]'
                    }"/>
</template>

<script setup>
import { useAttrs, computed , ref, watch} from 'vue';
import SelectBox from './SelectBox.vue';

const props = defineProps({
    label: {
        type: String,
        default: 'Select Month' // Use null to detect when it's explicitly set
    },
    placeholder: {
        type: String,
        default: 'Month' // Use null to detect when it's explicitly set
    },
    min: {
        type: Date,
        default: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
    },
    max: {
        type: Date,
        default: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    limit: {
        type: Number,
        default: 50
    }
});
const monthRecords = ref({});
const monthRecordsCnt = ref(0);
const rawAttrs = useAttrs();
const key = ref(0);
let attrs = computed(() => {

    let { ...all } = rawAttrs;

    Object.keys(props).forEach(key => {
        if (all[key] == null && props[key] != null && key != 'ref') {
            all[key] = props[key];
        }
    });

    return { all };
})

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function prepareOptions() {
    let startDate = props.min;
    monthRecords.value = {};
    monthRecordsCnt.value = 0;
    const currentDate = new Date(props.max.getTime());
    let limit = props.limit;
    for (; currentDate.getTime() - startDate.getTime() > 0; currentDate.setMonth(currentDate.getMonth() - 1)) {
        if (limit == 0) break;

        monthRecords.value[currentDate.getFullYear()+"-"+make2digit(currentDate.getMonth()+1)+"-01"]=months[currentDate.getMonth()] + " "+ currentDate.getFullYear();
        if (limit >= 1) {
            limit--;
        }
        monthRecordsCnt.value++;
    }
    key.value++;
}

watch(() => props.min, () => {
    prepareOptions();
})

function make2digit(month) {
    return (month >= 10 ? month : "0" + month);
}

function getEndDate(from_date) {
    let to_date = new Date(from_date);
    to_date.setMonth(to_date.getMonth() + 1);
    to_date.setDate(to_date.getDate() - 1);
    return to_date.getFullYear() + "-" + make2digit(to_date.getMonth() + 1) + "-" + make2digit(to_date.getDate());
}
prepareOptions();

defineExpose({
	make2digit, months, getEndDate
});
</script>