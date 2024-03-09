var form = document.getElementById('addForm');
var itemList = document.getElementById('items');
var buyPremium = document.getElementById('buy-premium')
var table = document.getElementById('points-table')
var showLeaderboard = document.getElementById('show-leaderboard')
var leaderboardTag = document.getElementById('leaderboard-tag')
var downloadedFilesTag = document.getElementById('downloadedFiles-tag')
var report = document.getElementById('report')
var downloads = document.getElementById('download')
var premiumStatusElement = document.getElementById('premium-status');

// Adding a single event listener to handle form submission
form.addEventListener('submit', handleFormSubmission);
buyPremium.addEventListener('click', BuyPremium);
showLeaderboard.addEventListener('click', ShowLeaderboard)
downloads.addEventListener('click', download)

async function download(e){
    e.preventDefault()
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3000/expense/download", {
        headers: {'Authorization' : token}})
        .then(response => {
            console.log('download', response)
            if (response.status === 200){
                var a = document.createElement('a')
                a.href = response.data.fileURL
                a.download = 'myexpense.csv'
                a.click()
                postFiles(a.href)
                getFiles()
            }
        })
        .catch(err=> console.log(err))
}
async function postFiles(fileURL){
    const token = localStorage.getItem('token');
    console.log('fileURl from frontend',fileURL)
    const fileURLS = {
        fileUrls: fileURL
    }
    axios.post("http://localhost:3000/expense/postfileurls", fileURLS, {
        headers: {'Authorization' : token}})
        .then(response => console.log(response))
        .catch(err => console.log('postfiles frontend',err))
}

// Update the getFiles function in your frontend JavaScript
async function getFiles(page=1) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/expense/getfileurls?page=${page}`, {
        headers: { 'Authorization': token }
    })
        .then(response => {
            console.log('getfiles: ', response.data);
            showDownloadedFiles(response.data.allFileURLS);
            downloadedFilesTag.style.display = 'block';
            displayFilesPagination(response.data.totalPages, response.data.currentPage);
        })
        .catch(err => console.log('postfiles frontend', err));
}

function displayFilesPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('files-pagination-container');
    paginationContainer.innerHTML = ''; 

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-btn';
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => getFiles(i));

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        paginationContainer.appendChild(pageButton);
    }
}


function showDownloadedFiles(fileUrls) {
    const parentNode = document.getElementById('downloaded-table');
    console.log('showDownloadedFiles')
    parentNode.innerHTML = '';
    
    for (var i = 0; i < fileUrls.length; i++) {
        console.log('showing the Files details on page: ', fileUrls[i]);
        const li = document.createElement('li');
        li.className = 'lists';
        li.id = fileUrls[i].userId;

        const fileUrlElement = document.createElement('span');
        fileUrlElement.className = 'fileUrl';
        fileUrlElement.innerHTML = `<strong>FileURL: </strong>${fileUrls[i].fileURL}`;
        // Appending elements to the li
        li.appendChild(fileUrlElement);

        parentNode.appendChild(li);
    }
}


async function ShowLeaderboard(page=1) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/premium/leaderboard?page=${page}`, { headers: { 'Authorization': token } })
        .then(response => {
            console.log('leaderboard', response);
            showLeaderboardOnScreen(response.data.allLeaderBoardUsers);
            showLeaderboard.style.display = 'block';
            leaderboardTag.style.display = 'block';
            downloadedFilesTag.style.display = 'none';
            displayLeaderboardPagination(response.data.totalPages, response.data.currentPage);
        })
        .catch(err => console.log(err));
}


function displayLeaderboardPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('leaderboard-pagination-container');
    paginationContainer.innerHTML = ''; 

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-btn';
        pageButton.innerText = i;

        // Passing the page number to the ShowLeaderboard function
        pageButton.addEventListener('click', () => ShowLeaderboard(i));

        if (i === currentPage) {
            pageButton.classList.add('active');
            console.log('pagebutton')
        }

        paginationContainer.appendChild(pageButton);
        console.log('pagebutton2')
    }
}

function showLeaderboardOnScreen(expenses) {
    const parentNode = document.getElementById('points-table');
    parentNode.innerHTML = '';
    for (var i = 0; i < expenses.length; i++) {
        console.log('showing the user details on page: ', expenses[i]);
        const li = document.createElement('li');
        li.className = 'lists';
        li.id = expenses[i].userId;

        const userNameElement = document.createElement('span');
        userNameElement.className = 'userName';
        userNameElement.innerHTML = `<strong>User Name: </strong>${expenses[i].name}  <strong>-</strong> `;

        const totalExpenseAmountElement = document.createElement('span');
        totalExpenseAmountElement.className = 'totalExpenseAmount';
        totalExpenseAmountElement.innerHTML = `<strong>Total Expense Amount: </strong>₹${expenses[i].totalExpense}`;

        // Appending elements to the li
        li.appendChild(userNameElement);
        li.appendChild(totalExpenseAmountElement);

        parentNode.appendChild(li);
    }
}

async function BuyPremium(e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {'Authorization' : token }})
    console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            console.log('Razorpay response:', response); 
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } })
            alert('Congratulations! You are a Premium User Now.');
        }
    }
    const rzp1 = new Razorpay(options)
    rzp1.open()
    e.preventDefault()
    rzp1.on('payment.failed', function(response){
        console.log(response)
        alert('Something Went Wrong!')
    })
}
// delete event
itemList.addEventListener('click', removeItem);

