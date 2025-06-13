import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

document.getElementById("openGoalModal").addEventListener("click", () => {
  document.getElementById("goalModal").classList.remove("hidden");
});

document.getElementById("closeGoalModal").addEventListener("click", () => {
  document.getElementById("goalModal").classList.add("hidden");
});

const uid = localStorage.getItem("uid");

document.getElementById("addGoalButton").addEventListener("click", async () => {
  if (!uid) {
    alert("Please login first");
    return;
  }
  const title = document.getElementById("goalTitle").value.trim();
  const description = document.getElementById("goalDescription").value.trim();
  const dueDate = document.getElementById("goalDueDate").value;
  const createdAt = new Date().toISOString();

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  try {
    console.log(uid);
    console.log(db);
    const docRef = await addDoc(collection(db, "users", uid, "goals"), {
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
  document.getElementById("goalTitle").value = "";
  document.getElementById("goalDescription").value = "";
  document.getElementById("goalDueDate").value = "";
  document.getElementById("goalModal").classList.add("hidden");
  showToast("Goal Addded successfully.", "#4caf50");
  showGoals();
});

async function showGoals() {
  const goalsContainer = document.getElementById("goalsContainer");
  goalsContainer.innerHTML = "";

  if (!uid) return;

  try {
    const goalsSnap = await getDocs(collection(db, "users", uid, "goals"));

    goalsSnap.forEach((docSnap) => {
      const goal = docSnap.data();
      const goalId = docSnap.id;

      const card = document.createElement("div");
      card.className = "goal-card";

      const due = goal.dueDate
        ? new Date(goal.dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No date";

      card.innerHTML = `
      <h3>${goal.title} <small>Short-term</small></h3>
      <p>${goal.description}</p>
      <p class="deadline">Deadline: ${due}</p>
      <div class="progress-label">
        <span>Progress</span>
        <span id="progressValue-${goalId}">${goal.progress || 5}%</span>
      </div>
      <input class="progress-range" type="range" min="0" max="100" value="${goal.progress || 0}" oninput="updateProgressValue('${goalId}',this.value)" />
      <div class="actions">
       <button class="edit-goal" data-id="${goalId}">✏️</button>
            <button class="delete-goal" data-id="${goalId}">🗑️</button>
      </div>
    `;

      goalsContainer.appendChild(card);
    });

    document.querySelectorAll(".delete-goal").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        console.log("button Clicked!!!");
        const id = e.target.getAttribute("data-id");
        await deleteDoc(doc(db, "users", uid, "goals", id));
        showToast("Goal Deleted!!!", "#8f5c5c");
        showGoals();
      });
    });

    function editGoal(goalId) {
      alert("Edit functionality to be implemented.");
    }
  } catch (e) {
    showToast("Error showing Data!", "#8f5c5c");
  }
}

const progressDebounceMap = {};

window.updateProgressValue = function (goalId, value) {
  const progressSpan = document.getElementById(`progressValue-${goalId}`);
  if (progressSpan) {
    progressSpan.textContent = `${value}%`;
  }

  // Debounce Firestore update
  if (progressDebounceMap[goalId]) {
    clearTimeout(progressDebounceMap[goalId]);
  }

  progressDebounceMap[goalId] = setTimeout(async () => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      const goalRef = doc(db, "users", uid, "goals", goalId);
      console.log("Progress Updated for:", goalId);
      try {
        await updateDoc(goalRef, { progress: Number(value) });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  }, 1000); 
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
showGoals();
