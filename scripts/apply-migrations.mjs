// One-shot migration runner. Uso: node scripts/apply-migrations.mjs
import postgres from 'postgres';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIG_DIR = join(__dirname, '..', 'supabase', 'migrations');

const DB_URL = process.env.SUPABASE_DB_URL;
if(!DB_URL){
  console.error('SUPABASE_DB_URL env var required (postgres://... pooler URL con password).');
  process.exit(1);
}

const sql = postgres(DB_URL, { max: 1, ssl: 'require', prepare: false });

try {
  const files = (await readdir(MIG_DIR)).filter(f => f.endsWith('.sql')).sort();
  console.log(`Applying ${files.length} migrations from ${MIG_DIR}`);
  for(const f of files){
    const content = await readFile(join(MIG_DIR, f), 'utf8');
    process.stdout.write(`→ ${f} ... `);
    try {
      await sql.unsafe(content);
      console.log('OK');
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }
} finally {
  await sql.end();
}
