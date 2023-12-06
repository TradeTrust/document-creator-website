import { Button } from "@tradetrust-tt/tradetrust-ui-components";
import React, { FunctionComponent, useState, useCallback, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { history } from "./../../history";

type states = "active" | "idle" | "prompted";

interface SessionTimeoutDialogProps {
  onLogout: () => void;
  onStayLoggedIn: () => void;
  remaining: number;
}

const SessionTimeoutDialog: FunctionComponent<SessionTimeoutDialogProps> = ({
  onLogout,
  onStayLoggedIn,
  remaining,
}) => {
  return (
    <div className="max-w-sm p-8 font-normal rounded-xl bg-white shadow-xl z-10 text-center">
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" className="max-w-[56px]">
        <path
          d="M25.371 9.5V3.854A23.333 23.333 0 1 1 6.061 20.39"
          stroke="#FF8200"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 26.5a1.5 1.5 0 0 0 0 3v-3zm4.5 0H46v3H50.5v-3zM10.5 29.5a1.5 1.5 0 0 0 0-3v3zm-4.5 0H10.5v-3H6v3zM29.75 45a1.5 1.5 0 0 0-3 0h3zm0 4.5V45h-3V49.5h3z"
          fill="#FF8200"
        />
        <path d="M12.5 12 28 27.5" stroke="#FF8200" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="my-4">Session Timeout</h3>
      <p className="my-4 leading-tight">
        For security reasons, your session will expire in {remaining} seconds. Do you want to extend the session?
      </p>
      <Button className="bg-white text-cerulean-500 hover:bg-cloud-100 mx-2" onClick={onLogout}>
        Logout
      </Button>
      <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800 mx-2" onClick={onStayLoggedIn}>
        Stay Logged In
      </Button>
    </div>
  );
};

interface SessionTimeoutProps {
  timeout?: number;
  promptBeforeIdle?: number;
  logout: () => void;
}

export const SessionTimeout: FunctionComponent<SessionTimeoutProps> = ({
  timeout = 900000,
  promptBeforeIdle = 60000,
  logout,
}) => {
  const [state, setState] = useState<states>("active");
  const [remaining, setRemaining] = useState<number>(0);

  const onIdle = () => {
    setState("idle");
  };

  const onActive = () => {
    setState("active");
  };

  const onPrompt = () => {
    setState("prompted");
  };

  const { reset, getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
  });

  const onStayLoggedIn = () => {
    setState("active");
    reset();
  };

  const onLogout = useCallback(() => {
    history.push("/logout");
    logout();
  }, [logout]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime]);

  useEffect(() => {
    if (state === "idle") {
      onLogout();
    }
  }, [onLogout, state]);

  return (
    <>
      {state === "prompted" && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40" />
          <SessionTimeoutDialog onLogout={onLogout} onStayLoggedIn={onStayLoggedIn} remaining={remaining} />
        </div>
      )}
    </>
  );
};
