import React from 'react';
import { SeatPreference } from '../types';

interface SeatSelectorProps {
  value: SeatPreference;
  onChange: (value: SeatPreference) => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({ value, onChange }) => {
  const options: { value: SeatPreference; label: string }[] = [
    { value: 'any', label: 'どこでも' },
    { value: 'table', label: 'テーブル' },
    { value: 'counter', label: 'お座敷' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`py-2 px-4 rounded-lg border-2 font-medium ${
            value === option.value
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
