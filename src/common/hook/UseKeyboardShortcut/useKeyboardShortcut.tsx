import { useEffect, useCallback, useReducer } from "react";

// Can include blacklisted elements like "INPUT", "TEXTAREA"
const blacklistedTargets: string[] = [];

interface Keymap {
  [key: string]: boolean;
}

type Action = { type: "set-key-down"; key: string } | { type: "set-key-up"; key: string };

export const useKeyboardShortcut = (shortcutKeys: string[], callback: () => void): void => {
  const initalKeyMapping = shortcutKeys.reduce<Keymap>((currentKeys, key) => {
    currentKeys[key.toLowerCase()] = false;
    return currentKeys;
  }, {});

  const keysReducer = (state: Keymap, action: Action): Keymap => {
    switch (action.type) {
      case "set-key-down":
        return { ...state, [action.key]: true };
      case "set-key-up":
        return { ...state, [action.key]: false };
      default:
        return state;
    }
  };

  const [keys, setKeys] = useReducer(keysReducer, initalKeyMapping);

  const keydownListener = useCallback(
    (keydownEvent) => {
      const { key, target, repeat } = keydownEvent;
      const loweredKey = key.toLowerCase();

      if (repeat) return;
      if (blacklistedTargets.includes(target.tagName)) return;
      if (keys[loweredKey] === undefined) return;

      if (keys[loweredKey] === false) setKeys({ type: "set-key-down", key: loweredKey });
    },
    [keys]
  );

  const keyupListener = useCallback(
    (keyupEvent) => {
      const { key, target } = keyupEvent;
      const loweredKey = key.toLowerCase();

      if (blacklistedTargets.includes(target.tagName)) return;
      if (keys[loweredKey] === undefined) return;
      if (keys[loweredKey] === true) setKeys({ type: "set-key-up", key: loweredKey });
    },
    [keys]
  );

  useEffect(() => {
    if (!Object.values(keys).filter((value) => !value).length) callback();
  }, [callback, keys]);

  // Add listeners to watch for keypress on page
  useEffect(() => {
    window.addEventListener("keydown", keydownListener, true);
    return () => window.removeEventListener("keydown", keydownListener, true);
  }, [keydownListener]);

  useEffect(() => {
    window.addEventListener("keyup", keyupListener, true);
    return () => window.removeEventListener("keyup", keyupListener, true);
  }, [keyupListener]);
};
