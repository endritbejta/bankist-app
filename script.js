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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;
  //.textContent = 0
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const calcDisplayBalace = function (acc) {
  // console.log(acc);
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
  // return balance;
};
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  //calc balance
  calcDisplayBalace(acc);
  //calc summary
  calcDisplaySummary(acc);
};

//// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // find current account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // show welcome message and container
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // calc movements

    //update ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // only grants a loan if there there is a deposit with at least 10% amount of the requested loan
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentAccount.username, currentAccount.pin);

  if (
    currentAccount.username === inputCloseUsername.value &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // console.log(accounts);

    // hide UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted); // for this to work we made a correction at the display movements fnc, making it acc two arguments(movements, sort), and here we call that function either with true or with false, each time we click we change it and then it sorts the array
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// slice method, we can slice an array without changing the original array
console.log(arr.slice(2)); // start slicing at index 2, wich in this case is c, and it returns a new array
console.log(arr.slice(2, 4)); // index 4 is not included
console.log(arr.slice(-1)); // take the last element
console.log(arr.slice(1, -2)); // starts at position one and returns all te values but not D and E in this case
console.log(arr.slice()); // it gives us a new copy

// splice
// console.log(arr.splice(2)); // takes all the elements from the element with index 2, and removes them from the original array
arr.splice(-1);
console.log(arr);
arr.splice(1, 2); // we delete two elements
console.log(arr);

// reverse

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse()); // mutates the original array
console.log(arr2);

// concat method

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); // same as concat method, its up to you wich one to choose

// join
console.log(letters.join(' - '));
*/
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));
// getting the last element old way
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);

// getting the last element with at
console.log(arr.at(-1));
console.log(arr.at(-2));

