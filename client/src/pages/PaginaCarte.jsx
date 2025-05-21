import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/authContext';
import Navbar from '../components/NavBar';
import { getCitatesiCartiSalvate } from "../../utils/api/userApi";
import { getAutorById } from '../../utils/api/autorApi';

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('citate');
  const [savedCitate, setSavedCitate] = useState([]);
  const [savedCarti, setSavedCarti] = useState([]);
  const [autoriMap, setAutoriMap] = useState({}); // map autorId -> autorData

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('user-data');
    logout();
    navigate('/login', { replace: true });
  };

  const fetchSavedData = async (userId) => {
    try {
      const data = await getCitatesiCartiSalvate(userId);
      setSavedCitate(data.quotes || []);
      setSavedCarti(data.carti || []);

      // Obține autorii pentru cărți
      if (data.carti?.length > 0) {
        const autorIds = data.carti
          .map(carte => carte.Autor)
          .filter(id => id); // elimină undefined/null

        // elimină duplicatele
        const uniqueAutorIds = [...new Set(autorIds)];

        // încarcă toți autorii
        const autoriDataArr = await Promise.all(
          uniqueAutorIds.map(id => getAutorById(id))
        );

        // construiește un map id -> autorData
        const autoriMapObj = {};
        uniqueAutorIds.forEach((id, i) => {
          autoriMapObj[id] = autoriDataArr[i];
        });

        setAutoriMap(autoriMapObj);
      }

    } catch (error) {
      console.error("Eroare la încărcarea datelor salvate:", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user-data');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed?.user) throw new Error("Date utilizator invalide");
        setUser(parsed.user);

        await fetchSavedData(parsed.user._id);
      } catch (err) {
        console.error("Eroare la parse user:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Profil */}
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

        {/* Conținut Taburi */}
        <div className="text-white">
          {activeTab === 'citate' && (
            <div className="space-y-4">
              {savedCitate.length > 0 ? (
                savedCitate.map((citat, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-xl shadow">
                    <p className="text-lg italic">"{citat.text}"</p>
                    {citat.autor && (
                      <p className="text-right text-sm text-gray-400 mt-2">– {citat.autor}</p>
                    )}
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
                savedCarti.map((carte, index) => {
                  const autorData = autoriMap[carte.Autor];
                  return (
                    <div key={index} className="bg-gray-800 p-4 rounded-xl shadow">
                      <h2 className="text-xl font-bold">{carte.Titlu}</h2>
                      {autorData && (
                        <p className="text-sm text-gray-400">
                          de {autorData.prenume} {autorData.nume}
                        </p>
                      )}
                      {!autorData && carte.Autor && (
                        <p className="text-sm text-gray-400">de {carte.Autor}</p> // fallback: id autor
                      )}
                      {carte.Descriere && <p className="mt-2 text-gray-300">{carte.Descriere}</p>}
                    </div>
                  );
                })
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
