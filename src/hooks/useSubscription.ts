import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/api/subscriptions.api'
import type { OdemeData } from '@/types/subscription.types'

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionsApi.getPlans().then((r) => r.data.data),
  })
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => subscriptionsApi.getCurrent().then((r) => r.data.data),
  })
}

export function useSubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OdemeData) => subscriptionsApi.subscribe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['current-subscription'] }),
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => subscriptionsApi.cancel(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['current-subscription'] }),
  })
}
