<template>
    <div class="dropdown-wrap" @click="toggleDropdown()" v-click-outside>
        <!-- Header Section -->
        <slot name="header"></slot>

        <div :class="['dropdown-hrd',className]" v-show="!showDropdown || !hasSearch">
            {{ selectedItem || (selectedList.length && selectedList.length + ' Items Selected') ||'Select Value' }}
        </div>

        <div :class="['input-wrapper', wrapperClass]" v-if="hasSearch && showDropdown" >
            <input placeHolder="Search..." v-model="searchVal" type="text"/>
        </div>

        <transition name="dropdown-fade">
            <div v-if="showDropdown" :class="['dropdown-lst-wrp', wrapperClass]" @click.stop="() => {}" v-key-handler>
                <div class="lst-wrap">
                    <!-- Show Selecetd List Item -->
                    <div class="multi-lst" v-if="selectedList.length">
                        <div class="sel-title">selected item list(<span class="count">{{ selectedList.length }}</span>)</div>
                        <div v-if="isMultiSelect" class="view clrB">View</div>

                        <div class="multi-wrp">
                            <div v-for="(item, index) in selectedList" :key="'item_'+index" class="multi-itm">
                                {{ item }}
                                <span class="close" @click="removeSelectedItem(item)">x</span>
                            </div>
                        </div>

                        <div v-if="isMultiSelect" class="clear clrB" @click="handleClearAll()">
                            Clear All
                        </div>
                    </div>

                    <!-- ListItems -->
                    <div v-if="listItems.length" ref="listHolder" class="lst-itm-wrap">
                        <div v-for="(item, index) in listItems" :key="item[options.id]" :id="item[options.id]" :class="['lst-itm', (index === currentIndex) && 'sel']" @click="handleSelectedItem()" @mouseenter="currentIndex = index">
                            <input v-if="isMultiSelect" class="drp-dwn-cb input-cb" type="checkbox" :checked="selectedList.includes(item[options.value])" />
                            {{ item[options.value] }}
                        </div>
                    </div>
                </div>

                <div v-if="isMultiSelect && hasAllSelect" class="sel-all-opt" @click="handleAllSelect()">
                    Select All
                </div>
            </div>
        </transition>
        <slot name="footer"></slot>
    </div>
</template>


<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import useApiRequest from '@/composables/request';

const props = defineProps({
    className: {
        type: String,
        default: ''
    },
    wrapperClass: {
        type: String,
        default: ''
    },
    dataUrl: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: () => ([])
    },
    modelValue: {
        type: [String, Array],
        default: []
    },
    hasSearch: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 25
    },
    options: {
        type: Object,
        default: {id: 'id', value: 'value'}
    },
    isMultiSelect: {
        type: Boolean,
        default: false
    },
    hasAllSelect: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['update:modelValue']);

//Assign import composables
const request = useApiRequest();

//variable declaration
let listItems = ref([]);
let showDropdown = ref(false);
let selectedVal = ref('');
let selectedList = ref([]);
let selectedItem = ref('');
let ajaxData = ref([]);
let searchVal = ref('');
let currentIndex = ref(0);
let listHolder = ref(null);

//life cycle hooks
onBeforeMount(() => {
    props.dataUrl && loadAjaxCall();
})

const getSelectedVal = () => {
    (!props.isMultiSelect) ? (selectedVal.value = props.modelValue) : (selectedList.value = props.modelValue);
};

//Methods
// Ajax call for get list
const loadAjaxCall = async () => {
    let {data, error} = await request.post(props.dataUrl);

    if(error) {
        console.log(error);
        return;
    }

    listItems.value = ajaxData.value = data;
    getSelectedVal();
};

const toggleDropdown = (val = true) => {
    showDropdown.value = val;
    !val && (searchVal.value = '');
}

const handleSelectedItem = () => {
    let emitVal = '';
    let val = listItems.value[currentIndex.value][props.options.id];

    if(props.isMultiSelect) {
        emitVal = getMultipleSelectLst(val);
    }
    else {
        selectedVal.value = val;
        toggleDropdown(false);
        emitVal = val.toString();
    }
    
    emit('update:modelValue', emitVal);
}

const getMultipleSelectLst = val => {
    let title = listItems.value.find(item => item.id === val)[props.options.value];
    let index  = selectedList.value.indexOf(title);

    (index > -1) ? selectedList.value.splice(index, 1) : selectedList.value.push(title);

    return selectedList;
}

const removeSelectedItem = val => {
    selectedList.value = selectedList.value.filter(item => item !== val);

    emit('update:modelValue', selectedList.value);
}

