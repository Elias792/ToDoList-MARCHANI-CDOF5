document.addEventListener('DOMContentLoaded', () => {
    // État de l'application
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filters = {
        category: '',
        priority: '',
        status: ''
    };

    // Éléments DOM
    const todoInput = document.getElementById('todoInput');
    const todoDetails = document.getElementById('todoDetails');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const toggleFilters = document.getElementById('toggleFilters');
    const filtersPanel = document.getElementById('filtersPanel');

    // Afficher les détails lors de la focus sur l'input
    todoInput.addEventListener('focus', () => {
        todoDetails.classList.remove('hidden');
    });

    // Ajouter une tâche
    addTodoBtn.addEventListener('click', addTodo);

    // Toggle des filtres
    toggleFilters.addEventListener('click', () => {
        filtersPanel.classList.toggle('hidden');
    });

    // Écouteurs d'événements pour les filtres
    document.getElementById('filterCategory').addEventListener('change', updateFilters);
    document.getElementById('filterPriority').addEventListener('change', updateFilters);
    document.getElementById('filterStatus').addEventListener('change', updateFilters);

    function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date(),
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            dueDate: document.getElementById('dueDate').value || null
        };

        todos.unshift(todo);
        saveTodos();
        renderTodos();
        resetForm();
    }

    function toggleTodo(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function updateFilters() {
        filters = {
            category: document.getElementById('filterCategory').value,
            priority: document.getElementById('filterPriority').value,
            status: document.getElementById('filterStatus').value
        };
        renderTodos();
    }

    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            if (filters.category && todo.category !== filters.category) return false;
            if (filters.priority && todo.priority !== filters.priority) return false;
            if (filters.status === 'completed' && !todo.completed) return false;
            if (filters.status === 'active' && todo.completed) return false;
            return true;
        });

        todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'todo-item';
            todoElement.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"
                     onclick="window.toggleTodo('${todo.id}')"></div>
                <div class="todo-content">
                    <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                    <div class="todo-meta">
                        <span>${todo.category}</span>
                        <span>•</span>
                        <span>${todo.priority}</span>
                        ${todo.dueDate ? `<span>•</span><span>Due: ${formatDate(todo.dueDate)}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="btn-delete" onclick="window.deleteTodo('${todo.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            `;
            todoList.appendChild(todoElement);
        });
    }

    function resetForm() {
        todoInput.value = '';
        document.getElementById('category').value = 'personal';
        document.getElementById('priority').value = 'medium';
        document.getElementById('dueDate').value = '';
        todoDetails.classList.add('hidden');
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    // Exposer les fonctions nécessaires globalement
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;

    // Rendu initial
    renderTodos();
});