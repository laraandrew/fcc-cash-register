// Get elements
const priceInput = document.getElementById('price');
const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDueDiv = document.getElementById('change-due');

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

// Event listener for purchase button
purchaseBtn.addEventListener('click', () => {
  const price = parseFloat(priceInput.value);
  const cash = parseFloat(cashInput.value);
  
  if (isNaN(price) || isNaN(cash)) { // handle invalid inputs
    alert('Please enter valid amounts for price and cash given.');
    return;
  }
  
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  
  const result = checkCashRegister(price, cash, cid);
  changeDueDiv.textContent = result;
  changeDueDiv.classList.add('show');
});

// Function to check cash register and calculate change
function checkCashRegister(price, cash, cid) {
  if (cash === price) {
    return "No change due - customer paid with exact cash";
  }

  let change = cash - price;
  let totalCid = cid.reduce((sum, [unit, amount]) => sum + amount, 0).toFixed(2);

  if (change > totalCid) { // required change to the customer is greater than cash in drawer
    return "Status: INSUFFICIENT_FUNDS";
  } else if (change.toFixed(2) === totalCid) {
    return "Status: CLOSED";
  }

  let changeArr = [];

  for (let [unit, value] of currencyUnits) { // sufficient change to give back to the customer
    let amount = 0;
    while (change >= value && cid.find(c => c[0] === unit)[1] >= value) {
      change -= value;
      change = change.toFixed(2);
      amount += value;
      cid.find(c => c[0] === unit)[1] -= value;
    }
    if (amount > 0) {
      const count = (amount / value).toFixed(0);
      changeArr.push(`${unit}: ${count} ($${amount.toFixed(2)})`);
    }
  }

  if (change > 0) {
    return "Status: INSUFFICIENT_FUNDS";
  }

  return `Status: OPEN ${changeArr.join(' ')}`;
}
