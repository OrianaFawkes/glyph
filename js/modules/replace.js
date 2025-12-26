export function createReplaceModule() {
  return {
    id: crypto.randomUUID(),
    type: "replace",
    name: "Replace Module",
    settings: {
      find: "",
      replace: "",
      useRegex: false,
    },

    transform(input, settings) {
      const { find, replace, useRegex } = settings;

      if (!find) return input;

      if (!useRegex) return input.split(find).join(replace);

      let regex;

      try {
        regex = new RegExp(find, "g");
      } catch (e) {
        return input;
      }

      return input.replace(regex, replace);
    },
  };
}
