(() => {
  "use strict";

  const body = document.body;

  function showView(name) {
    body.dataset.view = name;
    history.replaceState(null, "", "#" + name);
    window.scrollTo(0, 0);
    const first = document.querySelector(
      name === "signup" ? "#suEmail" : "#loginUser"
    );
    if (first) first.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.go));
  });

  if (location.hash === "#signup") body.dataset.view = "signup";

  document.querySelectorAll(".nav").forEach((nav) => {
    nav.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-link");
      if (!link) return;
      e.preventDefault();
      nav.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  document.querySelectorAll(".field").forEach((field) => {
    const input = field.querySelector("input");
    const clearBtn = field.querySelector(".clear-btn");
    const toggleBtn = field.querySelector(".toggle-pass");

    const sync = () => field.classList.toggle("has-value", input.value.length > 0);
    input.addEventListener("input", () => {
      sync();
      clearError(input);
    });
    sync();

    clearBtn?.addEventListener("click", () => {
      input.value = "";
      sync();
      clearError(input);
      input.focus();
    });

    toggleBtn?.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      toggleBtn.querySelector("i").className = show
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";
    });
  });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?[0-9\s\-()]{7,15}$/;

  function setError(input, message) {
    const err = document.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = message;
    input.closest(".field").classList.add("has-error");
  }

  function clearError(input) {
    const err = document.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = "";
    input.closest(".field").classList.remove("has-error");
  }

  function setMessage(el, text, ok) {
    el.textContent = text;
    el.classList.toggle("ok", !!ok);
    el.classList.toggle("bad", !ok);
  }

  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser");
    const pass = document.getElementById("loginPass");
    let valid = true;

    [user, pass].forEach(clearError);
    loginMsg.textContent = "";

    if (!user.value.trim()) {
      setError(user, "Enter your email or username.");
      valid = false;
    }
    if (!pass.value) {
      setError(pass, "Enter your password.");
      valid = false;
    }
    if (!valid) return;

    setMessage(loginMsg, "Logging in…", true);
    setTimeout(() => setMessage(loginMsg, "Welcome back to StaffSync!", true), 700);
  });

  document.querySelector(".forgot").addEventListener("click", (e) => {
    e.preventDefault();
    setMessage(loginMsg, "Password reset isn’t connected yet.", false);
  });

  const signupForm = document.getElementById("signupForm");
  const signupMsg = document.getElementById("signupMsg");

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("suEmail");
    const user = document.getElementById("suUser");
    const pass = document.getElementById("suPass");
    const pass2 = document.getElementById("suPass2");
    const contact = document.getElementById("suContact");
    let valid = true;

    [email, user, pass, pass2, contact].forEach(clearError);
    signupMsg.textContent = "";

    if (!emailRe.test(email.value.trim())) {
      setError(email, "Enter a valid email address.");
      valid = false;
    }
    if (user.value.trim().length < 3) {
      setError(user, "Username must be at least 3 characters.");
      valid = false;
    }
    if (pass.value.length < 8) {
      setError(pass, "Password must be at least 8 characters.");
      valid = false;
    }
    if (pass2.value !== pass.value || !pass2.value) {
      setError(pass2, "Passwords don’t match.");
      valid = false;
    }
    if (!phoneRe.test(contact.value.trim())) {
      setError(contact, "Enter a valid contact number.");
      valid = false;
    }
    if (!valid) return;

    setMessage(signupMsg, "Creating your account…", true);
    setTimeout(() => {
      setMessage(signupMsg, "Account created! You can log in now.", true);
      signupForm.reset();
      signupForm.querySelectorAll(".field").forEach((f) => f.classList.remove("has-value"));
    }, 700);
  });
})();