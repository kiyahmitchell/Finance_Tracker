// DOM Elements
const accountForm = document.getElementById("account-form");
const accountName = document.getElementById("account-name");
const accountBalance = document.getElementById("account-balance");
const accountList = document.getElementById("account-list");
const transactionForm = document.getElementById("transaction-form");
const transactionAccount = document.getElementById("transaction-account");
const transactionName = document.getElementById("transaction-name");
const transactionAmount = document.getElementById("transaction-amount");
const transactionType = document.getElementById("transaction-type");
const transactionList = document.getElementById("transaction-list");

// Local storage
const storageKey = "financeTrackerData";
let data = JSON.parse(localStorage.getItem(storageKey)) || {
  accounts: [],
  transactions: [],
};

// Save data to localStorage
function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// Add account
accountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const account = {
    id: Date.now(),
    name: accountName.value,
    balance: parseFloat(accountBalance.value),
  };

  data.accounts.push(account);
  saveData();
  renderAccounts();
  accountForm.reset();
});

// Render accounts
function renderAccounts() {
  accountList.innerHTML = "";
  transactionAccount.innerHTML =
    '<option value="" disabled selected>Select Account</option>';

  data.accounts.forEach((account) => {
    const li = document.createElement("li");
    li.textContent = `${account.name} - $${account.balance.toFixed(2)}`;
    accountList.appendChild(li);

    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = account.name;
    transactionAccount.appendChild(option);
  });
}

// Add transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    accountId: parseInt(transactionAccount.value),
    name: transactionName.value,
    amount: parseFloat(transactionAmount.value),
    type: transactionType.value, // Add the transaction type (income or expense)
  };

  data.transactions.push(transaction);

  // Update the account balance based on transaction type
  const account = data.accounts.find((acc) => acc.id === transaction.accountId);
  if (transaction.type === "income") {
    account.balance += transaction.amount;
  } else if (transaction.type === "expense") {
    account.balance -= transaction.amount;
  }

  saveData();
  renderAccounts();
  renderTransactions();
  transactionForm.reset();
});

// Render transactions
function renderTransactions() {
  transactionList.innerHTML = "";

  data.transactions.forEach((transaction) => {
    const account = data.accounts.find(
      (acc) => acc.id === transaction.accountId
    );
    const li = document.createElement("li");
    li.textContent = `${transaction.name} (${
      transaction.type
    }) - $${transaction.amount.toFixed(2)} in ${account.name}`;
    li.classList.add(transaction.type); // Adds 'income' or 'expense' class for styling
    transactionList.appendChild(li);
  });
}

// Initial render
renderAccounts();
renderTransactions();
