export function readFileAsJson<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    if (reader.error) {
      reject(reader.error);
    }
    reader.onload = () => {
      try {
        const json: T = JSON.parse(reader.result as string);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(file);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAcceptedFormatValue = (schema: any): string => {
  if (schema.accept) return schema.accept;

  let accept = "";
  for (const subSchema of Object.values(schema)) {
    if (typeof subSchema === "object") {
      const value = getAcceptedFormatValue(subSchema);
      if (value) accept = value;
    }
  }
  return accept;
};

export const showInKB = (x: number): string => {
  const byte = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return byte.substring(0, byte.length - 4);
};
