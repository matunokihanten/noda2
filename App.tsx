
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
    setAccepting,
    resetStats 
  } = useQueueSystem();

  const [currentView, setCurrentView] = useState<'customer' | 'shop' | 'admin'>('customer');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('/shop')) setCurrentView('shop');
      else if (hash.includes('/admin')) setCurrentView('admin');
      else setCurrentView('customer');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    </div>
  );
};

export default App;
