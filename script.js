// Get elements
const priceInput = document.getElementById('price');
const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDueDiv = document.getElementById('change-due');
const priceError = document.getElementById('price-error');
const cashError = document.getElementById('cash-error');

// Example cash-in-drawer array
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Array to define the currency units and their values
const currencyUnits = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 20],
  ["TEN", 10],
  ["FIVE", 5],
  ["ONE", 1],
  ["QUARTER", 0.25],
  ["DIME", 0.1],
  ["NICKEL", 0.05],
  ["PENNY", 0.01]
];

// Event listener for the purchase button
purchaseBtn.addEventListener('click', () => {
  const price = parseFloat(priceInput.value); // Get the price value
  const cash = parseFloat(cashInput.value);   // Get the cash value
  
  // Reset error messages
  priceError.style.display = 'none';
  cashError.style.display = 'none';

  // Handle invalid inputs
  if (isNaN(price) || isNaN(cash)) {
    if (isNaN(price)) {
      priceError.textContent = 'Please enter a valid price.';
      priceError.style.display = 'block';
    }
    if (isNaN(cash)) {
      cashError.textContent = 'Please enter a valid amount of cash.';
      cashError.style.display = 'block';
    }
    return;
  }
  
  // Handle case where cash provided is less than the price
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  
  // Calculate and display the result
  const result = checkCashRegister(price, cash, cid);
  changeDueDiv.innerHTML = result; // Use innerHTML to allow HTML content
  changeDueDiv.classList.add('show');
});

// Function to check cash register and calculate change
function checkCashRegister(price, cash, cid) {
  // Handle case where cash provided is exactly equal to the price
  if (cash === price) {
    return "No change due - customer paid with exact cash";
  }

  let change = cash - price; // Calculate the change required
  let totalCid = cid.reduce((sum, [unit, amount]) => sum + amount, 0).toFixed(2); // Calculate total cash in drawer

  // Handle case where cash in drawer is insufficient to provide the required change
  if (change > totalCid) {
    return "Status: INSUFFICIENT_FUNDS";
  } else if (change.toFixed(2) === totalCid) {
    return "Status: CLOSED";
  }

  let changeArr = [];

  // Loop through the currency units to determine the amount of each unit to return
  for (let [unit, value] of currencyUnits) {
    let amount = 0;
    while (change >= value && cid.find(c => c[0] === unit)[1] >= value) {
      change -= value;
      change = change.toFixed(2);
      amount += value;
      cid.find(c => c[0] === unit)[1] -= value;
    }
    if (amount > 0) {
      const count = (amount / value).toFixed(0); // Calculate the count of each unit
      changeArr.push(`${unit}: ${count} ($${amount.toFixed(2)})`); // Add to change array
    }
  }

  // Handle case where exact change cannot be provided
  if (change > 0) {
    return "Status: INSUFFICIENT_FUNDS";
  }

  // Return the status and the breakdown of change with each unit on a new line
  return `Status: OPEN<br>${changeArr.join('<br>')}`;
}
