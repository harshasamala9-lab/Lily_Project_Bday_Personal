"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Stage =
  | "intro"
  | "candle"
  | "gift"
  | "reveal"
  | "experienced";

interface ExperienceValue {
  /** Has the gift been opened at least once this session/visit? */
  opened: boolean;
  /** Which beat of the opening we are on. */
  stage: Stage;
  setStage: (stage: Stage) => void;
  /** Skip straight to the main experience (used by the "skip" control). */
  openExperience: () => void;
  /** Balloons floating over the whole site once revealed. */
  showBalloons: boolean;
  /** Fires the site-wide celebration burst (used by the finale). */
  celebrateNonce: number;
  celebrate: () => void;
  /** Registers an easter-egg payload so any surface can reveal it. */
  foundEgg: (title: string, payload: string) => void;
  /** Currently surfaced easter egg, if any. */
  egg: DiscoveredEgg | null;
  dismissEgg: () => void;
}

export interface DiscoveredEgg {
  title: string;
  payload: string;
  nonce: number;
}

const ExperienceContext = createContext<ExperienceValue | null>(null);

const STORAGE_KEY = "lily-put-universe:opened";

/**
 * Set NEXT_PUBLIC_SKIP_OPENING=1 while editing to land straight in the main
 * experience. Never set it in the environment Lily opens the site from.
 */
const SKIP_OPENING = process.env.NEXT_PUBLIC_SKIP_OPENING === "1";

const OPENED_EVENT = "lily-put-universe:opened-changed";

function getOpenedSnapshot() {
  if (typeof window === "undefined") return false;
  return SKIP_OPENING || window.sessionStorage.getItem(STORAGE_KEY) === "1";
}

function subscribeToOpened(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(OPENED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(OPENED_EVENT, callback);
  };
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const opened = useSyncExternalStore(
    subscribeToOpened,
    getOpenedSnapshot,
    () => false,
  );
  const [stage, setStage] = useState<Stage>("intro");
  const [celebrateNonce, setCelebrateNonce] = useState(0);
  const [egg, setEgg] = useState<DiscoveredEgg | null>(null);

  const openExperience = useCallback(() => {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new Event(OPENED_EVENT));
  }, []);

  const celebrate = useCallback(() => {
    setCelebrateNonce((n) => n + 1);
  }, []);

  const foundEgg = useCallback((title: string, payload: string) => {
    setEgg((prev) => ({
      title,
      payload,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  const value = useMemo<ExperienceValue>(
    () => ({
      opened,
      stage: opened ? "experienced" : stage,
      setStage,
      openExperience,
      showBalloons: opened,
      celebrateNonce,
      celebrate,
      foundEgg,
      egg,
      dismissEgg: () => setEgg(null),
    }),
    [
      opened,
      stage,
      openExperience,
      celebrateNonce,
      celebrate,
      foundEgg,
      egg,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used inside <ExperienceProvider>");
  }
  return ctx;
}

/** Convenience hook for content pages that should not play the opening. */
export function useHasOpened(): boolean {
  return useExperience().opened;
}
