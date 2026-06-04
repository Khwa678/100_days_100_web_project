const addTaskBtn = document.getElementById("addTaskBtn");
const modal = document.getElementById("taskModal");
const saveTask = document.getElementById("saveTask");
const titleInput = document.getElementById("taskTitle");
const priorityInput = document.getElementById("priority");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addTaskBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

saveTask.addEventListener("click", () => {

    if(titleInput.value.trim() === ""){
        alert("Enter Task");
        return;
    }

    const task = {
        id: Date.now(),
        title: titleInput.value,
        priority: priorityInput.value,
        status: "todo"
    };

    tasks.push(task);

    saveLocalStorage();
    renderTasks();

    titleInput.value = "";
    modal.style.display = "none";
});

function renderTasks(){

    document.querySelectorAll(".task-list").forEach(col=>{
        col.innerHTML="";
    });

    tasks.forEach(task=>{

        const taskCard = document.createElement("div");

        taskCard.classList.add("task");
        taskCard.draggable = true;
        taskCard.dataset.id = task.id;

        let priorityClass = task.priority.toLowerCase();

        taskCard.innerHTML = `
            <div class="priority ${priorityClass}">
                ${task.priority}
            </div>

            <h4>${task.title}</h4>

            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        taskCard.querySelector(".delete").addEventListener("click",()=>{
            tasks = tasks.filter(t=>t.id!==task.id);
            saveLocalStorage();
            renderTasks();
        });

        taskCard.querySelector(".edit").addEventListener("click",()=>{

            const newTitle = prompt("Edit Task",task.title);

            if(newTitle){
                task.title = newTitle;
                saveLocalStorage();
                renderTasks();
            }
        });

        taskCard.addEventListener("dragstart",()=>{
            taskCard.classList.add("dragging");
        });

        taskCard.addEventListener("dragend",()=>{
            taskCard.classList.remove("dragging");
        });

        document.getElementById(task.status)
        .appendChild(taskCard);
    });

    enableDrop();
}

function enableDrop(){

    document.querySelectorAll(".task-list").forEach(column=>{

        column.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });

        column.addEventListener("drop",(e)=>{

            const dragging =
            document.querySelector(".dragging");

            const id =
            Number(dragging.dataset.id);

            const task =
            tasks.find(t=>t.id===id);

            task.status =
            column.id;

            saveLocalStorage();
            renderTasks();
        });
    });
}

function saveLocalStorage(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );
});

if(localStorage.getItem("theme")==="true"){
    document.body.classList.add("dark");
}

renderTasks();