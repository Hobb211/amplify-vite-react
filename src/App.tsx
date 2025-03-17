import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id});
  }

  return (
    <main>
      <h1>Las tareas por hacer de {user?.signInDetails?.loginId}</h1>
      <button onClick={createTodo}>+ nuevo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={()=>deleteTodo(todo.id)}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 Aplicacion hospedada correctamente. Prueba creando una nueva tarea.
        <br />
      </div>
      <button onClick={signOut}>Cerrar sesión</button>
    </main>
  );
}

export default App;
