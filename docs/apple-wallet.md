# Apple Wallet Pass

TripLoop generates an unsigned `pass.json` payload for Apple Wallet trip passes. To install on an iPhone, the payload must be wrapped in a signed `.pkpass` bundle using Apple Developer certificates.

## Why not sign on the server?

Signing requires:
- Apple Developer Program membership ($99/year)
- A Pass Type Identifier registered in Apple Developer Portal
- A `.p12` certificate + WWDR intermediate certificate

Rather than force every fork/deploy to obtain these, we output the raw payload and let each operator wire their own signing.

## Current endpoint

```bash
GET /api/trips/{slug}/export?format=wallet
# → 200 application/json — Pass JSON payload (unsigned)
```

## Wiring a signing service

### Option 1: Node.js library `passkit-generator`

```bash
npm install passkit-generator
```

Create `src/app/api/trips/[slug]/wallet-signed/route.ts`:

```ts
import { PKPass } from 'passkit-generator';
import { readFile } from 'node:fs/promises';

export async function GET(req, { params }) {
  const { slug } = await params;

  const payloadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/trips/${slug}/export?format=wallet`);
  const payload = await payloadRes.json();

  // Fill in Apple Team ID from env
  payload.teamIdentifier = process.env.APPLE_TEAM_ID;

  const pass = new PKPass({
    model: payload,
    certificates: {
      wwdr: await readFile('./certs/wwdr.pem'),
      signerCert: await readFile('./certs/pass-cert.pem'),
      signerKey: await readFile('./certs/pass-key.pem'),
      signerKeyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE
    }
  });

  // Add required images (icon, logo, background — see Apple docs for sizes)
  pass.addBuffer('icon.png', await readFile('./public/wallet/icon.png'));
  pass.addBuffer('logo.png', await readFile('./public/wallet/logo.png'));

  return new Response(pass.getAsBuffer(), {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${slug}.pkpass"`
    }
  });
}
```

Deploy env vars:
- `APPLE_TEAM_ID` — from Apple Developer account
- `APPLE_PASS_KEY_PASSPHRASE` — passphrase for signer key

### Option 2: External signing service

Cheaper if you don't want to manage certs:

- [PassCreator](https://passcreator.com) — hosted signing API, ~$50/mo
- [Passbook.io](https://passbook.io) — dev-friendly, per-pass pricing
- [Fumiyasac/passkit-server](https://github.com/fumiyasac/passkit-server) — self-host free

## Testing

Signed .pkpass files can be:
- Emailed to yourself and opened on iPhone Mail
- Served over HTTPS with `Content-Type: application/vnd.apple.pkpass`
- Downloaded from AirDrop between Mac + iPhone

**Unsigned payloads will silently fail to open on iOS.** iOS gives no error, just refuses the pass.

## Google Wallet equivalent

Not wired. Google Wallet uses JWT-signed passes via Google Wallet API. If you want cross-platform:

1. Create an Issuer account at pay.google.com/business/console
2. Use `google-auth-library` to sign JWTs
3. Serve a "Save to Google Wallet" button linking to the JWT

The `buildWalletPassPayload()` helper in `src/lib/trip-export.ts` has enough info to map to a Google Generic Pass class. Estimated 2-3h implementation.
