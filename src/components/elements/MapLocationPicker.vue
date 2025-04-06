<template>
  <div>
    <!-- Location Display -->
    <div class="mb-4 p-4 border rounded-lg bg-gray-50">
      <div v-if="selectedAddress" class="space-y-2">
        <h3 class="font-medium text-lg">Selected Location</h3>
        <p class="text-gray-700">{{ selectedAddress }}</p>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-500">Latitude</label>
            <p class="font-mono">{{ latitude.toFixed(6) }}</p>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-500">Longitude</label>
            <p class="font-mono">{{ longitude.toFixed(6) }}</p>
          </div>
        </div>
      </div>
      <button
        @click="openMapModal"
        type="button"
        class="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {{ selectedAddress ? 'Change Location' : 'Select Location' }}
      </button>
    </div>

    <!-- Map Modal -->
    <div v-if="showMapModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium">Select Location</h3>
          <button @click="closeMapModal" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div class="p-4 overflow-auto flex-1">
          <!-- Search Box -->
          <div class="relative mb-4">
            <input
              ref="searchInput"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              placeholder="Search for Sivakasi Housing Board..."
            />
          </div>
          
          <!-- Map Container -->
          <div ref="mapContainer" class="h-96 w-full rounded-md border border-gray-300"></div>
          
          <!-- Status Messages -->
          <div class="mt-3 space-y-1">
            <div v-if="isLoading" class="flex items-center text-blue-600">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading map...
            </div>
            <div v-if="selectedAddress" class="text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ selectedAddress }}
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t flex justify-end space-x-3">
          <button
            @click="closeMapModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmLocation"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!latitude || !longitude"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'GoogleMapLocationPicker',
  props: {
    apiKey: {
      type: String,
      required: true
    },
    initialLocation: {
      type: Object,
      default: () => ({
        latitude: 9.4475, // Sivakasi coordinates
        longitude: 77.8145,
        address: ''
      })
    }
  },
  emits: ['location-selected'],
  setup(props, { emit }) {
    const showMapModal = ref(false);
    const mapContainer = ref(null);
    const searchInput = ref(null);
    const latitude = ref(props.initialLocation.latitude);
    const longitude = ref(props.initialLocation.longitude);
    const selectedAddress = ref(props.initialLocation.address);
    const isLoading = ref(false);
    let map = null;
    let marker = null;
    let autocomplete = null;
    let geocoder = null;

    // Load Google Maps script
    const loadGoogleMaps = () => {
      return new Promise((resolve) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    // Initialize map
    const initMap = async () => {
      isLoading.value = true;
      
      await loadGoogleMaps();
      
      // Set default center (Sivakasi)
      const center = latitude.value && longitude.value 
        ? { lat: latitude.value, lng: longitude.value } 
        : { lat: 9.4475, lng: 77.8145 };
      
      map = new google.maps.Map(mapContainer.value, {
        center,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Initialize services
      geocoder = new google.maps.Geocoder();
      autocomplete = new google.maps.places.Autocomplete(
        searchInput.value,
        { types: ['geocode'], componentRestrictions: { country: 'in' } }
      );
      
      // Add marker if initial location exists
      if (latitude.value && longitude.value) {
        placeMarker({ lat: latitude.value, lng: longitude.value });
      }

      // Set up autocomplete
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        
        map.setCenter(place.geometry.location);
        map.setZoom(16);
        placeMarker(place.geometry.location);
        
        // Get full address
        geocoder.geocode({ location: place.geometry.location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            selectedAddress.value = results[0].formatted_address;
          }
        });
      });

      // Add click listener
      map.addListener('click', (e) => {
        placeMarker(e.latLng);
        
        // Reverse geocode to get address
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            selectedAddress.value = results[0].formatted_address;
          }
        });
      });

      // Search for Sivakasi Housing Board initially
      searchLocation('Sivakasi Housing Board');
      
      isLoading.value = false;
    };

    const placeMarker = (location) => {
      if (marker) {
        marker.setMap(null);
      }
      
      marker = new google.maps.Marker({
        position: location,
        map,
        draggable: true
      });
      
      // Update coordinates
      latitude.value = location.lat();
      longitude.value = location.lng();
      
      // Update position if marker is dragged
      marker.addListener('dragend', (e) => {
        latitude.value = e.latLng.lat();
        longitude.value = e.latLng.lng();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            selectedAddress.value = results[0].formatted_address;
          }
        });
      });
    };

    const searchLocation = (query) => {
      if (!query) return;
      
      const request = {
        query,
        fields: ['geometry', 'formatted_address'],
        locationBias: { radius: 50000, center: { lat: 9.4475, lng: 77.8145 } }
      };
      
      const service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(16);
          placeMarker(results[0].geometry.location);
          selectedAddress.value = results[0].formatted_address;
        }
      });
    };

    const openMapModal = () => {
      showMapModal.value = true;
      nextTick(() => {
        initMap();
      });
    };

    const closeMapModal = () => {
      showMapModal.value = false;
      map = null;
      marker = null;
    };

    const confirmLocation = () => {
      emit('location-selected', { 
        latitude: latitude.value,
        longitude: longitude.value,
        address: selectedAddress.value
      });
      closeMapModal();
    };

    return {
      showMapModal,
      mapContainer,
      searchInput,
      latitude,
      longitude,
      selectedAddress,
      isLoading,
      openMapModal,
      closeMapModal,
      confirmLocation
    };
  }
};
</script>

<style scoped>
.pac-container {
  z-index: 10000 !important;
}
</style>