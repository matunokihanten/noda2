export type GuestStatus = 'waiting' | 'calling' | 'called' | 'arrived' | 'absent' | 'completed';
export type GuestType = 'shop' | 'web';
export type SeatPreference = 'any' | 'table' | 'counter';

export interface Guest {
  displayId: string;
  type: GuestType;
  adults: number;
  children: number;
  infants: number;
  pref: SeatPreference;
  status: GuestStatus;
  time: string;
  timestamp: number;
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
