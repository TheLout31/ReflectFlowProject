import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const uid = localStorage.getItem("uid");

document.getElementById("logoutBtn").addEventListener("click", async () => {
  console.log(uid);
  try {
    await signOut(auth);
    localStorage.removeItem("uid");
    window.location.href = "index.html";
  } catch (error) {
    alert("Logout failed: " + error.message);
  }
});

async function loadRecentTasks() {
  const container = document.getElementById("recent-tasks");
  if (!uid) {
    container.innerHTML = "<p>Please log in to see your tasks.</p>";
    return;
  }

  try {
    const taskRef = collection(db, "users", uid, "tasks");
    const q = query(taskRef, orderBy("createdAt", "desc"), limit(5)); // latest 5
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No tasks available.</p>";
      return;
    }

    container.innerHTML = ""; // Clear loading

    querySnapshot.forEach((docSnap) => {
      const task = docSnap.data();
      const div = document.createElement("div");
      div.className = "task-preview";

      div.innerHTML = `
        <span>${task.title}</span>
        <span class="task-status ${task.done ? "done" : "pending"}">
          ${task.done ? "Done" : "Pending"}
        </span>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p>Error loading tasks.</p>";
    console.error("Error:", error);
  }
}

async function loadRecentJournals() {
  const container = document.getElementById("recent-journal");
  if (!uid) {
    container.innerHTML = "<p>Please log in to see your journal.</p>";
    return;
  }

  try {
    const taskRef = collection(db, "users", uid, "journals");
    const q = query(taskRef, orderBy("createdAt", "desc"), limit(5)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No Journals available.</p>";
      return;
    }

    container.innerHTML = ""; // Clear loading

    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data();
      const div = document.createElement("div");
      div.className = "journal-preview";

      div.innerHTML = `
        <span>${entry.text.split(" ").slice(0,5).join(" ")}....</span>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p>Error loading tasks.</p>";
    console.error("Error:", error);
  }
}

async function loadRecentGoals() {
  const container = document.getElementById("recent-goals");
  if (!uid) {
    container.innerHTML = "<p>Please log in to see your Goals.</p>";
    return;
  }

  try {
    const taskRef = collection(db, "users", uid, "goals");
    const q = query(taskRef, orderBy("createdAt", "desc"), limit(5)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No Goals available.</p>";
      return;
    }

    container.innerHTML = ""; 

    querySnapshot.forEach((docSnap) => {
      const goal = docSnap.data();
      const div = document.createElement("div");
      div.className = "goal-preview";

      div.innerHTML = `
        <span>${goal.title}</span>
        <span class="goal-status">
          ${goal.progress}%
        </span>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = "<p>Error loading tasks.</p>";
    console.error("Error:", error);
  }
}
loadRecentGoals()
loadRecentJournals();
loadRecentTasks();
