export function createCaseModule() {
  return {
    id: crypto.randomUUID(),
    type: "case",
    name: "Case Module",
    settings: {
      mode: "upper",
    },

    transform(input, settings) {
      const { mode } = settings;

      if (!input) return "";

      switch (mode) {
        case "upper":
          return input.toUpperCase();

        case "lower":
          return input.toLowerCase();

        case "title":
          return input.replace(
            /\w\S*/g,
            (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
          );

        default:
          return input;
      }
    },
  };
}
