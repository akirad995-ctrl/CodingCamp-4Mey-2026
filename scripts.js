// ===== MINION DASHBOARD - scripts.js =====

// ---- FLOATING FRUIT BACKGROUND ----
(function spawnFruits() {
  const container = document.getElementById("fruit-bg");
  // Pakai SVG stroberi inline biar pasti muncul tanpa butuh internet
  const svgSrc = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <ellipse cx='50' cy='62' rx='34' ry='32' fill='%23e8192c'/>
    <ellipse cx='38' cy='62' rx='10' ry='12' fill='%23c0001a'/>
    <ellipse cx='62' cy='62' rx='10' ry='12' fill='%23c0001a'/>
    <circle cx='36' cy='55' r='3' fill='%23ffecec' opacity='0.5'/>
    <circle cx='55' cy='50' r='2.5' fill='%23ffecec' opacity='0.5'/>
    <circle cx='48' cy='68' r='2' fill='%23ffecec' opacity='0.5'/>
    <circle cx='64' cy='60' r='2' fill='%23ffecec' opacity='0.5'/>
    <!-- seeds -->
    <ellipse cx='40' cy='58' rx='1.5' ry='2' fill='%23fff176'/>
    <ellipse cx='52' cy='54' rx='1.5' ry='2' fill='%23fff176'/>
    <ellipse cx='60' cy='63' rx='1.5' ry='2' fill='%23fff176'/>
    <ellipse cx='45' cy='72' rx='1.5' ry='2' fill='%23fff176'/>
    <ellipse cx='56' cy='74' rx='1.5' ry='2' fill='%23fff176'/>
    <ellipse cx='35' cy='68' rx='1.5' ry='2' fill='%23fff176'/>
    <!-- leaves -->
    <ellipse cx='50' cy='30' rx='6' ry='14' fill='%2327ae60' transform='rotate(-20 50 30)'/>
    <ellipse cx='50' cy='30' rx='6' ry='14' fill='%2327ae60' transform='rotate(20 50 30)'/>
    <ellipse cx='50' cy='28' rx='4' ry='12' fill='%232ecc71'/>
  </svg>`;
  const count = 16;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("img");
    el.className = "fruit";
    el.src = svgSrc;
    el.alt = "";
    const size = 36 + Math.random() * 52;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (9 + Math.random() * 14) + "s";
    el.style.animationDelay = "-" + (Math.random() * 16) + "s";
    container.appendChild(el);
  }
})();

// ---- GREETING & DATETIME ----
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function formatDateTime() {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${day}, ${date} ${month} ${year} — ${h}:${m}:${s}`;
}

function updateGreeting() {
  const name = localStorage.getItem("userName") || "Minion";
  document.getElementById("greeting-text").textContent =
    `${getGreeting()}, ${name}! 🍌`;
  document.getElementById("datetime-text").textContent = formatDateTime();
}

setInterval(updateGreeting, 1000);
updateGreeting();

// ---- CUSTOM NAME MODAL ----
const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("name-input");
const nameSaveBtn = document.getElementById("name-save-btn");

function initName() {
  const saved = localStorage.getItem("userName");
  if (!saved) {
    nameModal.classList.remove("hidden");
  } else {
    nameModal.classList.add("hidden");
  }
}

nameSaveBtn.addEventListener("click", () => {
  const val = nameInput.value.trim();
  if (val) {
    localStorage.setItem("userName", val);
    nameModal.classList.add("hidden");
    updateGreeting();
  }
});

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") nameSaveBtn.click();
});

initName();

// Edit name button — reopen modal
document.getElementById("edit-name-btn").addEventListener("click", () => {
  nameInput.value = localStorage.getItem("userName") || "";
  nameModal.classList.remove("hidden");
  nameInput.focus();
});

// Delete name button — clear name and reopen modal
document.getElementById("delete-name-btn").addEventListener("click", () => {
  localStorage.removeItem("userName");
  nameInput.value = "";
  nameModal.classList.remove("hidden");
  nameInput.focus();
});

// ---- DARK / LIGHT MODE ----
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

applyTheme(localStorage.getItem("theme") || "light");

// ---- FOCUS TIMER ----
let timerDuration = parseInt(localStorage.getItem("timerDuration")) || 25;
let timeLeft = timerDuration * 60;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const customDuration = document.getElementById("custom-duration");
const applyDurationBtn = document.getElementById("apply-duration-btn");

