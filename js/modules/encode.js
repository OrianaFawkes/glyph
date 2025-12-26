export function createEncodeModule() {
  return {
    id: crypto.randomUUID(),
    type: "encode",
    name: "Encode / Decode Module",
    settings: {
      mode: "base64-encode",
    },

    transform(input, settings) {
      const { mode } = settings;

      if (!input) return "";

      try {
        switch (mode) {
          case "base64-encode":
            return base64Encode(input);

          case "base64-decode":
            return base64Decode(input);

          case "url-encode":
            return encodeURIComponent(input);

          case "url-decode":
            return decodeURIComponent(input);

          default:
            return input;
        }
      } catch (e) {
        console.log(e);
        return input;
      }
    },
  };
}

function base64Encode(text) {
  return btoa(
    new TextEncoder()
      .encode(text)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

function base64Decode(base64) {
  try {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.log(e);
    return base64;
  }
}
