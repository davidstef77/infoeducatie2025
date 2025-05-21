import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/authContext';
import Navbar from '../components/NavBar';

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('citate');
  const [savedCitate, setSavedCitate] = useState([]);
const [savedCarti, setSavedCarti] = useState([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('user-data');
    logout();
    navigate('/login', { replace: true });
  };

  

  useEffect(() => {
    const storedUser = localStorage.getItem('user-data');
  
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const citateFromStorage = JSON.parse(localStorage.getItem('savedCitate')) || [];
const cartiFromStorage = JSON.parse(localStorage.getItem('savedCarti')) || [];

setSavedCitate(citateFromStorage);
console.log(setSavedCitate)
setSavedCarti(cartiFromStorage);

    try {
      const parsedData = JSON.parse(storedUser);
      if (!parsedData || !parsedData.user) {
        throw new Error("Datele utilizatorului sunt invalide.");
      }
      setUser(parsedData.user);
    } catch (err) {
      console.error("Eroare la parse user:", err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-center px-4">
        <p className="text-red-400 text-lg mb-4">⚠️ Eroare la încărcarea profilului.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
            {user.imagine ? (
              <img src={user.imagine} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              user.prenume?.[0] || 'U'
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">
              {user.prenume || 'Utilizator'} {user.nume}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-xl text-sm transition-colors text-white"
            >
              Deconectare
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-300 mb-8">
          {user.bio || 'Nu există descriere...'}
          <span className="ml-2 text-blue-400 cursor-pointer">Editează</span>
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          {[
            { key: 'citate', label: 'Citate Salvate', icon: BookmarkIcon },
            { key: 'carti', label: 'Cărți Salvate', icon: BookOpenIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 flex items-center gap-2 ${
                activeTab === key
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content on active tab (to be implemented later) */}
        <div className="text-white">
  {activeTab === 'citate' && (
    <div className="space-y-4">
      {savedCitate.length > 0 ? (
        savedCitate.map((citat, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-lg italic">"{citat.text}"</p>
            {citat.autor && <p className="text-right text-sm text-gray-400 mt-2">– {citat.autor}</p>}
          </div>
        ))
      ) : (
        <p className="text-gray-400">Nu ai salvat niciun citat.</p>
      )}
    </div>
  )}

  {activeTab === 'carti' && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {savedCarti.length > 0 ? (
        savedCarti.map((carte, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold">{carte.titlu}</h2>
            {carte.autor && <p className="text-sm text-gray-400">de {carte.autor}</p>}
            {carte.descriere && <p className="mt-2 text-gray-300">{carte.descriere}</p>}
          </div>
        ))
      ) : (
        <p className="text-gray-400">Nu ai salvat nicio carte.</p>
      )}
    </div>
  )}
</div>

      </div>
    </div>
  );
}
