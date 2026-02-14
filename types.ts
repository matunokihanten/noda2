
export type GuestType = 'web' | 'shop';
export type SeatPreference = 'どこでも' | 'カウンター' | 'テーブル' | 'お座敷';

export interface Guest {
  displayId: string;
  type: GuestType;
  adults: number;
  children: number;
  infants: number;
  pref: SeatPreference;
  status: 'waiting' | 'called' | 'arrived' | 'absent' | 'completed';
  arrived: boolean;
  called: boolean;
  absent: boolean;
  time: string;
  timestamp: number;
  calledTime?: string;
  arrivedTime?: string;
  absentTime?: string;
}

export interface Stats {
  totalToday: number;
  completedToday: number;
  averageWaitTime: number;
}

export interface AppState {
  queue: Guest[];
  stats: Stats;
  nextNumber: number;
  isAccepting: boolean;
}
