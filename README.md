# KGIB Cashout CMS Prototype

Static internal-review prototype for a constrained KGI Cashout scenario within the nested `Finance Management > Operational Transfer > Orders` page.

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

- Nested Operational Transfer `Orders` page with a dedicated `KGI Cashout` tab plus `Custodian` and `Bank Execution Status` columns
- Full-page `New` form following the Orders pattern
- Form controls fixed to `1001 -> 1000`, KGI custodian, and system-populated full-balance amount
- Destination asset type is currency-driven: `USD -> U_NORMAL_KGI_USD`, `TWD -> U_NORMAL_KGI_TWD`
- Eye action opens a read-only view; the pencil action opens the checker page with `Reject` / `Approve` actions for pending requests
- Bank execution status is distinct from review status: new/rejected requests are `NOT SUBMITTED`, approved requests become `SUBMITTED`, and historical confirmed execution can show `ACCEPTED`

## Prototype Assumptions

- `C_DEPOSIT_FEE` and `C_WITHDRAWAL_FEE` are available for demonstration; `C_TRADING_FEE` is shown but disabled until UID `1001` posting validation is complete.
- Submitted amount equals the displayed current balance and is not editable in this prototype.
- Created requests use the Orders edit/review page; production permissions determine who sees `Reject` / `Approve`.
- Approval simulates KGIB instruction `04` submission and evidence capture; no real bank integration is executed.
