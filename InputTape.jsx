// ============================================
// InputTape.jsx
// Visualizes the input string as a tape,
// highlighting the currently active character.
// ============================================

import React from 'react';
import './InputTape.css';

/**
 * InputTape — renders each character of the input string as a cell.
 * The cell at `activeIndex` is highlighted.
 *
 * @param {string} input       - The full input string
 * @param {number} activeIndex - Index of currently processed character (-1 = none, input.length = end)
 */
function InputTape({ input = '', activeIndex = -1 }) {
  if (!input) {
    return (
      <div className="tape-container">
        <div className="tape-header">
          <span className="tape-label">INPUT TAPE</span>
        </div>
        <div className="tape-empty">
          <span>ε (empty string)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tape-container">
      <div className="tape-header">
        <span className="tape-label">INPUT TAPE</span>
        <span className="tape-info">{input.length} symbol{input.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tape cells */}
      <div className="tape-scroll">
        <div className="tape-cells">
          {/* Read-head position indicator */}
          {activeIndex >= 0 && activeIndex < input.length && (
            <div
              className="read-head"
              style={{ left: `calc(${activeIndex} * 52px + 4px)` }}
            >
              <span className="read-head-arrow">▼</span>
            </div>
          )}

          {input.split('').map((char, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            const isNext = activeIndex >= 0 && i === activeIndex + 1;

            return (
              <div
                key={i}
                className={`tape-cell
                  ${isActive ? 'tape-cell-active' : ''}
                  ${isPast ? 'tape-cell-past' : ''}
                  ${isNext ? 'tape-cell-next' : ''}
                `}
              >
                <span className="tape-char">{char}</span>
                <span className="tape-index">{i}</span>
              </div>
            );
          })}

          {/* End-of-input marker */}
          <div className={`tape-cell tape-cell-end ${activeIndex >= input.length ? 'tape-cell-active-end' : ''}`}>
            <span className="tape-char end-marker">⊣</span>
            <span className="tape-index">end</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="tape-legend">
        <span className="legend-item legend-active">■ current</span>
        <span className="legend-item legend-past">■ processed</span>
        <span className="legend-item legend-next">■ next</span>
      </div>
    </div>
  );
}

export default InputTape;
