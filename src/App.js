import React, { useState, useEffect } from 'react';
import './TodoList.css'; // Importar o arquivo de estilo CSS

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    loadList();
  }, []);

  const fetchLists = async () => {
    const response = await fetch('http://localhost:3000/api/todolist');
    const lists = await response.json();
    return lists;
  };
  const handleEditTitle = (id, newTitle) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditDescription = (id, newDescription) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, description: newDescription } : task
    );
    setTasks(updatedTasks);
  };
  const loadList = async () => {
    const lists = await fetchLists();
    setTasks(lists);
  };

  const addList = async (event) => {
    event.preventDefault();
    const task = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'Pendente',
    };

    await fetch('http://localhost:3000/api/todolist', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    loadList();
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:3000/api/todolist/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadList();
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      try {
        await fetch(`http://localhost:3000/api/todolist/${id}`, {
          method: 'delete',
        });
        loadList();
      } catch (error) {
        console.error('Erro ao excluir a tarefa:', error);
      }
    }
  };

  return (
    <main>
      <form onSubmit={addList} className='add-form'>
        <input
          type='text'
          placeholder='Adicionar tarefa'
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type='text'
          placeholder='Descrição'
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button type='submit'>+</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Descrição</th>
            <th>Criada em</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <input
                  type='text'
                  value={task.title}
                  onChange={(e) => handleEditTitle(task.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type='text'
                  value={task.description}
                  onChange={(e) =>
                    handleEditDescription(task.id, e.target.value)
                  }
                />
              </td>
              <td>{task.date}</td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value='Pendente'>Pendente</option>
                  <option value='Em Andamento'>Em Andamento</option>
                  <option value='Concluida'>Concluída</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(task.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default TodoList;
