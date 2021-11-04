import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { ApiLookup, useData } from "../providers/DataProvider";

export const TaskList = () => {
  const { data, setData } = useData();
  const [textValue, setTextValue] = useState("");

  const tasks = data.tasks;

  const handleTaskChange = (index) => () => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, isCompleted: !task.isCompleted };
      }

      return task;
    });

    setData((prev) => ({ ...prev, tasks: newTasks }));
  };

  const newTask = (name) => {
    const newTask = {
      isCompleted: false,
      name: name,
    };
    ApiLookup.lookup('POST','api/task',(data)=>{
      ApiLookup.lookup('GET','api/task/all',(data)=>{
        setData((prev)=>({...prev,tasks:data.data}));
        
      },'');
    },newTask);
  };

  const handleSubmit = (event) => {
    ApiLookup.lookup('GET','api/task/all',(data)=>{
      setData((prev)=>({...prev,tasks:data.data}));
      
    },'');

    event.preventDefault();
    newTask(textValue);
  };

  const handleTextChange = (event) => {
    const value = event.target.value;
    setTextValue(value);
  };

  return (
    <article>
      <form onSubmit={handleSubmit}>
        <input
          value={textValue}
          onChange={handleTextChange}
          type="text"
          placeholder="Task name"
        />
        <button>Create Task</button>
      </form>

      <ul>
        {tasks.map((task, index) => {
          return (
            <TaskItem
              id={task.id}
              isChecked={task.isCompleted}
              taskName={task.name}
              onTaskChange={handleTaskChange(index)}
            />
          );
        })}
      </ul>
    </article>
  );
};
