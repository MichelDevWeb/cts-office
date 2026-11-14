import fs from 'node:fs/promises';
import path from 'node:path';

// Antigravity keeps one <uuid>.db (or .db-wal / .pb) per conversation. Its format is undocumented and private, so the office reads only
// file names and modification times: a file that just changed means that agent is working.
export async function changedConversations(dirs, since) {
  const byId = new Map();
  for (const dir of dirs) {
    let names; try { names = await fs.readdir(dir); } catch { continue; }
    for (const n of names) {
      let id = '';
      if (n.endsWith('.db-wal')) id = n.slice(0, -7);
      else if (n.endsWith('.db') || n.endsWith('.pb')) id = n.slice(0, -3);
      else continue;
      const st = await fs.stat(path.join(dir, n)).catch(() => null);
      if (st && st.mtimeMs > since) {
        const prev = byId.get(id);
        if (!prev || st.mtimeMs > prev.mtime) byId.set(id, { id, dir, mtime: st.mtimeMs });
      }
    }
  }
  return [...byId.values()];
}

export function watchAntigravity({ dirs, onActive, everyMs = 3000, now = Date.now }) {
  let since = now(), busy = false;
  const t = setInterval(async () => {
    if (busy) return; busy = true;
    try {
      const hits = await changedConversations(dirs, since);
      for (const h of hits) { since = Math.max(since, h.mtime); onActive(h); }
    } finally { busy = false; }
  }, everyMs);
  t.unref?.();
  return () => clearInterval(t);
}
