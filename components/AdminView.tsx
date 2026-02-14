import React from 'react';
import { Guest, Stats } from '../types';

interface AdminViewProps {
  queue: Guest[];
  stats: Stats;
  isAccepting: boolean;
  onUpdateStatus: (displayId: string, updates: Partial<Guest>) => Promise<void>;
  onComplete: (displayId: string) => Promise<void>;
  onToggleAccepting: () => void;
  onRemove: (displayId: string) => Promise<void>;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  queue, stats, isAccepting, onUpdateStatus, onComplete, onToggleAccepting, onRemove 
}) => {
  return (
    <div className="space-y-6">
      {/* 状況サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-xs mb-1">待ち組数</p>
          <p className="text-2xl font-bold text-gray-800">{queue.length}組</p>
        </div>
        <button 
          onClick={onToggleAccepting}
          className={`p-4 rounded-xl shadow-sm border font-bold ${
            isAccepting ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {isAccepting ? '受付中' : '停止中'}
        </button>
      </div>

      {/* 待ち一覧 */}
      <div className="space-y-3">
        {queue.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            現在、お待ちのお客様はいません
          </div>
        ) : (
          queue.map((guest) => (
            <div key={guest.displayId} className={`bg-white p-5 rounded-2xl shadow-sm border-l-8 flex justify-between items-center ${
              guest.status === 'calling' ? 'border-yellow-400' : 'border-red-500'
            }`}>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-3xl font-black text-gray-800">{guest.displayId}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    guest.status === 'calling' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {guest.status === 'calling' ? '呼び出し中' : '待ち'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {guest.adults}大 {guest.children}子 {guest.infants}幼 | {guest.pref === 'any' ? '指定なし' : guest.pref === 'table' ? 'テ' : '座'}
                </p>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => onUpdateStatus(guest.displayId, { status: 'calling' })}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold"
                >
                  呼出
                </button>
                <button 
                  onClick={() => onComplete(guest.displayId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
                >
                  案内
                </button>
                <button 
                  onClick={() => onRemove(guest.displayId)}
                  className="bg-gray-200 text-gray-500 px-3 py-2 rounded-xl"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminView;
