
import React, { useEffect, useState } from 'react';
import { useQueueSystem } from './hooks/useQueueSystem';
import AdminView from './components/AdminView';
import ShopView from './components/ShopView';
import CustomerView from './components/CustomerView';

const App: React.FC = () => {
  const { 
    state, 
    registerGuest, 
    updateGuestStatus, 
    completeGuest, 
    removeGuest,
    setAccepting,
    resetStats 
  } = useQueueSystem();

  const [currentView, setCurrentView] = useState<'customer' | 'shop' | 'admin'>('customer');

  useEffect(() => {
    // 擬似的なハッシュルーティング
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/shop') setCurrentView('shop');
      else if (hash === '#/admin') setCurrentView('admin');
      else setCurrentView('customer');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初回チェック

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 画面のナビゲーションバー（デモ用）
  const renderNav = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex bg-black/80 backdrop-blur text-white px-2 py-2 rounded-2xl gap-1 z-[100] shadow-2xl scale-90 md:scale-100">
      <button 
        onClick={() => window.location.hash = '/'} 
        className={`px-4 py-2 rounded-xl text-sm font-bold ${currentView === 'customer' ? 'bg-red-800' : 'hover:bg-white/10'}`}
      >
        <i className="fa-solid fa-mobile-screen mr-2"></i> 顧客
      </button>
      <button 
        onClick={() => window.location.hash = '/shop'} 
        className={`px-4 py-2 rounded-xl text-sm font-bold ${currentView === 'shop' ? 'bg-red-800' : 'hover:bg-white/10'}`}
      >
        <i className="fa-solid fa-tablet-screen mr-2"></i> 店舗
      </button>
      <button 
        onClick={() => window.location.hash = '/admin'} 
        className={`px-4 py-2 rounded-xl text-sm font-bold ${currentView === 'admin' ? 'bg-red-800' : 'hover:bg-white/10'}`}
      >
        <i className="fa-solid fa-gear mr-2"></i> 管理
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentView === 'customer' && <CustomerView state={state} onRegister={registerGuest} />}
      {currentView === 'shop' && <ShopView state={state} onRegister={registerGuest} onUpdateStatus={updateGuestStatus} />}
      {currentView === 'admin' && (
        <AdminView 
          state={state} 
          onUpdateStatus={updateGuestStatus} 
          onComplete={completeGuest}
          onSetAccepting={setAccepting}
          onResetStats={resetStats}
        />
      )}
      {renderNav()}
    </div>
  );
};

export default App;
