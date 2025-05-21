import React, { useState } from 'react';
import { XMarkIcon, PlusCircleIcon, BookOpenIcon, UserCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import AddQuoteModal from './AddQuoteModal';
import AddAutorModal from './AddAutorModal';
import AddCarteModal from './AddCarteModal';

export default function AddModal({ onClose }) {
  const [modalType, setModalType] = useState(null); // 'quote', 'author', 'book' sau null

  const closeAllModals = () => setModalType(null);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Adaugă conținut nou
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <ActionButton
              onClick={() => setModalType('quote')}
              color="from-purple-500 to-pink-500"
              icon={<DocumentTextIcon />}
              text="Citat nou"
            />

            <ActionButton
              onClick={() => setModalType('author')}
              color="from-blue-500 to-cyan-500"
              icon={<UserCircleIcon />}
              text="Autor nou"
            />

            <ActionButton
              onClick={() => setModalType('book')}
              color="from-green-500 to-emerald-500"
              icon={<BookOpenIcon />}
              text="Carte nouă"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2.5 text-gray-300 hover:text-white rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all duration-200 border border-gray-600/50 flex items-center justify-center gap-2"
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="font-medium">Anulează</span>
          </button>
        </div>
      </div>

      {/* Modale condiționale */}
      {modalType === 'quote' && <AddQuoteModal onClose={closeAllModals} />}
      {modalType === 'author' && <AddAutorModal onClose={closeAllModals} />}
      {modalType === 'book' && <AddCarteModal onClose={closeAllModals} />}
    </>
  );
}

const ActionButton = ({ onClick, color, icon, text }) => (
  <button
    onClick={onClick}
    className={`group relative w-full px-4 py-3.5 rounded-xl bg-gradient-to-r ${color} hover:shadow-lg transition-all duration-250 hover:scale-[1.02] active:scale-95`}
  >
    <div className="flex items-center justify-center gap-3">
      <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
        {React.cloneElement(icon, { className: `w-5 h-5 text-white` })}
      </span>
      <span className="text-lg font-semibold text-white tracking-wide">{text}</span>
      <PlusCircleIcon className="w-5 h-5 ml-auto text-white/50 group-hover:text-white/80 transition-colors" />
    </div>
  </button>
);
