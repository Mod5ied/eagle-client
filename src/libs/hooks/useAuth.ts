"use client";
import { useLoginMutation, useMeQuery } from '@store/services/auth.api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { data: meData, isLoading: meLoading, refetch, isFetching: meFetching } = useMeQuery();
  const [login, loginState] = useLoginMutation();
  // After successful login redirect to products
  useEffect(() => {
    if (loginState.isSuccess) {
      router.replace('/products');
    }
  }, [loginState.isSuccess, router]);
  return {
    user: meData?.user ?? null,
    login,
    loginState,
    meLoading: meLoading || meFetching,
    refetchMe: refetch,
  };
}
