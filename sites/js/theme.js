// Tema claro/escuro
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  const toggle = document.getElementById("themeToggle");
  const themeText = document.getElementById("themeText");
  if (toggle) toggle.checked = isDark;
  if (themeText) themeText.textContent = isDark ? "Modo Escuro" : "Modo Claro";
  localStorage.setItem("theme", theme);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      const newTheme = toggle.checked ? "dark" : "light";
      applyTheme(newTheme);
    });
  }
}
