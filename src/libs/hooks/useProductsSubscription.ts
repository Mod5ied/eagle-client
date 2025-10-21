"use client";
import { useEffect, useRef } from 'react';
import { subscribeProducts } from '@firebase/products.repo';
import { useDispatch } from 'react-redux';
import { productsUpserted, productsRemoved, productsListenerReset } from '@store/slices/products.slice';

// Singleton guard to prevent multiple Firestore listeners.
let productsListenerActive = false;
let productsUnsub: (() => void) | null = null;

export function useProductsSubscription(active: boolean) {
  const dispatch = useDispatch();
  const mountedRef = useRef(false);
  const firstSnapshotRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    if (!active) return;
    // Attach only once.
    if (!productsListenerActive) {
      productsListenerActive = true;
      productsUnsub = subscribeProducts((products, removed) => {
        if (products.length) {
          dispatch(productsUpserted(products));
        } else if (firstSnapshotRef.current) {
          // Clear initializing state even if no products exist yet.
          dispatch(productsUpserted([]));
        }
        if (removed.length) dispatch(productsRemoved(removed));
        if (firstSnapshotRef.current) firstSnapshotRef.current = false;
      }, (error) => {
        // Clear initializing on error so fallback can trigger
        if (firstSnapshotRef.current) {
          dispatch(productsUpserted([]));
          firstSnapshotRef.current = false;
        }
      });
    }
    return () => {
      // On full unmount of last subscriber, we keep listener until explicit reset (e.g. logout).
      mountedRef.current = false;
    };
  }, [active, dispatch]);
}

// Explicit reset (e.g., call on logout) to remove listener and clear slice.
export function resetProductsListener(dispatch: any) {
  if (productsUnsub) {
    productsUnsub();
    productsUnsub = null;
  }
  productsListenerActive = false;
  dispatch(productsListenerReset());
}
