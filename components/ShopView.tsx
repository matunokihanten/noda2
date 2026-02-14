
import React, { useState } from 'react';
import { AppState, Guest, SeatPreference } from '../types';
import SeatSelector from './SeatSelector';
import { playArrivalSound } from '../utils/audio';

interface ShopViewProps {
  state: AppState;
  onRegister: (data: any) => Guest;
  onUpdateStatus: (id: string, updates: Partial<Guest>) => void;
}

const ShopView: React.FC<ShopViewProps> = ({ state, onRegister, onUpdateStatus }) => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pref, setPref] = useState<SeatPreference>('どこでも');
  const [showTicket, setShowTicket] = useState<Guest | null>(null);

  const canSubmit = adults > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    // 仮のID生成予測
    const nextId = `S-${state.nextNumber}`;
    if (confirm(`${nextId} 番で受付します。よろしいですか？`)) {
      const g = onRegister({ type: 'shop', adults, children, infants, pref });
      setShowTicket(g);
      // 入力リセット
      setAdults(2);
      setChildren(0);
      setInfants(0);
      setPref('どこでも');
    }
  };

  const handleArrival = (id: string) => {
    onUpdateStatus(id, { arrived: true, arrivedTime: new Date().toLocaleTimeString('ja-JP') });
    playArrivalSound();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="bg-red-900 text-white p-4 text-center shadow-lg">
        <h1 className="text-3xl font-black">🏪 松乃木飯店 店舗受付</h1>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* 左側：入力エリア */}
        <div className="w-1/3 bg-white rounded-3xl shadow-xl flex flex-col border border-gray-200">
          <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
            <h2 className="text-2xl font-black text-red-900 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-user-plus"></i> 新規受付
            </h2>

            <div className="space-y-6">
              <Counter label="大人 (中学生以上)" value={adults} onChange={setAdults} min={1} icon="fa-person" />
              <Counter label="子供 (小学生)" value={children} onChange={setChildren} icon="fa-child" />
              <Counter label="幼児 (未就学児)" value={infants} onChange={setInfants} icon="fa-baby" />

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">🪑 座席のご希望</label>
                <SeatSelector value={pref} onChange={setPref} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || !state.isAccepting}
              className={`w-full py-6 rounded-2xl text-2xl font-black shadow-lg transition-all ${
                canSubmit && state.isAccepting
                  ? 'bg-red-800 text-white hover:bg-red-700 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!state.isAccepting ? '受付停止中' : '✓ 受付確定'}
            </button>
          </div>
        </div>

        {/* 右側：待ち状況エリア */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl flex flex-col border border-gray-200">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-red-900">📋 現在の待ち状況</h2>
            <div className="text-xl font-bold bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-red-600">{state.queue.length}</span> 組待ち
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {state.queue.length === 0 ? (
                <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                  <i className="fa-solid fa-people-group text-6xl mb-4"></i>
                  <p className="text-xl font-bold">お待ちの方はいません</p>
                </div>
              ) : (
                state.queue.map(guest => (
                  <div 
                    key={guest.displayId} 
                    onClick={() => !guest.arrived && handleArrival(guest.displayId)}
                    className={`p-4 rounded-2xl border-4 transition-all cursor-pointer relative ${
                      guest.called ? 'border-orange-400 bg-orange-50 animate-pulse-orange' : 
                      guest.arrived ? 'border-green-400 bg-green-50' :
                      guest.absent ? 'border-red-200 bg-gray-50 opacity-60' :
                      'border-gray-100 bg-white hover:border-red-200'
                    }`}
                  >
                    <div className="text-3xl font-black text-red-900 text-center mb-2">{guest.displayId}</div>
                    <div className="text-sm font-bold text-gray-500 flex justify-around">
                      <span>大:{guest.adults}</span>
                      <span>子:{guest.children}</span>
                      <span>幼:{guest.infants}</span>
                    </div>
                    <div className="text-center mt-2 font-black text-blue-800 bg-blue-50 py-1 rounded-lg">
                      {guest.pref}
                    </div>
                    {guest.called && (
                      <div className="mt-2 text-center bg-orange-500 text-white text-[10px] font-bold py-1 rounded animate-bounce">
                        お呼び出し中！
                      </div>
                    )}
                    {guest.arrived && (
                      <div className="mt-2 text-center bg-green-500 text-white text-[10px] font-bold py-1 rounded">
                        到着済み
                      </div>
                    )}
                    {guest.absent && (
                      <div className="mt-2 text-center bg-red-500 text-white text-[10px] font-bold py-1 rounded">
                        不在
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* チケット表示オーバーレイ */}
      {showTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-10 text-center shadow-2xl animate-in zoom-in-90 duration-300">
            <h3 className="text-3xl font-black text-green-600 mb-6">受付完了！</h3>
            <p className="text-gray-500 font-bold mb-2">お客様の番号は</p>
            <div className="text-9xl font-black text-red-900 my-6">{showTicket.displayId}</div>
            <p className="text-xl font-bold text-gray-700 bg-gray-100 p-4 rounded-2xl">
              大人{showTicket.adults}名様、{showTicket.pref}
            </p>
            <button 
              onClick={() => setShowTicket(null)}
              className="mt-10 w-full py-5 bg-gray-800 text-white text-2xl font-black rounded-2xl hover:bg-gray-900 transition-all"
            >
              次の方へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Counter: React.FC<{ label: string; value: number; onChange: (v: number) => void; min?: number; icon: string }> = ({ label, value, onChange, min = 0, icon }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <div className="flex items-center gap-2 mb-3 text-gray-700 font-black">
      <i className={`fa-solid ${icon}`}></i> {label}
    </div>
    <div className="flex items-center justify-between gap-4">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-400 hover:border-red-300 active:scale-95 transition-all shadow-sm"
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <span className="text-5xl font-black text-red-900 w-16 text-center">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-400 hover:border-red-300 active:scale-95 transition-all shadow-sm"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
);

export default ShopView;
