// functions for the frontend/UI

async function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = {
        name,
        email,
        password
    }

    try {
        const createdUser = await fetch('/api/v2/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const createdUserJSON = await createdUser.json();

        if (createdUserJSON) {
            alert(createdUserJSON.message);
        }
    } catch(error) {
        alert('There was an err!')
    }
}


async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userSigninData = {
        email,
        password
    }

    try {
        const loggedinUser = await fetch('/api/v2/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userSigninData)
        });

        const loggedinUserJSON = await loggedinUser.json();

        if (loggedinUserJSON) {
            localStorage.setItem('token', loggedinUserJSON.data.token)
            alert(loggedinUserJSON.message);
            window.location.href = 'http://localhost:4000/home.html'
        }
    } catch(error) {
        alert('There was an err!')
    }
}

