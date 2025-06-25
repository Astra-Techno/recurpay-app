<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
          <Icon name="ArrowLeft" :size="20" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Scan QR Code</h1>
          <p class="text-gray-600 mt-1">Scan to pay or receive money</p>
        </div>
      </div>
      
      <!-- Flash Toggle -->
      <button 
        v-if="cameraActive"
        @click="toggleFlash"
        class="p-2 rounded-lg"
        :class="flashOn ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'"
      >
        <Icon name="Flashlight" :size="20" />
      </button>
    </div>

    <!-- QR Scanner -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="relative">
        <!-- Camera View -->
        <div v-if="!scanResult" class="relative">
          <div 
            v-if="!cameraActive"
            class="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-4"
          >
            <div class="p-4 bg-blue-100 rounded-full">
              <Icon name="QrCode" :size="48" class="text-blue-600" />
            </div>
            <div class="text-center">
              <h3 class="font-medium text-gray-900 mb-2">Ready to Scan</h3>
              <p class="text-sm text-gray-500 mb-4">Position the QR code within the frame</p>
              <button 
                @click="startCamera"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Camera
              </button>
            </div>
          </div>

          <!-- Mock Camera View -->
          <div 
            v-else
            class="aspect-square bg-gray-900 rounded-lg relative overflow-hidden"
          >
            <!-- Camera placeholder -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div class="text-white text-center">
                <Icon name="Camera" :size="48" class="mx-auto mb-2 opacity-50" />
                <p class="text-sm opacity-75">Camera View</p>
              </div>
            </div>

            <!-- Scanning Frame -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="relative w-64 h-64">
                <!-- Corner borders -->
                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                
                <!-- Scanning line animation -->
                <div class="absolute inset-x-0 top-0 h-1 bg-blue-500 animate-pulse" 
                     :style="{ top: scanLinePosition + '%' }"></div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="absolute bottom-4 left-0 right-0 text-center">
              <p class="text-white text-sm">Position QR code within the frame</p>
            </div>
          </div>
        </div>

        <!-- Scan Result -->
        <div v-else class="text-center space-y-4">
          <div class="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Icon name="CheckCircle" :size="32" class="text-green-600" />
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">QR Code Scanned!</h3>
            <p class="text-sm text-gray-500">{{ scanResult.type }} detected</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 mt-6">
        <button 
          v-if="!cameraActive && !scanResult"
          @click="showMyQR = true"
          class="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Icon name="QrCode" :size="20" />
          <span>Show My QR</span>
        </button>
        
        <button 
          v-if="cameraActive && !scanResult"
          @click="mockScan"
          class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Simulate Scan
        </button>
        
        <button 
          v-if="cameraActive"
          @click="stopCamera"
          class="flex-1 bg-red-100 text-red-700 py-3 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Stop Camera
        </button>
      </div>
    </div>

    <!-- Scan Result Details -->
    <div v-if="scanResult" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
      
      <div class="space-y-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Merchant</span>
          <span class="font-medium text-gray-900">{{ scanResult.merchant }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">UPI ID</span>
          <span class="font-medium text-gray-900">{{ scanResult.upiId }}</span>
        </div>
        
        <div v-if="scanResult.amount" class="flex justify-between">
          <span class="text-gray-600">Amount</span>
          <span class="font-medium text-gray-900">₹{{ formatCurrency(scanResult.amount) }}</span>
        </div>
        
        <div v-if="scanResult.description" class="flex justify-between">
          <span class="text-gray-600">Description</span>
          <span class="font-medium text-gray-900">{{ scanResult.description }}</span>
        </div>
      </div>

      <!-- Amount Input (if not fixed) -->
      <div v-if="!scanResult.amount" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Enter Amount</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <input
            v-model="paymentAmount"
            type="number"
            placeholder="0.00"
            class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
            step="0.01"
          />
        </div>
      </div>

      <!-- Pay Button -->
      <button 
        @click="proceedToPayment"
        :disabled="!scanResult.amount && !paymentAmount"
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium mt-4"
      >
        Pay ₹{{ formatCurrency(scanResult.amount || paymentAmount || 0) }}
      </button>
    </div>

    <!-- My QR Code Modal -->
    <transition name="modal-fade">
      <div v-if="showMyQR" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-sm w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">My QR Code</h2>
            <button @click="showMyQR = false" class="text-gray-400 hover:text-gray-600">
              <Icon name="X" :size="20" />
            </button>
          </div>
          
          <div class="text-center space-y-4">
            <!-- QR Code Placeholder -->
            <div class="bg-gray-100 p-8 rounded-lg">
              <div class="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <div class="grid grid-cols-8 gap-1">
                  <div v-for="i in 64" :key="i" 
                       class="w-2 h-2 rounded-sm"
                       :class="Math.random() > 0.5 ? 'bg-black' : 'bg-white'">
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p class="font-medium text-gray-900">John Doe</p>
              <p class="text-sm text-gray-500">john.doe@upi</p>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="shareQR"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Share
              </button>
              <button 
                @click="downloadQR"
                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Recent Scans -->
    <div v-if="recentScans.length" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
      
      <div class="space-y-3">
        <div
          v-for="scan in recentScans"
          :key="scan.id"
          @click="selectRecentScan(scan)"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Icon name="QrCode" :size="20" class="text-blue-600" />
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ scan.merchant }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(scan.date, 'DD MMM, hh:mm A') }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-gray-900">₹{{ formatCurrency(scan.amount) }}</p>
            <p class="text-sm text-gray-500">{{ scan.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate } from '@/composables/helper'
import Signal from '@/composables/signal'

useCurrentTitle('Scan QR - RecurPay')

const router = useRouter()

// Reactive data
const cameraActive = ref(false)
const flashOn = ref(false)
const scanResult = ref(null)
const showMyQR = ref(false)
const paymentAmount = ref('')
const scanLinePosition = ref(0)

const recentScans = ref([
  {
    id: 1,
    merchant: 'Starbucks Coffee',
    amount: 450,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'Completed'
  },
  {
    id: 2,
    merchant: 'Metro Station',
    amount: 25,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'Completed'
  },
  {
    id: 3,
    merchant: 'Grocery Store',
    amount: 1250,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'Completed'
  }
])

let scanLineInterval = null

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const startCamera = () => {
  cameraActive.value = true
  startScanLineAnimation()
}

const stopCamera = () => {
  cameraActive.value = false
  scanResult.value = null
  stopScanLineAnimation()
}

const toggleFlash = () => {
  flashOn.value = !flashOn.value
}

const startScanLineAnimation = () => {
  scanLineInterval = setInterval(() => {
    scanLinePosition.value = (scanLinePosition.value + 2) % 100
  }, 50)
}

const stopScanLineAnimation = () => {
  if (scanLineInterval) {
    clearInterval(scanLineInterval)
    scanLineInterval = null
  }
}

const mockScan = () => {
  // Simulate QR scan result
  setTimeout(() => {
    scanResult.value = {
      type: 'UPI Payment',
      merchant: 'Coffee Shop',
      upiId: 'coffeeshop@paytm',
      amount: Math.random() > 0.5 ? Math.floor(Math.random() * 500) + 100 : null,
      description: 'Payment for order #1234'
    }
    stopScanLineAnimation()
  }, 1500)
}

const proceedToPayment = () => {
  const amount = scanResult.value.amount || paymentAmount.value
  
  // Navigate to payment confirmation
  router.push({
    name: 'payment-confirmation',
    query: {
      merchant: scanResult.value.merchant,
      upiId: scanResult.value.upiId,
      amount: amount,
      description: scanResult.value.description
    }
  })
}

const selectRecentScan = (scan) => {
  scanResult.value = {
    type: 'UPI Payment',
    merchant: scan.merchant,
    upiId: scan.merchant.toLowerCase().replace(/\s+/g, '') + '@upi',
    amount: scan.amount,
    description: 'Previous transaction'
  }
}

const shareQR = () => {
  if (navigator.share) {
    navigator.share({
      title: 'My QR Code',
      text: 'Scan this QR code to pay me',
      url: 'https://example.com/pay/john-doe'
    })
  } else {
    Signal.success('QR code sharing link copied to clipboard')
  }
}

const downloadQR = () => {
  // Create a mock download
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  
  // Draw a simple QR pattern
  ctx.fillStyle = '#000000'
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i * 10, j * 10, 10, 10)
      }
    }
  }
  
  // Download the canvas as image
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-qr-code.png'
    a.click()
    URL.revokeObjectURL(url)
  })
  
  Signal.success('QR code downloaded')
}

onMounted(() => {
  // Request camera permissions if needed
  // navigator.mediaDevices.getUserMedia({ video: true })
})

onUnmounted(() => {
  stopScanLineAnimation()
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

@keyframes scan-line {
  0% { top: 0%; }
  100% { top: 100%; }
}
</style>
