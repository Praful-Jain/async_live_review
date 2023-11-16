const fetch = require("node-fetch");

// Fetch all the users by calling the /users API
async function fetchAllUsers() {
  const response = await fetch(`http://localhost:3000/users`);
  const data = await response.json();
  console.log(data);
  return data.users.length;
}


// Returns array containing ID's of 5 users
function range(id) {
  const userIds = new Array(5).fill(0); 
  userIds.forEach((element, index, array) => {
    array[index] = id;
    id++;
  });
  return userIds;
}

async function fetchUser(id) {
  const response = await fetch(`http://localhost:3000/todos?user_id=${id}`);
  const data = await response.json();
  return data.todos;    // return an array containing todo of a particular user
}

async function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

// Fetch todos for each user in chunks of 5 users
async function fetchTodos(length) {
  const todos = [];    // Array of todos of all the users

  // Fetching 5 user's todos at a time.
  for (let id = 1; id <= length; id += 5) {

    const userIds = range(id);     // Array containing ID's of 5 users
    const userPromises = userIds.map((id) => fetchUser(id));    // Array containing promises of 5 users
    const data = await Promise.all(userPromises);    // Fetching todos of 5 users -- concurrently
    console.log(data);
    todos.push(...data);    // Push 'data' onto 'todos' array.
    await wait(1000);   // Wait for 1 second before the next iteration
  }
  return todos;  
}


// Calculate how many todos are completed for each user and print the result
async function todosCompleted(todos, length) {
  const result = [];  

  for (let i = 0; i < length; i++) {

    let todo = todos[i];      // getting todos of a single user form 'data' array

    // Computing Completed Todos Count for each user
    const count = todo.reduce((acc, obj) => {
      if (obj.isCompleted == true) {
        acc++;
      }
      return acc;
    }, 0);
    
    const user = {
      id: i + 1,
      name: `user ${i + 1}`,
      numTodosCompleted: count
    }
    result.push(user);    // Pushing number of todos completed for each user in 'result' array 
  }
  console.log(result);
}

async function main() {
  const length = await fetchAllUsers();     // Fetch all the users by calling the /users API
  const todos = await fetchTodos(length);   // Fetch todos for each user in chunks of 5 users
  await todosCompleted(todos, length);      // Calculate how many todos are completed for each user and print the result
}
main();
