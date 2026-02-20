"use client";

import { create } from "zustand";
import type {
  GamePhase,
  GameMode,
  Identity,
  Question,
  Answer,
  GameResult,
} from "@/lib/types";

interface GameState {
  phase: GamePhase;
  mode: GameMode;
  identity: Identity | null;
  questions: Question[];
  currentRound: number;
  answers: Answer[];
  result: GameResult | null;

  setPhase: (phase: GamePhase) => void;
  setMode: (mode: GameMode) => void;
  setIdentity: (identity: Identity) => void;
  setQuestions: (questions: Question[]) => void;
  submitAnswer: (answer: Answer) => void;
  nextRound: () => void;
  setResult: (result: GameResult) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "landing",
  mode: "daily",
  identity: null,
  questions: [],
  currentRound: 0,
  answers: [],
  result: null,

  setPhase: (phase) => set({ phase }),
  setMode: (mode) => set({ mode }),
  setIdentity: (identity) => set({ identity }),
  setQuestions: (questions) => set({ questions }),
  submitAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  nextRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
  setResult: (result) => set({ result }),
  reset: () =>
    set({
      phase: "landing",
      mode: "daily",
      identity: null,
      questions: [],
      currentRound: 0,
      answers: [],
      result: null,
    }),
}));
