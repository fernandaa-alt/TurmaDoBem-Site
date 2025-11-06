// === forms.js ===
// Script global de validação, interatividade e envio de formulários

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      clearMessages(form);
      disableButton(form, true);

      const isValid = validateForm(form);

      if (!isValid) {
        disableButton(form, false);
        return;
      }

      const formData = Object.fromEntries(new FormData(form).entries());
      console.table(formData);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        showToast("✅ Formulário enviado com sucesso!");
        console.groupCollapsed("📋 Dados enviados:");
        console.table(formData);
        console.groupEnd();

        form.reset();
      } catch (err) {
        showToast("❌ Erro ao enviar o formulário. Tente novamente.", "error");
        console.error(err);
      }

      disableButton(form, false);
    });

    form.querySelectorAll("input").forEach((input) => {
      if (input.type === "tel") maskPhone(input);
      if (input.name === "cpf") maskCPF(input);
    });
  });

  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");

  if (showLoginBtn && showRegisterBtn) {
    showLoginBtn.addEventListener("click", () => toggleForms("login"));
    showRegisterBtn.addEventListener("click", () => toggleForms("register"));
    toggleForms("login");
  }
});

function toggleForms(target) {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");

  if (target === "login") {
    loginSection.style.display = "block";
    registerSection.style.display = "none";
  } else {
    registerSection.style.display = "block";
    loginSection.style.display = "none";
  }
}

function validateForm(form) {
  let valid = true;
  const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;

    // Campo obrigatório
    if (field.hasAttribute("required") && !value) {
      showError(field, "Este campo é obrigatório.");
      valid = false;
    }

    // E-mail
    else if (type === "email" && value && !emailRegex.test(value)) {
      showError(field, "Digite um e-mail válido (ex: nome@exemplo.com).");
      valid = false;
    }

    // CPF
    else if (name === "cpf" && value && !isValidCPF(value)) {
      showError(field, "CPF inválido.");
      valid = false;
    }

    // Checkbox obrigatório
    else if (type === "checkbox" && field.required && !field.checked) {
      showError(field, "Você deve marcar esta opção para continuar.");
      valid = false;
    }
  });

  return valid;
}

// === Erros e mensagens ===
function clearMessages(form) {
  form.querySelectorAll(".error-msg").forEach((el) => el.remove());
}

function showError(input, message) {
  const error = document.createElement("div");
  error.classList.add("error-msg");
  error.innerHTML = `<span style="color:#b50000;">⚠️ ${message}</span>`;
  input.insertAdjacentElement("afterend", error);
}

function disableButton(form, disable) {
  const button = form.querySelector("button[type='submit']");
  if (button) button.disabled = disable;
}

// === Máscaras ===
function maskPhone(input) {
  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length <= 10)
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");

    input.value = v;
  });
}

function maskCPF(input) {
  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
  });
}

// === CPF Validator ===
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

// === Toasts ===
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `toast ${type}`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 100);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// === MENU HAMBURGUER ===
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("sidebar");
  const menu = document.querySelector(".menu");

  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }
});