function removeItem(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are You Sure? You want to delete this item?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
        }
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    var expenseAmt = document.getElementById('expenseamt').value;
    var expenseDescription = document.getElementById('description').value;
    var categoryValue = document.getElementById('category').value;
    var income = document.getElementById('income').checked;
    console.log('income', income)
    var li = document.createElement('li');
    li.className = 'list-group-item';

    var bigSpace = ' - ';

    var incomes = 'Income: ' + expenseAmt;
    var expenses = 'Expense: ' + expenseAmt;
    var expenseDescriptions = 'Description: ' + expenseDescription;
    var categoryValues = 'Category: ' + categoryValue;
    
    if (income){
        li.appendChild(document.createTextNode(incomes));
    } else{
        li.appendChild(document.createTextNode(expenses));
    }
    
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(expenseDescriptions));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(categoryValues));

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.appendChild(document.createTextNode('Delete'));


    li.appendChild(deleteBtn);

    itemList.appendChild(li);

    var expenseDetails = {
        expenseAmount: expenseAmt,
        expenseDescription: expenseDescription,
        category: categoryValue,
        Income: income
    };
    console.log('ExpenseDetails:', expenseDetails);
    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", expenseDetails, {
        headers: {'Authorization' : token}})
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML +
                "<h3 style='color:red'> Something Went wrong!!!</h4>",
                console.log('Expense posting: ',err);
        });

    // Creating a new list item
    var li = document.createElement('li');
    li.className = 'list-group-item';
    // Clearing the form fields
    document.getElementById('expenseamt').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    // localStorage.setItem(email, JSON.stringify(userDetails));
    console.log('Expense details added to Our server!!', expenseDetails);
}

document.addEventListener('DOMContentLoaded', handlePageLoad);
async function handlePageLoad() {
    // Making a GET request to retrieve data from the backend server
    const token = localStorage.getItem('token')
    axios.get("http://localhost:3000/expense/get-expenses", {
        headers: {'Authorization' : token}
    })
        .then((response) => {
            // Displaying the data on the screen and in the console
            const { expenses, totalPages, currentPage } = response.data;
            showNewExpenseOnScreen(expenses);

            // Displaying pagination controls
            displayPaginationControls(totalPages, currentPage);
            console.log('handlepageload data', expenses);
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);
        });
    // for premium status
    try {
        const response = await axios.get("http://localhost:3000/purchase/premium-status", {
            headers: { 'Authorization': token }
        });
        const isPremiumUser = response.data.permuimStatus;
        console.log(isPremiumUser)
        if (isPremiumUser){
            premiumStatusElement.innerText = "You are a Premium User"
            buyPremium.style.display = 'none'
            leaderboardTag.style.display = 'none'; 
            downloadedFilesTag.style.display = 'none';
            
        } else{
            console.log('not a premium user')
            showLeaderboard.style.display = 'none'
            leaderboardTag.innerText = ''
            report.style.display = 'none'
            downloads.style.display = 'none'
        }
        
    } catch (err) {
        console.error('Error while fetching premium status:', err);
    }
}

function displayPaginationControls(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous controls
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = 'pagination-btn'
      pageButton.innerText = i;
      pageButton.addEventListener('click', () => goToPage(i));
  
      if (i === currentPage) {
        pageButton.classList.add('active');
      }
  
      paginationContainer.appendChild(pageButton);
    }
  }
  
  async function goToPage(page) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}`, {
        headers: { 'Authorization': token }
      });
  
      const { expenses, totalPages, currentPage } = response.data;
      showNewExpenseOnScreen(expenses);
  
      // Updating pagination controls
      displayPaginationControls(totalPages, currentPage);
    } catch (err) {
      console.error('Error while fetching data:', err);
    }
  }

function showNewExpenseOnScreen(expenses) {
    const parentNode = document.getElementById('items');
    parentNode.innerHTML = '';

    for (var i = 0; i < expenses.length; i++) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = expenses[i].id;

        const income = expenses[i].income;
        const expense = expenses[i].expense;

        // Creating elements with appropriate classes
        const incomeElement = document.createElement('span');
        incomeElement.className = 'expenseAmount';
        incomeElement.innerHTML = `<strong>Income: </strong>₹${income}  <strong>-</strong> `;

        const expenseElement = document.createElement('span');
        expenseElement.className = 'expenseAmount';
        expenseElement.innerHTML = `<strong>Expense: </strong>₹${expense}  <strong>-</strong> `;

        const descriptionElement = document.createElement('span');
        descriptionElement.className = 'description';
        descriptionElement.innerHTML = `<strong>Description: </strong>${expenses[i].description}  <strong>-</strong> `;

        const categoryElement = document.createElement('span');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `<strong>Category: </strong>${expenses[i].category}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.appendChild(document.createTextNode('Delete'));
        deleteBtn.onclick = (function (expenseId) {
            return function () {
                deleteExpense(expenseId);
            };
        })(expenses[i]._id);
        
        // Appending elements to the li
        li.appendChild(income !== undefined ? incomeElement : expenseElement);
        li.appendChild(descriptionElement);
        li.appendChild(categoryElement);
        li.appendChild(deleteBtn);

        parentNode.appendChild(li);
    }
}


function deleteExpense(expenseId) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {
        headers: {'Authorization' : token}
    })
        .then((response) => {
            removeExpenseFromScreen(expenseId);
        })
        .catch((err) => err);
}

function removeExpenseFromScreen(expenseId) {
    const parentNode = document.getElementById('items');
    const childNodeTobeDeleted = document.getElementById(expenseId);
    if (childNodeTobeDeleted) {
        parentNode.removeChild(childNodeTobeDeleted);
    }
}

