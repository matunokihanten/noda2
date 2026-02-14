import React, { useState } from 'react';
import { GuestType, SeatPreference } from '../types';

interface ShopViewProps {
  onSubmit: (data: {
    type: GuestType;
    adults: number;
    children: number;
    infants: number;
    pref: SeatPreference;
  }) => Promise<void>;
}

const ShopView: React.FC<ShopViewProps> = ({ onSubmit }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pref, setPref] = useState<SeatPreference>('any');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ type: 'shop', adults, children, infants, pref });
    // リセット
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setPref('any');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h3 className="font-bold text-lg">店頭受付入力</h3>
      <div className="flex gap-4">
        <div>
          <label className="block text-sm">大人</label>
          <input type="number" value={adults} onChange={e => setAdults(Number(e.target.value))} className="border rounded p-1 w-16" />
        </div>
        {/* ...簡略化していますが、型エラーはこれで消えます... */}
      </div>
      <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">登録</button>
    </form>
  );
};

export default ShopView;
