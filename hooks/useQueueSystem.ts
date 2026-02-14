import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 
import { Guest, AppState, GuestType, SeatPreference } from '../types';

export const useQueueSystem = () => {
  const [state, setState] = useState<AppState>({
    queue: [],
    stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
    nextNumber: 1,
    isAccepting: true,
  });

  // リアルタイム同期のセットアップ
  useEffect(() => {
    const fetchQueue = async () => {
      const { data } = await supabase
        .from('queue')
        .select('*')
        .order('timestamp', { ascending: true });
      if (data) setState(prev => ({ ...prev, queue: data }));
    };

    fetchQueue();

    // データの変更を監視して自動更新
    const channel = supabase
      .channel('queue-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, () => {
        fetchQueue();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 受付登録（DBへ保存）
  const registerGuest = useCallback(async (data: { type: GuestType, adults: number, children: number, infants: number, pref: SeatPreference }) => {
    const prefix = data.type === 'shop' ? 'S' : 'W';
    const displayId = `${prefix}-${state.nextNumber}`;
    const newGuest = {
      displayId,
      ...data,
      status: 'waiting',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };

    const { error } = await supabase.from('queue').insert([newGuest]);
    if (error) console.error('登録エラー:', error);

    setState(prev => ({ ...prev, nextNumber: prev.nextNumber + 1 }));
  }, [state.nextNumber]);

  // ステータス更新（呼び出し・不在など）
  const updateGuestStatus = useCallback(async (displayId: string, updates: Partial<Guest>) => {
    await supabase.from('queue').update(updates).eq('displayId', displayId);
  }, []);

  // 案内完了（削除）
  const completeGuest = useCallback(async (displayId: string) => {
    await supabase.from('queue').delete().eq('displayId', displayId);
  }, []);

  return {
    state,
    registerGuest,
    updateGuestStatus,
    completeGuest,
    setAccepting: (status: boolean) => setState(prev => ({ ...prev, isAccepting: status })),
    resetStats: () => {},
    removeGuest: async (displayId: string) => {
      await supabase.from('queue').delete().eq('displayId', displayId);
    }
  };
};
