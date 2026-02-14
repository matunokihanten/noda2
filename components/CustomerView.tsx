
import React, { useState, useEffect } from 'react';
import { AppState, Guest, SeatPreference } from '../types';
import SeatSelector from './SeatSelector';
import { playCallSound } from '../utils/audio';

interface CustomerViewProps {
  state: AppState;
  onRegister: (data: any) => Guest;
}

const CustomerView: React.FC<CustomerViewProps> = ({ state, onRegister }) => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pref, setPref] = useState<SeatPreference>('どこでも');
  const [myNumber, setMyNumber] = useState<string | null>(() => localStorage.getItem('my_number_display_id'));

  useEffect(() => {
    // 自分の番号がある場合、それがキュー内に存在するか確認
    if (myNumber) {
      const exists = state.queue.find(g => g.displayId === myNumber);
      if (!exists) {
        // リセット後や案内終了後はクリア
        setMyNumber(null);
        localStorage.removeItem('my_number_display_id');
      } else if (exists.called) {
        // 呼び出し音を鳴らす（ブラウザ制限で初動ユーザー操作が必要）
        // 実際の実装ではユーザーが一度どこかタップした後に有効
        try {
            playCallSound();
        } catch(e) {}
      }
    }
  }, [state.queue, myNumber]);

  const handleRegister = () => {
    if (!state.isAccepting) return;
    const g = onRegister({ type: 'web', adults, children, infants, pref });
    setMyNumber(g.displayId);
    localStorage.setItem('my_number_display_id', g.displayId);
  };

  const handleCancel = () => {
    if (confirm('順番待ちをキャンセルしますか？')) {
      setMyNumber(null);
      localStorage.removeItem('my_number_display_id');
      // ここで本来はサーバー側に削除リクエストを送る
    }
  };

  if (myNumber) {
    const myGuest = state.queue.find(g => g.displayId === myNumber);
    const pos = state.queue.findIndex(g => g.displayId === myNumber) + 1;

    return (
      <div className="min-h-screen bg-red-900 text-white p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white text-gray-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
          <p className="font-bold text-red-800 text-lg mb-2">松乃木飯店 順番待ちチケット</p>
          <p className="text-gray-400 text-xs font-bold mb-4">ブラウザを閉じても番号は保存されます</p>
          
          <div className="bg-red-50 border-2 border-red-100 rounded-3xl py-10 my-6 relative overflow-hidden">
             <div className="text-gray-500 font-black text-xs uppercase tracking-widest mb-2">現在の受付番号</div>
             <div className="text-8xl font-black text-red-900">{myNumber}</div>
             {myGuest?.called && (
                <div className="absolute top-2 right-2 rotate-12 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded animate-bounce shadow-lg">
                    📢 お呼び出し中
                </div>
             )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-gray-400 font-bold mb-1">現在の待ち順</p>
              <p className="text-3xl font-black text-gray-800">あと <span className="text-red-600 text-4xl">{pos}</span> 組</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-4 rounded-2xl text-left">
                <p className="text-xs text-gray-400 font-bold mb-1">人数</p>
                <p className="font-bold text-sm">大{myGuest?.adults} 子{myGuest?.children} 幼{myGuest?.infants}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-left">
                <p className="text-xs text-gray-400 font-bold mb-1">ご希望</p>
                <p className="font-bold text-sm">{myGuest?.pref}</p>
              </div>
            </div>
          </div>

          {myGuest?.called ? (
            <div className="mt-8 p-6 bg-orange-500 text-white rounded-3xl font-black text-xl animate-pulse shadow-lg">
                お席が用意できました！<br/>店舗へお入りください
            </div>
          ) : (
            <div className="mt-8 text-gray-400 text-sm font-bold flex flex-col gap-4">
                <p>順番が近づきましたら<br/>店内のスタッフにお伝えください</p>
                <button onClick={handleCancel} className="text-red-300 hover:text-red-500">
                    受付をキャンセルする
                </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-red-900 text-white p-6 text-center shadow-md">
        <h1 className="text-2xl font-black tracking-tight">🏮 松乃木飯店</h1>
        <p className="text-red-100 text-sm font-bold mt-1 opacity-80">オンライン順番待ち受付</p>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-red-50 text-red-800 rounded-full font-black text-sm mb-4">
              {state.queue.length} 組がお待ちです
            </div>
            <h2 className="text-2xl font-black text-gray-800">受付フォーム</h2>
          </div>

          {!state.isAccepting && (
            <div className="bg-red-100 text-red-700 p-4 rounded-2xl font-bold text-center mb-6">
              現在、店頭が大変混み合っているため<br/>オンライン受付を一時停止しています。
            </div>
          )}

          <div className="space-y-6">
            <Counter label="大人 (中学生以上)" value={adults} onChange={setAdults} min={1} icon="fa-person" />
            <div className="grid grid-cols-2 gap-4">
               <CounterCompact label="子供" value={children} onChange={setChildren} icon="fa-child" />
               <CounterCompact label="幼児" value={infants} onChange={setInfants} icon="fa-baby" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">🪑 座席のご希望</label>
                <SeatSelector value={pref} onChange={setPref} />
            </div>

            <button
              onClick={handleRegister}
              disabled={!state.isAccepting}
              className={`w-full py-5 rounded-2xl text-xl font-black shadow-lg transition-all ${
                state.isAccepting ? 'bg-red-800 text-white hover:bg-red-700 active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              順番待ちに登録する
            </button>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-400 text-xs font-bold">
        © 松乃木飯店 All Rights Reserved.
      </footer>
    </div>
  );
};

const Counter: React.FC<{ label: string; value: number; onChange: (v: number) => void; min?: number; icon: string }> = ({ label, value, onChange, min = 0, icon }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm">
      <i className={`fa-solid ${icon}`}></i> {label}
    </div>
    <div className="flex items-center justify-between">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xl font-black text-gray-400 shadow-sm"
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <span className="text-3xl font-black text-red-900">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xl font-black text-gray-400 shadow-sm"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
);

const CounterCompact: React.FC<{ label: string; value: number; onChange: (v: number) => void; icon: string }> = ({ label, value, onChange, icon }) => (
    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-1 mb-2 text-gray-700 font-bold text-[10px]">
        <i className={`fa-solid ${icon}`}></i> {label}
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-black text-gray-400 shadow-sm">
          -
        </button>
        <span className="text-xl font-black text-red-900">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-black text-gray-400 shadow-sm">
          +
        </button>
      </div>
    </div>
);

export default CustomerView;
