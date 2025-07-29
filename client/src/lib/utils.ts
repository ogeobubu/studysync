export function cn(...inputs: (string | undefined | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function isValidTime(time: string): boolean {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

export function compareTimes(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  if (h1 !== h2) return h1 - h2;
  return m1 - m2;
}