import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuth } from '@/shared/auth/AuthProvider'
import type { ScoredOffer } from '@/shared/types/offer'

type FavoritesContextValue = {
  enabled: boolean
  favorites: ScoredOffer[]
  isFavorite: (productUrl: string) => boolean
  toggle: (offer: ScoredOffer) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<ScoredOffer[]>([])

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    let active = true
    const load = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('offer')
        .eq('user_id', user.id)
      if (active) {
        const rows = (data ?? []) as Array<{ offer: ScoredOffer }>
        setFavorites(rows.map((row) => row.offer))
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [user])

  const isFavorite = useCallback(
    (productUrl: string) => favorites.some((o) => o.productUrl === productUrl),
    [favorites],
  )

  const toggle = useCallback(
    async (offer: ScoredOffer) => {
      if (!user) return
      const url = offer.productUrl
      const already = favorites.some((o) => o.productUrl === url)
      if (already) {
        setFavorites((f) => f.filter((o) => o.productUrl !== url)) // optimistic
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('offer->>productUrl', url)
        if (error) {
          setFavorites((f) =>
            f.some((o) => o.productUrl === url) ? f : [...f, offer],
          ) // revert on failure
        }
      } else {
        setFavorites((f) =>
          f.some((o) => o.productUrl === url) ? f : [...f, offer],
        ) // optimistic, deduped
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, offer })
        if (error) setFavorites((f) => f.filter((o) => o.productUrl !== url))
      }
    },
    [user, favorites],
  )

  const value = useMemo<FavoritesContextValue>(
    () => ({ enabled: Boolean(user), favorites, isFavorite, toggle }),
    [user, favorites, isFavorite, toggle],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return ctx
}
