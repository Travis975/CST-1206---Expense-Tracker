let expenseList = [];

function checkIfUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'http://localhost:4000';
    }
}

function toggleUserInput() {
    let userInput = document.getElementById("userInput");
    userInput.style.display = userInput.style.display === "none" ? "flex" : "none";
}



async function createExpense(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const expenseData = {
        category,
        amount,
        description,
        date
    }

    // console.log('user input: ', expenseData);

    const token = localStorage.getItem('token');

    // console.log('this is the token: ', token);

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
        // console.log(createdExpenseJSON);

        if (createdExpenseJSON) {
            console.log(createdExpenseJSON.message);
            getAllExpenses(expenseList);
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

    if (expenseList.length > 0){
        for (let expense of expenseList) {
            const expenseItem = 
            `
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="p-5">
                    <a href="#">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${expense.category}</h5>
                    </a>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> Cost: $${expense.amount.toFixed(2)}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> Description: ${expense.description}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> Date: ${formatDate(expense.date)}</p>
                </div>
                <div class="mt-1">
                    <button type="submit" class="delete-button block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" data-expense-id=${expense._id}>Delete Expense</button>
                </div>
            </div>
            `
    
            expenseElements.innerHTML += expenseItem;
        }
    }
    else{
        expenseElements.innerHTML = 
        `
        <main class="flex min-h-full align-center place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">No Expenses Found</h1>
          <p class="mt-6 text-base leading-7 text-gray-600">Please add an expense to start tracking</p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
          </div>
        </div>
        </main>
      `
        
    }

    attachDeleteEventListeners();
}

function formatDate(dateString) {
    // Since dateString is in the format 'yyyy-mm-dd'
    const dateParts = dateString.split('-'); 
    const year = parseInt(dateParts[0]);
    // Month is zero-based in JavaScript Date object
    const month = parseInt(dateParts[1]) - 1; 
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[date.getMonth()];
    
    return `${day} ${monthName} ${year}`;
}



async function deleteExpense(expenseId) {
    const token = localStorage.getItem('token');

    try {
        const expenseData = await fetch(`/api/v2/user/expenses/${expenseId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (expenseData) {
            // Remove the deleted expense from expenseList
            expenseList = expenseList.filter(expense => expense._id !== expenseId);
            // Update the UI
            generateAllExpenses(expenseList);
            console.log("Expense deleted successfully!");
        } else {
            // Handle error response
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Error deleting expense. Please try again.");
    }
}

function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const expenseId = button.dataset.expenseId;
            await deleteExpense(expenseId);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Call getExpensesByMonth() initially to display expenses for the default selected month
    getExpensesByMonth();
});

async function getExpensesByMonth() {
    const selectedMonth = document.getElementById('selectMonth').value;

    try {
        const expenseData = await fetch(`/api/v2/user/expenses?month=${selectedMonth}`);
        if (expenseData) {
            const expensesByMonth = await response.json();
            displayExpensesByMonth(expensesByMonth);
        } else {
            throw new Error('Failed to fetch expenses by month');
        }
    } catch (error) {
        console.error('Error fetching expenses by month:', error);
        alert('Error fetching expenses by month. Please try again.');
    }
}

function displayExpensesByMonth(expenses) {
    // Clear the existing content
    const monthlyCost = document.getElementById('MonthlyCost');
    monthlyCost.innerHTML = '';

    // Display expenses by month
    if (expenses.length > 0) {
        const expensesList = document.createElement('ul');
        expenses.forEach(expense => {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.category}: $${expense.amount}`;
            expensesList.appendChild(listItem);
        });
        monthlyCost.appendChild(expensesList);
    } else {
        monthlyCost.textContent = 'No expenses found for the selected month.';
    }
}


function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:4000';
}

checkIfUserLoggedIn();
getAllExpenses();


