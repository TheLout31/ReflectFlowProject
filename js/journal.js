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
      console.log("Task deleted:", idx)
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
    console.log("Document written with ID: ", docRef.id);
    loadEntries();
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  journalInput.value = "";
});

loadEntries();
