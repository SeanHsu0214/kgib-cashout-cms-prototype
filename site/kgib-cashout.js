const balanceMap = {
  "USD|C_DEPOSIT_FEE": "12,480.75",
  "TWD|C_DEPOSIT_FEE": "398,600",
  "USD|C_WITHDRAWAL_FEE": "8,940.20",
  "TWD|C_WITHDRAWAL_FEE": "256,800",
};

const orders = [
  {
    id: 102,
    scenario: "KGI Cashout",
    from: "1001",
    currency: "USD",
    amount: "8,940.20",
    to: "1000",
    custodian: "KGI",
    status: "PENDING REVIEW",
    assetType: "C_WITHDRAWAL_FEE",
    balance: "8,940.20",
    created: "2026/05/26 14:18:20 (UTC+08:00)",
    updated: "2026/05/26 14:18:21 (UTC+08:00)",
    requester: "Sean Hsu",
    reason: "KGI fee balance cashout",
    note: "Full balance KGI withdrawal fee settlement.",
  },
  {
    id: 101,
    scenario: "KGI Cashout",
    from: "1001",
    currency: "TWD",
    amount: "398,600",
    to: "1000",
    custodian: "KGI",
    status: "APPROVED",
    assetType: "C_DEPOSIT_FEE",
    balance: "398,600",
    created: "2026/05/25 11:22:59 (UTC+08:00)",
    updated: "2026/05/25 11:31:44 (UTC+08:00)",
    requester: "admin-tw",
    reason: "KGI fee balance cashout",
    note: "Full balance KGI deposit fee settlement.",
  },
  {
    id: 100,
    scenario: "KGI Cashout",
    from: "1001",
    currency: "USD",
    amount: "12,480.75",
    to: "1000",
    custodian: "KGI",
    status: "REJECTED",
    assetType: "C_DEPOSIT_FEE",
    balance: "12,480.75",
    created: "2026/05/22 12:13:11 (UTC+08:00)",
    updated: "2026/05/22 12:13:12 (UTC+08:00)",
    requester: "admin-tw",
    reason: "KGI fee balance cashout",
    note: "Rejected before bank submission.",
  },
];

const listPage = document.querySelector("#listPage");
const formPage = document.querySelector("#formPage");
const orderRows = document.querySelector("#orderRows");
const formCrumb = document.querySelector("#formCrumb");
const formTitle = document.querySelector("#formTitle");
const currency = document.querySelector("#currency");
const fromAssetType = document.querySelector("#fromAssetType");
const toAssetType = document.querySelector("#toAssetType");
const fromBalance = document.querySelector("#fromBalance");
const toBalance = document.querySelector("#toBalance");
const amount = document.querySelector("#amount");
const reason = document.querySelector("#reason");
const note = document.querySelector("#note");
const statusRow = document.querySelector("#statusRow");
const orderStatus = document.querySelector("#orderStatus");
const formFooter = document.querySelector("#formFooter");
const toast = document.querySelector("#toast");
let activeOrder = null;
let toastTimer = null;

function tag(value) {
  const color = value === "APPROVED" ? "green" : value === "REJECTED" ? "red" : "orange";
  return `<span class="tag ${color}">${value}</span>`;
}

function eyeIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>`;
}

function editIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Z"/><path d="M13.8 7 17 10.2"/><path d="M4 21h16"/></svg>`;
}

