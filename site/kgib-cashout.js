const balanceMap = {
  "USD|C_DEPOSIT_FEE": "12,480.75",
  "TWD|C_DEPOSIT_FEE": "398,600",
  "USD|C_WITHDRAWAL_FEE": "8,940.20",
  "TWD|C_WITHDRAWAL_FEE": "256,800",
};

const requests = [
  {
    id: "CO_KGI_9F4Q2",
    currency: "USD",
    amount: "8,940.20",
    from: "(1001)",
    to: "(1000)",
    custodian: "KGI",
    status: "PENDING REVIEW",
    bankStatus: "NOT SUBMITTED",
    assetType: "C_WITHDRAWAL_FEE",
    currentBalance: "8,940.20",
    created: "2026/05/26 14:18:20 (UTC+08:00)",
    updated: "2026/05/26 14:18:21 (UTC+08:00)",
    requester: "Sean Hsu",
    reviewer: "-",
    reason: "KGIB fee balance cashout",
    note: "KGI withdrawal fee settlement - full balance",
    rail: "VASPF API / instructCode 04",
    logs: [
      ["Sean Hsu created KGIB cashout request for full balance USD 8,940.20.", "2026/05/26 14:18:20 (UTC+08:00)"],
      ["System captured balance snapshot: USD 8,940.20 under UID 1001 / C_WITHDRAWAL_FEE / KGI.", "2026/05/26 14:18:20 (UTC+08:00)"],
      ["Waiting for checker review; bank instruction not submitted.", "2026/05/26 14:18:21 (UTC+08:00)"],
    ],
  },
  {
    id: "CO_KGI_7KD31",
    currency: "TWD",
    amount: "398,600",
    from: "(1001)",
    to: "(1000)",
    custodian: "KGI",
    status: "COMPLETED",
    bankStatus: "ACCEPTED",
    assetType: "C_DEPOSIT_FEE",
    currentBalance: "398,600",
    created: "2026/05/25 11:22:59 (UTC+08:00)",
    updated: "2026/05/25 11:31:44 (UTC+08:00)",
    requester: "admin-tw",
    reviewer: "Finance Checker",
    reason: "KGIB fee balance cashout",
    note: "KGI deposit fee settlement - full balance",
    rail: "P payment file / instruction code 04",
    bankReference: "KGI-P-20260525-000042",
    logs: [
      ["admin-tw created KGIB cashout request for full balance TWD 398,600.", "2026/05/25 11:22:59 (UTC+08:00)"],
      ["Finance Checker approved request after balance revalidation.", "2026/05/25 11:28:12 (UTC+08:00)"],
      ["System submitted KGIB P payment file instruction code 04.", "2026/05/25 11:28:13 (UTC+08:00)"],
      ["KGIB accepted payment file result: KGI-P-20260525-000042.", "2026/05/25 11:31:44 (UTC+08:00)"],
    ],
  },
  {
    id: "CO_7QCM5",
    currency: "TWD",
    amount: "10",
    from: "-",
    to: "(63438)",
    custodian: "-",
    status: "REJECTED",
    bankStatus: "-",
    assetType: "-",
    created: "2026/05/22 12:13:11 (UTC+08:00)",
    updated: "2026/05/22 12:13:12 (UTC+08:00)",
    requester: "admin-tw",
    reviewer: "admin-tw",
    reason: "Others",
    note: "create CASH_OUT order_7QCM5",
    logs: [["admin-tw rejected cash out request.", "2026/05/22 12:13:12 (UTC+08:00)"]],
  },
  {
    id: "CO_GR85O",
    currency: "USD",
    amount: "100",
    from: "-",
    to: "(63438)",
    custodian: "-",
    status: "NEW",
    bankStatus: "-",
    assetType: "-",
    created: "2026/05/21 11:45:34 (UTC+08:00)",
    updated: "2026/05/21 11:45:34 (UTC+08:00)",
    requester: "Sean Hsu",
    reviewer: "-",
    reason: "Others",
    note: "test",
    logs: [["Sean Hsu created cash out request.", "2026/05/21 11:45:34 (UTC+08:00)"]],
  },
];

const requestRows = document.querySelector("#requestRows");
const kgibModal = document.querySelector("#kgibModal");
const standardModal = document.querySelector("#standardModal");
const modalBackdrop = document.querySelector("#modalBackdrop");
const currency = document.querySelector("#currency");
const assetType = document.querySelector("#assetType");
const balance = document.querySelector("#balance");
const amount = document.querySelector("#amount");
const balanceCurrency = document.querySelector("#balanceCurrency");
const amountCurrency = document.querySelector("#amountCurrency");
const destinationAsset = document.querySelector("#destinationAsset");
const feeNotice = document.querySelector("#feeNotice");
const createKgibBtn = document.querySelector("#createKgibBtn");
const detailModal = document.querySelector("#detailModal");
const detailBody = document.querySelector("#detailBody");
const detailFooter = document.querySelector("#detailFooter");
const detailTitle = document.querySelector("#detailTitle");
const toast = document.querySelector("#toast");
let activeId = null;
let toastTimer;

