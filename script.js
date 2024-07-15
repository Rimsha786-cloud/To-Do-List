document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const daySelect = document.getElementById('daySelect');
    const daysContainer = document.getElementById('daysContainer');

    addTaskBtn.addEventListener('click', addTask);
    daysContainer.addEventListener('click', handleTaskActions);

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        const day = daySelect.value;

        if (taskText === '') return;

        const task = createTaskElement(taskText);
        document.getElementById(day).querySelector('.taskList').appendChild(task);
        saveTasks();
        taskInput.value = '';
    }

    function createTaskElement(text) {
        const li = document.createElement('li');
        li.className = 'task';
        li.innerHTML = `
            <span>${text}</span>
            <div class="actions">
                <button class="complete">✓</button>
                <button class="edit">✎</button>
                <button class="delete">✗</button>
            </div>
        `;
        return li;
    }

    function handleTaskActions(event) {
        const target = event.target;
        const task = target.closest('.task');

        if (target.classList.contains('complete')) {
            task.classList.toggle('completed');
        } else if (target.classList.contains('edit')) {
            const newText = prompt('Edit your task:', task.firstElementChild.textContent);
            if (newText !== null) {
                task.firstElementChild.textContent = newText.trim();
            }
        } else if (target.classList.contains('delete')) {
            task.remove();
        }
        saveTasks();
    }

    function saveTasks() {
        const tasks = {};
        document.querySelectorAll('.day').forEach(day => {
            const dayName = day.id;
            const taskList = [];
            day.querySelectorAll('.task').forEach(task => {
                taskList.push({
                    text: task.firstElementChild.textContent,
                    completed: task.classList.contains('completed')
                });
            });
            tasks[dayName] = taskList;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        for (const day in tasks) {
            tasks[day].forEach(task => {
                const taskElement = createTaskElement(task.text);
                if (task.completed) {
                    taskElement.classList.add('completed');
                }
                document.getElementById(day).querySelector('.taskList').appendChild(taskElement);
            });
        }
    }
});
