// ============================================
// Controls.jsx
// Buttons: Simulate, Step Mode, Next Step, Reset
// ============================================

import React from 'react';
import './Controls.css';

/**
 * Controls — Action buttons for the simulator.
 *
 * @param {function} onSimulate    - Run full simulation
 * @param {function} onStepMode    - Start step-by-step mode
 * @param {function} onNextStep    - Advance one step
 * @param {function} onReset       - Reset everything
 * @param {string}   mode          - 'idle' | 'full' | 'step'
 * @param {boolean}  hasMoreSteps  - Whether step mode can advance
 * @param {number}   currentStep   - Current step index
 * @param {number}   totalSteps    - Total steps in trace
 */
function Controls({
  onSimulate,
  onStepMode,
  onNextStep,
  onReset,
  mode,
  hasMoreSteps,
  currentStepIndex,
  totalSteps,
}) {
  const isIdle = mode === 'idle';
  const isStep = mode === 'step';
  const isFull = mode === 'full';

  return (
    <div className="controls-wrapper">
      <div className="controls-row">
        {/* Simulate (full run) */}
        <button
          className="ctrl-btn btn-simulate"
          onClick={onSimulate}
          disabled={isStep && hasMoreSteps}
          title="Run full simulation at once"
        >
          <span className="btn-icon">▶▶</span>
          <span className="btn-label">Simulate</span>
        </button>

        {/* Step Mode */}
        <button
          className="ctrl-btn btn-step-mode"
          onClick={onStepMode}
          disabled={isStep && hasMoreSteps}
          title="Start step-by-step mode"
        >
          <span className="btn-icon">▶</span>
          <span className="btn-label">Step Mode</span>
        </button>

        {/* Next Step — only visible in step mode */}
        {isStep && (
          <button
            className={`ctrl-btn btn-next ${!hasMoreSteps ? 'btn-done' : ''}`}
            onClick={onNextStep}
            disabled={!hasMoreSteps}
            title="Process next symbol"
          >
            <span className="btn-icon">{hasMoreSteps ? '→' : '✓'}</span>
            <span className="btn-label">{hasMoreSteps ? 'Next Step' : 'Done'}</span>
          </button>
        )}

        {/* Reset */}
        <button
          className="ctrl-btn btn-reset"
          onClick={onReset}
          title="Reset the simulator"
        >
          <span className="btn-icon">↺</span>
          <span className="btn-label">Reset</span>
        </button>
      </div>

      {/* Step progress indicator */}
      {isStep && totalSteps > 0 && (
        <div className="step-progress">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className="progress-label">
            Step {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
      )}
    </div>
  );
}

export default Controls;
