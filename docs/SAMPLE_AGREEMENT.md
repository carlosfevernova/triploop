# Sample Asset Purchase Agreement — TripLoop

**Template for reference. Not legal advice.** Have your attorney review before signing. Adapts to most jurisdictions with local counsel edits.

---

## Asset Purchase Agreement

**Effective Date:** [DATE, e.g., 2026-09-15]

**This Asset Purchase Agreement ("Agreement") is entered into on the Effective Date by and between:**

**Seller:** Carlos Fernandez Vernova ("Seller"), an individual with mailing address at [ADDRESS, GDL, MX] and email `hola@nano-almacen.mx`.

**Buyer:** [BUYER LEGAL NAME] ("Buyer"), a [company / individual] with mailing address at [BUYER ADDRESS] and email [BUYER EMAIL].

---

## 1. Purchased Assets

Seller agrees to transfer to Buyer, and Buyer agrees to acquire from Seller, the following assets ("Assets") related to the TripLoop application:

1.1. **Source Code:** All source code, documentation, and configuration files in the GitHub repository at `https://github.com/carlosfevernova/triploop` as of the Effective Date, including all commit history.

1.2. **Intellectual Property:** All copyright, moral rights, and any other intellectual property rights Seller holds in the Source Code, subject to the MIT License already governing third-party contributions.

1.3. **Domain Aliases** *(optional, if included per Tier selected)*: Vercel deployment aliases `triploop-six.vercel.app` and `triploop-tequilera-barranca-s-projects.vercel.app`, subject to Vercel's transfer terms.

1.4. **Content Assets:** 231 curated Points of Interest data files, 60 template trip files, 4 locale message catalogs (EN, ES, PT-BR, DE-DE), OG image assets, and marketing content packs contained in the repository.

1.5. **Documentation:** All files in `/docs`, `/marketing`, and root-level `.md` files (AUDIT.md, README.md, CHANGELOG.md, etc.).

1.6. **NOT Included:**
   - Supabase project (Buyer will create own; migrations transfer cleanly)
   - Third-party API keys (Google Maps, Stripe, OpenRouter, Anthropic, Twilio, Resend)
   - Custom domain names (Buyer will register desired domain)
   - Any user data or waitlist emails collected pre-Effective-Date
   - Trademark "TripLoop" name (see §7)

## 2. Purchase Price and Payment

2.1. The total purchase price is **[$X0,000 USD]** (the "Purchase Price"), payable as follows:

   - **50% ($X0,000 USD)** upon execution of this Agreement.
   - **50% ($X0,000 USD)** upon completion of asset transfer per §4.

2.2. Payment method (Buyer choose one): [ ] Wire transfer  [ ] Wise  [ ] Stripe invoice  [ ] PayPal  [ ] Escrow.com (fees paid by Buyer).

2.3. Payments are non-refundable once transferred except as expressly stated in §5.

## 3. Representations and Warranties

3.1. **Seller Warrants:**
   (a) Seller has full legal right to sell the Assets.
   (b) Assets do not, to Seller's knowledge, infringe on any third-party rights beyond what is disclosed in `package.json` and `LICENSE`.
   (c) All Source Code is MIT-licensed with clear provenance.
   (d) No pending litigation, claims, or encumbrances affect the Assets.
   (e) Pre-revenue status: Assets have generated **$0 USD** in revenue to date.

3.2. **Buyer Warrants:**
   (a) Buyer has the legal authority to acquire the Assets.
   (b) Buyer is not acquiring for unlawful purposes.
   (c) Buyer has independently evaluated the Assets and is not relying on undisclosed representations.

## 4. Transfer Process

4.1. **Within 3 business days of the initial payment:**
   - Seller transfers GitHub repository ownership to Buyer's specified GitHub account.
   - Seller provides written walkthrough of environment variables required (documented in `.env.example`).
   - Seller provides 2-hour video call for architecture Q&A and Vercel setup (or 8 hours if Buy It Now tier).

4.2. **Within 7 business days of the initial payment:**
   - Buyer confirms successful build, deploy, and access to the codebase.
   - Buyer provides written notice of any Material Defect (§5) or the final payment is due.

