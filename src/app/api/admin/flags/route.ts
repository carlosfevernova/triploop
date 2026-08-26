import { NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/admin-guard';
import { getAllFlags, setFlag, clearFlag, type FlagKey, FLAG_META } from '@/lib/feature-flags';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_KEYS = new Set<string>(FLAG_META.map((f) => f.key));

function isValidKey(k: string): k is FlagKey {
  return VALID_KEYS.has(k);
}

export async function GET(){
  if(!(await isAdminAuthed())){
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ flags: getAllFlags() });
}

export async function POST(request: Request){
  if(!(await isAdminAuthed())){
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const { key, value, action } = (body ?? {}) as { key?: string; value?: unknown; action?: string };
  if(!key || !isValidKey(key)){
    return NextResponse.json({ error: 'invalid_key', valid: Array.from(VALID_KEYS) }, { status: 400 });
  }
  if(action === 'clear'){
    clearFlag(key);
    return NextResponse.json({ ok: true, key, action: 'clear', flags: getAllFlags() });
  }
  if(typeof value !== 'boolean'){
    return NextResponse.json({ error: 'invalid_value', hint: 'value must be boolean or pass action=clear' }, { status: 400 });
  }
  const prev = setFlag(key, value);
  return NextResponse.json({ ok: true, key, value, previous: prev, flags: getAllFlags() });
}
