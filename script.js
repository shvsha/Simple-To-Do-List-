// Date
const today = new Date();
document.getElementById("date").textContent = today.toLocaleDateString("en-PH", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

// Sidebar nav
const sections = ["all-tasks", "completed-tasks", "due-today", "due-week"];
const titles = {
    "all-tasks": "Task List",
    "completed-tasks": "Completed Tasks",
    "due-today": "Tasks Due Today",
    "due-week": "Tasks Due This Week"
  };
  document.querySelectorAll(".sidebar-nav li, .sidebar-nav a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");

      document.querySelectorAll(".main-section").forEach(sec => {
        sec.style.display = sec.id === sectionId ? "block" : "none";
      });

      if (titles[sectionId]) {
        document.getElementById("sub-title").textContent = titles[sectionId];
      }

      document.querySelectorAll(".sidebar-nav li").forEach(li => {
        li.classList.remove("active");
      });

      const activeLi = document.getElementById(sectionId);
      activeLi.classList.add("active");
    });
  });

// Mark as done button functionality
const markAsDone = (button) => {
  const taskItem = button.closest('.task-item');
  const title = taskItem.querySelector('h3').textContent;
  const desc = taskItem.querySelector('p').textContent;
  
  const completedTask = document.createElement('div');
  completedTask.className = 'task-item-undone';
  completedTask.innerHTML = `
  <div class="task-item-undone-content">
    <h3>${title}</h3>
    <p>${desc}</p>
    <button id="mark-undone" class="task-item-btn">Mark as Undone</button>
  </div>`;

  document.getElementById('task-item-undone').appendChild(completedTask);
  completedTask.querySelector('#mark-undone').addEventListener('click', () => markAsUndone(completedTask.querySelector('#mark-undone')));
  taskItem.remove();
  
  Swal.fire({
    title: "Done!",
    text: "Task moved to completed section.",
    icon: "success",
    background: '#131518',
    color: 'white',
    confirmButtonText: 'Okay',
    confirmButtonColor: '#2575fc'
  });
};

// Mark as undone button functionality
const markAsUndone = (button) => {
  const completedTaskItem = button.closest('.task-item-undone');
  const title = completedTaskItem.querySelector('h3').textContent;
  const desc = completedTaskItem.querySelector('p').textContent;

  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.innerHTML = `
    <div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <button id="mark-done" class="task-item-btn">Mark as Done</button>
      <button id="edit" class="task-item-btn">Edit</button>
      <button id="delete" class="task-item-btn">Delete</button>  
    </div>
    <div>
      <button class="favorite-btn"><i class="fa-regular fa-star"></i></button>
    </div>
  `;
  
  // Add to all tasks section
  document.getElementById('task-list').appendChild(taskItem);
  
  taskItem.querySelector('#mark-done').addEventListener('click', () => markAsDone(taskItem.querySelector('#mark-done')));
  taskItem.querySelector('#edit').addEventListener('click', editTask);
  taskItem.querySelector('#delete').addEventListener('click', () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      background: '#131518',
      color: 'white',
      showCancelButton: true,
      confirmButtonColor: "#2575fc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        taskItem.remove();
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
          background: '#131518',
          color: 'white',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#2575fc'
        });
      }
    });
  });

  completedTaskItem.remove();
  
  Swal.fire({
    title: "Undone!",
    text: "Task moved back to task list.",
    icon: "success",
    background: '#131518',
    color: 'white',
    confirmButtonText: 'Okay',
    confirmButtonColor: '#2575fc'
  });
};

// Update existing event listeners to pass the button element
document.querySelectorAll('.task-item-btn#mark-done').forEach(btn => {
  btn.addEventListener('click', () => markAsDone(btn));
});

document.querySelectorAll('.task-item-btn#mark-undone').forEach(btn => {
  btn.addEventListener('click', () => markAsUndone(btn));
});

// Edit task button functionality
const editBtns = document.querySelectorAll('.task-item-btn#edit');
const editTask = () => {
  Swal.fire({
    title: "Edit Task",
    text: "Edit functionality is not implemented yet.",
    icon: "info",
    background: '#131518',
    color: 'white',
    confirmButtonText: 'Okay',
    confirmButtonColor: '#2575fc'
  });
};
editBtns.forEach(btn => {
  btn.addEventListener('click', editTask);
});

// Delete task button functionality
const deleteBtns = document.querySelectorAll('.task-item-btn#delete');
const taskItems = document.querySelectorAll('.task-item');
const completedTaskItems = document.querySelectorAll('.task-item.completed');

const deleteTask = (index) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    background: '#131518',
    color: 'white',
    showCancelButton: true,
    confirmButtonColor: "#2575fc",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      taskItems[index].remove();
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    }
  });
};

deleteBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => deleteTask(index));
});

// Add task button functionality
document.querySelectorAll('#container-add-task-list, #add-task-btn')
  .forEach(el => el.addEventListener('click', async () => {  
  const { value: formValues } = await Swal.fire({
    background: '#131518',
    color: 'white',
    icon: 'info',
    title: 'Add New Task',
    html:
      `<input id="swal-task-title" class="swal2-input" placeholder="Task Title" required>
       <input id="swal-task-desc" class="swal2-input" placeholder="Description" required>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Add Task',
    confirmButtonColor: '#2575fc',
    preConfirm: () => {
      const title = document.getElementById('swal-task-title').value.trim();
      const desc = document.getElementById('swal-task-desc').value.trim();
      if (!title || !desc) {
        Swal.showValidationMessage('Please enter both title and description');
        return false;
      }
      return [title, desc];
    }
  });

  // Add the new task to in the task list
  if (formValues) {
    const [title, desc] = formValues;
    const taskList = document.getElementById('task-list');
    const newTask = document.createElement('div');
    newTask.className = 'task-item';
    newTask.innerHTML = `
        <div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <button id="mark-done" class="task-item-btn">Mark as Done</button>
          <button id="edit" class="task-item-btn">Edit</button>
          <button id="delete" class="task-item-btn">Delete</button>
        </div>
        <div>
        <button class="favorite-btn"><i class="fa-regular fa-star"></i></button>
        </div>
    `;
    taskList.appendChild(newTask);
    Swal.fire('Success!', 'Task added successfully.', 'success');

    newTask.querySelector('#mark-done').addEventListener('click', () => markAsDone(newTask.querySelector('#mark-done')));
    newTask.querySelector('#edit').addEventListener('click', editTask);
    newTask.querySelector('#delete').addEventListener('click', function() {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        background: '#131518',
        color: 'white',
        showCancelButton: true,
        confirmButtonColor: "#2575fc",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          newTask.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
            background: '#131518',
            color: 'white',
            confirmButtonText: 'Okay',
            confirmButtonColor: '#2575fc'
          });
        }
      });
    });
    }
  }));
  