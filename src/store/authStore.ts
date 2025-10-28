import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
  }),
  actions: {
    async fetchUser() {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user || null
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
  },
})
