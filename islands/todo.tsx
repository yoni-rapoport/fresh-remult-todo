/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Task } from "../shared/task.ts";


export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Setup", completed: true },
    { id: 2, title: "Entities", completed: false },
    { id: 3, title: "Paging, Sorting and Filtering", completed: false },
    { id: 4, title: "CRUD Operations", completed: false },
    { id: 5, title: "Validation", completed: false },
    { id: 6, title: "Backend methods", completed: false },
    { id: 7, title: "Database", completed: false },
    { id: 8, title: "Authentication and Authorization", completed: false },
    { id: 9, title: "Deployment", completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task>();
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);

  const createNewTask = () => {
    if (newTaskTitle) {
      const newTask: Task = {
        title: newTaskTitle,
        completed: false,
        id: tasks.length + 1
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  }

  const setAll = (completed: boolean) => {
    setTasks(tasks.map(task => ({ ...task, completed })));
  }


  return (
    <div>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            value={newTaskTitle}

            onInput={e => setNewTaskTitle(e.currentTarget.value)}
            onBlur={createNewTask}
            onKeyDown={e => { if (e.key === 'Enter') createNewTask() }} />
        </header>

        <section className="main">
          <input id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={tasks.length > 0 && tasks[0].completed}
            onChange={e => setAll(e.currentTarget.checked)}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {tasks.filter(task => !hideCompleted || !task.completed)
              .map(task => {
                if (!editingTask || task.id != editingTask.id) {

                  const setCompleted =  (completed: boolean) => {
                    const updatedTask: Task = { ...task, completed };
                    setTasks(tasks.map(t => t === task ? updatedTask : t));
                  }
                  const deleteTask =  () => {
                    setTasks(tasks.filter(t => t !== task));
                  };
                  return <li key={task.id} className={task.completed ? 'completed' : ''}>
                    <div className="view">
                      <input className="toggle" type="checkbox"
                        checked={task.completed}
                        onChange={e => setCompleted(e.currentTarget.checked)}
                      />
                      <label onDblClick={() => setEditingTask(task)}>{task.title}</label>
                      <button className="destroy" onClick={deleteTask}></button>
                    </div>
                  </li>
                }
                else {

                  const saveTask =  () => {
                    setTasks(tasks.map(t => t === task ? editingTask : t));
                    setEditingTask(undefined);
                  };
                  const titleChange = (title: string) => {
                    setEditingTask({ ...editingTask, title });
                  };
                  return <li key={task.id} className="editing">
                    <input className="edit"
                      value={editingTask.title}
                      onBlur={saveTask}
                      onChange={e => titleChange(e.currentTarget.value)} />
                  </li>
                }

              })}
          </ul>
        </section>
        <footer className="footer">
          <button onClick={() => setHideCompleted(false)} >All </button>
          <button onClick={() => setHideCompleted(true)}>Active</button>
        </footer>
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Based on <a href="http://todomvc.com">TodoMVC</a></p>
        <p>
          <a href="https://www.github.com/remult/remult" target="_blank">
            Give remult a ⭐ on github</a>
        </p>
      </footer>
    </div>
  );
}
