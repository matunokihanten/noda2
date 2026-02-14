import React, { useState } from 'react';
import { GuestType, SeatPreference } from '../types';

interface CustomerViewProps {
  onSubmit: (data: {
    type: GuestType;
    adults: number;
    children: number;
    infants: number;
    pref: SeatPreference;
  }) => Promise<void>;
  isAccepting: boolean;
}

const CustomerView: React.FC<CustomerViewProps> = ({ onSubmit, isAccepting }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pref, setPref] = useState<SeatPreference>('any');

  if (!isAccepting) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ただいま受付停止中です</h2>
        <p className="text-gray-600">恐れ入りますが、しばらく経ってから再度お試しください。</p>
      </div>
    );
  }

  const preferences: { value: SeatPreference; label: string }[] = [
    { value: 'any', label: 'どちらでも' },
    { value: 'table', label: 'テーブル' },
    { value: 'counter', label: '座敷' } // 元のコードの「座敷」をcounterとして扱います
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">📝</span>
        順番待ちの受付
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-500 mb-2">大人</label>
            <div className="flex items-center justify-center space-x-3">
              <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-gray-300">-</button>
              <span className="text-xl font-bold">{adults}</span>
              <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-gray-300">+</button>
            </div>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-500 mb-2">子供</label>
            <div className="flex items-center justify-center space-x-3">
              <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-gray-300">-</button>
              <span className="text-xl font-bold">{children}</span>
              <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-gray-300">+</button>
            </div>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-500 mb-2">幼児</label>
            <div className="flex items-center justify-center space-x-3">
              <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-8 h-8 rounded-full border border-gray-300">-</button>
              <span className="text-xl font-bold">{infants}</span>
              <button onClick={() => setInfants(infants + 1)} className="w-8 h-8 rounded-full border border-gray-300">+</button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">ご希望のお席</label>
          <div className="grid grid-cols-3 gap-3">
            {preferences.map((p) => (
              <button
                key={p.value}
                onClick={() => setPref(p.value)}
                className={`py-3 px-2 rounded-xl border-2 font-medium transition-all ${
                  pref === p.value ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-500'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSubmit({ type: 'web', adults, children, infants, pref })}
          className="w-full bg-red-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
        >
          この内容で受付する
        </button>
      </div>
    </div>
  );
};

export default CustomerView;
