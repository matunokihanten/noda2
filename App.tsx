import React, { useState } from 'react';
import { useQueueSystem } from './hooks/useQueueSystem';
// { } を外してインポートします
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import { Users, LayoutDashboard, UtensilsCrossed } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const { 
    state, 
    registerGuest, 
    updateGuestStatus, 
    completeGuest, 
    setAccepting,
    removeGuest 
  } = useQueueSystem();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <nav className="bg-white border-b mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('customer')}
                className={`flex items-center px-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'customer'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                お客様用画面
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center px-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                店側管理画面
              </button>
            </div>
            <div className="flex items-center text-red-600 font-bold">
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              <span>松乃木飯店 順番待ち</span>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === 'customer' ? (
          <CustomerView 
            onSubmit={async (data: any) => {
              await registerGuest(data);
            }} 
            isAccepting={state.isAccepting} 
          />
        ) : (
          <AdminView
            queue={state.queue}
            stats={state.stats}
            isAccepting={state.isAccepting}
            onUpdateStatus={updateGuestStatus}
            onComplete={completeGuest}
            onToggleAccepting={() => setAccepting(!state.isAccepting)}
            onRemove={removeGuest}
          />
        )}
      </main>
    </div>
  );
}

export default App;
