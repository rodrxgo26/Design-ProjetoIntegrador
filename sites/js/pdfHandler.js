let currentPdfFile = null;
let analyzing = false;

function resetUI() {
  const progressBar = document.getElementById("progressBar");
  const output = document.getElementById("output");
  progressBar.style.width = "0%";
  output.innerHTML = `<p class="text-gray-500 dark:text-gray-400">Nenhum PDF carregado.</p>`;
  document.getElementById("pdfInput").value = "";
  document.getElementById("file-name").textContent = "";
  currentPdfFile = null;
  analyzing = false;
}

function simulatePdfRead(file) {
  const progressBar = document.getElementById("progressBar");
  const output = document.getElementById("output");

  output.innerHTML = `<div class="text-accent animate-pulse text-lg">A processar <strong>${file.name}</strong>...</div>`;
  progressBar.style.width = "0%";
  progressBar.style.transition = "width 1.5s ease-in-out";

  setTimeout(() => (progressBar.style.width = "100%"), 100);
  setTimeout(() => showPdfResult(file), 1800);
}

function showPdfResult(file) {
  const output = document.getElementById("output");

  output.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-accent mb-3">PDF Carregado</h2>
        <div class="space-y-2">
          <p><strong>Nome:</strong> ${file.name}</p>
          <p><strong>Tamanho:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
          <p><strong>Status:</strong> Pronto para análise</p>
          <button id="analisarBtn" class="mt-4 px-5 py-2 border border-accent bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-lightHighlight dark:hover:bg-darkHighlight transition">Analisar PDF</button>
        </div>
      </div>
      <button id="removePdf" class="button ml-4 mt-2" title="Remover PDF"> ... botão animado ... </button>
    </div>
  `;

  document.getElementById("file-name").textContent = `📄 ${file.name}`;
  currentPdfFile = file;

  document.getElementById("analisarBtn")?.addEventListener("click", () => {
    if (!analyzing) analisarPdf(file);
  });

  document.getElementById("removePdf")?.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (!btn.classList.contains("delete")) {
      btn.classList.add("delete");
      setTimeout(() => {
        btn.classList.remove("delete");
        resetUI();
      }, 1500);
    }
  });
}

function analisarPdf(file) {
  analyzing = true;
  const output = document.getElementById("output");
  const button = document.getElementById("analisarBtn");

  if (!file || !button) return;

  button.disabled = true;
  button.textContent = "Analisando...";

  const loader = document.createElement("div");
  loader.className = "mt-6 text-accent flex items-center gap-2";
  loader.innerHTML = `<svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" ...></svg> A analisar o PDF...`;
  output.appendChild(loader);

  setTimeout(() => {
    loader.remove();
    output.innerHTML += `<div class="mt-4 p-4 bg-highlight rounded"><h3 class="text-lg font-bold mb-2 text-accent">Resultado da Análise</h3><p class="text-sm text-white">[Aqui entra o conteúdo da tua análise real]</p></div>`;
    button.disabled = false;
    button.textContent = "Analisar PDF";
    analyzing = false;
    showToast("Análise concluída com sucesso!", "success");
  }, 3000);
}

function handleFile(file) {
  if (!file || file.type !== "application/pdf") {
    showToast("Por favor selecione um ficheiro PDF válido.");
    return;
  }
  simulatePdfRead(file);
}

function setupPdfUpload() {
  const input = document.getElementById("pdfInput");
  const dropzone = document.getElementById("dropzone");

  input.addEventListener("change", () => handleFile(input.files[0]));

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
}
