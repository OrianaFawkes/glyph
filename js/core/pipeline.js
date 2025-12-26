export function runPipeline(inputText, modules) {
  let currentText = inputText;

  for (const module of modules) {
    try {
      const output = module.transform(currentText, module.settings);
      if (typeof output === "string") currentText = output;
    } catch (e) {
      console.log(e);
    }
  }

  return currentText;
}
