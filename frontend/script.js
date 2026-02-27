const API = "http://localhost:5000/api";

function getValue(id) {
  return document.getElementById(id).value;
}

async function register() {
  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: getValue("username"),
      password: getValue("password"),
    }),
  });

  alert("Registered! Now login.");
}

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: getValue("username"),
      password: getValue("password"),
    }),
  });

  const data = await res.json();

  if (!data.token) {
    alert("Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  window.location.href = "dashboard.html";
}

async function addTodo() {
  await fetch(`${API}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      title: getValue("title"),
      priority: getValue("priority"),
    }),
  });

  loadTodos();
}

async function loadTodos() {
  const res = await fetch(`${API}/todos`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  });

  const data = await res.json();

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  if (!Array.isArray(data)) return;

  data.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${todo.title} - <b>${todo.priority}</b>
      <button onclick="deleteTodo(${todo.id})">❌</button>
    `;
    list.appendChild(li);
  });
}

async function deleteTodo(id) {
  await fetch(`${API}/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  });

  loadTodos();
}

if (window.location.pathname.includes("dashboard.html")) {
  loadTodos();
}