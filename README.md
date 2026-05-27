# KGIB Cashout CMS Prototype

Static internal-review prototype for the constrained KGIB cashout extension to `Finance Management > Operational Transfer > Cashout`.

## Run

Open `site/index.html` directly, or serve the repository locally:

```bash
python3 -m http.server 4173 --directory site
```

## Entry Points

- Main prototype: `site/index.html`
- Named entry: `site/kgib-cashout.html`

The repository is configured for GitHub Pages deployment from `site/` through `.github/workflows/deploy-pages.yml`.

## Included Interaction

- Existing Cashout transaction list with `KGIB Cashout` action next to `New`
- Existing `New` entry remains visible for context but does not open an incomplete non-KGIB form in this prototype
- KGIB form with fixed `1001 -> 1000`, KGI custodian, system-populated full-balance amount, and fee asset allowlist behavior
- Shared list identification for KGI attribution, approval status, and bank execution state
- Existing-style read-only Cash Out details modal with bottom `Reject` / `Approve` actions for pending requests
- KGIB execution evidence retained inside the details modal

## Prototype Assumptions

- `C_DEPOSIT_FEE` and `C_WITHDRAWAL_FEE` are available for demonstration; `C_TRADING_FEE` is shown but disabled until UID `1001` posting validation is complete.
- Submitted amount equals the displayed current balance and is not editable in this prototype.
- Created requests use the existing Details approval mechanism; production permissions determine who sees `Reject` / `Approve`.
- Approval simulates KGIB instruction `04` submission and evidence capture; no real bank integration is executed.
