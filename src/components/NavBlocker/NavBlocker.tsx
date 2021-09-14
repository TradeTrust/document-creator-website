import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

interface IProps {
  when: boolean;
  message: string;
}

export default function NavBlocker({ when, message }: IProps) {
  console.log("HELLO");
  const history = useHistory();
  const lastPathName = useRef(history.location.pathname);

  useEffect(() => {
    const unlisten = history.listen(({ pathname }) => (lastPathName.current = pathname));

    const unblock = history.block(({ pathname }) => {
      if (lastPathName.current !== pathname && when) {
        return message;
      }
    });

    return () => {
      unlisten();
      unblock();
    };
  }, [history, when, message]);

  return null;
}
