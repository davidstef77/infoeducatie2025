import React, { useState } from 'react';
import { Register } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [prenume, setPrenume] = useState('');
  const [nume, setNume] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [preferinteGen, setPreferinteGen] = useState('');
  const [imagine, setImagine] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const genuri = [
    "Stoicism",
      "Dezvoltare Personala",
      "Motivational",
      "Business",
      "Spiritualitate",
      "Istorie",
      "Religie",
      "Filosofie",
      "Politica",
      "Psihologie",
      "Educatie",
      "Romantism",
      "Literatura",
      "Poezie",
      "Drama",
      "Comedie"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagine(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password || !preferinteGen || !userName || !nume || !prenume) {
      setErrorMessage('Toate câmpurile sunt obligatorii.');
      return;
    }

    if (email.length < 5 || password.length < 5) {
      setErrorMessage('Emailul și parola trebuie să aibă cel puțin 5 caractere.');
      return;
    }

    try {
      const data = await Register(userName, prenume, nume, email, password, preferinteGen, imagine);
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setSuccessMessage('Înregistrare reușită!');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('A apărut o eroare. Încearcă din nou.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Creează cont</h2>

        <div className="flex justify-center mb-4">
          <label className="cursor-pointer w-28 h-28 rounded-full border-2 border-gray-600 overflow-hidden flex items-center justify-center bg-gray-700">
            {imagine ? (
              <img src={imagine} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">Adaugă poză</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {errorMessage && <p className="text-red-500 text-center mb-3">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-3">{successMessage}</p>}

        <input
          className="w-full mb-3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          placeholder="Parolă"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full mb-3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          placeholder="Nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
        />
        <input
          className="w-full mb-3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          placeholder="Prenume"
          value={prenume}
          onChange={(e) => setPrenume(e.target.value)}
        />
        <input
          className="w-full mb-3 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <select
          className="w-full mb-4 p-3 rounded-md bg-gray-700 text-white"
          value={preferinteGen}
          onChange={(e) => setPreferinteGen(e.target.value)}
        >
          <option value="">Selectează un gen preferat</option>
          {genuri.map((gen) => (
            <option key={gen} value={gen}>{gen}</option>
          ))}
        </select>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          onClick={handleRegister}
        >
          Înregistrează-te
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Ai deja un cont?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Conectează-te
          </span>
        </p>
      </div>
    </div>
  );
}
