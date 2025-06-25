<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-600 mt-1">Manage your app preferences and account settings</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Notifications -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Push Notifications</h3>
              <p class="text-sm text-gray-500">Receive notifications about your transactions</p>
            </div>
            <button 
              @click="settings.pushNotifications = !settings.pushNotifications"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Email Notifications</h3>
              <p class="text-sm text-gray-500">Get email updates about your account</p>
            </div>
            <button 
              @click="settings.emailNotifications = !settings.emailNotifications"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">SMS Alerts</h3>
              <p class="text-sm text-gray-500">Receive SMS for important transactions</p>
            </div>
            <button 
              @click="settings.smsAlerts = !settings.smsAlerts"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.smsAlerts ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Biometric Authentication</h3>
              <p class="text-sm text-gray-500">Use fingerprint or face ID to unlock</p>
            </div>
            <button 
              @click="settings.biometricAuth = !settings.biometricAuth"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.biometricAuth ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.biometricAuth ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Auto-lock</h3>
              <p class="text-sm text-gray-500">Automatically lock app after inactivity</p>
            </div>
            <select 
              v-model="settings.autoLockTime"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="never">Never</option>
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Transaction PIN</h3>
              <p class="text-sm text-gray-500">Require PIN for transactions above ₹1000</p>
            </div>
            <button 
              @click="settings.transactionPin = !settings.transactionPin"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.transactionPin ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.transactionPin ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Privacy</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Analytics</h3>
              <p class="text-sm text-gray-500">Help improve the app by sharing usage data</p>
            </div>
            <button 
              @click="settings.analytics = !settings.analytics"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.analytics ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.analytics ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Personalized Ads</h3>
              <p class="text-sm text-gray-500">Show ads based on your interests</p>
            </div>
            <button 
              @click="settings.personalizedAds = !settings.personalizedAds"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="settings.personalizedAds ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settings.personalizedAds ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- App Preferences -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">App Preferences</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Theme</h3>
              <p class="text-sm text-gray-500">Choose your preferred app theme</p>
            </div>
            <select 
              v-model="settings.theme"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Language</h3>
              <p class="text-sm text-gray-500">Select your preferred language</p>
            </div>
            <select 
              v-model="settings.language"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="bn">Bengali</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Currency</h3>
              <p class="text-sm text-gray-500">Default currency for display</p>
            </div>
            <select 
              v-model="settings.currency"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data & Storage -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Data & Storage</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">Clear Cache</h3>
              <p class="text-sm text-gray-500">Free up space by clearing cached data</p>
            </div>
            <button 
              @click="clearCache"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>

          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">Export Data</h3>
              <p class="text-sm text-gray-500">Download your account data</p>
            </div>
            <button 
              @click="exportData"
              class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">About</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Version</span>
            <span class="font-medium text-gray-900">1.0.0</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Build</span>
            <span class="font-medium text-gray-900">2024.01.15</span>
          </div>
          
          <div class="pt-4 space-y-2">
            <button class="w-full text-left text-blue-600 hover:text-blue-700 font-medium text-sm">
              Terms of Service
            </button>
            <button class="w-full text-left text-blue-600 hover:text-blue-700 font-medium text-sm">
              Privacy Policy
            </button>
            <button class="w-full text-left text-blue-600 hover:text-blue-700 font-medium text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          @click="saveSettings"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCurrentTitle } from '@/composables/use-meta'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

useCurrentTitle('Settings - RecurPay')

const request = useApiRequest()

// Reactive data
const settings = ref({
  // Notifications
  pushNotifications: true,
  emailNotifications: true,
  smsAlerts: false,
  
  // Security
  biometricAuth: false,
  autoLockTime: '5',
  transactionPin: true,
  
  // Privacy
  analytics: true,
  personalizedAds: false,
  
  // App Preferences
  theme: 'light',
  language: 'en',
  currency: 'INR'
})

// Watch for changes and save to localStorage
watch(settings, (newSettings) => {
  localStorage.setItem('appSettings', JSON.stringify(newSettings))
}, { deep: true })

// Methods
const clearCache = async () => {
  try {
    // Clear localStorage cache (except important data)
    const importantKeys = ['user', 'token', 'appSettings']
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      if (!importantKeys.includes(key)) {
        localStorage.removeItem(key)
      }
    })
    
    Signal.success('Cache cleared successfully')
  } catch (error) {
    Signal.error('Failed to clear cache')
  }
}

const exportData = async () => {
  try {
    // API call to export user data
    // const response = await request.post('/api/task/User:exportData')
    // if (!response.error) {
    //   // Create download link
    //   const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
    //   const url = URL.createObjectURL(blob)
    //   const a = document.createElement('a')
    //   a.href = url
    //   a.download = 'recurpay-data-export.json'
    //   a.click()
    //   URL.revokeObjectURL(url)
    //   Signal.success('Data exported successfully')
    // }
    
    // Mock export for demo
    const mockData = {
      user: { name: 'John Doe', email: 'john@example.com' },
      transactions: [],
      services: [],
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recurpay-data-export.json'
    a.click()
    URL.revokeObjectURL(url)
    
    Signal.success('Data exported successfully')
  } catch (error) {
    Signal.error('Failed to export data')
  }
}

const saveSettings = async () => {
  try {
    // API call to save settings
    // const response = await request.post('/api/task/User:updateSettings', settings.value)
    // if (!response.error) {
    //   Signal.success('Settings saved successfully')
    // }
    
    Signal.success('Settings saved successfully')
  } catch (error) {
    Signal.error('Failed to save settings')
  }
}

const loadSettings = async () => {
  try {
    // Load from localStorage first
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
    }
    
    // Then load from API
    // const response = await request.post('/api/item/User:settings')
    // if (!response.error) {
    //   settings.value = { ...settings.value, ...response.data }
    // }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

onMounted(() => {
  loadSettings()
})
</script>
