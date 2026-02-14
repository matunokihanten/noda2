
import React from 'react';
import { AppState, Guest } from '../types';
import { playCallSound } from '../utils/audio';

interface AdminViewProps {
  state: AppState;
  onUpdateStatus: (id: string, updates: Partial<Guest>) => void;
  onComplete: (id: string) => void;
  onSetAccepting: (status: boolean) => void;
  onResetStats: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ state, onUpdateStatus, onComplete, onSetAccepting, onResetStats }) => {
  const handleCall = (guest: Guest) => {
    if (confirm(`【${guest.displayId}】様をお呼び出しします。よろしいですか？`)) {
      onUpdateStatus(guest.displayId, { called: true, calledTime: new Date().toLocaleTimeString('ja-JP') });
      playCallSound();
    }
  };

  const handleAbsent = (guest: Guest) => {
    if (confirm(`【${guest.displayId}】様を不在に設定します。よろしいですか？`)) {
      onUpdateStatus(guest.displayId, { absent: true, absentTime: new Date().toLocaleTimeString('ja-JP') });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800">🏮 松乃木飯店 管理システム</h1>
          <p className="text-gray-500 font-bold mt-1">リアルタイムで順番待ち状況を更新しています</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => onSetAccepting(!state.isAccepting)}
            className={`px-8 py-4 rounded-2xl font-black text-white transition-all shadow-xl active:scale-95 ${state.isAccepting ? 'bg-orange-600' : 'bg-green-600'}`}
          >
            {state.isAccepting ? '新規受付を停止する' : '受付を開始する'}
          </button>
          <button 
            onClick={onResetStats}
            className="px-8 py-4 rounded-2xl font-black bg-white text-gray-400 border border-gray-200 hover:bg-gray-100 transition-all shadow-sm"
          >
            本日のデータ全削除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: '現在お待ちの組数', value: `${state.queue.length}組`, color: 'text-red-600', bg: 'bg-red-50' },
          { label: '本日の総受付数', value: `${state.stats.totalToday}組`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'ご案内済み', value: `${state.stats.completedToday}組`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '平均待ち時間', value: `${state.stats.averageWaitTime}分`, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white shadow-sm text-center`}>
            <p className="text-sm text-gray-500 font-black mb-1">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-100">
                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">受付番号</th>
                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">受付時刻 / 状態</th>
                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">ご来店人数</th>
                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">ご希望の席</th>
                <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-xs text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {state.queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-black text-xl italic">
                    現在、お待ちのお客様はいません
                  </td>
                </tr>
              ) : (
                state.queue.map(guest => (
                  <tr key={guest.displayId} className={`transition-all ${guest.called ? 'bg-orange-50/50' : 'hover:bg-gray-50'} ${guest.absent ? 'opacity-40 grayscale' : ''}`}>
                    <td className="px-8 py-6">
                      <span className="text-3xl font-black text-red-900">{guest.displayId}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-gray-700">{guest.time}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {guest.arrived && <span className="text-[10px] font-black bg-green-600 text-white px-2 py-0.5 rounded-full">店頭到着済み</span>}
                        {guest.called && <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full">呼び出し済み</span>}
                        {guest.absent && <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">不在</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-600">
                      大人:{guest.adults} / 子:{guest.children} / 幼:{guest.infants}
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-block px-4 py-1 rounded-xl bg-blue-50 text-blue-700 font-black">
                        {guest.pref}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={() => handleCall(guest)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all shadow-md active:scale-95 ${guest.called ? 'bg-white text-gray-300 border border-gray-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                          disabled={guest.called}
                        >
                          <i className="fa-solid fa-bullhorn"></i>
                          呼び出す
                        </button>
                        <button 
                          onClick={() => handleAbsent(guest)}
                          className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all shadow-md active:scale-95"
                        >
                          <i className="fa-solid fa-user-slash"></i>
                          不在
                        </button>
                        <button 
                          onClick={() => onComplete(guest.displayId)}
                          className="px-8 py-3 bg-red-800 text-white rounded-2xl font-black hover:bg-red-900 transition-all shadow-xl active:scale-95"
                        >
                          ご案内完了
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
