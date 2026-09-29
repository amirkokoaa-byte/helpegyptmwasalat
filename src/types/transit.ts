export type TransportModeId = 'metro' | 'lrt_train' | 'monorail' | 'brt';

export interface TransportMode {
  id: TransportModeId;
  name: string;
  subtitle: string;
  badge: string;
  color: string;
  accentBg: string;
  iconName: string;
  description: string;
}

export interface TransitLine {
  id: string;
  modeId: TransportModeId;
  name: string;
  color: string;
  textColor: string;
  terminalA: string;
  terminalB: string;
}

export interface Station {
  id: string;
  name: string;
  modeId: TransportModeId;
  lineId: string;
  order: number;
  isInterchange?: boolean;
  interchangeLines?: string[];
  notes?: string;
}

export interface FareBracket {
  id: string;
  modeId: TransportModeId;
  minStations: number;
  maxStations: number; // e.g. 999 for infinity
  price: number;
  label: string;
}

export interface RouteStep {
  station: Station;
  lineId: string;
  isStart?: boolean;
  isEnd?: boolean;
  isTransfer?: boolean;
  transferToLineId?: string;
  direction?: string;
}

export interface RouteResult {
  startStation: Station;
  endStation: Station;
  totalStations: number;
  estimatedMinutes: number;
  formattedTime?: string;
  fare: number;
  path: RouteStep[];
  transfers: {
    stationName: string;
    fromLineId: string;
    toLineId: string;
    direction: string;
  }[];
  appliedBracket: FareBracket | null;
}