customDuration.value = timerDuration;

function renderTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

renderTimer();

startBtn.addEventListener("click", () => {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerDisplay.textContent = "00:00";
      alert("✨ Time's up! Take a break~");
      return;
    }
    timeLeft--;
    renderTimer();
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timeLeft = timerDuration * 60;
  renderTimer();
});

applyDurationBtn.addEventListener("click", () => {
  const val = parseInt(customDuration.value);
  if (!val || val < 1 || val > 120) return alert("Enter a duration between 1 and 120 minutes.");
  timerDuration = val;
  localStorage.setItem("timerDuration", timerDuration);
  clearInterval(timerInterval);
  timerRunning = false;
  timeLeft = timerDuration * 60;
  renderTimer();
});

// ---- TO-DO LIST ----
let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todoInput = document.getElementById("todo-input");
const todoAddBtn = document.getElementById("todo-add-btn");
const todoList = document.getElementById("todo-list");
const sortSelect = document.getElementById("sort-select");

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getSortedTodos() {
  const sort = sortSelect.value;
  const copy = [...todos];
  if (sort === "az") copy.sort((a, b) => a.text.localeCompare(b.text));
  else if (sort === "za") copy.sort((a, b) => b.text.localeCompare(a.text));
  else if (sort === "done") copy.sort((a, b) => Number(a.done) - Number(b.done));
  return copy;
}

function renderTodos() {
  todoList.innerHTML = "";
  const sorted = getSortedTodos();
  sorted.forEach((todo) => {
    const realIndex = todos.findIndex(t => t.id === todo.id);
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todos[realIndex].done = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const editBtn = document.createElement("button");
    editBtn.className = "todo-btn";
    editBtn.title = "Edit";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => startEdit(li, realIndex, span, editBtn));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-btn";
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
      todos.splice(realIndex, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

function startEdit(li, index, span, editBtn) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "todo-edit-input";
  input.value = todos[index].text;
  li.replaceChild(input, span);

  editBtn.textContent = "💾";
  editBtn.title = "Save";

  const save = () => {
    const val = input.value.trim();
    if (!val) return;
    // prevent duplicate on edit (ignore self)
    const duplicate = todos.some((t, i) => i !== index && t.text.toLowerCase() === val.toLowerCase());
    if (duplicate) return alert("✨ That task already exists!");
    todos[index].text = val;
    saveTodos();
    renderTodos();
  };

  editBtn.onclick = save;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
  input.focus();
}

todoAddBtn.addEventListener("click", () => {
  const val = todoInput.value.trim();
  if (!val) return;
  // Challenge: prevent duplicate tasks
  const duplicate = todos.some(t => t.text.toLowerCase() === val.toLowerCase());
  if (duplicate) return alert("✨ That task already exists!");
  todos.push({ id: Date.now(), text: val, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = "";
});

todoInput.addEventListener("keydown", (e) => { if (e.key === "Enter") todoAddBtn.click(); });
sortSelect.addEventListener("change", renderTodos);
renderTodos();

// ---- QUICK LINKS ----
let links = JSON.parse(localStorage.getItem("quickLinks")) || [];

const linkNameInput = document.getElementById("link-name-input");
const linkUrlInput = document.getElementById("link-url-input");
const linkAddBtn = document.getElementById("link-add-btn");
const linksContainer = document.getElementById("links-container");

function saveLinks() {
  localStorage.setItem("quickLinks", JSON.stringify(links));
}

function renderLinks() {
  linksContainer.innerHTML = "";
  links.forEach((link, index) => {
    const wrap = document.createElement("div");
    wrap.className = "link-btn-wrap";

    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "link-btn";
    a.textContent = link.name;

    const delBtn = document.createElement("button");
    delBtn.className = "link-delete-btn";
    delBtn.title = "Remove";
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => {
      links.splice(index, 1);
      saveLinks();
      renderLinks();
    });

    wrap.appendChild(a);
    wrap.appendChild(delBtn);
    linksContainer.appendChild(wrap);
  });
}

linkAddBtn.addEventListener("click", () => {
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();
  if (!name || !url) return alert("Please enter both a label and a URL.");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  links.push({ name, url });
  saveLinks();
  renderLinks();
  linkNameInput.value = "";
  linkUrlInput.value = "";
});

linkUrlInput.addEventListener("keydown", (e) => { if (e.key === "Enter") linkAddBtn.click(); });
renderLinks();
