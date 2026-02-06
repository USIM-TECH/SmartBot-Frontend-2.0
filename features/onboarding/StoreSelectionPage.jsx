import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { INITIAL_STORES } from "../../constants";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const StoreSelectionPage = ({
  onComplete,
  selectedIds,
  setSelectedIds,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleStore = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === INITIAL_STORES.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(INITIAL_STORES.map((s) => s.id)));
  };

  const handleConfirm = () => {
    navigate("/chat");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    onLogout();
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-background-light dark:bg-[#131f1a] flex flex-col">
      <header className="w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-base">
                shopping_bag
              </span>
            </div>
            <h1 className="text-base font-bold tracking-tight text-smart-dark dark:text-white">
              SmartBot
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 pr-4 border-r border-gray-100 dark:border-white/5 h-6">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold border border-primary/20">
                  {userData?.username
                    ? userData.username.charAt(0).toUpperCase()
                    : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : "U"}
                </div>
                <span className="text-[10px] font-bold text-slate-gray/60 dark:text-gray-400 truncate max-w-[120px]">
                  {userData?.username || user.email}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-slate-gray/60 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-4 px-6 overflow-y-auto">
        <div className="max-w-[600px] w-full animate-fade-in">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-extrabold tracking-tight text-smart-dark dark:text-white mb-0.5">
              Location & Store Selection
            </h2>
            <p className="text-slate-gray/60 dark:text-gray-400 font-medium text-[11px]">
              Personalize your search results by selecting nearby retailers.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/[0.02] border border-gray-100 dark:border-white/5 p-4 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">
                  location_on
                </span>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xs font-bold text-smart-dark dark:text-white mb-0.5">
                  Enable Location Access
                </h3>
                <p className="text-slate-gray/60 dark:text-gray-400 text-[10px] leading-relaxed mb-2">
                  Allow access to your location to find stores near you
                  automatically.
                </p>
                <button
                  onClick={() => setIsLocationAllowed(true)}
                  className={`flex items-center justify-center gap-2 text-[10px] font-bold py-1.5 px-4 rounded-full transition-all ${
                    isLocationAllowed
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-primary text-white hover:bg-emerald-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    near_me
                  </span>
                  {isLocationAllowed
                    ? "Location Access Granted"
                    : "Allow Access"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-smart-dark dark:text-white">
                Nearby Stores
              </h3>
              <button
                onClick={handleSelectAll}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
              >
                {selectedIds.size === INITIAL_STORES.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="space-y-1.5">
              {INITIAL_STORES.map((store) => (
                <label
                  key={store.id}
                  className={`group relative flex items-center justify-between p-2.5 bg-white dark:bg-zinc-900 border-2 rounded-2xl cursor-pointer transition-all shadow-sm ${
                    selectedIds.has(store.id)
                      ? "border-primary"
                      : "border-transparent hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
                      <img
                        alt={store.name}
                        className="w-full h-full object-cover"
                        src={store.imageUrl}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-smart-dark dark:text-white leading-tight">
                        {store.name}
                      </p>
                      <p className="text-[8px] text-slate-gray/60 dark:text-gray-400 uppercase font-extrabold tracking-widest">
                        {store.distance} • {store.type}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(store.id)}
                      onChange={() => toggleStore(store.id)}
                      className="peer h-6 w-6 rounded-full border-gray-200 dark:border-white/10 text-primary focus:ring-transparent focus:ring-offset-0 transition-colors cursor-pointer appearance-none border checked:bg-primary"
                    />
                    {selectedIds.has(store.id) && (
                      <span className="material-symbols-outlined absolute pointer-events-none text-white text-base font-bold">
                        check
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={selectedIds.size === 0}
            onClick={handleConfirm}
            className={`w-full text-xs font-bold py-3.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] ${
              selectedIds.size === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white shadow-primary/20 hover:brightness-105"
            }`}
          >
            Confirm Selection
          </button>
        </div>
      </main>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default StoreSelectionPage;
