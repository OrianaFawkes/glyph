export function createEmptyModule() {
  return {
    id: crypto.randomUUID(),
    type: null,
    name: "Empty Module",
    settings: {},

    transform(input) {
      return input;
    },
  };
}
