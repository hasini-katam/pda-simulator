// ============================================
// App.jsx — PDA Simulator (Redesigned UI)
// ============================================

import React, { useState, useCallback, useEffect, useRef } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0a0c10;
    --bg-panel: #10141c;
    --bg-card:  #161b26;
    --bg-hover: #1e2535;
    --border:   #252d3d;
    --border-b: #3a4560;
    --blue:     #4f9cf9;
    --cyan:     #00e5ff;
    --green:    #00e676;
    --red:      #ff3d71;
    --yellow:   #ffd740;
    --tp:       #e8edf5;
    --ts:       #8899bb;
    --tm:       #4a5568;
    --mono:     'JetBrains Mono', monospace;
    --display:  'Syne', sans-serif;
  }

  html, body {
    min-height: 100vh;
    background: var(--bg);
    color: var(--tp);
    font-family: var(--mono);
    font-size: 16px;
  }

  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(79,156,249,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79,156,249,.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  #root { position: relative; z-index: 1; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border-b); border-radius: 4px; }

  .app { max-width: 1000px; margin: 0 auto; padding: 0 28px 80px; }

  .hdr { text-align: center; padding: 56px 0 44px; }
  .hdr-tag { font-size: .85rem; letter-spacing: .22em; color: var(--blue); text-transform: uppercase; margin-bottom: 14px; }
  .hdr-title { font-family: var(--display); font-weight: 800; font-size: clamp(2.8rem, 7vw, 4.6rem); letter-spacing: -.02em; margin-bottom: 12px; line-height: 1.05; }
  .hdr-title span { color: var(--cyan); }
  .hdr-sub { font-size: 1rem; color: var(--ts); letter-spacing: .05em; margin-bottom: 24px; }
  .hdr-def { display: inline-flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; justify-content: center; padding: 14px 24px; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 10px; font-size: .88rem; color: var(--ts); line-height: 1.6; }
  .hdr-def-sep { color: var(--tm); }
  .hdr-line { width: 64px; height: 3px; background: linear-gradient(90deg, var(--blue), var(--cyan)); margin: 22px auto 0; border-radius: 2px; }

  .sec { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 14px; padding: 30px 32px; margin-bottom: 22px; }
  .sec-title { display: flex; align-items: center; gap: 12px; font-family: var(--display); font-weight: 700; font-size: .85rem; letter-spacing: .18em; color: var(--ts); text-transform: uppercase; margin-bottom: 22px; }
  .sec-num { font-family: var(--mono); font-size: .76rem; color: var(--tm); background: var(--bg-hover); padding: 3px 9px; border-radius: 3px; border: 1px solid var(--border); }
  .sec-badge { margin-left: auto; padding: 4px 12px; border-radius: 3px; font-size: .76rem; font-weight: 700; letter-spacing: .08em; }
  .badge-step { background: rgba(0,229,255,.1); border: 1px solid rgba(0,229,255,.4); color: var(--cyan); }
  .badge-full { background: rgba(79,156,249,.1); border: 1px solid rgba(79,156,249,.4); color: var(--blue); }

  .inp-wrap { position: relative; margin-bottom: 14px; }
  .pda-inp { width: 100%; padding: 16px 80px 16px 20px; background: var(--bg); border: 1px solid var(--border-b); border-radius: 6px; color: var(--tp); font-family: var(--mono); font-size: 1.4rem; letter-spacing: .14em; outline: none; transition: border-color .2s, box-shadow .2s; }
  .pda-inp::placeholder { color: var(--tm); font-size: 1rem; letter-spacing: .04em; }
  .pda-inp:focus { border-color: var(--blue); box-shadow: 0 0 22px rgba(79,156,249,.22); }
  .pda-inp.err { border-color: var(--red); box-shadow: 0 0 22px rgba(255,61,113,.22); }
  .inp-cnt { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: .8rem; color: var(--tm); pointer-events: none; }

  .err-msg { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; background: rgba(255,61,113,.08); border: 1px solid rgba(255,61,113,.32); border-radius: 6px; font-size: .9rem; color: var(--red); margin-bottom: 14px; animation: slideDown .2s ease; }
  @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

  .ex-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .ex-lbl { font-size: .85rem; color: var(--tm); }
  .ex-btn { padding: 7px 16px; border-radius: 5px; font-family: var(--mono); font-size: .95rem; cursor: pointer; font-weight: 600; letter-spacing: .05em; transition: all .15s; }
  .ex-b { background: rgba(79,156,249,.1); border: 1px solid rgba(79,156,249,.32); color: var(--blue); }
  .ex-b:hover { background: rgba(79,156,249,.2); border-color: var(--blue); }
  .ex-r { background: rgba(255,61,113,.08); border: 1px solid rgba(255,61,113,.28); color: var(--red); }
  .ex-r:hover { background: rgba(255,61,113,.16); border-color: var(--red); }
  .ex-e { background: rgba(255,215,64,.08); border: 1px solid rgba(255,215,64,.28); color: var(--yellow); }
  .ex-e:hover { background: rgba(255,215,64,.14); border-color: var(--yellow); }

  .ctrl-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }
  .btn { display: flex; align-items: center; gap: 9px; padding: 13px 22px; border-radius: 6px; font-family: var(--mono); font-size: .95rem; font-weight: 600; letter-spacing: .07em; cursor: pointer; transition: all .18s; text-transform: uppercase; border: 1px solid transparent; }
  .btn:disabled { opacity: .35; cursor: not-allowed; }
  .btn:active:not(:disabled) { transform: scale(.97); }
  .btn-sim { background: rgba(79,156,249,.14); border-color: rgba(79,156,249,.45); color: var(--blue); }
  .btn-sim:hover:not(:disabled) { background: rgba(79,156,249,.24); border-color: var(--blue); box-shadow: 0 0 18px rgba(79,156,249,.22); }
  .btn-stp { background: rgba(0,229,255,.1); border-color: rgba(0,229,255,.38); color: var(--cyan); }
  .btn-stp:hover:not(:disabled) { background: rgba(0,229,255,.2); border-color: var(--cyan); }
  .btn-nxt { background: rgba(0,230,118,.1); border-color: rgba(0,230,118,.4); color: var(--green); animation: pulseG 1.6s infinite; }
  .btn-nxt:hover:not(:disabled) { background: rgba(0,230,118,.2); border-color: var(--green); }
  .btn-nxt:disabled { animation: none; }
  @keyframes pulseG { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0)} 50%{box-shadow:0 0 12px 3px rgba(0,230,118,.18)} }
  .btn-rst { background: rgba(255,61,113,.08); border-color: rgba(255,61,113,.32); color: var(--red); }
  .btn-rst:hover { background: rgba(255,61,113,.16); border-color: var(--red); }

  .prog-row { display: flex; align-items: center; gap: 14px; }
  .prog-track { flex: 1; height: 5px; background: var(--bg-hover); border-radius: 3px; overflow: hidden; }
  .prog-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--blue)); border-radius: 3px; transition: width .3s ease; }
  .prog-lbl { font-size: .84rem; color: var(--tm); white-space: nowrap; }

  .viz-grid { display: grid; grid-template-columns: 1fr 240px; gap: 32px; align-items: start; }

  .tape-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .tape-lbl { font-family: var(--display); font-weight: 700; font-size: .92rem; letter-spacing: .14em; color: var(--cyan); text-transform: uppercase; }
  .tape-info { font-size: .84rem; color: var(--tm); }
  .tape-scroll { overflow-x: auto; padding-bottom: 6px; }
  .tape-cells { display: flex; align-items: flex-end; gap: 6px; position: relative; padding-top: 38px; width: max-content; min-width: 100%; }
  .read-head { position: absolute; top: 0; display: flex; justify-content: center; width: 56px; transition: left .3s ease; }
  .rh-arrow { font-size: 1.4rem; color: var(--yellow); animation: bounce .6s ease-in-out infinite alternate; }
  @keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-5px)} }

  .t-cell { width: 56px; min-width: 56px; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 6px 8px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 5px; transition: all .2s; }
  .t-active { background: rgba(255,215,64,.1); border-color: var(--yellow); box-shadow: 0 0 12px rgba(255,215,64,.2); animation: tpulse .4s ease; }
  @keyframes tpulse { 0%{transform:scale(1.1)} 100%{transform:scale(1)} }
  .t-past { background: rgba(79,156,249,.04); border-color: rgba(79,156,249,.18); opacity: .5; }
  .t-next { border-color: rgba(0,229,255,.36); }
  .t-end { background: var(--bg); border-style: dashed; }
  .t-end-active { border-color: var(--green); background: rgba(0,230,118,.06); }
  .t-char { font-family: var(--mono); font-size: 1.3rem; font-weight: 700; color: var(--tp); line-height: 1; }
  .t-active .t-char { color: var(--yellow); }
  .t-past .t-char { color: var(--tm); }
  .t-idx { font-size: .68rem; color: var(--tm); }
  .tape-empty { padding: 20px; text-align: center; color: var(--tm); font-size: .92rem; border: 1px dashed var(--border); border-radius: 6px; }
  .tape-legend { display: flex; gap: 18px; margin-top: 12px; }
  .leg { font-size: .8rem; font-family: var(--mono); display: flex; align-items: center; gap: 5px; }
  .leg-a { color: var(--yellow); } .leg-p { color: rgba(79,156,249,.5); } .leg-n { color: var(--cyan); }

  .stk-hdr { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .stk-lbl { font-family: var(--display); font-weight: 700; font-size: .92rem; letter-spacing: .14em; color: var(--cyan); text-transform: uppercase; }
  .stk-cnt { font-size: .84rem; color: var(--tm); }
  .stk-body { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 10px; min-height: 220px; display: flex; flex-direction: column; gap: 5px; }
  .stk-top-ind { text-align: center; padding: 2px 0 8px; font-size: .78rem; color: var(--tm); letter-spacing: .08em; text-transform: uppercase; }
  .stk-top-ind.pushed { color: var(--green); } .stk-top-ind.popped { color: var(--red); }
  .stk-cells { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .stk-empty { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 90px; font-size: .92rem; color: var(--tm); }
  .stk-cell { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 5px; transition: all .2s; }
  .stk-top-cell { background: rgba(79,156,249,.08); border-color: var(--blue); }
  .pushed-anim { animation: pushIn .35s ease; }
  @keyframes pushIn { 0%{opacity:0;transform:translateY(-10px) scale(.94)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  .stk-item { font-family: var(--mono); font-size: 1.25rem; font-weight: 700; color: var(--yellow); }
  .stk-tag { font-size: .72rem; color: var(--blue); }
  .stk-bot { padding: 8px 0 3px; text-align: center; border-top: 2px solid var(--border-b); margin-top: 5px; font-size: .72rem; color: var(--tm); letter-spacing: .08em; text-transform: uppercase; }
  .act-badge { padding: 10px 14px; border-radius: 5px; font-size: .88rem; font-weight: 600; letter-spacing: .05em; text-align: center; margin-top: 10px; animation: badgePop .25s ease; }
  @keyframes badgePop { 0%{transform:scale(.88);opacity:.5} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  .ab-push   { background: rgba(0,230,118,.1);  border: 1px solid rgba(0,230,118,.38);  color: var(--green); }
  .ab-pop    { background: rgba(255,215,64,.1);  border: 1px solid rgba(255,215,64,.38); color: var(--yellow); }
  .ab-accept { background: rgba(0,230,118,.12);  border: 1px solid rgba(0,230,118,.45);  color: var(--green); }
  .ab-reject { background: rgba(255,61,113,.1);  border: 1px solid rgba(255,61,113,.38); color: var(--red); }
  .ab-start  { background: rgba(79,156,249,.1);  border: 1px solid rgba(79,156,249,.38); color: var(--blue); }

  .result { display: flex; align-items: center; gap: 22px; padding: 26px 30px; border-radius: 12px; border: 1px solid transparent; animation: resReveal .4s ease; }
  @keyframes resReveal { 0%{opacity:0;transform:scale(.95) translateY(10px)} 60%{transform:scale(1.02) translateY(0)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  .res-accepted { background: rgba(0,230,118,.07); border-color: rgba(0,230,118,.42); box-shadow: 0 0 24px rgba(0,230,118,.18); }
  .res-rejected { background: rgba(255,61,113,.07); border-color: rgba(255,61,113,.42); box-shadow: 0 0 24px rgba(255,61,113,.18); }
  .res-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; flex-shrink: 0; }
  .res-accepted .res-icon { background: rgba(0,230,118,.14); color: var(--green); border: 2px solid rgba(0,230,118,.38); animation: spinIn .5s ease; }
  .res-rejected .res-icon { background: rgba(255,61,113,.14); color: var(--red);   border: 2px solid rgba(255,61,113,.38); animation: shakeIn .4s ease; }
  @keyframes spinIn  { from{transform:rotate(-90deg) scale(.5);opacity:0} to{transform:rotate(0) scale(1);opacity:1} }
  @keyframes shakeIn { 0%{transform:translateX(-7px)} 25%{transform:translateX(7px)} 50%{transform:translateX(-5px)} 75%{transform:translateX(5px)} 100%{transform:translateX(0)} }
  .res-verdict { font-family: var(--display); font-weight: 800; font-size: 2rem; letter-spacing: .06em; line-height: 1; }
  .res-accepted .res-verdict { color: var(--green); }
  .res-rejected .res-verdict { color: var(--red); }
  .res-sub { font-size: .92rem; color: var(--ts); margin-top: 6px; }

  .log-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .log-lbl { font-family: var(--display); font-weight: 700; font-size: .92rem; letter-spacing: .14em; color: var(--cyan); text-transform: uppercase; }
  .log-cnt { font-size: .84rem; color: var(--tm); }
  .log-entries { max-height: 340px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-right: 5px; }
  .log-empty { padding: 22px; text-align: center; color: var(--tm); font-size: .92rem; border: 1px dashed var(--border); border-radius: 6px; }
  .log-entry { display: grid; grid-template-columns: 34px auto 1fr auto; align-items: center; gap: 12px; padding: 11px 14px; border: 1px solid var(--border); border-radius: 5px; background: var(--bg-card); font-family: var(--mono); font-size: .86rem; animation: logSlide .2s ease; }
  @keyframes logSlide { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  .log-active   { background: rgba(79,156,249,.07); border-color: rgba(79,156,249,.38); }
  .log-running  { border-left: 3px solid var(--border-b); }
  .log-accepted { border-left: 3px solid var(--green); }
  .log-rejected { border-left: 3px solid var(--red); }
  .log-snum { font-size: .76rem; color: var(--tm); font-weight: 600; }
  .log-act { padding: 3px 9px; border-radius: 3px; font-size: .74rem; font-weight: 700; letter-spacing: .05em; white-space: nowrap; text-transform: uppercase; }
  .la-push   { background: rgba(0,230,118,.14);  color: var(--green); }
  .la-pop    { background: rgba(255,215,64,.14);  color: var(--yellow); }
  .la-accept { background: rgba(0,230,118,.18);   color: var(--green); }
  .la-reject { background: rgba(255,61,113,.14);  color: var(--red); }
  .la-start  { background: rgba(79,156,249,.14);  color: var(--blue); }
  .log-desc { color: var(--ts); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .log-snap { color: var(--tm); font-size: .76rem; white-space: nowrap; padding-left: 8px; }

  .ftr { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 32px 0 10px; font-size: .82rem; color: var(--tm); letter-spacing: .06em; }
  .ftr-sep { color: var(--border-b); }

  @media (max-width: 680px) {
    .viz-grid { grid-template-columns: 1fr; }
    .hdr-def  { display: none; }
    .sec      { padding: 20px 18px; }
    .hdr-title { font-size: 2.5rem; }
  }
`;

function validateInput(input) {
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== '(' && input[i] !== ')') {
      return `Invalid character "${input[i]}" at position ${i + 1}. Only '(' and ')' are allowed.`;
    }
  }
  return null;
}

function buildTrace(input) {
  const steps = [];
  const stack = [];
  steps.push({ index: -1, char: null, action: 'START', description: 'PDA initialized. Stack is empty. Ready to process input.', stack: [], status: 'running' });
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '(') {
      stack.push('(');
      steps.push({ index: i, char, action: 'PUSH', description: `Read '(' at index ${i} → Push '(' onto stack.`, stack: [...stack], status: 'running' });
    } else {
      if (stack.length === 0) {
        steps.push({ index: i, char, action: 'REJECT_EMPTY', description: `Read ')' at index ${i} → Stack is EMPTY! Cannot pop. REJECTED.`, stack: [], status: 'rejected' });
        return { steps, accepted: false };
      }
      stack.pop();
      steps.push({ index: i, char, action: 'POP', description: `Read ')' at index ${i} → Pop '(' from stack.`, stack: [...stack], status: 'running' });
    }
  }
  if (stack.length === 0) {
    steps.push({ index: input.length, char: null, action: 'ACCEPT', description: 'End of input. Stack is EMPTY → String ACCEPTED! ✓', stack: [], status: 'accepted' });
    return { steps, accepted: true };
  } else {
    steps.push({ index: input.length, char: null, action: 'REJECT_REMAINING', description: `End of input. Stack has ${stack.length} unmatched '(' → REJECTED! ✗`, stack: [...stack], status: 'rejected' });
    return { steps, accepted: false };
  }
}

function usePDA() {
  const [inputString, setInputString]           = useState('');
  const [inputError, setInputError]             = useState(null);
  const [trace, setTrace]                       = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mode, setMode]                         = useState('idle');
  const [result, setResult]                     = useState(null);

  const reset = useCallback(() => { setTrace([]); setCurrentStepIndex(0); setMode('idle'); setResult(null); setInputError(null); }, []);

  const simulate = useCallback(() => {
    const err = validateInput(inputString);
    if (err) { setInputError(err); return; }
    setInputError(null);
    const { steps, accepted } = buildTrace(inputString);
    setTrace(steps); setCurrentStepIndex(steps.length - 1);
    setResult(accepted ? 'accepted' : 'rejected'); setMode('full');
  }, [inputString]);

  const startStepMode = useCallback(() => {
    const err = validateInput(inputString);
    if (err) { setInputError(err); return; }
    setInputError(null);
    const { steps } = buildTrace(inputString);
    setTrace(steps); setCurrentStepIndex(0); setResult(null); setMode('step');
  }, [inputString]);

  const nextStep = useCallback(() => {
    if (mode !== 'step') return;
    setCurrentStepIndex(prev => {
      const next = Math.min(prev + 1, trace.length - 1);
      if (next !== prev) { const s = trace[next]; if (s.status === 'accepted' || s.status === 'rejected') setResult(s.status); }
      return next;
    });
  }, [mode, trace]);

  const visibleSteps = trace.slice(0, currentStepIndex + 1);
  const currentStep  = visibleSteps[visibleSteps.length - 1] || null;
  const hasMoreSteps = mode === 'step' && currentStepIndex < trace.length - 1;

  return { inputString, inputError, mode, result, currentStep, visibleSteps, hasMoreSteps, currentStepIndex, totalSteps: trace.length, setInputString, simulate, startStepMode, nextStep, reset };
}

function InputTape({ input, activeIndex }) {
  if (!input) return (
    <div>
      <div className="tape-hdr"><span className="tape-lbl">INPUT TAPE</span></div>
      <div className="tape-empty">ε (empty string — will be ACCEPTED)</div>
    </div>
  );
  return (
    <div>
      <div className="tape-hdr">
        <span className="tape-lbl">INPUT TAPE</span>
        <span className="tape-info">{input.length} symbol{input.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="tape-scroll">
        <div className="tape-cells">
          {activeIndex >= 0 && activeIndex < input.length && (
            <div className="read-head" style={{ left: `calc(${activeIndex} * 62px + 4px)` }}>
              <span className="rh-arrow">▼</span>
            </div>
          )}
          {input.split('').map((ch, i) => {
            let cls = 't-cell';
            if (i === activeIndex) cls += ' t-active';
            else if (i < activeIndex) cls += ' t-past';
            else if (activeIndex >= 0 && i === activeIndex + 1) cls += ' t-next';
            return (
              <div key={i} className={cls}>
                <span className="t-char">{ch}</span>
                <span className="t-idx">{i}</span>
              </div>
            );
          })}
          <div className={`t-cell t-end${activeIndex >= input.length ? ' t-end-active' : ''}`}>
            <span className="t-char" style={{ color: 'var(--tm)', fontSize: '1rem' }}>⊣</span>
            <span className="t-idx">end</span>
          </div>
        </div>
      </div>
      <div className="tape-legend">
        <span className="leg leg-a">■ current</span>
        <span className="leg leg-p">■ processed</span>
        <span className="leg leg-n">■ next</span>
      </div>
    </div>
  );
}

function StackVisualizer({ stack, action }) {
  const display = [...stack].reverse();
  const pushed  = action === 'PUSH';
  const popped  = action === 'POP' || action === 'REJECT_EMPTY';
  const LABELS  = { PUSH: '⬆ PUSH  (', POP: '⬇ POP  (', ACCEPT: '✓ ACCEPT', REJECT_EMPTY: '✗ REJECT — empty stack', REJECT_REMAINING: '✗ REJECT — unmatched (', START: '◈ INITIALIZED' };
  const CLASSES = { PUSH: 'ab-push', POP: 'ab-pop', ACCEPT: 'ab-accept', REJECT_EMPTY: 'ab-reject', REJECT_REMAINING: 'ab-reject', START: 'ab-start' };
  return (
    <div>
      <div className="stk-hdr">
        <span className="stk-lbl">STACK</span>
        <span className="stk-cnt">{stack.length} item{stack.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="stk-body">
        <div className={`stk-top-ind${pushed ? ' pushed' : popped ? ' popped' : ''}`}>TOP ▼</div>
        <div className="stk-cells">
          {display.length === 0
            ? <div className="stk-empty">∅ EMPTY</div>
            : display.map((item, i) => (
              <div key={i} className={`stk-cell${i === 0 ? ' stk-top-cell' : ''}${i === 0 && pushed ? ' pushed-anim' : ''}`}>
                <span className="stk-item">{item}</span>
                {i === 0 && <span className="stk-tag">← top</span>}
              </div>
            ))
          }
        </div>
        <div className="stk-bot">BOTTOM ═══</div>
      </div>
      {action && <div className={`act-badge ${CLASSES[action] || 'ab-start'}`}>{LABELS[action] || action}</div>}
    </div>
  );
}

function Controls({ onSimulate, onStepMode, onNextStep, onReset, mode, hasMoreSteps, currentStepIndex, totalSteps }) {
  const isStep = mode === 'step';
  return (
    <div>
      <div className="ctrl-row">
        <button className="btn btn-sim" onClick={onSimulate} disabled={isStep && hasMoreSteps}><span>▶▶</span><span>Simulate</span></button>
        <button className="btn btn-stp" onClick={onStepMode} disabled={isStep && hasMoreSteps}><span>▶</span><span>Step Mode</span></button>
        {isStep && <button className="btn btn-nxt" onClick={onNextStep} disabled={!hasMoreSteps}><span>{hasMoreSteps ? '→' : '✓'}</span><span>{hasMoreSteps ? 'Next Step' : 'Done'}</span></button>}
        <button className="btn btn-rst" onClick={onReset}><span>↺</span><span>Reset</span></button>
      </div>
      {isStep && totalSteps > 0 && (
        <div className="prog-row">
          <div className="prog-track"><div className="prog-fill" style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }} /></div>
          <span className="prog-lbl">Step {currentStepIndex + 1} / {totalSteps}</span>
        </div>
      )}
    </div>
  );
}

function ExecutionLog({ steps, activeIndex }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [steps.length]);
  const ACT_CLS = { PUSH: 'la-push', POP: 'la-pop', ACCEPT: 'la-accept', REJECT_EMPTY: 'la-reject', REJECT_REMAINING: 'la-reject', START: 'la-start' };
  if (steps.length === 0) return (
    <div>
      <div className="log-hdr"><span className="log-lbl">EXECUTION LOG</span></div>
      <div className="log-empty">No steps yet. Run a simulation to see the trace.</div>
    </div>
  );
  return (
    <div>
      <div className="log-hdr">
        <span className="log-lbl">EXECUTION LOG</span>
        <span className="log-cnt">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="log-entries">
        {steps.map((step, i) => (
          <div key={i} className={`log-entry log-${step.status}${i === activeIndex ? ' log-active' : ''}`}>
            <span className="log-snum">{String(i).padStart(2, '0')}</span>
            <span className={`log-act ${ACT_CLS[step.action] || 'la-start'}`}>{step.action}</span>
            <span className="log-desc">{step.description}</span>
            <span className="log-snap">[{step.stack.join(', ') || 'ε'}]</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function ResultDisplay({ result }) {
  if (!result) return null;
  const ok = result === 'accepted';
  return (
    <div className={`result res-${result}`}>
      <div className="res-icon">{ok ? '✓' : '✗'}</div>
      <div>
        <div className="res-verdict">{ok ? 'ACCEPTED' : 'REJECTED'}</div>
        <div className="res-sub">{ok ? 'String has balanced parentheses' : 'String does not have balanced parentheses'}</div>
      </div>
    </div>
  );
}

const EXAMPLES = [
  { label: '(())',   value: '(())',   cls: 'ex-b' },
  { label: '()()()', value: '()()()', cls: 'ex-b' },
  { label: '((()))', value: '((()))', cls: 'ex-b' },
  { label: '(()',    value: '(()',    cls: 'ex-r' },
  { label: ')(',     value: ')(',    cls: 'ex-r' },
  { label: 'ε',      value: '',      cls: 'ex-e' },
];

export default function App() {
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'pda-styles';
    el.textContent = CSS;
    if (!document.getElementById('pda-styles')) document.head.appendChild(el);
    return () => { document.getElementById('pda-styles')?.remove(); };
  }, []);

  const { inputString, inputError, mode, result, currentStep, visibleSteps, hasMoreSteps, currentStepIndex, totalSteps, setInputString, simulate, startStepMode, nextStep, reset } = usePDA();

  function handleChange(e) { reset(); setInputString(e.target.value); }
  function handleKey(e)    { if (e.key === 'Enter') simulate(); }
  function loadExample(v)  { reset(); setInputString(v); }

  const tapeActive = currentStep ? currentStep.index : -1;
  const stackState = currentStep ? currentStep.stack  : [];
  const lastAction = currentStep ? currentStep.action : null;

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-tag">Automata Theory</div>
        <h1 className="hdr-title">PDA <span>Simulator</span></h1>
        <p className="hdr-sub">Pushdown Automaton — Balanced Parentheses Recognizer</p>
        <div className="hdr-def">
          <span>Q = {'{'} q₀, q_accept {'}'}</span>
          <span className="hdr-def-sep">|</span>
          <span>Σ = {'{'} (, ) {'}'}</span>
          <span className="hdr-def-sep">|</span>
          <span>Γ = {'{'} (, $ {'}'}</span>
          <span className="hdr-def-sep">|</span>
          <span>δ: push on (, pop on )</span>
        </div>
        <div className="hdr-line" />
      </header>

      <section className="sec">
        <div className="sec-title"><span className="sec-num">01</span> INPUT STRING</div>
        <div className="inp-wrap">
          <input className={`pda-inp${inputError ? ' err' : ''}`} value={inputString} onChange={handleChange} onKeyDown={handleKey} placeholder="Enter parentheses, e.g. (())" spellCheck={false} autoComplete="off" />
          <span className="inp-cnt">{inputString.length} chars</span>
        </div>
        {inputError && <div className="err-msg"><span>⚠</span>{inputError}</div>}
        <div className="ex-row">
          <span className="ex-lbl">Try:</span>
          {EXAMPLES.map((ex, i) => <button key={i} className={`ex-btn ${ex.cls}`} onClick={() => loadExample(ex.value)}>{ex.label}</button>)}
        </div>
      </section>

      <section className="sec">
        <div className="sec-title"><span className="sec-num">02</span> CONTROLS</div>
        <Controls onSimulate={simulate} onStepMode={startStepMode} onNextStep={nextStep} onReset={reset} mode={mode} hasMoreSteps={hasMoreSteps} currentStepIndex={currentStepIndex} totalSteps={totalSteps} />
      </section>

      {mode !== 'idle' && (
        <section className="sec">
          <div className="sec-title">
            <span className="sec-num">03</span> VISUALIZATION
            {mode === 'step' && <span className="sec-badge badge-step">STEP MODE</span>}
            {mode === 'full' && <span className="sec-badge badge-full">FULL RUN</span>}
          </div>
          <div className="viz-grid">
            <InputTape input={inputString} activeIndex={tapeActive} />
            <StackVisualizer stack={stackState} action={lastAction} />
          </div>
        </section>
      )}

      {result && (
        <section className="sec">
          <div className="sec-title"><span className="sec-num">04</span> RESULT</div>
          <ResultDisplay result={result} />
        </section>
      )}

      {visibleSteps.length > 0 && (
        <section className="sec">
          <div className="sec-title">
            <span className="sec-num">{result ? '05' : '04'}</span> EXECUTION LOG
          </div>
          <ExecutionLog steps={visibleSteps} activeIndex={currentStepIndex} />
        </section>
      )}

      <footer className="ftr">
        <span>PDA Simulator</span>
        <span className="ftr-sep">◆</span>
        <span>Context-Free Language Recognition</span>
      </footer>
    </div>
  );
}