import { NavLink } from 'react-router-dom';
import { BookOpenIcon, PlusCircleIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AddModal from './AddModal';

export default function Navbar() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 w-full h-15 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700 z-50 ">
        <div className="max-w-6xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full relative">
            <NavLink to="/user" className="flex flex-col items-center p-2 text-gray-300 hover:text-purple-400">
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Profil</span>
            </NavLink>

            <NavLink to="/foryou" className="flex flex-col ml-5 items-center p-2 text-gray-300 hover:text-purple-400">
              <SparklesIcon className="w-6 h-6" />
              <span className="text-xs mt-1">FYP</span>
            </NavLink>

           <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-xl hover:scale-110 transition-all"
                aria-label="Adaugă citat"
              >
                <PlusCircleIcon className="w-8 h-8 text-white" />
              </button>
            </div>

            <NavLink to="/biblioteca" className="flex flex-col items-center p-2 text-gray-300 hover:text-purple-400">
              <BookOpenIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Bibliotecă</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
