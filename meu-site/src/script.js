const pdfInput = document.getElementById("pdfInput");
const dropzone = document.getElementById("dropzone");
const progressBar = document.getElementById("progressBar");
const output = document.getElementById("output");
const themeToggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");

let currentPdfFile = null;
let analyzing = false;

function showToast(message, type = "error") {
  const toast = document.createElement("div");
  toast.className = "px-4 py-3 rounded shadow-md w-72 text-sm flex items-center gap-3 animate-fade-in-up";

  if (type === "error") {
    toast.classList.add("bg-red-500", "text-white");
    toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
  } else if (type === "success") {
    toast.classList.add("bg-green-500", "text-white");
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
  }

  const container = document.getElementById("toastContainer");
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function resetUI() {
  progressBar.style.width = "0%";
  output.innerHTML = `<p class="text-gray-500">Nenhum PDF carregado.</p>`;
  pdfInput.value = "";
  currentPdfFile = null;
  analyzing = false;
}

function simulatePdfRead(file) {
  output.innerHTML = `
    <div class="text-accent animate-pulse text-lg">
      A processar <strong>${file.name}</strong>...
    </div>
  `;
  progressBar.style.width = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      showPdfResult(file);
    }
  }, 150);
}

function showPdfResult(file) {
  output.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-accent mb-3">PDF Carregado</h2>
        <div class="space-y-2">
          <p><strong>Nome:</strong> ${file.name}</p>
          <p><strong>Tamanho:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
          <p><strong>Status:</strong> Pronto para análise</p>

          <button
            id="analisarBtn"
            class="mt-4 px-5 py-2 border border-accent bg-accent text-lightText dark:text-darkText font-semibold rounded-lg shadow-md hover:bg-lightHighlight dark:hover:bg-darkHighlight transition"
          >
            Analisar PDF
          </button>
        </div>
      </div>

      <!-- Botão animado -->
      <button id="removePdf" class="button ml-4 mt-2" title="Remover PDF">
        <div class="trash">
          <div class="top">
            <div class="paper"></div>
          </div>
          <div class="box"></div>
          <div class="check">
            <svg viewBox="0 0 8 6">
              <polyline points="1 3.4 2.71428571 5 7 1"></polyline>
            </svg>
          </div>
        </div>
        <span>Remover PDF</span>
      </button>
    </div>

    <p class="mt-4 text-sm text-gray-400 italic">Esta é a área onde o resultado do teu programa será mostrado.</p>
  `;

  document.getElementById("analisarBtn").addEventListener("click", () => {
    if (analyzing) return;
    if (currentPdfFile) {
      analisarPdf(currentPdfFile, document.getElementById("analisarBtn"));
    } else {
      showToast("Nenhum PDF disponível para análise.");
    }
  });

  // Botão remover com animação
  const removeButton = document.getElementById("removePdf");
  if (removeButton) {
    removeButton.addEventListener("click", (e) => {
      if (!removeButton.classList.contains("delete")) {
        removeButton.classList.add("delete");
        setTimeout(() => removeButton.classList.remove("delete"), 3200);
      }
      resetUI();
      e.preventDefault();
    });
  }
}

function analisarPdf(file, button) {
  analyzing = true;
  button.disabled = true;
  button.textContent = "Analisando...";

  output.innerHTML += `
    <div id="analyzingLoader" class="mt-6 text-accent flex items-center gap-2">
      <svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      A analisar o PDF...
    </div>
  `;

  setTimeout(() => {
    document.getElementById("analyzingLoader")?.remove();

    output.innerHTML += `
      <div class="mt-4 p-4 bg-highlight rounded">
        <h3 class="text-lg font-bold mb-2 text-accent">Resultado da Análise</h3>
        <p class="text-sm text-white">[Aqui entra o conteúdo da tua análise real]</p>
      </div>
    `;

    button.disabled = false;
    button.textContent = "Analisar PDF";
    analyzing = false;

    showToast("Análise concluída com sucesso!", "success");
  }, 3000);
}

function handleFile(file) {
  if (!file || file.type !== "application/pdf") {
    showToast("Por favor selecione um ficheiro PDF válido.");
    pdfInput.value = "";
    return;
  }
  currentPdfFile = file;
  simulatePdfRead(file);
}

pdfInput.addEventListener("change", () => {
  handleFile(pdfInput.files[0]);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("bg-highlight");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("bg-highlight");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("bg-highlight");
  handleFile(e.dataTransfer.files[0]);
});

// Tema
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  if (themeToggle) themeToggle.checked = isDark;
  if (themeText) themeText.textContent = isDark ? "Modo Escuro" : "Modo Claro";
  localStorage.setItem("theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "dark" : "light";
      applyTheme(newTheme);
    });
  }
});

