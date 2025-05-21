import { useState, useContext , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../../utils/handleLogin';
import AuthContext from '../../context/authContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isLoggedIn, login } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/user'); // Redirecționează către /user
    }
  }, [isLoggedIn, navigate]);

  const loginHandler = async () => {
    setErrorMessage('');
    const result = await handleLogin(email, password, login, setErrorMessage);
   

    
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-900 px-4">
      <h1 className="text-white text-3xl font-semibold mb-6">Conectează-te</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-4 placeholder-gray-400"
      />

      <input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-4 placeholder-gray-400"
      />

      <button
        onClick={loginHandler}
        className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        Autentificare
      </button>

      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}

      {isLoggedIn && (
        <p className="text-green-500 mt-4">Te-ai conectat cu succes!</p>
        
      )}
      <h2 onClick={() => navigate('/register')} className="text-blue-500 mt-4 cursor-pointer">
    Nu ai un cont?
  </h2>

     
    </div>
  );
}
