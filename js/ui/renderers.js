import { replaceEmptyModule } from "./actions.js";

export function renderEmptyModule(
  module,
  container,
  pipeline,
  pipelineEl,
  renderModule,
  updateOutput
) {
  container.classList.add("empty-module");

  const group = document.createElement("div");
  group.className = "segmented";

  const options = [
    { value: "case", label: "Case" },
    { value: "replace", label: "Replace" },
    { value: "encode", label: "Encode / Decode" },
    { value: "json", label: "JSON" },
  ];
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.classList.toggle("active", module.settings.mode === opt);
    btn.addEventListener("click", () => {
      replaceEmptyModule(
        module,
        container,
        opt.value,
        pipeline,
        pipelineEl,
        renderModule,
        updateOutput
      );
    });

    group.appendChild(btn);
  });

  container.appendChild(group);
}

export function renderCaseModule(module, container, updateOutput) {
  const group = document.createElement("div");
  group.className = "segmented";

  const modes = [
    { value: "upper", label: "UPPERCASE" },
    { value: "lower", label: "lowercase" },
    { value: "title", label: "Title Case" },
  ];
  modes.forEach((mode) => {
    const btn = document.createElement("button");
    btn.textContent = mode.label;
    btn.classList.toggle("active", module.settings.mode === mode.value);
    btn.addEventListener("click", () => {
      module.settings.mode = mode.value;

      updateOutput();

      [...group.children].forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");
    });

    group.appendChild(btn);
  });

  container.appendChild(group);
}

export function renderReplaceModule(module, container, updateOutput) {
  const findInput = document.createElement("input");
  findInput.setAttribute("name", `module-find-input`);
  findInput.type = "text";
  findInput.placeholder = "Find";
  findInput.value = module.settings.find;

  const replaceInput = document.createElement("input");
  replaceInput.setAttribute("name", `module-replace-input`);
  replaceInput.type = "text";
  replaceInput.placeholder = "Replace";
  replaceInput.value = module.settings.replace;

  const regexToggle = document.createElement("button");
  regexToggle.textContent = "Regex";
  regexToggle.className = "toggle";

  if (module.settings.useRegex) {
    regexToggle.classList.add("active");
  }

  findInput.addEventListener("input", () => {
    module.settings.find = findInput.value;
    updateOutput();
  });

  replaceInput.addEventListener("input", () => {
    module.settings.replace = replaceInput.value;
    updateOutput();
  });

  regexToggle.addEventListener("click", () => {
    module.settings.useRegex = !module.settings.useRegex;
    regexToggle.classList.toggle("active");
    updateOutput();
  });

  container.append(findInput, replaceInput, regexToggle);
}

export function renderEncodeModule(module, container, updateOutput) {
  const group = document.createElement("div");
  group.className = "segmented";

  const modes = [
    { value: "base64-encode", label: "Encode (Base64)" },
    { value: "base64-decode", label: "Decode (Base64)" },
    { value: "url-encode", label: "Encode for URL" },
    { value: "url-decode", label: "Decode from URL" },
  ];
  modes.forEach((mode) => {
    const btn = document.createElement("button");
    btn.textContent = mode.label;
    btn.classList.toggle("active", module.settings.mode === mode.value);
    btn.addEventListener("click", () => {
      module.settings.mode = mode.value;

      updateOutput();

      [...group.children].forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");
    });

    group.appendChild(btn);
  });

  container.appendChild(group);
}

export function renderJsonModule(module, container, updateOutput) {
  const indentGroup = document.createElement("div");
  indentGroup.className = "segmented";

  const indentOptions = [
    { value: 2, label: "2 spaces" },
    { value: 4, label: "4 spaces" },
    { value: 8, label: "8 spaces" },
  ];

  indentOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.classList.toggle("active", module.settings.indent === opt.value);

    btn.addEventListener("click", () => {
      module.settings.indent = opt.value;
      updateOutput();

      [...indentGroup.children].forEach((b) =>
        b.classList.remove("active")
      );
      btn.classList.add("active");
    });

    indentGroup.appendChild(btn);
  });

  const sortGroup = document.createElement("div");
  sortGroup.className = "segmented";

  const sortOptions = [
    { value: false, label: "Original order" },
    { value: true, label: "Sort keys" },
  ];

  sortOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.classList.toggle(
      "active",
      module.settings.sortKeys === opt.value
    );

    btn.addEventListener("click", () => {
      module.settings.sortKeys = opt.value;
      updateOutput();

      [...sortGroup.children].forEach((b) =>
        b.classList.remove("active")
      );
      btn.classList.add("active");
    });

    sortGroup.appendChild(btn);
  });

  container.appendChild(indentGroup);
  container.appendChild(sortGroup);
}
