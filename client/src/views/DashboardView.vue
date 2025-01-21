<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOddsStore } from '../stores/odds'
import { authService } from '../services/auth'

const SPORTS = [
  { value: 'basketball', label: 'Basketball (NBA)' },
  { value: 'football', label: 'Football (NFL)' },
  { value: 'baseball', label: 'Baseball (MLB)' },
  { value: 'tennis', label: 'Tennis (ATP)' }
] as const

const router = useRouter()
const oddsStore = useOddsStore()
const selectedSport = ref(SPORTS[0].value)

const filteredOdds = computed(() => {
  return oddsStore.getOddsBySport(selectedSport.value)
})

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-white">Odds Dashboard</h1>
            </div>
          </div>
          <button 
            @click="handleLogout"
            class="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="py-6">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <select
              v-model="selectedSport"
              class="block w-64 px-3 py-2 text-base border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            >
              <option 
                v-for="sport in SPORTS" 
                :key="sport.value" 
                :value="sport.value"
              >
                {{ sport.label }}
              </option>
            </select>

            <div class="flex items-center gap-4">
              <span v-if="oddsStore.lastUpdated" class="text-sm text-gray-400">
                Last updated: {{ oddsStore.lastUpdated.toLocaleTimeString() }}
              </span>
              <button
                @click="oddsStore.fetchOdds(selectedSport)"
                :disabled="oddsStore.isLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="oddsStore.isLoading">Refreshing...</span>
                <span v-else>Refresh Odds</span>
              </button>
            </div>
          </div>

          <div v-if="oddsStore.error" class="text-red-500">{{ oddsStore.error }}</div>

          <div v-if="oddsStore.isLoading" class="text-center py-4">
            <div class="text-white">Loading odds...</div>
          </div>

          <div v-if="!filteredOdds.length && !oddsStore.isLoading" class="text-center py-4">
            <div class="text-gray-400">No odds data for selected sport. Click refresh to load odds.</div>
          </div>

          <div v-else-if="!oddsStore.isLoading" class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-700 shadow sm:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-800">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Event</th>
                        <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Time</th>
                        <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Home Odds</th>
                        <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Away Odds</th>
                        <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Bookmaker</th>
                      </tr>
                    </thead>
                    <tbody class="bg-gray-900 divide-y divide-gray-700">
                      <tr 
                        v-for="odd in filteredOdds" 
                        :key="odd.event"
                        class="hover:bg-gray-800/50"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button 
                            @click="router.push(`/event/${encodeURIComponent(odd.event)}?sport=${selectedSport.value}`)"
                            class="text-sm text-blue-500 hover:text-blue-400 hover:underline cursor-pointer transition-colors duration-150 focus:outline-none"
                          >
                            {{ odd.event }}
                          </button>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-300">
                            {{ new Date(odd.startTime).toLocaleString() }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="space-y-1">
                            <div v-for="odds in odd.homeOdds" :key="odds.name" class="text-sm">
                              <span class="text-gray-300">{{ odds.odds.toFixed(2) }}</span>
                              <span class="text-gray-500 text-xs ml-1">({{ odds.name }})</span>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="space-y-1">
                            <div v-for="odds in odd.awayOdds" :key="odds.name" class="text-sm">
                              <span class="text-gray-300">{{ odds.odds.toFixed(2) }}</span>
                              <span class="text-gray-500 text-xs ml-1">({{ odds.name }})</span>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-300">{{ odd.homeOdds.length }} bookmakers</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template> 