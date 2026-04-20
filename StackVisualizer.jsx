// ============================================
// StackVisualizer.jsx
// Renders the stack contents visually.
// Top of stack is at the TOP of the display.
// ============================================

import React from 'react';
import './StackVisualizer.css';

/**
 * StackVisualizer — shows the current stack state.
 * @param {string[]} stack  - Array of items (bottom → top), e.g. ['(', '(']
 * @param {string}   action - Latest action string for animation hint
 */
function StackVisualizer({ stack = [], action = null }) {
  // Reverse so top of stack appears at top of display
  const displayStack = [...stack].reverse();

  const isJustPushed = action === 'PUSH';
  const isJustPopped = action === 'POP' || action === 'REJECT_EMPTY';

  return (
    <div className="stack-container">
      {/* Header */}
      <div className="stack-header">
        <span className="stack-label">STACK</span>
        <span className="stack-count">{stack.length} item{stack.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Stack body */}
      <div className="stack-body">
        {/* Top indicator */}
        <div className={`stack-top-indicator ${isJustPushed ? 'pushed' : ''} ${isJustPopped ? 'popped' : ''}`}>
          <span className="arrow-label">TOP ▼</span>
        </div>

        {/* Stack cells */}
        <div className="stack-cells">
          {displayStack.length === 0 ? (
            <div className="stack-empty">
              <span className="empty-label">∅ EMPTY</span>
            </div>
          ) : (
            displayStack.map((item, i) => (
              <div
                key={i}
                className={`stack-cell ${i === 0 ? 'stack-top' : ''} ${i === 0 && isJustPushed ? 'animate-push' : ''}`}
              >
                <span className="cell-item">{item}</span>
                {i === 0 && (
                  <span className="cell-tag">← top</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom indicator */}
        <div className="stack-bottom-indicator">
          <span className="bottom-label">BOTTOM ═══</span>
        </div>
      </div>

      {/* Action badge */}
      {action && action !== 'START' && (
        <div className={`action-badge action-${action.toLowerCase().replace('_', '-')}`}>
          {action === 'PUSH' && '⬆ PUSH  ('}
          {action === 'POP' && '⬇ POP  ('}
          {action === 'ACCEPT' && '✓ ACCEPT'}
          {action === 'REJECT_EMPTY' && '✗ REJECT — empty stack'}
          {action === 'REJECT_REMAINING' && '✗ REJECT — unmatched ('}
        </div>
      )}
      {action === 'START' && (
        <div className="action-badge action-start">◈ INITIALIZED</div>
      )}
    </div>
  );
}

export default StackVisualizer;
