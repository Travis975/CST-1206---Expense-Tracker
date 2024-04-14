let expenseList = [];

function checkIfUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'http://localhost:4000';
    }
}

async function createExpense(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    const expenseData = {
        category,
        amount,
        description,
        date
    }

    console.log('user input: ', expenseData);

    const token = localStorage.getItem('token');

    console.log('this is the token: ', token);

    if (!token) {
        alert("TOKEN NOT FOUND!");
        return;
    }

    try {
        const createdExpense = await fetch('/api/v2/user/expenses', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(expenseData)
        });

        const createdExpenseJSON = await createdExpense.json();
        console.log(createdExpenseJSON);

        if (createdExpenseJSON) {
            alert(createdExpenseJSON.message);
        }
    } catch(error) {
        alert('There was an error creating post!', error);
    }
}

async function getAllExpenses() {
    try {
        const allExpenses = await fetch('/api/v2/user/expenses');

        const allExpensesJSON = await allExpenses.json();
        expenseList = allExpensesJSON.data;

        generateAllExpenses(expenseList);
    } catch(error) {
        alert('There was an error getting posts!')
    }
}
 
async function generateAllExpenses(expenseList) {
    const expenseElements = document.getElementById('allItems');
    console.log(expenseElements, 'expenseElements')
    expenseElements.innerHTML = "";

    for (let expense of expenseList) {
        const expenseItem = 
        `
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="p-5">
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${expense.category}</h5>
                </a>
                <h5 class="mb-3 font-normal text-gray-700 dark:text-gray-400">Cost</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${expense.amount}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${expense.description}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${expense.date}</p>
            </div>
        </div>
        `

        expenseElements.innerHTML += expenseItem;
    }
    
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:4000';
}

checkIfUserLoggedIn();
getAllExpenses();