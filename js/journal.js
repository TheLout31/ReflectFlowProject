import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const journalInput = document.getElementById("journalInput");
const saveJournal = document.getElementById("saveJournal");
const journalEntries = document.getElementById("journalEntries");
const createdAt = new Date().toISOString();
const uid = localStorage.getItem("uid");

function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function loadEntries() {
  const journalRef = collection(db, "users", uid, "journals");

  try {
    const entries = await getDocs(journalRef);
    journalEntries.innerHTML = "";

    entries.forEach((doc) => {
      const entry = doc.data();
      const entryID = doc.id;
      const entryEl = document.createElement("div");
      entryEl.className = "journal-card";
      entryEl.innerHTML = `
      <div class="journal-header" data-id="${entryID}">
        <span>${formatDate(entry.createdAt)}</span>
        <span class="mood">🧠 Neutral (0.00)</span>
      </div>
      <div class="journal-body">${entry.text}</div>
      <div class="journal-footer">
        <button class="delete-btn" data-id="${entryID}">🗑️</button>
      </div>
    `;
      journalEntries.appendChild(entryEl);
    });
  } catch (e) {
    console.log(e);
  }

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idx = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "users", uid, "journals", idx));
      showToast("Journal Deleted!!", "#4caf50");

      loadEntries();
    });
  });
}

saveJournal.addEventListener("click", async () => {
  const text = journalInput.value.trim();
  if (text === "") return;

  try {
    console.log(uid);
    console.log(db);
    const docRef = await addDoc(collection(db, "users", uid, "journals"), {
      text: text,
      createdAt: createdAt,
    });
    showToast("Journal Added!!", "#4caf50");
    console.log("Document written with ID: ", docRef.id);
    loadEntries();
  } catch (e) {
    showToast(e.message,  "#FF4433");
    console.error("Error adding document: ", e);
  }

  journalInput.value = "";
});

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

loadEntries();
