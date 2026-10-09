// ===== Ma'lumotlar bazasi =====
const STORAGE_KEY = "todo-pwa-data";

function getTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Ma'lumot o'qishda xato:", e);
    return [];
  }
}

function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Ma'lumot saqlashda xato:", e);
  }
}

// ===== CREATE: Yangi vazifa qo'shish =====
function createTodo(title) {
  const todos = getTodos();
  const newTodo = {
    id: Date.now(),              // Vaqtga asoslangan unikal ID
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  saveTodos(todos);
  renderTodos();
}

// ===== READ: Barcha vazifalarni olish (render qilish) =====
function renderTodos() {
  const todos = getTodos();
  const listEl = document.getElementById("todo-list");
  const statsEl = document.getElementById("stats-text");
  
  // Ro'yxatni tozalash
  listEl.innerHTML = "";
  
  // Bo'sh holat
  if (todos.length === 0) {
    listEl.innerHTML = '<li class="empty">Hozircha vazifa yo\'q. Yuqoridan qo\'shing!</li>';
    statsEl.textContent = "Jami: 0 | Bajarilgan: 0";
    return;
  }
  
  // Har bir vazifani chizish
  todos.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");
    
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""} 
             data-action="toggle" data-id="${todo.id}">
      <span class="todo-title">${escapeHtml(todo.title)}</span>
      <button class="btn-edit" data-action="edit" data-id="${todo.id}">✏️</button>
      <button class="btn-delete" data-action="delete" data-id="${todo.id}">🗑️</button>
    `;
    
    listEl.appendChild(li);
  });
  
  // Statistika
  const completed = todos.filter(t => t.completed).length;
  statsEl.textContent = `Jami: ${todos.length} | Bajarilgan: ${completed}`;
}

// ===== UPDATE: Bajarilgan/bajarilmagan =====
function toggleTodo(id) {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    renderTodos();
  }
}

// ===== UPDATE: Nomini o'zgartirish =====
function editTodo(id) {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  
  const newTitle = prompt("Yangi nom kiriting:", todo.title);
  if (newTitle !== null && newTitle.trim()) {
    todo.title = newTitle.trim();
    saveTodos(todos);
    renderTodos();
  }
}

// ===== DELETE: O'chirish =====
function deleteTodo(id) {
  if (!confirm("Bu vazifani o'chirishni xohlaysizmi?")) return;
  
  const todos = getTodos().filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

// Foydalanuvchi kiritgan matnni xavfsiz qilish
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== Forma submit =====
document.getElementById("todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("todo-input");
  const title = input.value.trim();
  if (title) {
    createTodo(title);
    input.value = "";
    input.focus();
  }
});

// ===== Ro'yxatdagi tugmalar (Event Delegation) =====
document.getElementById("todo-list").addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  
  const action = target.dataset.action;
  const id = parseInt(target.dataset.id);
  
  if (action === "toggle") toggleTodo(id);
  if (action === "edit") editTodo(id);
  if (action === "delete") deleteTodo(id);
});

// ===== Ilovani ishga tushirish =====
renderTodos();
console.log("✅ Ilova ishga tushdi");