import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import { SparklesIcon, ClockIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Bine ai venit la MindCast
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descoperă o lume a cunoașterii unde fiecare carte devine o aventură, 
            iar fiecare citat este o comoară ascunsă. Transformă lectura în experiențe memorabile.
          </p>
          
          {isLoggedIn ? (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30"
              onClick={() => navigate('/user')}
            >
              Continuă către profil
            </button>
          ) : (
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
              onClick={() => navigate('/login')}
            >
              Începe aventura
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all">
            <SparklesIcon className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Recomandări Personalizate</h3>
            <p className="text-gray-400">Descoperă cărți adaptate preferințelor tale prin AI</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all">
            <ClockIcon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lectură Eficientă</h3>
            <p className="text-gray-400">Extrage esența cărților în timp record</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all">
            <LightBulbIcon className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comunitate Activă</h3>
            <p className="text-gray-400">Dezbateri și perspective diverse din partea cititorilor</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all">
            <RocketLaunchIcon className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dezvoltare Continuă</h3>
            <p className="text-gray-400">Învață și evoluează prin challenge-uri lunare</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Alătură-te comunității noastre</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Peste 50.000 de cititori pasionați explorează deja lumea cărților într-un mod nou
          </p>
          <button 
            className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            onClick={() => navigate(isLoggedIn ? '/community' : '/signup')}
          >
            {isLoggedIn ? 'Explorează Comunitatea' : 'Înscrie-te Gratuit'}
          </button>
        </div>
      </div>
    </div>
  );
}