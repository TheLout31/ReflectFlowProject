import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

document.getElementById("openTaskModal").addEventListener("click", () => {
  document.getElementById("taskModal").classList.remove("hidden");
});

document.getElementById("closeTaskModal").addEventListener("click", () => {
  document.getElementById("taskModal").classList.add("hidden");
});

const uid = localStorage.getItem("uid");

// You can expand this to handle actual task saving
document.getElementById("addTaskButton").addEventListener("click", async () => {
  if (!uid) {
    alert("Please login first");
    return;
  }
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const createdAt = new Date().toISOString();

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  try {
    console.log(uid);
    console.log(db);
    const docRef = await addDoc(collection(db, "users", uid, "tasks"), {
      title: title,
      description: description,
      dueDate: dueDate,
      createdAt: createdAt,
    });
    showToast("Task Added!!", "#4caf50");
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    showToast(e.message, "#FF4433");
    console.error("Error adding document: ", e);
  }
  // const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  // tasks.push(newTask);

  // // tasks.array.forEach((element) => {});
  // localStorage.setItem("tasks", JSON.stringify(tasks));

  // Clear and close
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskModal").classList.add("hidden");
  showTasks();
});

async function showTasks() {
  const TaskList = document.getElementById("tasks-list");
  const taskRef = collection(db, "users", uid, "tasks");

  try {
    const querySnapshot = await getDocs(taskRef);
    TaskList.innerHTML = ""; // Clear previous content

    querySnapshot.forEach((docSnap) => {
      const task = docSnap.data();
      const taskId = docSnap.id;

      const card = document.createElement("div");
      card.className = "task-card";
      card.setAttribute("draggable", "true");
      card.setAttribute("data-id", taskId);

      card.innerHTML = `
        <div class="task-card-content">
          <div class="task-left-sec">
            <div>
              <input type="checkbox" class="task-done" data-id="${taskId}" ${
        task.done ? "checked" : ""
      } />
            </div>
            <div>
              <h3 class="task-title">${task.title}</h3>
              <p class="task-desc">${task.description}</p>
              <span class="due-date">Due: ${new Date(
                task.dueDate
              ).toDateString()}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="edit-task" data-id="${taskId}">✏️</button>
            <button class="delete-task" data-id="${taskId}">🗑️</button>
          </div>
        </div>
      `;

      TaskList.appendChild(card);
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", taskId);
        e.target.style.opacity = 0.5;
      });

      card.addEventListener("dragend", (e) => {
        e.target.style.opacity = 1;
      });

      card.addEventListener("dragstart", () => card.classList.add("dragging"));
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
    });

    TaskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(TaskList, e.clientY);
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedEl = document.querySelector(
        `.task-card[data-id="${draggedId}"]`
      );

      if (afterElement == null) {
        TaskList.appendChild(draggedEl);
      } else {
        TaskList.insertBefore(draggedEl, afterElement);
      }
    });

    // 🔄 Handle task done toggle
    document.querySelectorAll(".task-done").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const id = e.target.getAttribute("data-id");
        const checked = e.target.checked;
        const taskDocRef = doc(db, "users", uid, "tasks", id);
        await updateDoc(taskDocRef, { done: checked });
        console.log("Task updated:", id, "=> Done:", checked);
      });
    });

    // 🗑️ Handle delete
    document.querySelectorAll(".delete-task").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        await deleteDoc(doc(db, "users", uid, "tasks", id));
        showToast("Task Deleted!!", "#4caf50");
        console.log("Task deleted:", id);
        showTasks(); // Re-render after deletion
      });
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task-card:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function showToast(message, color) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = color;
  toast.style.color = "#fff";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = 1000;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

showTasks();
