import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/tasks')
      .then((response) => {
        setTasks(response.data.tasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const addTask = () => {
    if (task.trim()) {
      axios
        .post('http://localhost:8000/tasks', { text: task })
        .then((response) => {
          setTasks([...tasks, response.data.task]);
          setTask('');
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    }
  };

  const toggleComplete = (id) => {
    axios
      .patch(`http://localhost:8000/tasks/${id}`)
      .then((response) => {
        setTasks(
          tasks.map((t) =>
            t._id === id ? { ...t, completed: response.data.task.completed } : t
          )
        );
      })
      .catch((error) => {
        console.error('Error toggling task completion:', error);
      });
  };

  const removeTask = (id) => {
    axios
      .delete(`http://localhost:8000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((t) => t._id !== id));
      })
      .catch((error) => {
        console.error('Error removing task:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">My Todo List</h1>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition duration-300"
          >
            Add
          </button>
        </div>
        <ul className="mt-6 divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet. Add your first task!</p>
          ) : (
            tasks.map((t) => (
              <li
                key={t._id}
                className={`p-4 rounded-lg shadow-sm mb-3 flex justify-between items-center ${t.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}
              >
                <span
                  className={`text-gray-700 ${t.completed ? 'line-through text-gray-400' : ''
                    }`}
                >
                  {t.text}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleComplete(t._id)}
                    className={`px-3 py-1 rounded-lg ${t.completed
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      } transition duration-300`}
                  >
                    {t.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => removeTask(t._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
