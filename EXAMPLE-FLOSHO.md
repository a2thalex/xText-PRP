# xText-PRP + FloSho Example

## Complete Example: Building a Todo App with Visual Testing

This example shows how Claude Code uses xText-PRP with FloSho to build a complete todo application with automatic testing and documentation.

### Step 1: User Request

**Human**: "Build a todo app where users can add, complete, and delete tasks"

### Step 2: Claude Uses xText-PRP to Generate PRP

```markdown
# Todo App - Product Requirements Prompt

## Overview
A simple todo application with CRUD operations and visual testing.

## User Stories
- As a user, I want to add new tasks
- As a user, I want to mark tasks as complete
- As a user, I want to delete tasks
- As a user, I want to see all my tasks

## Technical Requirements
- React frontend
- Local storage for persistence
- Responsive design
- FloSho visual testing
```

### Step 3: Claude Implements the Feature

```javascript
// TodoApp.jsx
import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodos = [...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    localStorage.setItem('todos', JSON.stringify(updated));
  };

  const deleteTodo = (id) => {
    const filtered = todos.filter(todo => todo.id !== id);
    setTodos(filtered);
    localStorage.setItem('todos', JSON.stringify(filtered));
  };

  return (
    <div data-testid="todo-app" className="todo-app">
      <h1>My Todo List</h1>
      
      <div className="add-todo">
        <input
          data-testid="todo-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
        />
        <button data-testid="add-button" onClick={addTodo}>
          Add Task
        </button>
      </div>

      <div data-testid="todo-list">
        {todos.length === 0 ? (
          <p data-testid="empty-state">No tasks yet. Add one above!</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} data-testid={`todo-${todo.id}`} className="todo-item">
              <input
                data-testid={`checkbox-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              <button
                data-testid={`delete-${todo.id}`}
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoApp;
```

### Step 4: Claude Creates FloSho Tests

```javascript
// test-todo-app.js
import { FloSho } from './testing/flosho/index.js';

async function testTodoApp() {
  const flosho = new FloSho('Todo Application');
  await flosho.init();

  // Test 1: Complete Todo Flow
  await flosho.flow('Complete Todo Management Flow', [
    {
      action: 'navigate',
      url: 'http://localhost:3000',
      description: 'Open Todo Application'
    },
    {
      action: 'screenshot',
      name: 'initial-empty',
      description: 'Todo app with no tasks'
    },
    {
      action: 'fill',
      selector: '[data-testid="todo-input"]',
      value: 'Buy groceries',
      description: 'Type first todo item'
    },
    {
      action: 'click',
      selector: '[data-testid="add-button"]',
      description: 'Click Add Task button'
    },
    {
      action: 'wait',
      duration: 500,
      description: 'Wait for task to be added'
    },
    {
      action: 'screenshot',
      name: 'first-task-added',
      description: 'First task added to the list'
    },
    {
      action: 'fill',
      selector: '[data-testid="todo-input"]',
      value: 'Walk the dog',
      description: 'Type second todo item'
    },
    {
      action: 'click',
      selector: '[data-testid="add-button"]',
      description: 'Add second task'
    },
    {
      action: 'screenshot',
      name: 'multiple-tasks',
      description: 'Multiple tasks in the list'
    },
    {
      action: 'click',
      selector: '[data-testid^="checkbox-"]:first-of-type',
      description: 'Mark first task as complete'
    },
    {
      action: 'screenshot',
      name: 'task-completed',
      description: 'Task marked as complete with strikethrough'
    },
    {
      action: 'click',
      selector: '[data-testid^="delete-"]:last-of-type',
      description: 'Delete the second task'
    },
    {
      action: 'screenshot',
      name: 'task-deleted',
      description: 'Second task removed from list'
    }
  ]);

  // Test 2: Error States
  await flosho.flow('Error Handling', [
    {
      action: 'navigate',
      url: 'http://localhost:3000',
      description: 'Fresh start'
    },
    {
      action: 'click',
      selector: '[data-testid="add-button"]',
      description: 'Try to add empty task'
    },
    {
      action: 'screenshot',
      name: 'empty-task-prevented',
      description: 'No task added when input is empty'
    }
  ]);

  // Test 3: API Tests (if backend exists)
  await flosho.api('/api/todos', [
    {
      name: 'Get all todos',
      method: 'GET',
      expect: { status: 200 }
    },
    {
      name: 'Create todo',
      method: 'POST',
      data: { text: 'Test todo', completed: false },
      expect: { status: 201 }
    },
    {
      name: 'Update todo',
      method: 'PUT',
      endpoint: '/api/todos/1',
      data: { completed: true },
      expect: { status: 200 }
    },
    {
      name: 'Delete todo',
      method: 'DELETE',
      endpoint: '/api/todos/1',
      expect: { status: 204 }
    }
  ]);

  await flosho.done();
  
  console.log('\n✅ Todo app testing complete!');
  console.log('📖 Check testing/flosho-docs/ for documentation');
}

