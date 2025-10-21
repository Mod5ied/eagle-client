"use client";
import { Button } from '@components/ui/button';
import { useLogoutMutation } from '@store/services/auth.api';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@store/slices/auth.slice';
import { resetProductsListener } from '@hooks/useProductsSubscription';
import { useRouter } from 'next/navigation';
import { useToast } from '@components/ui/toast';
import { useState } from 'react';

export function LogoutButton() {
  const [doLogout, state] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  
  const handle = async () => {
    setIsLoggingOut(true);
    
    // Add blur overlay to page
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
    `;
    overlay.textContent = 'Logging out...';
    document.body.appendChild(overlay);
    
    // Small delay to show the blur effect
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      await doLogout().unwrap();
    } catch {
    }
    
    // Client side cleanup regardless of server response
    resetProductsListener(dispatch);
    dispatch(logout());
    
    // Force hard navigation to trigger middleware re-evaluation
    window.location.href = '/login';
  };
  return (
    <Button
      aria-label="Logout"
      variant="outline"
      size="sm"
      disabled={state.isLoading || isLoggingOut}
      onClick={handle}
      className="w-24 gap-1"
    >
      <LogOut size={16} />
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
