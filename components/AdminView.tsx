import React from 'react';

interface AdminViewProps {
  queue: any[];
  stats: any;
  isAccepting: boolean;
  onUpdateStatus: (id: string, updates: any) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onToggleAccepting: () => void;
  onRemove: (id: string) => Promise<void>;
}

const AdminView: React.FC<AdminViewProps> = ({ queue, isAccepting, onUpdateStatus, onComplete, onToggleAccepting, onRemove }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">現在の待ち状況 ({queue.length}組)</h2>
        <button 
          onClick={onToggleAccepting}
          className={`px-4 py-2 rounded font-bold ${isAccepting ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
        >
          {isAccepting ? '受付中' : '停止中'}
        </button>
      </div>
      <div className="grid gap-4">
        {queue.map((guest) => (
          <div key={guest.displayId} className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-800">{guest.displayId}</span>
              <span className="ml-4 text-gray-600">{guest.adults}名様 / {guest.time}</span>
            </div>
            <div className="space-x-2">
              <button onClick={() => onUpdateStatus(guest.displayId, { called: true })} className="bg-blue-500 text-white px-3 py-1 rounded">呼出</button>
              <button onClick={() => onComplete(guest.displayId)} className="bg-green-500 text-white px-3 py-1 rounded">案内完了</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;
