// app/index.tsx
import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import LoadingPage from './screen/loadingPage';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  return null; // Nu este necesar să returnezi altceva
}
