<template>
  <div>
    <input
      :id="id"
      :name="name"
      :value="value"
      @input="onInput"
      @focus="showSuggestions = true"
      @blur="hideSuggestions"
    />
    <ul v-if="showSuggestions">
      <li
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @mousedown="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    id: String,
    name: String,
    suggestions: Array
  },
  data() {
    return {
      showSuggestions: false,
      filteredSuggestions: []
    };
  },
  watch: {
    value(newVal) {
      this.filteredSuggestions = this.suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(newVal.toLowerCase())
      );
    }
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    selectSuggestion(suggestion) {
      this.$emit('input', suggestion);
      this.showSuggestions = false;
    },
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200); // Delay to allow for selection via mousedown
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
}
li {
  padding: 8px;
  cursor: pointer;
}
li:hover {
  background-color: #f0f0f0;
}
</style>
