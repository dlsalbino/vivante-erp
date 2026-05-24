import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      nome: null,
      perfil: null,
      login: (token, nome, perfil) => set({ token, nome, perfil }),
      logout: () => set({ token: null, nome: null, perfil: null }),
    }),
    {
      name: 'vivante-erp-auth',
      partialize: (state) => ({
        token: state.token,
        nome: state.nome,
        perfil: state.perfil,
      }),
    }
  )
)

export default useAuthStore
