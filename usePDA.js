// ============================================
// usePDA.js — Core PDA Logic Hook
// Pushdown Automaton for Balanced Parentheses
// ============================================

import { useState, useCallback } from 'react';

/**
 * Validates that the input string contains only '(' and ')'.
 * Returns an error message string or null if valid.
 */
function validateInput(input) {
  if (typeof input !== 'string') return 'Input must be a string.';
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== '(' && input[i] !== ')') {
      return `Invalid character "${input[i]}" at position ${i + 1}. Only '(' and ')' are allowed.`;
    }
  }
  return null;
}

/**
 * Builds the complete step-by-step trace for the PDA simulation.
 * Each step captures: index, character, action, stack state, and status.
 */
function buildTrace(input) {
  const steps = [];
  const stack = [];

  // Initial state (before processing any character)
  steps.push({
    index: -1,
    char: null,
    action: 'START',
    description: 'PDA initialized. Stack is empty. Ready to process input.',
    stack: [],
    status: 'running',
  });

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '(') {
      // Push '(' onto the stack
      stack.push('(');
      steps.push({
        index: i,
        char,
        action: 'PUSH',
        description: `Read '(' at index ${i} → Push '(' onto stack.`,
        stack: [...stack],
        status: 'running',
      });
    } else if (char === ')') {
      if (stack.length === 0) {
        // Reject: tried to pop from empty stack
        steps.push({
          index: i,
          char,
          action: 'REJECT_EMPTY',
          description: `Read ')' at index ${i} → Stack is EMPTY! Cannot pop. REJECTED.`,
          stack: [...stack],
          status: 'rejected',
        });
        return { steps, accepted: false };
      } else {
        // Pop from stack
        stack.pop();
        steps.push({
          index: i,
          char,
          action: 'POP',
          description: `Read ')' at index ${i} → Pop '(' from stack.`,
          stack: [...stack],
          status: 'running',
        });
      }
    }
  }

  // End of input — check if stack is empty
  if (stack.length === 0) {
    steps.push({
      index: input.length,
      char: null,
      action: 'ACCEPT',
      description: 'End of input. Stack is EMPTY → String ACCEPTED! ✓',
      stack: [],
      status: 'accepted',
    });
    return { steps, accepted: true };
  } else {
    steps.push({
      index: input.length,
      char: null,
      action: 'REJECT_REMAINING',
      description: `End of input. Stack has ${stack.length} unmatched '(' → String REJECTED! ✗`,
      stack: [...stack],
      status: 'rejected',
    });
    return { steps, accepted: false };
  }
}

/**
 * usePDA — Main hook that manages simulation state.
 */
export function usePDA() {
  const [inputString, setInputString] = useState('');
  const [inputError, setInputError] = useState(null);

  // Full trace of steps (computed once at simulate time)
  const [trace, setTrace] = useState([]);

  // Current step index in step-by-step mode
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Mode: 'idle' | 'full' | 'step'
  const [mode, setMode] = useState('idle');

  // Final result
  const [result, setResult] = useState(null); // null | 'accepted' | 'rejected'

  /** Resets everything to initial state */
  const reset = useCallback(() => {
    setTrace([]);
    setCurrentStepIndex(0);
    setMode('idle');
    setResult(null);
    setInputError(null);
  }, []);

  /** Run full simulation (show all steps at once with final result) */
  const simulate = useCallback(() => {
    // Validate
    const err = validateInput(inputString);
    if (err) {
      setInputError(err);
      return;
    }
    setInputError(null);

    const { steps, accepted } = buildTrace(inputString);
    setTrace(steps);
    setCurrentStepIndex(steps.length - 1); // show all steps
    setResult(accepted ? 'accepted' : 'rejected');
    setMode('full');
  }, [inputString]);

  /** Start step-by-step mode */
  const startStepMode = useCallback(() => {
    // Validate
    const err = validateInput(inputString);
    if (err) {
      setInputError(err);
      return;
    }
    setInputError(null);

    const { steps, accepted } = buildTrace(inputString);
    setTrace(steps);
    setCurrentStepIndex(0); // show only first step
    setResult(null);        // result shown only when finished
    setMode('step');
    // Store the final accepted value in trace for reference
    setTrace(steps.map((s, i) => ({ ...s, _accepted: accepted })));
  }, [inputString]);

  /** Advance one step in step-by-step mode */
  const nextStep = useCallback(() => {
    if (mode !== 'step') return;
    setCurrentStepIndex(prev => {
      const next = prev + 1;
      if (next >= trace.length) return prev; // already at end

      // If next step is the last one, reveal result
      const nextStep = trace[next];
      if (nextStep.status === 'accepted' || nextStep.status === 'rejected') {
        setResult(nextStep.status);
      }
      return next;
    });
  }, [mode, trace]);

  /** The steps visible to the UI */
  const visibleSteps = trace.slice(0, currentStepIndex + 1);

  /** The current (latest visible) step */
  const currentStep = visibleSteps[visibleSteps.length - 1] || null;

  /** Whether there are more steps to advance */
  const hasMoreSteps = mode === 'step' && currentStepIndex < trace.length - 1;

  return {
    // State
    inputString,
    inputError,
    mode,
    result,
    currentStep,
    visibleSteps,
    hasMoreSteps,
    currentStepIndex,
    totalSteps: trace.length,

    // Actions
    setInputString,
    simulate,
    startStepMode,
    nextStep,
    reset,
  };
}