console.log('jonas'.at(0)); // works also on strings
*/
/*

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log(`--------- FOR EACH   -------------`);
movements.forEach(function (movement, index, array) {
  // console.log(array);
  if (movement > 0) {
    console.log(`Movement: ${index + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement: ${index + 1} You withdrew ${Math.abs(movement)}`);
  }
});
// continue and break do not work in forEach, if u need to break out of a loop we have to use for of loop
*/
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// set
const currenciesUnique = new Set(['USD', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

// account1.movements.forEach(function (mov, i) {
//   containerApp.insertAdjacentHTML = `<div class="movements__row">
//   <div class="movements__type movements__type--withdrawal">
//     ${i + 1} ${mov > 0 ? 'Deposit' : 'Withdrawal'}
//   </div>
//   <div class="movements__date">24/01/2037</div>
//   <div class="movements__value">${Math.abs(mov)}</div>
// </div>`;
//   containerApp.appendChild();
// });

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function (dogsJulia, dogsKate) {
  const realDogsJulia = dogsJulia.slice(1, -1);
  // console.log(realDogsJulia);
  const bothArr = realDogsJulia.concat(dogsKate);
  // console.log(bothArr);
  console.log(
    bothArr.forEach(function (years, i) {
      console.log(
        years > 3
          ? `Dog number ${i + 1} is an adult and is ${years} old`
          : `Dog ${i + 1} is still a puppy`
      );
    })
  );
};
checkDogs(dogsJulia, dogsKate);
*/

// the map method

/*
const euroToUSD = 1.1;

const movementsUSD = movements.map(mov => mov * euroToUSD);

console.log(movements, movementsUSD);
const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * euroToUSD);
}

console.log(movementsUSDfor);

const movementsDesc = movements.map((mov, i) => {
  return `movement ${i + 1}: You ${
    mov > 0 ? 'deposited' : 'withdrew'
  } ${Math.abs(mov)}`;
});

console.log(movementsDesc);
*/

/*

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
console.log(movements);
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(acc, cur, i);
  return acc + cur;
}, 0);
console.log(balance);

// max value of movements arr

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAvgHumanAge = function (ages) {
  const humanAge = ages.map(dog =>
    dog > 2 ? (dog = dog * 4 + 16) : (dog = dog * 2)
  );
  const adultDog = humanAge.filter(humanAge => humanAge >= 18);
  console.log(adultDog);

  const avgAge = adultDog.reduce(
    (avg, curr) => avg + curr / adultDog.length,
    0
  );
  console.log(avgAge);
};
calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/
/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAgeArrow = ages => {
  return ages
    .map(age => (age > 2 ? (age = age * 4 + 16) : (age = age * 2)))
    .filter(age => {
      return age >= 18; 
    })
    .reduce((avg, cur, i, arr) => avg + cur / arr.length, 0);
};

console.log(calcAverageHumanAgeArrow([5, 2, 4, 1, 15, 8, 3]));
*/

// console.log(movements.find(mov => mov < 0));

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
/*
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/
/*
const owners = ['jonas', 'zach', 'adam', 'martha'];
console.log(owners.sort()); // mutates the original string
console.log(owners);

console.log(movements);
console.log(movements.sort()); // this way the sort method does not sot by the value of numbers, because it sorts by converting them to strings

movements.sort((a, b) => a - b);
console.log(movements);
*/

/*
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
const x = new Array(7);
// console.log(x);
// console.log(x.map(() => 5)); // this does not work

x.fill(1, 3, 6); // fills with one three elements
console.log(x);
arr.fill(23, 4, 6); // mutates the original arr
console.log(arr);

Array.from({ length: 7 }, () => 1);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const diceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
console.log(diceRolls);

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  movementsUI = [...document.querySelectorAll('.movements__value')]
});
*/

// const bankDepositsSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(bankDepositsSum);

// // const bankDepositsSum1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;
// console.log(bankDepositsSum);

// let a = 10;
// console.log(a++);
// console.log(a);

// // 3. create a sum which contains the sum of deposits and withdrawals

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     {
//       deposits: 0,
//       withdrawals: 0,
//     }
//   );

// console.log(deposits, withdrawals);

// //this is a nice title => This Is a Nice Title

// const str = 'This is a nice title and it is the sky blue';
// const exceptions = ['a', 'and', 'the'];
// const titleConstructor = function (str) {
//   return str
//     .toLowerCase()
//     .split(' ')
//     .map(word => {
//       if (exceptions.includes(word)) {
//         return word;
//       } else {
//         return word[0].toUpperCase() + word.slice(1);
//       }
//     })
//     .join(' ');
// };
// console.log(titleConstructor(str));

// ///////////////////////////////////////
// // Coding Challenge #4

// /*
// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
// Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

// GOOD LUCK 😀
// */

// // 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// const dogs = [
//   { weight: 22, curFood: 280, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));

// console.log(dogs);

// // 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   sarahDog.recommendedFood > sarahDog.curFood
//     ? 'Saras dog is eating too much'
//     : 'Sarah dog is eating too little'
// );

// // 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();

// console.log(ownersEatTooLittle);
// console.log(ownersEatTooMuch);
// // 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);

// // 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)

// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// // 7/ dogs that eat okay

// const dogsOkay = dog =>
//   dog.curFood > 0.9 * dog.recommendedFood &&
//   dog.curFood < 1.1 * dog.recommendedFood;

// console.log(dogs.filter(dogsOkay));

// console.log(dogsOkay);

// // Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// const shallowDogsSorted = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(shallowDogsSorted);

// const isArray = function (anything) {
//   if (typeof anything === 'string') {
//     return true;
//   } else return false;
// };

// console.log(isArray('endrit'));
// console.log(isArray(23));
// console.log(isArray({ e: 'endrit' }));
// console.log(isArray([3, 4, 5, 3]));

// const first = function (arr, n) {
//   if (!arr) return void 0;
//   if (n == null) return arr[0];
//   if (n < 0) return [];
//   else return arr.slice(0, n);
// };

// console.log(first([7, 9, 0]));
// console.log(first([3]));
// console.log(first([7, 9, 0, -2], 3));
// console.log(first([7, 9, 0, -2], 6));
// console.log(first([7, 9, 0, -2], -3));

// const lastEl = function (arr, n) {
//   if (!arr) return;
//   if (n == null) return arr[arr.length - 1];
//   if (n) return arr.slice(-n);
// };

// console.log(lastEl([7, 9, 0]));
// console.log(lastEl([7, 9, 0, 2], 3));
// console.log(lastEl([7, 9, 0, 2], 6));

// // 8. Write a JavaScript program to find the most frequent item of an array. Go to the editor
// // Sample array : var arr1=[3, 'a', 'a', 'a', 2, 3, 'a', 3, 'a', 2, 4, 9, 3];
// // Sample Output : a ( 5 times )
// const arr1 = [3, 'a', 'a', 'a', 2, 3, 'a', 3, 'a', 2, 4, 9, 3];

// let mf = 1;
// let m = 0;
// let item;
// for (let i = 0; i < arr1.length; i++) {
//   for (let j = i; j < arr1.length; j++) {
//     if (arr1[i] == arr1[j]) m++;
//     if (mf < m) {
//       mf = m;
//       item = arr1[i];
//     }
//   }
//   m = 0;
// }

// console.log(item + '(' + mf + ' times )');

// // 9. Write a JavaScript program which accept a string as input and swap the case of each character. For example if you input 'The Quick Brown Fox' the output should be 'tHE qUICK bROWN fOX'

// const swap = function (str) {
//   let newTxt = '';
//   str.split('').map(e => {
//     if (e == e.toUpperCase()) {
//       newTxt += e.toLowerCase();
//     } else {
//       newTxt += e.toUpperCase();
//     }
//   });
//   return newTxt;
// };

// swap('the QuiCk bRown Fox');
// console.log(swap('endrit bejtaA as sad asdASD sad'));

// const swap1 = function (str) {
//   const upper = 'QWERTYUIOPASDFGHJKLZXCVBNM';
//   const lower = 'qwertyuiopasdfghjklzxcvbnm';
//   const result = [];

//   for (let i = 0; i < str.length; i++) {
//     if (lower.indexOf(str[i]) !== -1) {
//       result.push(str[i].toUpperCase());
//     } else if (upper.indexOf(str[i]) !== -1) {
//       result.push(str[i].toLowerCase());
//     } else result.push(str[i]);
//   }
//   return result.join('');
// };
// console.log(swap1('The Quick Brown Fox'));

// const swap3 = function (str) {
//   let result = '';
//   str.split('').map(l => {
//     if (l == l.toLowerCase()) {
//       return (result += l.toUpperCase());
//     } else {
//       return (result += l.toLowerCase());
//     }
//   });
//   return result;
// };

// console.log(swap3('The Quick Brown Fox'));

// var a = [
//   [1, 2, 1, 24],
//   [8, 11, 9, 4],
//   [7, 0, 7, 27],
//   [7, 4, 28, 14],
//   [3, 10, 26, 7],
// ];

// function print(a) {
//   a.forEach((el, i) => {
//     console.log(`Row${i + 1}`);
//     el.forEach(el => console.log(`"${el}"`));
//   });
// }
// print(a);

// for (var i in a) {
//   console.log('row ' + i);
//   for (var j in a[i]) {
//     console.log(' ' + a[i][j]);
//   }
// }

// const squareFNC = function (arr) {
//   return arr.reduce((sum, curr) => sum + curr ** 2, 0);
// };

// console.log([1, 1, 2].reduce((acc, cur) => acc + cur ** 2, 0));

// console.log(squareFNC([1, 1, 1]));
// console.log(squareFNC([2, 3]));

// const sumArr = function (arr) {
//   return arr.reduce((acc, cur) => acc + cur, 0);
// };

// const productArr = function (arr) {
//   return arr.reduce((acc, cur) => acc * cur, 1);
// };

// console.log(sumArr([2, 2, 3]), productArr([2, 2, 3]));

// // Write a JavaScript program to remove duplicate items from an array (ignore case sensitivity).

// const remover = function (str) {
//   const strLower = str.map(word =>
//     typeof word === 'string' ? word.toLowerCase() : word
//   );

//   for (let i = 0; i < strLower.length; i++) {
//     for (let j = i + 1; j < strLower.length; j++) {
//       while (strLower[i] === strLower[j]) {
//         strLower.splice(j, 1);
//         // continue;
//       }
//       // console.log(strLower);
//     }
//   }
//   return strLower;
// };

// console.log(
//   remover([
//     1,
//     2,
//     3,
//     3,
//     3,
//     5,
//     2,
//     1,
//     2,
//     3,
//     12,
//     23,
//     23,
//     23,
//     23,
//     23,
//     23,
//     'endrit',
//     'nezir',
//     'erina',
//     'Erina',
//     'Bejta',
//     'endrit',
//     'bejta',
//   ])
// );

// // We have the following arrays : Go to the editor
// // Write a JavaScript program to display the colors in the following way :
// // "1st choice is Blue ."
// // "2nd choice is Green."
// // "3rd choice is Red."
// // - - - - - - - - - - - - -
// // Note : Use ordinal numbers to tell their position.

// let color = ['Blue', 'Green', 'Red', 'Orange', 'Violet', 'Indigo', 'Yellow'];
// let o = ['th', 'st', 'nd', 'rd'];

// const displayColor = function (clr) {
//   clr.forEach((color, i) => {
//     console.log(
//       `${i + 1}${i < o.length - 1 ? o[i + 1] : o[0]} choice is ${color}.`
//     );
//   });
// };

// // console.log(displayColor(color));

// const shufle = function (str) {
//   let len = str.length;
//   let temp, index;

//   while (len > 0) {
//     //generate a random index
//     index = Math.floor(Math.random() * len);
//     // console.log(index);

//     temp = str[len];
//     str[len] = str[index];
//     str[index] = temp;

//     len--;
//   }
//   return str;
// };
// console.log([1, 2, 23, 4]);
// console.log(shufle([1, 2, 23, 4, 42, 32, 4, 23, 3, 52, 3, 23, 2, 523]).length);
// console.log(arr);

// const arr1 = [1, 1, 1, 1, 1, 1, 1, 1, 1];
// const arr2 = [2, 2, 2, 23, 3, 2, 2, 3, 4, 32, 3, 3, 2, 3, 23, 23, 2, 32, 313];
// const sumOfArr = function (arr1, arr2) {
//   let l1 = arr1.length;
//   let l2 = arr2.length;
//   let sum = [];
//   let it = l1 > l2 ? l1 : l2;
//   for (let i = 0; i < it; i++) {
//     if (!arr1[i]) arr1[i] = 0;
//     if (!arr2[i]) arr2[i] = 0;
//     sum.push(arr1[i] + arr2[i]);
//   }
//   return sum;
// };

// console.log(sumOfArr(arr1, arr2));
// console.log(arr1, arr2);

// const duplicateFinder = function (arr) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 1; j < arr.length; j++) {
//       // while (arr[i] === arr[j]) {
//       //   return `duplicate found ${arr[j]}`;
//       //   continue;
//       // }
//     }
//   }
// };

// console.log(duplicateFinder([1, 2, 2, 3, 2, 3, 2]));

// console.log(
//   find_duplicate_in_array([1, 1, 2, -2, 4, 5, 4, 7, 8, 7, 7, 71, 3, 6])
// // );

// let obj = {};
// obj[2] = 0;
// obj[4] = 1;
// console.log(obj);

// const endrit = {
//   user: 'endrit',
//   2: 1,
//   email: 'endrit.bejta@hotmail.com',
// };

// for (const [key, val] of Object.entries(endrit)) {
//   console.log(key, val);
// }

// for (const prop in obj) {
//   console.log(obj[prop]);
// }
// const duplicateFinder = function (arr) {
//   const object = {};
//   const result = [];

//   arr.forEach(item => {
//     if (!object[item]) object[item] = 0;
//     object[item] += 1;
//   });

//   // console.log(object);

//   for (const prop in object) {
//     // console.log(key, val);
//     if (object[prop] >= 2) {
//       //
//       result.push(prop);
//       // result.push(Number(key));
//     }
//   }
//   return result;
// };
// console.log(duplicateFinder([1, 2, 3, 4, 6, 6, 64, 2, 42, 32, 32, 6, 2, 1]));
// // console.log(Object.entries(obj));

// function find_duplicate_in_array(arra1) {
//   var object = {};
//   var result = [];

//   arra1.forEach(function (item) {
//     if (!object[item]) object[item] = 0;
//     object[item] += 1;
//   });

//   for (var prop in object) {
//     if (object[prop] >= 2) {
//       result.push(prop);
//     }
//   }

//   return result;
// }

// console.log(find_duplicate_in_array([1, 2, -2, 4, 5, 4, 7, 8, 7, 7, 71, 3, 6]));
// const union = function (arr1, arr2) {
//   let l1 = arr1.length;
//   let l2 = arr2.length;
// //   const uninonArr = [];
// //   // let
// //   let unionenSet = new Set(...arr1, ...arr2);
// //   // arr2.forEach(el => {});
// //   // for (const el in unionenSet)
// //   // }a
// //   // return;
// // };

// // console.log(union([1, 4, 2, 3], [24, 2, 1, 3]));

// const unionUne = function (arr1, arr2) {
//   if (!arr2) return arr1;

//   const firstPart = arr1;
//   // console.log(firstPart);
//   const secondPart = arr2.filter(el => !arr1.includes(el));
//   // console.log(secondPart);
//   return [...firstPart, ...secondPart].sort((a, b) => a - b);
// };

// function union(arra1, arra2) {
//   if (arra1 == null || arra2 == null) return void 0;

//   var obj = {};

//   for (var i = arra1.length - 1; i >= 0; --i) obj[arra1[i]] = arra1[i];

//   for (var i = arra2.length - 1; i >= 0; --i) obj[arra2[i]] = arra2[i];
//   // console.log(obj);
//   var res = [];

//   for (var n in obj) {
//     // console.log(n);
//     if (obj.hasOwnProperty(n)) res.push(obj[n]);
//   }

//   return res;
// }
// console.log(union([100, 2, 1, 10]));

// console.log(unionUne([1, 2, 3, 4, 5, 6, 7, 8]));

// let nestArr = [1, [2, 3], 3, [4, [2, [1, 2, [3]], 2], [21, 2], 43], 2];
// console.log(
//   nestArr
//     .toString()
//     .split(',')
//     .map(el => Number(el))
// );

// const enrit = {
//   user: 'endrit',
//   email: 'endrit@',
//   pw: '1234',
// };

// enrit.user = 'drilon';
// console.log(enrit);
// var flatten = function (a, shallow, r) {
//   if (!r) {
//     r = [];
//   }

//   if (shallow) {
//     return r.concat.apply(r, a);
//   }

//   for (var i = 0; i < a.length; i++) {
//     if (a[i].constructor == Array) {
//       flatten(a[i], shallow, r);
//     } else {
//       r.push(a[i]);
//     }
//   }
//   return r;
// };

// console.log(flatten([1, [2], [3, [[4]]], [5, 6]]));

const diffrenceFinder = function (arr1, arr2) {
  let obj = {};
  let difference = [];
  const first = arr1.filter(el => {
    if (!arr2.includes(el)) {
      obj[el] = 'Tick';
      // difference.push(el);
      // console.log(obj);
    }
  });
  console.log(first);
  const sec = arr2.filter(el => {
    if (!arr1.includes(el)) {
      obj[el] = 'Tick';
      // difference.push(el);
      // console.log(obj);
    }
  });
  for (const [endrit, meriton] of Object.entries(obj)) {
    difference.push(+endrit);
  }
  // const dif = [...arr1.filter(el => !arr2.includes(el), ...arr2.filter(el => !arr1.includes(el)))
  return difference;
};

console.log(
  diffrenceFinder(
    [1, 2, 4, 53, 231, 2, 23, 23, 23, 1, 1, 1, 5, 6, 3],
    [1, 2, 3, 5, 6, 6, 1000]
  )
);

// console.log(flatten([1, [2], [3, [[4]]], [5, 6]], true));

// const falsishValueRemover = function (arr) {
//   if (!arr) return;
//   // let iterator = -1;
//   let result = [];
//   // let resultIndex = -1;

//   // let length = arr ? arr.arrLength : 0;

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i]) {
//       result.push(arr[i]);
//     }
//   }
//   return result;
// };

// console.log(
//   falsishValueRemover([1, 2, 3, 0, 4, undefined, 2, null, NaN, 2, 4, 6, '', ''])
// );
/*
const library = [
  { author: 'Bill Gates', title: 'c', libraryID: 1254 },
  { author: 'Steve Jobs', title: 'a', libraryID: 4264 },
  {
    author: 'Suzanne Collins',
    title: 'b',
    libraryID: 3245,
  },
];
// console.log(library);

// function compareToSort(x, y) {
//   if (x.title < y.title) return -2;
//   if (x.title > y.title) return 3;
//   return 0;
// }
// console.log(library.sort(compareToSort));

library.slice().sort((a, b) => a.title - b.title);
console.log(library);

var objs = [
  { first_nom: 'Lazslo', last_nom: 'Jamf' },
  { first_nom: 'Pig', last_nom: 'Bodine' },
  { first_nom: 'Pirate', last_nom: 'Prentice' },
];
console.log(objs.sort((a, b) => a.last_nom - b.last_nom));

var ojbsSorted = library.sort(function (a, b) {
  if (a.title > b.title) return 1;
  if (a.title < b.title) return -1;
  return 0;
});
console.log(ojbsSorted);
*/
