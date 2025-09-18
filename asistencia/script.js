//selecionar elementos de html
const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

// Identificar actividad en el botón
loginBtn.addEventListener("click", () => {
 
  if (username.value.trim() === "" || password.value.trim() === "") {
    alert("Ingreso de datos no válido, por favor, completa todos los campos.");
    return;
  }

  // Confirmación visual
  loginBtn.innerText = "Guardado";
  loginBtn.classList.remove("btn-primary");
  loginBtn.classList.add("btn-success");
  loginBtn.disabled = true; 
});