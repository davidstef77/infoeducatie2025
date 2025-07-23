// src/pages/ForYou.js (or wherever your file is)

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your page components
import ExplorePage from "./ForYou/explore";
import ForYouPage from "./ForYou/fyppage";

// 1. Define tabs as a data structure for scalability
const tabs = [
  { id: 'fyp', label: 'Pentru Tine', component: <ForYouPage /> },
  { id: 'explore', label: 'Explorează', component: <ExplorePage /> },
];

export default function ForYou() {
  // Use a string for state - more descriptive and scalable than a boolean
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // 2. Define styles once to keep the JSX clean (DRY principle)
  const baseButtonClasses = "px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2";
  const activeClasses = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200/60";

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 3. Render buttons dynamically from the `tabs` array */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex space-x-1 bg-white/50 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-200"
            role="tablist" // Accessibility improvement
            aria-label="Navigare conținut"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${baseButtonClasses} ${activeTab === tab.id ? activeClasses : inactiveClasses}`}
                role="tab" // Accessibility improvement
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Animate content switching for a better UX */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // The key tells AnimatePresence which component is active
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeComponent}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}