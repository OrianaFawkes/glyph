import { runPipeline } from "./core/pipeline.js";
import { createEmptyModule } from "./modules/empty.js";
import { removeModule, clearModule } from "./ui/actions.js";
import * as renderer from "./ui/renderers.js";

const GLYPH_VERSION = "0.1.0";
const MAX_MODULES = 5;

// DOM References

const addModuleBtn = document.getElementById("add-module-btn");
const copyBtn = document.getElementById("copy-output-btn");
const inputEl = document.getElementById("input-text");
const maxNotice = document.getElementById("max-notice");
const outputEl = document.getElementById("output-text");
const pipelineEl = document.getElementById("pipeline");

// App State

let pipeline = [];

// Event Wiring

addModuleBtn.addEventListener("click", () => {
  if (!canAddModule()) return;

  const module = createEmptyModule();
  pipeline.push(module);

  const moduleEl = renderModule(module);
  pipelineEl.appendChild(moduleEl);

  updateAddModuleState();
  updateOutput();
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputEl.value);

    copyBtn.textContent = "Copied to Clipboard";

    setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1000);
  } catch (err) {
    console.error("Copy failed", err);
  }
});

inputEl.addEventListener("input", updateOutput);

pipelineEl.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterEl = getDragAfterElement(pipelineEl, e.clientY);
  const draggingEl = document.querySelector(".dragging");

  if (!draggingEl) return;

  if (afterEl == null) {
    pipelineEl.appendChild(draggingEl);
    return;
  }
  pipelineEl.insertBefore(draggingEl, afterEl);
});

// Helper Functions

function getModuleRenderer(type) {
  return {
    case: renderer.renderCaseModule,
    replace: renderer.renderReplaceModule,
    encode: renderer.renderEncodeModule,
    json: renderer.renderJsonModule,
  }[type];
}

function canAddModule() {
  return pipeline.length < MAX_MODULES;
}

// Drag & Drop

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".module:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height * 0.25;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function syncPipelineOrder() {
  const idsInDomOrder = [...pipelineEl.children].map(
    (el) => el.dataset.moduleId
  );

  pipeline = idsInDomOrder.map((id) => pipeline.find((m) => m.id === id));

  updateOutput();
}

// Rendering helpers

function renderModuleShell(module, onRemove) {
  const el = document.createElement("section");
  el.className = "module";

  const header = document.createElement("div");
  header.className = "module-header";

  const title = document.createElement("h3");
  title.textContent = module.name;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "danger";
  removeBtn.addEventListener("click", onRemove);

  header.append(title, removeBtn);
  el.append(header);

  return el;
}

function renderModule(module) {
  const el = renderModuleShell(module, () => {
    if (module.type === null) {
      removeModule(
        module,
        el,
        pipeline,
        pipelineEl,
        updateAddModuleState,
        updateOutput
      );
      return;
    }
    clearModule(module, el, pipeline, pipelineEl, renderModule, updateOutput);
  });

  if (module.type === null) {
    renderer.renderEmptyModule(
      module,
      el,
      pipeline,
      pipelineEl,
      renderModule,
      updateOutput
    );
  } else {
    const renderer = getModuleRenderer(module.type);
    if (renderer) renderer(module, el, updateOutput);
  }

  el.draggable = true;
  el.dataset.moduleId = module.id;
  el.addEventListener("dragstart", (e) => {
    el.classList.add("dragging");
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    syncPipelineOrder();
  });

  return el;
}

function updateAddModuleState() {
  if (canAddModule()) {
    addModuleBtn.style.display = "block";
    maxNotice.style.display = "none";
    return;
  }
  addModuleBtn.style.display = "none";
  maxNotice.style.display = "block";
}

function updateOutput() {
  const inputText = inputEl.value;
  const result = runPipeline(inputText, pipeline);
  outputEl.value = result;
}

updateAddModuleState();
updateOutput();
