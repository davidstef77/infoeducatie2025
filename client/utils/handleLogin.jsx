import { Login } from './auth';
import { useContext } from 'react';
import AuthContext from '../context/authContext'; // sau calea ta reală

export const handleLogin = async (email, password, login, setErrorMessage) => {
  if (!email || !password) {
    setErrorMessage('Te rugăm să completezi ambele câmpuri.');
    return { success: false };
  }

  try {
    const data = await Login(email, password);

    if (data.error) {
      setErrorMessage(data.error);
      return { success: false };
    } else {
      login(data); // Folosești login din context
      setErrorMessage('');
      return { success: true };
    }
  } catch (error) {
    console.error(error);
    setErrorMessage('A apărut o eroare. Încearcă din nou.');
    return { success: false };
  }
};