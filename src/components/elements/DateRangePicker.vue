<template>
  <div class="relative" v-click-outside="closeCalendar">
    <FormKit
      type="text"
      readonly
      :model-value="formattedDateRange"
      @click="toggleCalendar"
      :classes="{
        input: 'cursor-pointer',
        outer: 'mb-0'
      }"
      placeholder="Select date range"
      :validation="validation"
      :validation-messages="{
        required: 'Please select a date range',
        invalid: 'Invalid date range selection'
      }"
    />

    <div v-if="isOpen" class="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 w-[700px]">
      <div class="flex gap-4">
        <!-- Preset Ranges -->
        <div class="w-1/5 border-r pr-4">
          <div class="space-y-2">
            <button
              v-for="preset in presetRanges"
              :key="preset.label"
              @click="applyPreset(preset)"
              class="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <!-- Calendar Container -->
        <div class="flex-1 flex gap-4">
          <div v-for="(cal, index) in calendar" :key="index" class="flex-1">
            <div class="flex justify-between items-center mb-4">
              <button 
                @click="prevMonth(index)"
                :disabled="isPreviousDisabled(index)"
                class="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <div class="font-semibold text-sm">{{ getMonthYear(index) }}</div>
              <button 
                @click="nextMonth(index)"
                :disabled="isNextDisabled(index)"
                class="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <div v-for="day in days" :key="day" class="text-center text-xs font-medium text-gray-500">
                {{ day }}
              </div>
              <div
                v-for="date in cal"
                :key="date.key"
                @click="!date.disabled && selectDate(date.date)"
                class="text-center p-2 rounded cursor-pointer text-sm"
                :class="getDateClasses(date)"
              >
                {{ date.date.getDate() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="mt-4 pt-4 border-t flex justify-between">
        <button
          @click="clearSelection"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear
        </button>
        <button
          @click="closeCalendar"
          class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { createInput } from '@formkit/vue';

const props = defineProps({
  context: Object,
  minDate: Date,
  maxDate: Date
});

// FormKit Registration
const dateRangeInput = createInput({
  type: 'input',
  props: ['minDate', 'maxDate'],
  component: 'DateRangePicker'
});

const isOpen = ref(false);
const currentDate = ref(new Date());
const selectedStart = ref(null);
const selectedEnd = ref(null);
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Preset Ranges
const presetRanges = [
  { 
    label: 'Today', 
    getRange: () => [new Date(), new Date()] 
  },
  { 
    label: 'Last 7 Days', 
    getRange: () => [addDays(new Date(), -6), new Date()] 
  },
  { 
    label: 'Last 30 Days', 
    getRange: () => [addDays(new Date(), -29), new Date()] 
  },
  { 
    label: 'This Month', 
    getRange: () => [startOfMonth(new Date()), endOfMonth(new Date())] 
  }
];

// Computed Properties
const formattedDateRange = computed(() => {
  if (!props.context._value?.start || !props.context._value?.end) return '';
  return `${formatDate(props.context._value.start)} - ${formatDate(props.context._value.end)}`;
});

const calendar = computed(() => [
  generateCalendar(currentDate.value),
  generateCalendar(addMonths(currentDate.value, 1))
]);

const validation = computed(() => [
  [() => props.context._value?.start && props.context._value?.end, 'required'],
  [() => isValidRange(props.context._value), 'invalid']
]);

// Methods
function toggleCalendar() {
  isOpen.value = !isOpen.value;
}

function closeCalendar() {
  isOpen.value = false;
}

function selectDate(date) {
  if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
    selectedStart.value = date;
    selectedEnd.value = null;
  } else {
    selectedEnd.value = date;
    if (date < selectedStart.value) {
      [selectedStart.value, selectedEnd.value] = [date, selectedStart.value];
    }
    updateFormKitValue();
  }
}

function applyPreset(preset) {
  const [start, end] = preset.getRange();
  selectedStart.value = start;
  selectedEnd.value = end;
  updateFormKitValue();
  closeCalendar();
}

function clearSelection() {
  selectedStart.value = null;
  selectedEnd.value = null;
  props.context.node.input(null);
  closeCalendar();
}

function updateFormKitValue() {
  props.context.node.input({
    start: selectedStart.value,
    end: selectedEnd.value
  });
}

// Date Classes Logic
function getDateClasses(date) {
  const classes = [];
  const currentValue = props.context._value;
  const now = new Date();
  
  // Disabled State
  if (date.disabled) {
    classes.push('text-gray-400 opacity-50 cursor-not-allowed');
  } else {
    classes.push('hover:bg-blue-100');
  }

  // Current Date
  if (isSameDay(date.date, now)) {
    classes.push('font-semibold text-blue-500');
  }

  // Selected Dates
  if (currentValue?.start && isSameDay(date.date, currentValue.start)) {
    classes.push('bg-blue-600 text-white hover:bg-blue-700');
  }
  if (currentValue?.end && isSameDay(date.date, currentValue.end)) {
    classes.push('bg-blue-600 text-white hover:bg-blue-700');
  }

  // In Range
  if (currentValue?.start && currentValue?.end && 
      date.date > currentValue.start && date.date < currentValue.end) {
    classes.push('bg-blue-100');
  }

  // Disabled by min/max dates
  if (props.minDate && date.date < props.minDate) {
    classes.push('opacity-50 cursor-not-allowed');
  }
  if (props.maxDate && date.date > props.maxDate) {
    classes.push('opacity-50 cursor-not-allowed');
  }

  return classes;
}

// Calendar Generation
function generateCalendar(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const daysArray = [];
  
  // Previous Month
  const prevMonthEnd = endOfMonth(addMonths(date, -1));
  const prevMonthDays = prevMonthEnd.getDate();
  const firstDay = start.getDay();
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const dateObj = addDays(prevMonthEnd, -i);
    daysArray.push(createCalendarDay(dateObj, false, date));
  }

  // Current Month
  for (let i = 1; i <= end.getDate(); i++) {
    const dateObj = new Date(date.getFullYear(), date.getMonth(), i);
    daysArray.push(createCalendarDay(dateObj, true, date));
  }

  // Next Month
  const totalDays = daysArray.length;
  const nextMonthDays = 42 - totalDays;
  for (let i = 1; i <= nextMonthDays; i++) {
    const dateObj = new Date(date.getFullYear(), date.getMonth() + 1, i);
    daysArray.push(createCalendarDay(dateObj, false, date));
  }

  return daysArray;
}

