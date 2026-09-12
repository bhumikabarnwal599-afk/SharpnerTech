
const expenseForm = document.getElementById("expenseForm");

const expenseAmount = document.getElementById("expenseAmount");

const expenseDescription =
    document.getElementById("expenseDescription");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseList =
    document.getElementById("expenseList");

const submitButton =
    document.getElementById("submitButton");



let expenses = [];


let editExpenseId = null;


expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const amount = expenseAmount.value;

    const description =
        expenseDescription.value;

    const category =
        expenseCategory.value;


    if (
        amount === "" ||
        description === "" ||
        category === ""
    ) {
        alert("Please fill all the fields.");
        return;
    }


    if (editExpenseId !== null) {

        expenses = expenses.map(function (expense) {

            if (expense.id === editExpenseId) {

                return {
                    id: expense.id,
                    amount: amount,
                    description: description,
                    category: category
                };
            }

            return expense;
        });


        editExpenseId = null;

        submitButton.textContent = "Add Expense";

    }

    
    else {

        const expense = {

            id: Date.now(),

            amount: amount,

            description: description,

            category: category
        };


        expenses.push(expense);

    }

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    displayExpenses();

    expenseForm.reset();

});


function displayExpenses() {

   
    expenseList.innerHTML = "";


    expenses.forEach(function (expense) {

        const listItem =
            document.createElement("li");

        listItem.className =
            "list-group-item d-flex align-items-center";


        const expenseText =
            document.createElement("span");

        expenseText.textContent =
            `${expense.amount} - ${expense.category} - ${expense.description}`;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete Expense";

        deleteButton.className =
            "btn btn-danger btn-sm ms-3";


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit Expense";

        editButton.className =
            "btn btn-warning btn-sm ms-2";


        deleteButton.addEventListener(
            "click",
            function () {

                deleteExpense(expense.id);

            }
        );


        editButton.addEventListener(
            "click",
            function () {

                editExpense(expense.id);

            }
        );


        listItem.appendChild(expenseText);

        listItem.appendChild(deleteButton);

        listItem.appendChild(editButton);


        expenseList.appendChild(listItem);

    });

}


function deleteExpense(id) {

    // Remove expense from array
    expenses = expenses.filter(function (expense) {

        return expense.id !== id;

    });


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    displayExpenses();

}


function editExpense(id) {

    // Find expense
    const expense =
        expenses.find(function (expense) {

            return expense.id === id;

        });


    expenseAmount.value =
        expense.amount;

    expenseDescription.value =
        expense.description;

    expenseCategory.value =
        expense.category;

    editExpenseId = id;


    
    submitButton.textContent =
        "Update Expense";

}