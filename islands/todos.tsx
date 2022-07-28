/** @jsx h */
import { h } from "preact";
import { Remult } from "remult";
import { useState } from "preact/hooks";
import { Task } from "../model/task.ts";

const remult = new Remult();
const taskRepo = remult.repo(Task);

export default function Todos({ data }: { data: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(data);

  const addTask = () => {
    setTasks([...tasks, new Task()]);
  };

  return (
    <div>
      {tasks.map((task) => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map((t) => t === task ? { ...task, ...values } : t));
        };

        const saveTask = async () => {
          const savedTask = await taskRepo.save(task);
          setTasks(tasks.map((t) => t === task ? savedTask : t));
        };

        const deleteTask = async () => {
          await taskRepo.delete(task);
          setTasks(tasks.filter((t) => t !== task));
        };

        return (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onClick={(e) => handleChange({ completed: !task.completed })}
            />
            <input
              value={task.title}
              onInput={(e) => handleChange({ title: e.currentTarget.value })}
            />
            <button onClick={saveTask}>Save</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        );
      })}
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}