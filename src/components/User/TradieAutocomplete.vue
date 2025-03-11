<template>
    <div class="">
        <FormKit  
            type="autocomplete"
            name="tradie"
            placeholder="Select tradie"
            :hasSearch="false"
            :multiple="true"
            :keymap="keyMap"
            :options="list"
            :dataUrl="dataUrl"
            v-model="selectedOption" 
        >
            <template #preslot="{isSelected}">
                <FormKit
                    type="checkbox"
                    name="checkbox"
                    :classes="{
                        outer: 'inline check-box'
                    }"
                    :modelValue="isSelected"
                />
            </template>
            <template #postslot="{config}">
                <FormKit 
                    type="rating"
                    name="rating"
                    :classes="{
                        outer: 'rating-outer'
                    }"
                    ratingType="star"
                    :ratingProps="{
                        disabled: true
                    }"
                    v-model="rating"
                />
            </template>
        </FormKit>

        <FormKit 
            type="button"
            :classes="{
                input: 'new-tradie-btn'
            }"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.402 45.402" height="10" width="10">
                <g><path fill="currentColor" d="M41.267,18.557H26.832V4.134C26.832,1.851,23.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27  c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435  c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/></g>
            </svg>
            <div class="label">Add a new tradie</div>
        </FormKit>
    </div>
</template>

<script setup>
import { FormKit } from '@formkit/vue';
import { ref } from 'vue';

const props = defineProps({
    dataUrl: {
        type: String,
        default: ''
    },
    keyMap: {
        type: Object,
        default: {label: 'label', value: 'value'}
    },
    list: {
        type: Array,
        default: []
    }
})

const selectedOption = ref('');
const rating = ref(3);

</script>

<style>
.rating-outer {
    margin-bottom: 0px !important;
    padding: 0px 0px 0px 10px;
}
.check-box {
    margin-bottom: 0px !important;
    margin-top: 5px;
    max-width: 10px !important;
    margin-right: 10px;
}
.label {
    margin: 2px 0px 0px 5px;
}
.new-tradie-btn {
    background: linear-gradient(to bottom,rgba(255, 255, 255, 1) 20%,rgba(243, 243, 243, 1) 80%,rgba(236, 236, 236, 1) 100%);
    border: 1px solid #CCCCCC;
    border-radius: 5px;
    font-size: 14px;
    color: #002a67cc;
    padding: 5px 15px;
}
</style>