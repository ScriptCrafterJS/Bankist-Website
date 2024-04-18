"use strict";

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-08-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Motasem Ali",
  movements: [2300, 25000, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 2.1,
  pin: 3333,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-08-26T12:01:20.894Z",
  ],
  currency: "ILS",
  locale: "ar-jo",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
//convert currency to the local area currency
const formatCurrency = function (account, value) {
  return new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(value);
};

//convert the date to the local area date
const formatDate = function (movementDate, account) {
  const numberOfDays = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const days = numberOfDays(new Date(), movementDate);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} Days Ago`;
  return new Intl.DateTimeFormat(account.locale).format(movementDate);
};
//create movement
const createMovement = function ({ amount, index, date, account }) {
  const movementType = amount < 0 ? "withdrawal" : "deposit";
  const movementDate = new Date(date);
  const formattedMovementDate = formatDate(movementDate, account);

  const formattedValue = formatCurrency(account, amount);
  const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
    index + 1
  } ${movementType}</div>
    <div class="movements__date">${formattedMovementDate}</div>
      <div class="movements__value">${formattedValue}</div>
    </div>
  `;
  return html;
};

//display the movements of the current account
const displayMovements = function (account, movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (movement, i) {
    const movementHTML = createMovement({
      amount: movement.toFixed(2),
      index: i,
      date: account.movementsDates[i],
      account: account,
    });
    containerMovements.insertAdjacentHTML("afterbegin", movementHTML);
  });
};

//calculate the total balance of the current account
const calculateBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  account.balance = balance;
  labelBalance.textContent = formatCurrency(account, account.balance);
};

//display the statistics under the movements of the current account
const displayAccountStatistics = function (account) {
  const income = account.movements
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value);
  labelSumIn.textContent = formatCurrency(account, income);
  const outcome = account.movements
    .filter((value) => value < 0)
    .reduce((acc, value) => acc + value);
  labelSumOut.textContent = formatCurrency(account, Math.abs(outcome));
  const interest = account.movements
    .filter((value) => value > 0)
    .map((value) => (value * account.interestRate) / 100) // the next filter is for if the interest is result to be above 1€ it will be added
    .filter((value) => value >= 1)
    .reduce((acc, value) => acc + value, 0);
  labelSumInterest.textContent = formatCurrency(account, interest);
};

const updateUI = function (account) {
  calculateBalance(account);
  displayMovements(account, account.movements);
  displayAccountStatistics(account);
};

const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((partOfName) => partOfName[0])
      .join("");
  });
};
createUserName(accounts);

//creating the event handlers...

let currentAccount, timer;

const closeAccount = function () {
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    //delete the current account
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
};

//10 minutes timer until you logged out
const startTimeOut = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 600;
  tick();
  const PER_SECOND = 1000;
  timer = setInterval(tick, PER_SECOND);
};

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  //if the account exist then check for the pin method
  //the plus (+) before the inputLoginPin.value is to convert it to number
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    const currentDate = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(currentDate);
    updateUI(currentAccount);

    clearInterval(timer); //so we don't confuse with the previous timer.
    //call the timer function to start the 10 minutes countdown timer...
    startTimeOut();

    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (
    receiverAccount?.username !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //restart the timer
    clearInterval(timer);
    startTimeOut();

    inputTransferTo.value = inputTransferAmount.value = "";
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  closeAccount();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  //you only take loan if you have deposit that is 10% of the amount requested
  if (
    amount > 0 &&
    currentAccount.movements.some((value) => value >= amount * 0.1)
  ) {
    clearInterval(timer); //restart the timer
    startTimeOut();
    const LOAN_DELAY = 1.5 * 1000;
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, LOAN_DELAY);
    inputLoanAmount.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function () {
  let moves = currentAccount.movements;
  if (!sorted) {
    moves = moves.slice().sort((a, b) => a - b);
  }
  sorted = !sorted;
  displayMovements(currentAccount, moves);
});