const handleAllSelect = () => {
    selectedList.value = listItems.value.map(item => item[props.options.value]);
}

const handleClearAll = () => {
    selectedList.value = [];
}

const arrowFuncHandler = (val = true) => {
    val ? currentIndex.value++ : currentIndex.value--;
    (currentIndex.value < 0) && (currentIndex.value = listItems.value.length - 1);
    (listItems.value.length - 1 < currentIndex.value) && (currentIndex.value = 0);

    scrollSelectedItem();
}

const scrollSelectedItem = () => {
    let elem = listHolder.value.children[currentIndex.value];

    elem.scrollIntoView({ behavior: "auto", block: "center" });
}

// Key Event Feature
const keyHandler = e => {
    switch(e.key.toLowerCase()) {
        case 'arrowup':
            return arrowFuncHandler(false);
        case 'arrowdown':
            return arrowFuncHandler();
        case 'enter':
            return handleSelectedItem();
        case 'escape':
            return toggleDropdown(false);
    }
}

//Directives
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutSide = (event) => {
            (!(event.target === el || el.contains(event.target))) && toggleDropdown(false);
        }
        document.addEventListener('click', el.clickOutSide);
    },
    unmounted(el, binding) {
        document.removeEventListener('click', el.clickOutSide);
    }
}

const vKeyHandler = {
    mounted() {
        document.addEventListener('keyup', keyHandler);
    },
    unmounted() {
        document.removeEventListener('keyup',keyHandler);
    }
}

watch(() => props.list, (newVal, oldVal) => {
    listItems.value = newVal;
    getSelectedVal();
})

// watch
watch(selectedVal, (newVal, oldVal) => {
    let {id, value} = props.options;
    selectedItem.value = listItems.value.find(item => item[id] === newVal)?.[value];
})

watch(searchVal , 
    (newVal, oldVal) => {
        let val = newVal.trim().toLowerCase();
        let originalList = props.dataUrl ? ajaxData.value : props.list;
        
        listItems.value = val ? 
            originalList.filter(item => item[props.options.value].toLowerCase().includes(val)): 
            originalList;
    }
)

</script>

<style>
.dropdown-wrap {
    outline: none;
    width: 220px;
    background-color: #fff;
    border: 1px solid #ccc !important;
    cursor: pointer;
    height: 30px;
    line-height: 20px;
    display: inline-block;
    font-size: 14px;
    color: #555;
    vertical-align: middle;
    border-radius: 4px;
    position: relative;
}
.dropdown-lst-wrp {
    position: absolute;
    z-index: 1;
    margin: 5px 0px 0px 0px;
    box-shadow: 0px 2px 0px 3px #f6f6f6;
    width: 100%;
    border-radius: 5px;
    background: #fff;
}
.lst-wrap {
    overflow-y: auto;
    max-height: 250px;
}
.lst-itm-wrap {
    margin: 5px;
}

.lst-hrd-wrap {
    position: sticky;
    top: 0px;
    padding: 5px;
    background: #fff;
}

.lst-itm {
    padding: 5px 10px;
    border-radius: 4px;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }

    &:hover {
        background-color: #f4f4f4;
    }
}

.count {
    color: #808080;
    font-size: 12px;
}

.lst-itm.sel {
    background-color: #f4f4f4;
}

.dropdown-hrd {
    height: 100%;
    width: 100%;
    padding: 5px;
}

.input {
    border-bottom: 1px solid #ccc;
    border-radius: 5px;
    height: 30px;
    width: 100%;
    outline: none;
    padding: 5px;
}

.dropdown-fade-enter-active {
  transition: all 0.3s ease-out;
}

.dropdown-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

.no-res {
    padding: 5px;
    cursor: default;
}

.drp-dwn-cb {
    margin-right: 10px;
}
.multi-itm {
    padding: 5px;
    background: #ccc;
    margin: 2px;
    border-radius: 25px;
    font-size: 12px;
}
.close {
    background: #818181;
    color: #fff;
    padding: 0px 5px;
    border-radius: 100%;
    margin: 0px 2px;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
}
.multi-wrp {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    max-height: 70px;
    overflow: hidden;
}
.sel-title {
    font-weight: bold;
    display: inline-block;
}
.multi-lst {
    position: sticky;
    top: 0px;
    background: #fff;
    padding: 5px;
    cursor: default;
}
.clrB {
    cursor: pointer;
    color: #056beb;
}
.view {
    float: right;
}
.clear {
    text-align: end;
}
.sel-all-opt {
    padding: 10px;
    cursor: pointer;
    text-align: center;
    color: #0072ff;
}
</style>