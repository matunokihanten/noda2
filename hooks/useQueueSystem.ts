
import { useState, useEffect, useCallback } from 'react';
import { Guest, Stats, AppState, GuestType, SeatPreference } from '../types';

const STORAGE_KEY = 'matsunoki_queue_state_v2';
const LAST_DATE_KEY = 'matsunoki_last_date_v2';

const getInitialState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  const today = new Date().toLocaleDateString('ja-JP');

  if (lastDate !== today) {
    localStorage.setItem(LAST_DATE_KEY, today);
    const newState: AppState = {
      queue: [],
      stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
      nextNumber: 1,
      isAccepting: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  }

  return saved ? JSON.parse(saved) : {
    queue: [],
    stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
    nextNumber: 1,
    isAccepting: true,
  };
};

export const useQueueSystem = () => {
  const [state, setState] = useState<AppState>(getInitialState);

  // ステートが更新されたら保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // 他のタブでの更新を検知して同期（これで管理画面に即座に反映される）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getJSTime = () => new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit'
  });

  const registerGuest = useCallback((data: { type: GuestType, adults: number, children: number, infants: number, pref: SeatPreference }) => {
    // 最新の状態をlocalStorageから取得して競合を防ぐ
    const currentState = getInitialState();
    const prefix = data.type === 'shop' ? 'S' : 'W';
    const displayId = `${prefix}-${currentState.nextNumber}`;
    
    const newGuest: Guest = {
      displayId,
      ...data,
      status: 'waiting',
      arrived: false,
      called: false,
      absent: false,
      time: getJSTime(),
      timestamp: Date.now(),
    };

    const newState: AppState = {
      ...currentState,
      queue: [...currentState.queue, newGuest],
      nextNumber: currentState.nextNumber + 1,
      stats: { ...currentState.stats, totalToday: currentState.stats.totalToday + 1 }
    };

    setState(newState);
    // storageイベントを発生させるために明示的にセット
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    return newGuest;
  }, []);

  const updateGuestStatus = useCallback((displayId: string, updates: Partial<Guest>) => {
    setState(prev => {
      const newState = {
        ...prev,
        queue: prev.queue.map(g => g.displayId === displayId ? { ...g, ...updates } : g)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const completeGuest = useCallback((displayId: string) => {
    setState(prev => {
      const guest = prev.queue.find(g => g.displayId === displayId);
      if (!guest) return prev;

      const waitTime = (Date.now() - guest.timestamp) / 1000 / 60;
      const newCompleted = prev.stats.completedToday + 1;
      const newAvg = Math.round((prev.stats.averageWaitTime * prev.stats.completedToday + waitTime) / newCompleted);

      const newState: AppState = {
        ...prev,
        queue: prev.queue.filter(g => g.displayId !== displayId),
        stats: {
          ...prev.stats,
          completedToday: newCompleted,
          averageWaitTime: newAvg
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const setAccepting = useCallback((status: boolean) => {
    setState(prev => {
      const newState = { ...prev, isAccepting: status };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const resetStats = useCallback(() => {
    if (confirm('本日のすべての統計データと待ち行列をリセットしてもよろしいですか？')) {
      const newState: AppState = {
        queue: [],
        stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
        nextNumber: 1,
        isAccepting: true,
      };
      setState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  }, []);

  return {
    state,
    registerGuest,
    updateGuestStatus,
    completeGuest,
    setAccepting,
    resetStats
  };
};