function tag(value) {
  const className = {
    "PENDING REVIEW": "orange",
    APPROVED: "blue",
    COMPLETED: "green",
    REJECTED: "red",
    NEW: "orange",
    "NOT SUBMITTED": "gray",
    ACCEPTED: "green",
    SUBMITTED: "cyan",
  }[value] || "gray";
  return `<span class="tag ${className}">${value}</span>`;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function matchesFilters(item) {
  const from = document.querySelector("#fromFilter").value.trim();
  const to = document.querySelector("#toFilter").value.trim();
  const status = document.querySelector("#statusFilter").value;
  const currencyValue = document.querySelector("#currencyFilter").value;
  return (!from || item.from.includes(from))
    && (!to || item.to.includes(to))
    && (!status || item.status === status)
    && (!currencyValue || item.currency === currencyValue);
}

function renderRows() {
  requestRows.innerHTML = requests.filter(matchesFilters).map((item) => `
    <tr>
      <td>${item.currency}</td>
      <td>${item.amount}</td>
      <td>${item.from}</td>
      <td>${item.to}</td>
      <td class="${item.custodian === "KGI" ? "kgi-cell" : ""}">${item.custodian}</td>
      <td>${tag(item.status)}</td>
      <td>${item.bankStatus === "-" ? "-" : tag(item.bankStatus)}</td>
      <td>${item.created}</td>
      <td>${item.updated}</td>
      <td>${item.requester}</td>
      <td>${item.reviewer}</td>
      <td>${item.reason}</td>
      <td>${item.note}</td>
      <td><button class="detail-btn" data-detail="${item.id}" type="button"><svg class="detail-pencil" viewBox="0 0 16 16" aria-hidden="true"><path d="M10.9 2.2 13.8 5 5.2 13.4H2.4v-2.8L10.9 2.2Z"/><path d="m9.7 3.4 2.9 2.8"/></svg>Details</button></td>
    </tr>
  `).join("");
}

function openModal(modal) {
  modalBackdrop.hidden = false;
  modal.hidden = false;
}

function closeModals() {
  modalBackdrop.hidden = true;
  kgibModal.hidden = true;
  standardModal.hidden = true;
  detailModal.hidden = true;
}

function resetKgibForm() {
  document.querySelector("#kgibForm").reset();
  balance.value = "-";
  amount.value = "-";
  balanceCurrency.textContent = "";
  amountCurrency.textContent = "";
  destinationAsset.value = "-";
  feeNotice.hidden = true;
  createKgibBtn.disabled = true;
}

function updateBalance() {
  const key = `${currency.value}|${assetType.value}`;
  const value = balanceMap[key];
  const chosenCurrency = currency.value;
  destinationAsset.value = assetType.value || "-";
  balanceCurrency.textContent = chosenCurrency;
  amountCurrency.textContent = chosenCurrency;
  if (value) {
    balance.value = value;
    amount.value = value;
    feeNotice.hidden = false;
    feeNotice.textContent = `Full-balance rule enforced: ${chosenCurrency} ${value} will be locked at creation and revalidated before checker-approved submission.`;
    createKgibBtn.disabled = false;
  } else {
    balance.value = "-";
    amount.value = "-";
    createKgibBtn.disabled = true;
    feeNotice.hidden = true;
  }
}

function openDetails(id) {
  const item = requests.find((request) => request.id === id);
  activeId = id;
  detailTitle.textContent = `Cash Out: ${item.id}`;
  const executionEvidence = item.custodian === "KGI"
    ? `<div class="section-heading">KGIB Execution Evidence</div>
       <div class="evidence">
         <strong>Rail:</strong> ${item.rail}<br />
         <strong>Instruction code:</strong> 04<br />
         <strong>Bank reference:</strong> ${item.bankReference || "Not available before submission"}<br />
         <strong>Execution status:</strong> ${item.bankStatus}
       </div>`
    : "";
  detailBody.innerHTML = `
    <h3>From</h3>
    <div class="form-grid three">
      <label>Uid<input value="${item.from}" readonly /></label>
      <label>Currency<input value="${item.currency}" readonly /></label>
      <label>Asset Type<input value="${item.assetType}" readonly /></label>
      <label>Amount<input value="${item.amount}" readonly /></label>
      <label>Current Balance<input value="${item.currentBalance || item.amount}" readonly /></label>
      <label>Custodian<input value="${item.custodian}" readonly /></label>
    </div>
    <div class="direction">↓</div>
    <h3>To</h3>
    <div class="form-grid three destination">
      <label>Uid<input value="${item.to}" readonly /></label>
      <label>Asset Type<input value="${item.assetType}" readonly /></label>
    </div>
    <div class="form-grid footer-fields">
      <label>Reason<input value="${item.reason}" readonly /></label>
      <label class="wide">Note<textarea rows="2" readonly>${item.note}</textarea></label>
      <label>Status<input value="${item.status}" readonly /></label>
    </div>
    ${executionEvidence}
  `;
  const isPending = item.status === "PENDING REVIEW";
  detailFooter.innerHTML = isPending
    ? `<button class="btn" data-close-detail type="button">Cancel</button>
       <button class="btn primary" data-reject type="button">Reject</button>
       <button class="btn primary" data-approve type="button">Approve</button>`
    : `<button class="btn" data-close-detail type="button">Close</button>`;
  openModal(detailModal);
}

function createKgibRequest() {
  const now = "2026/05/26 16:08:12 (UTC+08:00)";
  const id = `CO_KGI_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  requests.unshift({
    id,
    currency: currency.value,
    amount: amount.value,
    from: "(1001)",
    to: "(1000)",
    custodian: "KGI",
    status: "PENDING REVIEW",
    bankStatus: "NOT SUBMITTED",
    assetType: assetType.value,
    currentBalance: balance.value,
    created: now,
    updated: now,
    requester: "Sean Hsu",
    reviewer: "-",
    reason: document.querySelector("#reason").value,
    note: document.querySelector("#note").value,
    rail: currency.value === "USD" ? "VASPF API / instructCode 04" : "P payment file / instruction code 04",
    logs: [
      [`Sean Hsu created KGIB cashout request for full balance ${currency.value} ${amount.value}.`, now],
      [`System captured available balance ${currency.value} ${balance.value} for ${assetType.value} under UID 1001 / KGI.`, now],
      ["Waiting for checker review; bank instruction not submitted.", now],
    ],
  });
  renderRows();
  closeModals();
  resetKgibForm();
  showToast("KGIB Cashout created. Pending checker review; no bank submission yet.");
}

function reviewRequest(approved) {
  const item = requests.find((request) => request.id === activeId);
  if (!item) return;
  item.reviewer = "Finance Checker";
  if (approved) {
    item.status = "APPROVED";
    item.bankStatus = "SUBMITTED";
    item.bankReference = item.currency === "USD" ? "VASPF-20260526-00818" : "KGI-P-20260526-000043";
    item.updated = "2026/05/26 16:10:04 (UTC+08:00)";
    item.logs.unshift(["KGIB instruction 04 submitted after approval and balance revalidation.", "2026/05/26 16:10:04 (UTC+08:00)"]);
    item.logs.unshift(["Finance Checker approved the cashout request.", "2026/05/26 16:10:03 (UTC+08:00)"]);
    showToast("Approved. KGIB instruction 04 submitted and evidence recorded.");
  } else {
    item.status = "REJECTED";
    item.bankStatus = "NOT SUBMITTED";
    item.updated = "2026/05/26 16:10:03 (UTC+08:00)";
    item.logs.unshift(["Finance Checker rejected request. Bank instruction was not submitted.", "2026/05/26 16:10:03 (UTC+08:00)"]);
    showToast("Rejected. No KGIB bank instruction submitted.");
  }
  renderRows();
  openDetails(item.id);
}

document.querySelector("#kgibBtn").addEventListener("click", () => {
  resetKgibForm();
  openModal(kgibModal);
});
document.querySelector("#newBtn").addEventListener("click", () => openModal(standardModal));
document.querySelector("#closeKgibBtn").addEventListener("click", closeModals);
document.querySelector("#cancelKgibBtn").addEventListener("click", closeModals);
document.querySelectorAll("[data-close-standard]").forEach((node) => node.addEventListener("click", closeModals));
modalBackdrop.addEventListener("click", closeModals);
currency.addEventListener("change", updateBalance);
assetType.addEventListener("change", updateBalance);
createKgibBtn.addEventListener("click", createKgibRequest);
document.querySelector("#searchBtn").addEventListener("click", renderRows);
document.querySelector("#clearBtn").addEventListener("click", () => {
  document.querySelectorAll(".toolbar input").forEach((input) => { input.value = ""; });
  document.querySelectorAll(".toolbar select").forEach((select) => { select.value = ""; });
  renderRows();
});
requestRows.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) openDetails(detailButton.dataset.detail);
});
detailFooter.addEventListener("click", (event) => {
  if (event.target.closest("[data-approve]")) reviewRequest(true);
  if (event.target.closest("[data-reject]")) reviewRequest(false);
  if (event.target.closest("[data-close-detail]")) closeModals();
});
document.querySelector("#closeDetailBtn").addEventListener("click", closeModals);

renderRows();
