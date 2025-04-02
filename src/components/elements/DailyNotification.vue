<template>
    <div v-if="isVisible" class="bg-[var(--ui-background)] p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <!-- Close Button -->
      <span @click="closeMessage" class="absolute cursor-pointer top-2 right-2 text-white text-xl hover:text-gray-300 focus:outline-none">
        &times;
      </span>
  
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-white">Daily Tips !!!</h2>
      </div>
      <div class="mb-4">
        <p class="text-base text-white">{{ dailyMessage }}</p>
      </div>
      <div class="mt-4 text-center">
        <small class="text-sm text-gray-100">Stay updated with helpful tips every day!</small>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Sample list of daily tips/messages for landlords
  const messages = [
    "Ensure your rental property is well-maintained to attract quality tenants.",
    "Review your lease agreements regularly to stay compliant with new laws.",
    "Consider offering incentives like discounted rent for long-term tenants.",
    "Conduct regular property inspections to avoid unexpected repairs.",
    "Be prompt in addressing tenant concerns to maintain a positive relationship.",
    "Stay on top of market trends to adjust rental prices competitively.",
    "Offer flexible payment options for tenants who may need assistance.",
    "Keep your property clean and well-lit to make it more appealing to potential tenants."
  ];
  
  // Function to get today's message
  const getDailyMessage = () => {
    const today = new Date();
    const dayOfYear = today.getDate();  // Get the day of the year (1-31)
    return messages[dayOfYear % messages.length];  // Loop through messages
  };
  
  const dailyMessage = ref('');
  const isVisible = ref(true);
  
  onMounted(() => {
    dailyMessage.value = getDailyMessage();
  });
  
  // Function to close the message container
  const closeMessage = () => {
    isVisible.value = false;
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS already handles styling, no need for additional custom styles */
  </style>
  