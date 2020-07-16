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

interface QrCode {
  type: string;
  payload: {
    uri: string;
    key: string;
    permittedActions: string[];
    redirect: string;
  };
}

export const encodeQrCode = (payload: QrCode): string =>
  `https://action.openattestation.com/?q=${encodeURIComponent(JSON.stringify(payload))}`;
