"use client";

import { useCallback, useRef } from "react";

/**
 * Tiny WebAudio design kit.
 *
 * All sound is synthesised — no audio files, no network cost — and every cue is
 * only ever triggered from a user gesture, so nothing autoplays.
 */

type Cue = "sparkle" | "chime" | "unlock" | "pop" | "whoosh" | "page";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  function ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;

    if (!ctxRef.current) {
      try {
        ctxRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }

  const play = useCallback((cue: Cue, volume = 0.16) => {
    const ctx = ensure();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    const tone = (
      freq: number,
      start: number,
      duration: number,
      type: OscillatorType = "sine",
      peak = 1,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(peak, now + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };

    switch (cue) {
      case "sparkle":
        tone(1318.5, 0, 0.18, "sine", 0.7);
        tone(1975.5, 0.05, 0.22, "sine", 0.4);
        break;
      case "chime":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          tone(f, i * 0.09, 0.7, "sine", 0.6),
        );
        break;
      case "unlock":
        tone(392, 0, 0.16, "square", 0.35);
        tone(880, 0.09, 0.3, "sine", 0.7);
        tone(1174.7, 0.16, 0.42, "sine", 0.5);
        break;
      case "pop":
        tone(660, 0, 0.09, "triangle", 0.6);
        tone(990, 0.04, 0.12, "triangle", 0.35);
        break;
      case "whoosh": {
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i += 1) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 2;
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(3600, now + 0.35);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start(now);
        break;
      }
      case "page":
        tone(523.25, 0, 0.12, "sine", 0.25);
        tone(783.99, 0.06, 0.16, "sine", 0.18);
        break;
    }
  }, []);

  return { play };
}
