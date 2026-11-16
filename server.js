// server.js — ПЗ №5: To-Do List на Express.js + Pug
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// ---------- Налаштування Express ----------
app.set('view engine', 'pug');                 // шаблонізатор Pug
app.set('views', path.join(__dirname, 'views')); // папка з шаблонами
app.use(express.json());                       // парсинг JSON у тілі POST/PUT

// ---------- Імітація бази даних ----------
let tasks = [
  { id: 1, title: 'Встановити Node.js та npm', completed: true },
  { id: 2, title: 'Налаштувати Express.js', completed: false },
  { id: 3, title: 'Створити шаблони Pug', completed: false }
];
let nextId = 4;

// ---------- API-маршрути (JSON) ----------

// READ ALL: повернути весь список задач
app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// CREATE: додати нову задачу
app.post('/api/tasks', (req, res) => {
  const { title } = req.body || {};
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Поле "title" є обов\'язковим' });
  }
  const newTask = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// UPDATE STATUS: змінити completed на протилежний
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Задачу не знайдено' });
  }
  task.completed = !task.completed;
  res.status(200).json(task);
});

// DELETE: видалити задачу
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Задачу не знайдено' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// ---------- Сторінки (Pug) ----------
app.get('/', (req, res) => res.redirect('/tasks'));

app.get('/tasks', (req, res) => {
  res.render('tasks', { title: 'Список справ', tasks });
});

// ---------- Запуск ----------
app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}/tasks`);
});
