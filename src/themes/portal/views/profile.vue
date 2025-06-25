<template>
  <div class="space-y-6">
    <!-- Profile Header -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img 
            :src="user?.avatar || avatarFallback" 
            alt="Profile Picture" 
            class="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
          <button 
            @click="showAvatarUpload = true"
            class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Icon name="Camera" :size="16" />
          </button>
        </div>
        
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ user?.name || 'User Name' }}</h1>
          <p class="text-gray-600">{{ user?.email || 'user@example.com' }}</p>
          <div class="flex items-center space-x-4 mt-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Icon name="CheckCircle" :size="12" class="mr-1" />
              Verified
            </span>
            <span class="text-sm text-gray-500">Member since {{ formatDate(user?.createdAt || new Date()) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            <button 
              @click="editMode.personal = !editMode.personal"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {{ editMode.personal ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <form @submit.prevent="savePersonalInfo" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  :disabled="!editMode.personal"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  :disabled="!editMode.personal"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                :disabled="!editMode.personal"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                :disabled="!editMode.personal"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                v-model="profileForm.dateOfBirth"
                type="date"
                :disabled="!editMode.personal"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div v-if="editMode.personal" class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="editMode.personal = false"
                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
          
          <div class="space-y-4">
            <!-- Change Password -->
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-900">Password</h3>
                <p class="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
              <button 
                @click="showChangePassword = true"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Change
              </button>
            </div>
            <!-- Two-Factor Authentication -->
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p class="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button 
                @click="toggle2FA"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <!-- Login Sessions -->
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-900">Active Sessions</h3>
                <p class="text-sm text-gray-500">Manage your active login sessions</p>
              </div>
              <button 
                @click="showActiveSessions = true"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
          
          <div class="space-y-4">
            <!-- Notifications -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Push Notifications</h3>
                <p class="text-sm text-gray-500">Receive notifications about your account</p>
              </div>
              <button 
                @click="preferences.notifications = !preferences.notifications"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="preferences.notifications ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <!-- Email Updates -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Email Updates</h3>
                <p class="text-sm text-gray-500">Receive email updates about transactions</p>
              </div>
              <button 
                @click="preferences.emailUpdates = !preferences.emailUpdates"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="preferences.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="preferences.emailUpdates ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>

            <!-- Dark Mode -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Dark Mode</h3>
                <p class="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <button 
                @click="preferences.darkMode = !preferences.darkMode"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="preferences.darkMode ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="preferences.darkMode ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Account Stats -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Transactions</span>
              <span class="font-semibold text-gray-900">{{ accountStats.totalTransactions }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Active Services</span>
              <span class="font-semibold text-gray-900">{{ accountStats.activeServices }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Account Balance</span>
              <span class="font-semibold text-green-600">₹{{ formatCurrency(accountStats.balance) }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div class="space-y-3">
            <button 
              @click="downloadStatement"
              class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icon name="Download" :size="20" class="text-gray-600" />
              <span class="text-sm font-medium text-gray-900">Download Statement</span>
            </button>
            
            <button 
              @click="exportData"
              class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icon name="FileText" :size="20" class="text-gray-600" />
              <span class="text-sm font-medium text-gray-900">Export Data</span>
            </button>
            
            <button 
              @click="contactSupport"
              class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icon name="MessageCircle" :size="20" class="text-gray-600" />
              <span class="text-sm font-medium text-gray-900">Contact Support</span>
            </button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-red-200">
          <h3 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
          
          <div class="space-y-3">
            <button 
              @click="deactivateAccount"
              class="w-full bg-red-50 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Deactivate Account
            </button>
            
            <button 
              @click="deleteAccount"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <transition name="modal-fade">
      <div v-if="showChangePassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
              <button @click="showChangePassword = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="X" :size="20" />
              </button>
            </div>

            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="showChangePassword = false"
                  class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate } from '@/composables/helper'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'
import avatarFallback from '@/assets/images/avatar.png'

useCurrentTitle('Profile - RecurPay')

const extendedStore = useExtendedStore()
const { user } = storeToRefs(extendedStore)
const request = useApiRequest()

// Reactive data
const showAvatarUpload = ref(false)
const showChangePassword = ref(false)
const showActiveSessions = ref(false)
const twoFactorEnabled = ref(false)

const editMode = ref({
  personal: false
})

const profileForm = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  dateOfBirth: '1990-01-01'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = ref({
  notifications: true,
  emailUpdates: true,
  darkMode: false
})

const accountStats = ref({
  totalTransactions: 156,
  activeServices: 8,
  balance: 25430.50
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const savePersonalInfo = async () => {
  try {
    // API call to save personal information
    // const response = await request.post('/api/task/Profile:updatePersonalInfo', profileForm.value)
    // if (!response.error) {
    //   Signal.success('Personal information updated successfully')
    //   editMode.value.personal = false
    // }
    
    Signal.success('Personal information updated successfully')
    editMode.value.personal = false
  } catch (error) {
    Signal.error('Failed to update personal information')
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    Signal.error('New passwords do not match')
    return
  }

  try {
    // API call to change password
    // const response = await request.post('/api/task/Profile:changePassword', passwordForm.value)
    // if (!response.error) {
    //   Signal.success('Password changed successfully')
    //   showChangePassword.value = false
    //   passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    // }
    
    Signal.success('Password changed successfully')
    showChangePassword.value = false
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    Signal.error('Failed to change password')
  }
}

const toggle2FA = async () => {
  try {
    twoFactorEnabled.value = !twoFactorEnabled.value
    Signal.success(`Two-factor authentication ${twoFactorEnabled.value ? 'enabled' : 'disabled'}`)
  } catch (error) {
    Signal.error('Failed to update two-factor authentication')
  }
}

const downloadStatement = () => {
  Signal.success('Statement download started')
}

const exportData = () => {
  Signal.success('Data export started')
}

const contactSupport = () => {
  Signal.success('Redirecting to support...')
}

const deactivateAccount = async () => {
  const result = await Signal.confirm(
    'Deactivate Account',
    'Are you sure you want to deactivate your account? You can reactivate it later.',
    'Deactivate'
  )
  
  if (result.isConfirmed) {
    try {
      // API call to deactivate account
      // const response = await request.post('/api/task/Profile:deactivateAccount')
      // if (!response.error) {
      //   Signal.success('Account deactivated successfully')
      //   extendedStore.logout()
      // }
      
      Signal.success('Account deactivated successfully')
    } catch (error) {
      Signal.error('Failed to deactivate account')
    }
  }
}

const deleteAccount = async () => {
  const result = await Signal.confirm(
    'Delete Account',
    'Are you sure you want to permanently delete your account? This action cannot be undone.',
    'Delete Permanently'
  )
  
  if (result.isConfirmed) {
    try {
      // API call to delete account
      // const response = await request.post('/api/task/Profile:deleteAccount')
      // if (!response.error) {
      //   Signal.success('Account deleted successfully')
      //   extendedStore.logout()
      // }
      
      Signal.success('Account deleted successfully')
    } catch (error) {
      Signal.error('Failed to delete account')
    }
  }
}

// Load profile data
const loadProfile = async () => {
  try {
    // Example API call using DataForge
    // const response = await request.post('/api/item/User:profile')
    // if (!response.error) {
    //   profileForm.value = response.data
    // }
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
