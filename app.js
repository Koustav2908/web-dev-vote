document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || []; // empty array because strings
    let votes = JSON.parse(localStorage.getItem("votes")) || {}; // empty object because numbers
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const updateSidebar = () => {
        const sidebar = document.getElementById("user-list");
        sidebar.innerHTML = ""; // DOM
        users.forEach((user) => {
            const userItem = document.createElement("li");
            userItem.classList.add("user-item");

            const userName = document.createElement("span");
            userName.textContent = user.email;
            userName.style.marginRight = "10px";
            userItem.appendChild(userName);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.style.color = "red";
            deleteButton.style.border = "1px solid black";
            deleteButton.style.padding = "5px";
            deleteButton.style.cursor = "pointer";

            deleteButton.addEventListener("click", () => {
                deleteUser(user.email);
            });
            userItem.appendChild(deleteButton);

            userItem.addEventListener("click", (event) => {
                if (event.target === deleteButton) return;
                const userVotes = votes[user.email] || { Tea: 0, Coffee: 0 };
                alert(
                    `${user.email}'s votes: \nTea: ${userVotes["Tea"]}\nCoffee: ${userVotes["Coffee"]}`
                );
            });
            sidebar.appendChild(userItem);
        });
    };

    const deleteUser = (email) => {
        users = users.filter((user) => user.email !== email);
        localStorage.setItem("users", JSON.stringify(users));
        delete votes[email];
        localStorage.setItem("votes", JSON.stringify(votes));

        if (currentUser && currentUser.email === email) {
            logout();
            alert("Account Deleted. Register again!");
        }
        updateSidebar();
    };

    const updateVoteDisplay = () => {
        if (currentUser) {
            const userVotes = votes[currentUser.email] || { Tea: 0, Coffee: 0 };
            document.getElementById("option1-count").textContent =
                userVotes["Tea"];
            document.getElementById("option2-count").textContent =
                userVotes["Coffee"];
        }
    };

    const register = (email, password) => {
        if (users.some((user) => user.email === email)) {
            alert("User already Registered!");
            return;
        }
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("User registered successfully!");
        updateSidebar();
    };

    const login = (email, password) => {
        const user = users.find(
            (user) => user.email === email && user.password === password
        );
        if (user) {
            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert("Logged in successfully!");

            document.getElementById("auth-section").style.display = "none";
            document.getElementById("vote-section").style.display = "block";
            updateVoteDisplay();
        } else {
            alert("Invalid username or password!");
        }
    };

    const logout = () => {
        currentUser = null;
        localStorage.removeItem("currentUser");
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("vote-section").style.display = "none";
        updateVoteDisplay();
    };

    const vote = (option) => {
        if (!currentUser) {
            alert("Login first!");
            return;
        }
        votes[currentUser.email] = votes[currentUser.email] || {
            Tea: 0,
            Coffee: 0,
        };
        votes[currentUser.email][option] += 1;
        localStorage.setItem("votes", JSON.stringify(votes));
        updateVoteDisplay();
    };

    // registration
    document.getElementById("register-btn").addEventListener("click", () => {
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        register(email, password);
    });

    // login
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    });

    // logout
    document.getElementById("logout-btn").addEventListener("click", logout);

    // tea vote
    document.getElementById("vote-option1").addEventListener("click", () => {
        vote("Tea");
    });

    // coffee vote
    document.getElementById("vote-option2").addEventListener("click", () => {
        vote("Coffee");
    });
});
