'use strict';
///BUGS : Vidhi zindabad : BUG 1 : loan liya toh balance aint updating, and I am not able to transfer henceforth. Check workflow of objects, UI, movements, and recompute movements and checkers !! lessgoooooo. BUG 2 :check number of decimals in interest (Integer.toFixed(2)) BUG 3: Welcome name needs to go after deleting account

// BANKIST APP
// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

//Data 2, Numbers Dates Section
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-09-27T17:01:17.194Z',
    '2023-09-20T23:36:17.929Z',
    '2023-09-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-09-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
//acronyms for login

const createUsernames = users => {
  users.forEach(user => {
    user.username = user.owner
      .split(' ')
      .reduce((acc, curr) => acc + curr[0], '');
  });
};
createUsernames(accounts);

//date formatting for displaying the movements

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  } else if (daysPassed === 1) {
    return 'Yesterday';
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  // const [day, month, year] = [
  //   `${date.getDate()}`.padStart(2, '0'),
  //   `${date.getMonth() + 1}`.padStart(2, '0'),
  //   date.getFullYear(),
  // ];
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date); //options object for TIME, not date
};
//COME BACK TO THIS
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//movements of money->withdrawals and deposits
const displayMovements = function (account, sort = false) {
  console.log(sort);
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b) //-1 for increasing, 1 for decreasing
    : account.movements; //slice is used because we want a new array or else accpunt.movements array will be mutated

  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formattedMovement = formatCurrency(
      mov,
      account.locale,
      account.currency
    );
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    let movRowLiteral = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()}</div>
    <div class="movements__date">${displayDate}</div>
    
    <div class="movements__value">${formattedMovement}</div> 
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', movRowLiteral);
  });
};

const computeBalances = accounts => {
  accounts.forEach(account => {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  });
};
computeBalances(accounts);

//balance of account
const calcDisplayBalance = account => {
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

//bottom statistics of deposits, withdrawals and interest on deposits with chaining methods, interests part is pretty cool and interesting
const calcDisplaySummary = account => {
  let inRes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  let outRes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  let interestRes = account.movements
    .filter(movs => movs > 0)
    .map(ele => (ele * account.interestRate) / 100)
    .filter(ele => ele > 1)
    .reduce((acc, ele) => acc + ele, 0);

  labelSumIn.textContent = formatCurrency(
    inRes,
    account.locale,
    account.currency
  );
  labelSumOut.textContent = formatCurrency(
    Math.abs(outRes),
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interestRes,
    account.locale,
    account.currency
  );
  console.log(account1.movements);
};

const updateUI = currentAccount => {
  inputTransferAmount.value = inputTransferTo.value = '';
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  const tick = () => {
    let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  let time = 120;
  tick(); //no delay for one second
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer; //should be global
//FAKING LOGIN state, hardcoding for now
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

//EVENT HANDLERS

//login Button

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  let loginUsername = inputLoginUsername.value;
  let loginPIN = Number(inputLoginPin.value);
  let accountObj = accounts.find(acc => acc.username === loginUsername);
  currentAccount = accountObj?.pin == loginPIN ? accountObj : undefined;
  console.log(currentAccount);
  if (currentAccount) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    //taking focus away from input field
    inputLoginPin.blur();
    //date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    }; //options object for TIME, not date
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();
    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
  }
});

//transfer button
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recepient = inputTransferTo.value.toLowerCase();
  //check if recepient valid first;
  if (amount > currentAccount.balance || amount < 0) {
    alert('Insufficient funds/Negative funds');
    return;
  }
  if (recepient.toLowerCase() === currentAccount.username.toLowerCase()) {
    alert("Can't transfer to self");
    return;
  }
  let recepientObj = accounts.find(account => {
    console.log(account.username.toLowerCase() + ' ---- ' + recepient);
    return account.username.toLowerCase() == recepient;
  });
  console.log(recepientObj);
  if (!recepientObj) {
    alert('Please enter valid recepient!');
    return;
  }

  currentAccount.movements.push(-1 * amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  recepientObj.movements.push(amount);
  recepientObj.movementsDates.push(new Date().toISOString());
  computeBalances(accounts);

  clearInterval(timer);
  timer = startLogOutTimer();
  updateUI(currentAccount);
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let loanAmt = Math.floor(+inputLoanAmount.value); //+ is short for type coercion to Number, not needed tho as Math.floor does type Coerction too but readability
  if (loanAmt <= 0) {
    alert("amount can't be negative or 0");
    return;
  }
  //condition:grant loan if there's a deposit that's atleast 10% of loan amt.
  //multiple ways to go about it, map, filter, but we'll use SOME

  if (currentAccount.movements.some(value => value >= 0.1 * loanAmt)) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmt);
      currentAccount.movementsDates.push(new Date().toISOString());
      computeBalances(accounts);

      clearInterval(timer);
      timer = startLogOutTimer();
      updateUI(currentAccount);
    }, 2000);
  } else {
    alert('Amount exceeds limit based on previous deposits');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  //can't be empty
  if (!(inputCloseUsername.value || inputClosePin.value)) {
    alert("Closing account's username or PIN cant be empty !");
    return;
  }
  //check if input username same as current user's username
  if (
    inputCloseUsername.value != currentAccount.username ||
    inputClosePin.value != currentAccount.pin
  ) {
    alert('Username/Password incorrect');
    return;
  }
  let accIndex = accounts.findIndex(
    acc => acc.username == inputCloseUsername.value
  );
  console.log(accIndex);
  //delete account
  accounts.splice(accIndex, 1); //adjusts the array too so sorted
  console.log(accounts);
  //hide UI
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
  inputCloseUsername.value = inputClosePin.value = '';
});
let toggleState = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  toggleState = toggleState ? false : true;
  displayMovements(currentAccount, toggleState);
});

//IT IS OVER YAY
