import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('./src', import.meta.url)))
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e', 'tests-playwright'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/**/*.test.ts',
        'src/lib/**/*.spec.ts',
        'src/lib/supabase-*.ts', // require live env; covered by E2E
        'src/lib/admin-i18n.ts', // pure data, no logic
        'src/lib/l4.ts'          // trivial, covered by tests but excluded from coverage floor
      ],
      // No hard thresholds yet — first-cut baseline is ~5% lines / 32 tests / 4 files.
      // Buyer can enforce their own floor via CI later. Baseline covers:
      //   • L() locale helper (4 tests)
      //   • Feature flags: parseFlagEnv + getFlag/setFlag/clearFlag/getAllFlags (14 tests)
      //   • AI cost estimator across 5 provider tiers (7 tests)
      //   • Admin auth: HMAC token sign/verify + passphrase check (7 tests)
    }
  }
});
