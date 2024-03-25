// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Creates a function to generate a unique task id
function generateTaskId() {
    if(nextId === null){
        nextId = 1
    }
    else {
        nextId++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId))

    return nextId
}

// Creates a function to create a task card
function createTaskCard(task) {
    const taskCard = `
      <div id="${task.id}" class="card task-card mb-3" data-id="${task.id}">
        <div class="card-header">
          <h5 class="card-title">${task.title}</h5>
          <button type="button" class="btn-close delete-task" aria-label="Close"></button>
        </div>
        <div class="card-body">
          <p class="card-text">${task.description}</p>
          <p class="card-text">Deadline: ${task.deadline}</p>
        </div>
      </div>`;
    return taskCard; 
}

// Creates a function to render the task list and make cards draggable
function renderTaskList() {

  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
   
  });

  for(var task of taskList){
    if(task.status === "to-do"){
     $('#todo-cards').append(createTaskCard(task));
    }
    else if(task.status === "in-progress"){
    $('#in-progress-cards').append(createTaskCard(task));
    }
    else {
         $('#done-cards').append(createTaskCard(task));
    }
  }

$('.task-card').draggable({
    revert: "invalid",
    stack: ".task-card",
    helper: "clone"
  });
}
// Creates a function to handle adding a new task
function handleAddTask(event){

    event.preventDefault();
  const title = $('#taskTitle').val();
  const description = $('#taskDescription').val();
  const deadline = $('#taskDeadline').val();

  if (title && description && deadline) {
    const newTask = {
         id: generateTaskId(), 
         title: title, 
         description: description, 
         deadline: deadline,
         status: "to-do" 
        };
   
    taskList.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);

    renderTaskList();

    $('#formModal').modal('hide');
    // Clears input fields
    $('#task-title').val('');
    $('#task-description').val('');
    $('#task-deadline').val('');
  } else {
    alert('Please fill in all fields.');
  }
}

// Creates a function to handle deleting a task
// Creates a function to handle deleting a task
function handleDeleteTask(event){
  const taskId = $(this).closest('.task-card').data('id');
  
  // Remove the task with taskId from the taskList array
  taskList = taskList.filter(task => task.id !== taskId);
  
  // Update localStorage with the modified taskList
  localStorage.setItem("tasks", JSON.stringify(taskList));
  
  // Re-render the task list
  renderTaskList(); 
}

// Creates a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');

  const targetLane = $(this).closest('.lane').attr('id');

    let newStatus = event.target.id // gets id status of parent div

 console.log(targetLane)

  for (var task of taskList) {
    if (task.id == taskId) {
      task.status = targetLane
    } 

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }    
}

// When the page loads, the following renders the task list, adds event listeners, makes lanes droppable, and makes the due date field a date picker
$(document).ready(function () {
    renderTaskList();
$('#addTaskForm').on('submit', handleAddTask);

  // Add task event listener
  $('#add-task-btn').on('click', function () {
    $('#task-title').val('');
    $('#task-description').val('');
    $('#task-deadline').val('');
});

  // Deletes task event listener.
  $(document).on('click','.delete-task', handleDeleteTask);

  // Makes lanes droppable.
  $('.lane').droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  // Makes the due date field a date picker.
  $('#task-deadline').datepicker({
    dateFormat: 'yy-mm-dd'
  });
  });
