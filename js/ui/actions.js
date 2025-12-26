import { createEmptyModule } from "../modules/empty.js";
import { createCaseModule } from "../modules/case.js";
import { createReplaceModule } from "../modules/replace.js";
import { createEncodeModule } from "../modules/encode.js";

export function replaceEmptyModule(
  oldModule,
  oldEl,
  newType,
  pipeline,
  pipelineEl,
  renderModule,
  updateOutput
) {
  const index = pipeline.indexOf(oldModule);

  if (index === -1) return;

  let newModule;

  switch (newType) {
    case "case":
      newModule = createCaseModule();
      break;

    case "replace":
      newModule = createReplaceModule();
      break;

    case "encode":
      newModule = createEncodeModule();
      break;

    default:
      return;
  }

  pipeline[index] = newModule;

  const newEl = renderModule(newModule);
  pipelineEl.replaceChild(newEl, oldEl);

  updateOutput();
}

export function removeModule(
  module,
  el,
  pipeline,
  pipelineEl,
  updateAddModuleState,
  updateOutput
) {
  const index = pipeline.indexOf(module);
  if (index === -1) return;

  pipeline.splice(index, 1);
  pipelineEl.removeChild(el);

  updateAddModuleState();
  updateOutput();
}

export function clearModule(
  oldModule,
  oldEl,
  pipeline,
  pipelineEl,
  renderModule,
  updateOutput
) {
  const index = pipeline.indexOf(oldModule);
  if (index === -1) return;

  const emptyModule = createEmptyModule();
  pipeline[index] = emptyModule;

  const newEl = renderModule(emptyModule);
  pipelineEl.replaceChild(newEl, oldEl);

  updateOutput();
}
