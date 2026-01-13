export function createJsonModule() {
  return {
    id: crypto.randomUUID(),
    type: "json",
    name: "JSON Module",
    settings: {
      indent: 2,
      sortKeys: false,
    },

    transform(input, settings) {
      const { indent, sortKeys } = settings;

      if (!input || !input.trim()) return "";

      try {
        const parsed = JSON.parse(input);

        const normalized = sortKeys
          ? sortObjectKeys(parsed)
          : parsed;

        return JSON.stringify(normalized, null, indent);
      } catch (err) {
        return input;
      }
    },
  };
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(value[key]);
        return acc;
      }, {});
  }

  return value;
}
