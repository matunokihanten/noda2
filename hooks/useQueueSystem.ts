
import { useState, useEffect, useCallback } from 'react';
import { Guest, Stats, AppState, GuestType, SeatPreference } from '../types';

const STORAGE_KEY = 'matsunoki_queue_state';
const LAST_DATE_KEY = 'matsunoki_last_date';

export const useQueueSystem = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const lastDate = localStorage.getItem(LAST_DATE_KEY);
    const today = new Date().toLocaleDateString('ja-JP');

    // 日付が変わっていたらリセット
    if (lastDate !== today) {
      localStorage.setItem(LAST_DATE_KEY, today);
      return {
        queue: [],
        stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
        nextNumber: 1,
        isAccepting: true,
      };
    }

    return saved ? JSON.parse(saved) : {
      queue: [],
      stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 },
      nextNumber: 1,
      isAccepting: true,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getJSTime = () => new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const registerGuest = useCallback((data: { type: GuestType, adults: number, children: number, infants: number, pref: SeatPreference }) => {
    const prefix = data.type === 'shop' ? 'S' : 'W';
    const displayId = `${prefix}-${state.nextNumber}`;
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

    setState(prev => ({
      ...prev,
      queue: [...prev.queue, newGuest],
      nextNumber: prev.nextNumber + 1,
      stats: { ...prev.stats, totalToday: prev.stats.totalToday + 1 }
    }));

    return newGuest;
  }, [state.nextNumber]);

  const updateGuestStatus = useCallback((displayId: string, updates: Partial<Guest>) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.map(g => g.displayId === displayId ? { ...g, ...updates } : g)
    }));
  }, []);

  const completeGuest = useCallback((displayId: string) => {
    setState(prev => {
      const guest = prev.queue.find(g => g.displayId === displayId);
      if (!guest) return prev;

      const waitTime = (Date.now() - guest.timestamp) / 1000 / 60;
      const newCompleted = prev.stats.completedToday + 1;
      const newAvg = Math.round((prev.stats.averageWaitTime * prev.stats.completedToday + waitTime) / newCompleted);

      return {
        ...prev,
        queue: prev.queue.filter(g => g.displayId !== displayId),
        stats: {
          ...prev.stats,
          completedToday: newCompleted,
          averageWaitTime: newAvg
        }
      };
    });
  }, []);

  const removeGuest = useCallback((displayId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(g => g.displayId !== displayId)
    }));
  }, []);

  const setAccepting = useCallback((status: boolean) => {
    setState(prev => ({ ...prev, isAccepting: status }));
  }, []);

  const resetStats = useCallback(() => {
    setState(prev => ({
      ...prev,
      stats: { totalToday: 0, completedToday: 0, averageWaitTime: 0 }
    }));
  }, []);

  return {
    state,
    registerGuest,
    updateGuestStatus,
    completeGuest,
    removeGuest,
    setAccepting,
    resetStats
  };
};
