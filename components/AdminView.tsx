
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
    if (confirm(`${guest.displayId} を呼び出しますか？`)) {
      onUpdateStatus(guest.displayId, { called: true, calledTime: new Date().toLocaleTimeString('ja-JP') });
      playCallSound();
    }
  };

  const handleAbsent = (guest: Guest) => {
    if (confirm(`${guest.displayId} を不在にマークしますか？`)) {
      onUpdateStatus(guest.displayId, { absent: true, absentTime: new Date().toLocaleTimeString('ja-JP') });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-red-900">🏮 管理パネル</h1>
            <p className="text-gray-500 text-sm">システム状況をリアルタイム監視中</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-sm ${state.isAccepting ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {state.isAccepting ? '● 受付中' : '■ 受付停止'}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onSetAccepting(!state.isAccepting)}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md ${state.isAccepting ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {state.isAccepting ? '一時停止' : '受付開始'}
          </button>
          <button 
            onClick={onResetStats}
            className="px-6 py-3 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all shadow-md"
          >
            統計リセット
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '現在待ち組数', value: state.queue.length, color: 'text-red-800' },
          { label: '本日受付総数', value: state.stats.totalToday, color: 'text-blue-800' },
          { label: '本日案内完了', value: state.stats.completedToday, color: 'text-green-800' },
          { label: '平均待ち(分)', value: state.stats.averageWaitTime, color: 'text-orange-800' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className={`text-4xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-sm text-gray-500">番号</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-500">受付/状態</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-500">人数</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-500">希望</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-500 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {state.queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">待ち客はいません</td>
                </tr>
              ) : (
                state.queue.map(guest => (
                  <tr key={guest.displayId} className={`transition-colors ${guest.called ? 'bg-orange-50' : 'hover:bg-gray-50'} ${guest.absent ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 font-black text-xl text-red-900">{guest.displayId}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{guest.time}</div>
                      <div className="mt-1 flex gap-1">
                        {guest.arrived && <span className="text-[10px] bg-green-500 text-white px-1 rounded">到着</span>}
                        {guest.called && <span className="text-[10px] bg-orange-500 text-white px-1 rounded">呼出済</span>}
                        {guest.absent && <span className="text-[10px] bg-red-500 text-white px-1 rounded">不在</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      大{guest.adults} 子{guest.children} 幼{guest.infants}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-800">{guest.pref}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => handleCall(guest)}
                          disabled={guest.called}
                          className={`p-2 rounded-lg transition-all ${guest.called ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                          title="呼び出し"
                        >
                          <i className="fa-solid fa-bullhorn"></i>
                        </button>
                        <button 
                          onClick={() => handleAbsent(guest)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                          title="不在マーク"
                        >
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                        <button 
                          onClick={() => onComplete(guest.displayId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-sm"
                        >
                          ご案内
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
