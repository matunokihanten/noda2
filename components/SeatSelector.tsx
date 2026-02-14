
import React from 'react';
import { SeatPreference } from '../types';

interface SeatSelectorProps {
  value: SeatPreference;
  onChange: (val: SeatPreference) => void;
}

const SEATS: SeatPreference[] = ['どこでも', 'カウンター', 'テーブル', 'お座敷'];

const SeatSelector: React.FC<SeatSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {SEATS.map(seat => (
        <button
          key={seat}
          onClick={() => onChange(seat)}
          className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${
            value === seat
              ? 'bg-red-800 text-white border-red-900 shadow-inner'
              : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
          }`}
        >
          {seat}
        </button>
      ))}
    </div>
  );
};

export default SeatSelector;
