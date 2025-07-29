export enum DayOfWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export type TimeValue = `${number}:${number}`; // HH:MM format

export interface TimeRange {
  start: TimeValue;
  end: TimeValue;
}