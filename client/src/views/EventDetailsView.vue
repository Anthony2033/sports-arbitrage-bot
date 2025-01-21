<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOddsStore } from '../stores/odds'

const route = useRoute()
const router = useRouter()
const oddsStore = useOddsStore()

const event = computed(() => {
  const eventId = decodeURIComponent(route.params.id as string)
  return oddsStore.getEventByName(eventId)
})

onMounted(async () => {
  if (!oddsStore.allOdds.length) {
    await oddsStore.fetchOdds(route.query.sport as string)
  }
})

const getTimeUntil = (date: Date) => {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${days}d ${hours}h ${minutes}m`
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back button -->
      <button
        @click="router.back()"
        class="mb-6 flex items-center text-gray-400 hover:text-white"
      >
        <span class="mr-2">←</span> Back to Dashboard
      </button>

      <div v-if="oddsStore.isLoading" class="text-white text-center">Loading...</div>
      <div v-else-if="oddsStore.error" class="text-red-500 text-center">{{ oddsStore.error }}</div>
      <div v-else-if="event" class="space-y-16">
        <!-- Event Header -->
        <div class="bg-gray-800 rounded-lg p-10 text-center max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">{{ event.event }}</h1>
          <div class="flex items-center justify-center space-x-16 text-gray-400 text-lg">
            <div>{{ new Date(event.startTime).toLocaleString() }}</div>
            <div>Starts in: {{ getTimeUntil(event.startTime) }}</div>
          </div>
        </div>

        <!-- Main Comparison -->
        <div class="grid grid-cols-2 gap-16 max-w-6xl mx-auto">
          <!-- Home Team -->
          <div class="bg-gray-800 rounded-lg p-10">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-semibold text-white">{{ event.homeTeam }}</h2>
              <div class="text-sm px-4 py-2 bg-gray-700 rounded-full text-gray-300">Home</div>
            </div>
            <div class="space-y-4">
              <div 
                v-for="odds in event.homeOdds" 
                :key="odds.name"
                class="flex justify-between items-center p-6 bg-gray-700 rounded"
                :class="{'ring-2 ring-green-500': odds === event.homeOdds[0]}"
              >
                <span class="text-gray-300 text-lg">{{ odds.name }}</span>
                <span 
                  class="text-xl font-medium"
                  :class="{'text-green-400': odds === event.homeOdds[0], 'text-gray-300': odds !== event.homeOdds[0]}"
                >
                  {{ odds.odds.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Away Team -->
          <div class="bg-gray-800 rounded-lg p-10">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-semibold text-white">{{ event.awayTeam }}</h2>
              <div class="text-sm px-4 py-2 bg-gray-700 rounded-full text-gray-300">Away</div>
            </div>
            <div class="space-y-4">
              <div 
                v-for="odds in event.awayOdds" 
                :key="odds.name"
                class="flex justify-between items-center p-6 bg-gray-700 rounded"
                :class="{'ring-2 ring-green-500': odds === event.awayOdds[0]}"
              >
                <span class="text-gray-300 text-lg">{{ odds.name }}</span>
                <span 
                  class="text-xl font-medium"
                  :class="{'text-green-400': odds === event.awayOdds[0], 'text-gray-300': odds !== event.awayOdds[0]}"
                >
                  {{ odds.odds.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Value Analysis -->
        <div class="bg-gray-800 rounded-lg p-10 max-w-4xl mx-auto">
          <h2 class="text-2xl font-semibold text-white mb-8 text-center">Best Value Analysis</h2>
          <div class="grid grid-cols-2 gap-8">
            <div class="bg-gray-700 rounded p-6">
              <div class="text-lg text-gray-400 mb-2">Best {{ event.homeTeam }} Odds</div>
              <div class="flex items-center justify-between">
                <div class="text-2xl text-green-400 font-bold">
                  {{ event.homeOdds[0].odds.toFixed(2) }}
                </div>
                <div class="text-base text-gray-400">
                  via {{ event.homeOdds[0].name }}
                </div>
              </div>
            </div>
            <div class="bg-gray-700 rounded p-6">
              <div class="text-lg text-gray-400 mb-2">Best {{ event.awayTeam }} Odds</div>
              <div class="flex items-center justify-between">
                <div class="text-2xl text-green-400 font-bold">
                  {{ event.awayOdds[0].odds.toFixed(2) }}
                </div>
                <div class="text-base text-gray-400">
                  via {{ event.awayOdds[0].name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-white text-center">Event not found</div>
    </div>
  </div>
</template> 