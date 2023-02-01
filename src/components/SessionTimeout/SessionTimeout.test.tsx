import { render, screen, fireEvent, act } from "@testing-library/react";
import { Router, MemoryRouter } from "react-router-dom";
import { createMocks } from "react-idle-timer";
import { history } from "./../../history";
import { SessionTimeout } from "./SessionTimeout";

history.push = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  createMocks();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe("SessionTimout", () => {
  it("should prompt session timeout when user is idle", () => {
    render(
      <Router history={history}>
        <SessionTimeout timeout={3000} promptBeforeIdle={1000} logout={() => {}} />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Session Timeout")).toBeInTheDocument();
  });

  it("should dismiss prompt when user click stay logged in", () => {
    render(
      <Router history={history}>
        <SessionTimeout timeout={3000} promptBeforeIdle={1000} logout={() => {}} />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.click(screen.getByText("Stay Logged In"));
    expect(screen.queryByText("Session Timeout")).not.toBeInTheDocument();
  });

  it("should push to `logout` when user click logout", () => {
    render(
      <MemoryRouter>
        <SessionTimeout timeout={3000} promptBeforeIdle={1000} logout={() => {}} />
      </MemoryRouter>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.click(screen.getByText("Logout"));
    expect(history.push).toHaveBeenCalledWith("/logout");
  });

  it("should push to `logout` when no action from user", async () => {
    render(
      <Router history={history}>
        <SessionTimeout timeout={3000} promptBeforeIdle={1000} logout={() => {}} />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(history.push).toHaveBeenCalledWith("/logout");
  });
});
