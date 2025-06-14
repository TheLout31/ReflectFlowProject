import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleLink = document.getElementById("toggleLink");
const formTitle = document.getElementById("formTitle");

let loggedIn = localStorage.getItem("uid");
console.log(loggedIn);
if (loggedIn) {
  window.location.href = "dashboard.html";
}

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  const isLogin = loginForm.style.display !== "none";

  loginForm.style.display = isLogin ? "none" : "block";
  signupForm.style.display = isLogin ? "block" : "none";
  formTitle.textContent = isLogin ? "Sign Up" : "Login";
  toggleLink.textContent = isLogin ? "Login" : "Sign up";
  toggleLink.parentElement.firstChild.textContent = isLogin
    ? "Already have an account? "
    : "Don't have an account? ";
});

signupForm.addEventListener("submit", async function (e) {
  console.log("function called!!!");
  e.preventDefault();

  const Email = signupForm.querySelector('input[type="email"]').value.trim();
  const Password = signupForm
    .querySelector('input[type="password"]')
    .value.trim();
  console.log(Email, Password);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    const user = userCredential.user;

     showToast("SignIn Successfull!!",  "#4caf50");

    signupForm.style.display = "none";
    loginForm.style.display = "block";
    formTitle.textContent = "Login";
    toggleLink.textContent = "Sign up";
    toggleLink.parentElement.firstChild.textContent = "Don't have an account? ";
  } catch (error) {
    showToast(error.message, "#FF4433");
    console.error(error);
  }
});

loginForm.addEventListener("submit", async function (e) {
  console.log("function called!!!");
  e.preventDefault();

  const Email = loginForm.querySelector('input[type="email"]').value.trim();
  const Password = loginForm
    .querySelector('input[type="password"]')
    .value.trim();
  console.log(Email, Password);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    const user = userCredential.user;
    localStorage.setItem("uid", JSON.stringify(user.uid));
    showToast("LogIn Successfull!!",  "#4caf50");
    window.location.href = "dashboard.html";
  } catch (error) {
    showToast("Incorrect Email or Password", "#FF4433");
    console.error(error);
  }
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
