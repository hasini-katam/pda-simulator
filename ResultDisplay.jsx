// ============================================
// ResultDisplay.jsx
// Shows ACCEPTED / REJECTED verdict
// ============================================

import React from 'react';
import './ResultDisplay.css';

/**
 * ResultDisplay — big verdict banner.
 * @param {string|null} result - 'accepted' | 'rejected' | null
 */
function ResultDisplay({ result }) {
  if (!result) return null;

  const isAccepted = result === 'accepted';

  return (
    <div className={`result-banner result-${result}`}>
      <div className="result-icon">{isAccepted ? '✓' : '✗'}</div>
      <div className="result-text">
        <span className="result-verdict">{isAccepted ? 'ACCEPTED' : 'REJECTED'}</span>
        <span className="result-sub">
          {isAccepted
            ? 'String has balanced parentheses'
            : 'String does not have balanced parentheses'}
        </span>
      </div>
    </div>
  );
}

export default ResultDisplay;