// Run the tests
testTodoApp();
```

### Step 5: Generated Documentation

#### testing/flosho-docs/user-manual/README.md

```markdown
# Todo Application - Test Documentation

*Generated by xText-PRP FloSho on January 15, 2024*

## User Flows

- [Complete Todo Management Flow](./complete-todo-management-flow.md) - ✅
- [Error Handling](./error-handling.md) - ✅

## API Tests

### /api/todos
- Get all todos: ✅
- Create todo: ✅
- Update todo: ✅
- Delete todo: ✅

## Screenshots

Total: 6 screenshots captured

---
*Built with xText-PRP + FloSho*
```

#### testing/flosho-docs/user-manual/complete-todo-management-flow.md

```markdown
# Complete Todo Management Flow

*Generated: January 15, 2024*  
*Status: ✅ Passed*

## Steps

### Step 1: Open Todo Application

**Result:** ✅ Success

![Before](../screenshots/initial-empty-before.png)
![After](../screenshots/initial-empty-after.png)

### Step 2: Type first todo item

**Result:** ✅ Success

![Before](../screenshots/first-task-before.png)
![After](../screenshots/first-task-after.png)

[... continues for all steps ...]
```

### Step 6: Claude's Summary

```markdown
## ✅ Todo App Complete

I've successfully built and tested the todo application using xText-PRP with FloSho:

### Implementation:
- React component with full CRUD operations
- Local storage persistence
- Clean, testable UI with data-testid attributes

### Testing:
- Complete user flow tested (11 steps)
- Error handling verified
- 6 screenshots captured
- API endpoints tested (if applicable)

### Documentation:
- User manual auto-generated
- Step-by-step guide with screenshots
- API reference created

### Deliverables:
- Source code: `TodoApp.jsx`
- Test suite: `test-todo-app.js`
- Documentation: `testing/flosho-docs/user-manual/`
- Screenshots: `testing/flosho-docs/screenshots/`

The application is fully tested and documented, ready for deployment!
```

## Key Benefits Demonstrated

1. **Context-Driven Development**: xText-PRP provided the structure
2. **Visual Testing**: FloSho captured every state
3. **Automatic Documentation**: Tests generated user guides
4. **Quality Assurance**: Can't complete without passing tests
5. **Professional Output**: Ready to share with stakeholders

## Running This Example

```bash
# 1. Clone xText-PRP with FloSho
git clone https://github.com/a2thalex/xText-PRP.git
cd xText-PRP
git checkout feature/flosho-testing

# 2. Install dependencies
npm install
npx playwright install chromium

# 3. Create the todo app
# (Copy the TodoApp.jsx code above)

# 4. Run the tests
node test-todo-app.js

# 5. View the documentation
open testing/flosho-docs/user-manual/README.md
```

This example shows how xText-PRP + FloSho creates a complete development workflow where testing and documentation happen automatically!