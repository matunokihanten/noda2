import React from 'react';

interface CustomerViewProps {
  onSubmit: (data: any) => Promise<void>;
  isAccepting: boolean;
}

const CustomerView: React.FC<CustomerViewProps> = ({ onSubmit, isAccepting }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'web',
      adults: Number(formData.get('adults')),
      children: Number(formData.get('children')),
      infants: Number(formData.get('infants')),
      pref: formData.get('pref'),
    };
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">受付登録</h2>
      {isAccepting ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">大人</label>
            <input name="adults" type="number" min="1" defaultValue="1" className="mt-1 block w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">子供</label>
            <input name="children" type="number" min="0" defaultValue="0" className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700">
            この内容で予約する
          </button>
        </form>
      ) : (
        <p className="text-red-500 font-bold">現在、オンライン受付を停止しております。</p>
      )}
    </div>
  );
};

export default CustomerView;