function renderOrders() {
  orderRows.innerHTML = orders.map((item) => `
    <tr>
      <td>${item.id}</td>
      <td>${item.scenario}</td>
      <td>${item.from}</td>
      <td>${item.currency}</td>
      <td>${item.amount}</td>
      <td>${item.to}</td>
      <td class="kgi-cell">${item.custodian}</td>
      <td>${tag(item.status)}</td>
      <td>${item.created}</td>
      <td>${item.updated}</td>
      <td>${item.requester}</td>
      <td>
        <div class="action-group">
          <button class="icon-action" data-view="${item.id}" type="button" aria-label="View order ${item.id}">${eyeIcon()}</button>
          <button class="icon-action" data-edit="${item.id}" type="button" aria-label="Edit order ${item.id}">${editIcon()}</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function showList() {
  formPage.hidden = true;
  listPage.hidden = false;
  activeOrder = null;
  renderOrders();
}

function resetCashoutForm() {
  currency.value = "";
  fromAssetType.value = "";
  toAssetType.value = "";
  fromBalance.textContent = "--";
  toBalance.textContent = "--";
  amount.value = "";
  reason.value = "KGI fee balance cashout";
  note.value = "Full balance KGI fee cashout for settlement and reconciliation.";
  statusRow.hidden = true;
  orderStatus.value = "";
}

function setEditable(editable) {
  currency.disabled = !editable;
  fromAssetType.disabled = !editable;
  reason.disabled = !editable;
  note.readOnly = !editable;
}

function setCreateFooter() {
  formFooter.innerHTML = `<button id="saveBtn" class="btn primary" type="button" disabled><span class="save-icon"></span> Save</button>`;
  document.querySelector("#saveBtn").addEventListener("click", createOrder);
}

function openCreate() {
  listPage.hidden = true;
  formPage.hidden = false;
  formCrumb.textContent = "Create";
  formTitle.textContent = "KGI Cashout";
  activeOrder = null;
  resetCashoutForm();
  setEditable(true);
  setCreateFooter();
}

function updateAmount() {
  const balance = balanceMap[`${currency.value}|${fromAssetType.value}`];
  toAssetType.value = fromAssetType.value;
  if (balance) {
    fromBalance.textContent = `${currency.value} ${balance}`;
    toBalance.textContent = "--";
    amount.value = balance;
  } else {
    fromBalance.textContent = "--";
    toBalance.textContent = "--";
    amount.value = "";
  }
  const saveBtn = document.querySelector("#saveBtn");
  if (saveBtn) {
    saveBtn.disabled = !balance;
  }
}

function createOrder() {
  if (!amount.value) return;
  const nextId = Math.max(...orders.map((item) => item.id)) + 1;
  orders.unshift({
    id: nextId,
    scenario: "KGI Cashout",
    from: "1001",
    currency: currency.value,
    amount: amount.value,
    to: "1000",
    custodian: "KGI",
    status: "PENDING REVIEW",
    assetType: fromAssetType.value,
    balance: amount.value,
    created: "2026/05/27 10:00:00 (UTC+08:00)",
    updated: "2026/05/27 10:00:00 (UTC+08:00)",
    requester: "Sean Hsu",
    reason: reason.value,
    note: note.value,
  });
  showList();
  showToast(`Order ${nextId} created. Pending checker review.`);
}

function openOrder(id, mode) {
  const item = orders.find((order) => order.id === Number(id));
  activeOrder = item;
  listPage.hidden = true;
  formPage.hidden = false;
  formCrumb.textContent = `${mode === "edit" ? "Edit" : "View"} / ${item.id}`;
  formTitle.textContent = "KGI Cashout";
  setEditable(false);
  currency.value = item.currency;
  fromAssetType.value = item.assetType;
  toAssetType.value = item.assetType;
  fromBalance.textContent = `${item.currency} ${item.balance}`;
  toBalance.textContent = "--";
  amount.value = item.amount;
  reason.value = item.reason;
  note.value = item.note;
  statusRow.hidden = false;
  orderStatus.value = item.status;
  if (mode === "edit" && item.status === "PENDING REVIEW") {
    formFooter.innerHTML = `
      <button class="btn" data-cancel-review type="button">Cancel</button>
      <button class="btn danger" data-reject type="button">Reject</button>
      <button class="btn primary" data-approve type="button">Approve</button>
    `;
  } else {
    formFooter.innerHTML = `<button class="btn" data-cancel-review type="button">Back</button>`;
  }
}

function reviewOrder(approved) {
  if (!activeOrder) return;
  activeOrder.status = approved ? "APPROVED" : "REJECTED";
  activeOrder.updated = "2026/05/27 10:03:12 (UTC+08:00)";
  showList();
  showToast(approved ? "Approved. KGIB instruction 04 submitted." : "Rejected. No bank instruction submitted.");
}

document.querySelector("#newBtn").addEventListener("click", openCreate);
document.querySelector("#backBtn").addEventListener("click", showList);
currency.addEventListener("change", updateAmount);
fromAssetType.addEventListener("change", updateAmount);
orderRows.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  const editButton = event.target.closest("[data-edit]");
  if (viewButton) openOrder(viewButton.dataset.view, "view");
  if (editButton) openOrder(editButton.dataset.edit, "edit");
});
formFooter.addEventListener("click", (event) => {
  if (event.target.closest("[data-cancel-review]")) showList();
  if (event.target.closest("[data-reject]")) reviewOrder(false);
  if (event.target.closest("[data-approve]")) reviewOrder(true);
});

renderOrders();
