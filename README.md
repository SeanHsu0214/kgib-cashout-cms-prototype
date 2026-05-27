# KGIB Cashout CMS Prototype

Static internal-review prototype for a constrained KGI Cashout scenario within `Finance Management > Operational Transfer 2.0 > Orders`.

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

- Operational Transfer 2.0 order list with a dedicated `KGI Cashout` tab and `Custodian` table column
- Full-page `New` form following the Operational Transfer 2.0 pattern
- Form controls fixed to `1001 -> 1000`, KGI custodian, and system-populated full-balance amount
- Eye action opens the same full-page form in read-only checker view with `Reject` / `Approve` actions for pending requests

## Prototype Assumptions

- `C_DEPOSIT_FEE` and `C_WITHDRAWAL_FEE` are available for demonstration; `C_TRADING_FEE` is shown but disabled until UID `1001` posting validation is complete.
- Submitted amount equals the displayed current balance and is not editable in this prototype.
- Created requests use the Operational Transfer 2.0 view/review page; production permissions determine who sees `Reject` / `Approve`.
- Approval simulates KGIB instruction `04` submission and evidence capture; no real bank integration is executed.
