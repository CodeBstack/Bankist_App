'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movs, sort = false) {
    //empty the initial container
    containerMovements.innerHTML = '';

    // To sort
    // const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'     //condition ? if true : if false -- ternary operators

        const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${1 + 1} ${type} </div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html)   //beforeend inverts them
    });
};
displayMovements(account1.movements);

//Calculating Balance and printing it.
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

    labelBalance.textContent = `${acc.balance.toFixed(2)}€`
}

// calcDisplayBalance(account1.movements);



//Summary
const calcDisplaySummary = function (acc) {
    //Income calc
    const incomes = acc.movements.filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`

    //Outcome Calc
    const outcomes = acc.movements.filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}€`

    //Interest Calc
    const interest = acc.movements.filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            return int >= 1;
        }) //excludes interests below 1
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// calcDisplaySummary(account1.movements);




// console.log(containerMovements.innerHTML);


//Computing Usernames using map & forEach
const createUsernames = function (accts) {
    accts.forEach(function (acct) {
        acct.username = acct.owner  //this will create a username object
            .toLowerCase()
            .split(' ') //this means, split the strings which has been transformed to lower case and put it into an array.
            .map(name => name[0])   //this means, get the element at position [0] of each elements of the splitted array.   //username function ends here
            .join('');    //or we do username.join('');
    });

};
// console.log(createUsernames(accounts));
//what we did here is just, forEach of the acct of accts(the passed in argument), add a new object which is the username which is then gotten by manipulating the owner object.


createUsernames(accounts);
console.log(account1.username); //js //this will only log only if the function createUsernames is called.
console.log(accounts);

//Update UI 
const updateUI = function (acc) {
    //Display movements
    displayMovements(currentAccount.movements);

    //Display balance
    calcDisplayBalance(currentAccount)

    //Display summary
    calcDisplaySummary(currentAccount)
};

//  Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
    //prevent form from submitting
    e.preventDefault();

    // console.log('LOGIN')

    currentAccount = accounts.find(acc => acc.username ===
        inputLoginUsername.value || acc.owner.split(' ')[0] === inputLoginUsername.value);

    // console.log(currentAccount);

    //  ? --optional chaining - the pin will only be read only if currentAccount exists.
    if (currentAccount?.pin === Number(inputLoginPin.value)) {

        //Display UI and message
        labelWelcome.textContent = `Welcome back,
          ${currentAccount.owner.split(' ')[0]}`

        containerApp.style.opacity = 100;

        //Update UI
        updateUI(currentAccount);

        console.log('Login')
    }

    //Clearing the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault(); //to prevent the click from reloading the page

    const amount = Number(inputTransferAmount.value);

    const recieverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value);

    // console.log(amount, recieverAcc);

    //blurring inputs from cursor focus
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();

    if (amount > 0 &&
        recieverAcc &&
        currentAccount.balance >= amount &&
        recieverAcc?.username !== currentAccount.username
    ) {
        console.log('Transfer Valid')
        //Doing the Transfer
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);

        //Update UI
        updateUI(currentAccount);
    }
});

//REQUESTTING LOAN  -- loan is granted if any deposit is greater the 10 percent of the requested loan 
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    //Rounding the loan amount value
    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        setTimeout(function () {
            //Add movement
            currentAccount.movements.push(amount);

            // updateUI
            updateUI(currentAccount)
        }, 2500);
    }
    inputLoanAmount.value = '';
})


//findIndex - returns the index(position) of an element and not the element.
btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.
        username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );
        console.log(index);
        // indexOf(23);

        //Delete account
        accounts.splice(index, 1);

        //Hide UI
        containerApp.style.opacity = 0;
    }

    //blurring inputs from cursor focus
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();

});

//using the flat method to add all movements of all accounts

// const accountMovements = accounts.map(acc => acc.
//     movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
//     console.log(allMovements)
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0)
// console.log(overalBalance);

//using chaining
const overalBalance = accounts
    .map(acc => acc.movements)
    .flat()
    .reduce((acc, mov) => acc + mov, 0)

console.log(overalBalance);

//flatMap - combines the flat and map method
const overalBalance2 = accounts
    .flatMap(acc => acc.movements)
    .reduce((acc, mov) => acc + mov, 0)

console.log(overalBalance2);



//SORT CLICK
let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})

//Using Array.from
labelBalance.addEventListener('click', function () {
    const movementsUI = Array.from(
        document.querySelectorAll('.movements__value'),
        el => Number(el.textContent.replace('€', ''))
    );

    // console.log(movementsUI.map(el => el.textContent.replace('€', '')));
    console.log(movementsUI)
});