4.3. **Upon Buyer's confirmation OR expiration of the 7-day inspection period:**
   - Buyer pays the remaining 50% of the Purchase Price.
   - Seller executes formal IP assignment document if required by Buyer's jurisdiction.

## 5. Material Defect and Remedy

5.1. A "Material Defect" is a discovery within the 7-day inspection period that materially impairs the Assets' value beyond what is documented in the repository (AUDIT.md, CHANGELOG.md, .env.example).

5.2. **Remedies for Material Defect (in order of preference):**
   (a) Seller fixes the defect within 5 business days at no additional cost.
   (b) Purchase Price reduced by mutually agreed amount.
   (c) Buyer terminates Agreement, Seller refunds 100% of initial payment, GitHub repo ownership reverts to Seller.

5.3. Known issues documented in AUDIT.md or CHANGELOG.md are **NOT** Material Defects.

## 6. Post-Sale Support

6.1. Seller provides the following post-sale consulting hours (video call) at no additional cost:
   - **Asset only tier:** 2 hours total, expiring 30 days from Effective Date.
   - **Buy It Now tier:** 8 hours total, expiring 60 days from Effective Date.
   - **Bundle tier:** 12 hours total (8 TripLoop + 4 FiestaMap), expiring 60 days from Effective Date.

6.2. Additional consulting available at **$75 USD per hour**, invoiced in 30-minute increments, payable within 15 days of invoice.

## 7. Trademark and Brand

7.1. The name "TripLoop" is not currently a registered trademark. Buyer may:
   (a) Continue using the name as-is (Seller waives any common-law claims post-Transfer).
   (b) Rename to Buyer's preferred brand at Buyer's discretion.
   (c) Register "TripLoop" as trademark in Buyer's chosen jurisdiction at Buyer's cost.

7.2. Seller retains the right to publicly disclose the acquisition (e.g., "TripLoop was acquired by [BUYER]") in maker portfolios and press mentions, unless Buyer requests confidentiality per §9.

## 8. Non-Compete

8.1. For a period of **12 months** from the Effective Date, Seller agrees NOT to:
   (a) Build a substantially similar competing AI road-trip planner product.
   (b) Actively solicit users from any waitlist or email list associated with TripLoop.

8.2. Seller may:
   (a) Build unrelated travel-adjacent products (e.g., events, dining, hotels).
   (b) Consult for other travel tech companies (with disclosure to Buyer).
   (c) Maintain other portfolio products publicly listed on Seller's GitHub prior to Effective Date.

## 9. Confidentiality

9.1. Terms of this Agreement (specifically, the Purchase Price) are confidential unless both parties agree in writing to disclose.

9.2. Buyer's identity may be publicly disclosed by Seller unless Buyer requests confidentiality within 7 days of Effective Date.

## 10. General

10.1. **Governing Law:** [BUYER JURISDICTION or MEXICO if not specified]. Disputes resolved via arbitration in [CITY].

10.2. **Entire Agreement:** This document constitutes the entire agreement between the parties regarding the Assets. Prior discussions, emails, and Loom demos are superseded except where explicitly referenced.

10.3. **Amendments:** Any modification requires written agreement signed by both parties.

10.4. **Severability:** If any clause is unenforceable, remaining clauses stay in effect.

10.5. **Escrow (optional):** Both parties may agree to use Escrow.com for the transaction. Escrow fees are paid by Buyer unless negotiated otherwise.

---

## Signatures

**Seller:**  
Signature: ___________________________  
Name: Carlos Fernandez Vernova  
Date: _______________  

**Buyer:**  
Signature: ___________________________  
Name: [BUYER NAME]  
Title (if company): _______________  
Date: _______________  

---

## Attachments (for reference)

- **Attachment A:** FOR_SALE.md — Full pitch and valuation defense
- **Attachment B:** AUDIT.md — Technical audit
- **Attachment C:** CHANGELOG.md — Sprint history
- **Attachment D:** LICENSE — MIT license text

---

*Template last revised 2026-08-26. Use as starting point only. Consult local attorney for jurisdiction-specific language, tax structuring (buyer's country + seller's country), and enforceability review.*

*Free Escrow.com transaction templates: https://www.escrow.com/support/knowledge-base*
