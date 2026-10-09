import { COLLECTORS } from '@/data/community';

export type UsernameCheck = { ok: boolean; label: string };

export function checkUsername(name: string): UsernameCheck {
  if (!name) return { ok: false, label: '' };
  if (!/^[a-z0-9_.]{3,20}$/.test(name)) return { ok: false, label: '3–20 letters, numbers, _ or .' };
  if (COLLECTORS.includes(name)) return { ok: false, label: 'Taken' };
  return { ok: true, label: 'Available' };
}
