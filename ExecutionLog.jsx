// ============================================
// ExecutionLog.jsx
// Shows a scrollable list of all executed steps
// ============================================

import React, { useEffect, useRef } from 'react';
import './ExecutionLog.css';

/**
 * ExecutionLog — renders each step as a log entry.
 * Auto-scrolls to the latest entry.
 *
 * @param {Array}  steps        - Array of step objects from usePDA
 * @param {number} activeIndex  - Currently highlighted step index
 */
function ExecutionLog({ steps = [], activeIndex = 0 }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest step
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [steps.length]);

  if (steps.length === 0) {
    return (
      <div className="log-container">
        <div className="log-header">
          <span className="log-label">EXECUTION LOG</span>
        </div>
        <div className="log-empty">
          <span>No steps yet. Run a simulation to see the trace.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="log-container">
      <div className="log-header">
        <span className="log-label">EXECUTION LOG</span>
        <span className="log-count">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="log-entries">
        {steps.map((step, i) => {
          const isActive = i === activeIndex;
          const isFinal = step.status === 'accepted' || step.status === 'rejected';

          return (
            <div
              key={i}
              className={`log-entry
                log-entry-${step.status}
                ${isActive ? 'log-entry-active' : ''}
                ${isFinal ? 'log-entry-final' : ''}
              `}
            >
              {/* Step number */}
              <span className="log-step-num">{String(i).padStart(2, '0')}</span>

              {/* Action badge */}
              <span className={`log-action-badge log-action-${step.action.toLowerCase().replace('_', '-')}`}>
                {step.action}
              </span>

              {/* Description */}
              <span className="log-description">{step.description}</span>

              {/* Stack snapshot */}
              <span className="log-stack-snap">
                [{step.stack.join(', ') || 'ε'}]
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ExecutionLog;
