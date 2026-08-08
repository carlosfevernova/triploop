'use client';
import type { PresenceUser } from '@/lib/use-trip-realtime';

interface Props {
  users: PresenceUser[];
  isEs?: boolean;
}

export function CollabPresence({ users, isEs }: Props){
  if(users.length === 0) return null;
  const visible = users.slice(0, 3);
  const extra = users.length - visible.length;
  return (
    <div className="flex items-center gap-2" title={isEs ? `${users.length} colaborador(es) activo(s)` : `${users.length} active collaborator(s)`}>
      <div className="flex -space-x-2">
        {visible.map((u) => (
          <div
            key={u.user_id}
            className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[10px] font-semibold text-white ring-1 ring-emerald-400"
            style={{ background: u.color }}
            title={u.email || 'Collaborator'}
          >
            {(u.email || '?')[0].toUpperCase()}
          </div>
        ))}
        {extra > 0 && (
          <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-ink-500 text-[10px] font-semibold text-white">
            +{extra}
          </div>
        )}
      </div>
      <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-600 md:inline">
        <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle" />
        {isEs ? 'En vivo' : 'Live'}
      </span>
    </div>
  );
}