function createCalendarDay(date, isCurrent, currentMonth) {
  return {
    date,
    current: isCurrent,
    disabled: !isCurrent || 
             (props.minDate && date < props.minDate) || 
             (props.maxDate && date > props.maxDate),
    key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  };
}

// Date Utilities
function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function isValidRange(value) {
  return !value || (value.start && value.end && value.start <= value.end);
}

// Navigation Controls
function prevMonth(index) {
  currentDate.value = addMonths(currentDate.value, index === 0 ? -1 : 0);
}

function nextMonth(index) {
  currentDate.value = addMonths(currentDate.value, index === 1 ? 1 : 0);
}

function getMonthYear(index) {
  const date = index === 1 ? addMonths(currentDate.value, 1) : currentDate.value;
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
}

function isPreviousDisabled(index) {
  if (!props.minDate) return false;
  const checkDate = index === 0 ? currentDate.value : addMonths(currentDate.value, 1);
  return startOfMonth(checkDate) <= startOfMonth(props.minDate);
}

function isNextDisabled(index) {
  if (!props.maxDate) return false;
  const checkDate = index === 1 ? addMonths(currentDate.value, 2) : addMonths(currentDate.value, 1);
  return endOfMonth(checkDate) >= endOfMonth(props.maxDate);
}

// Click Outside Directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>
