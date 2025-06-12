import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
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
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
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

      card.innerHTML = `
        <div class="task-card-content">
          <div class="task-left-sec">
            <div>
              <input type="checkbox" class="task-done" data-id="${taskId}" ${task.done ? 'checked' : ''} />
            </div>
            <div>
              <h3 class="task-title">${task.title}</h3>
              <p class="task-desc">${task.description}</p>
              <span class="due-date">Due: ${new Date(task.dueDate).toDateString()}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="edit-task" data-id="${taskId}">✏️</button>
            <button class="delete-task" data-id="${taskId}">🗑️</button>
          </div>
        </div>
      `;

      TaskList.appendChild(card);
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
        console.log("Task deleted:", id);
        showTasks(); // Re-render after deletion
      });
    });

  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

showTasks();
