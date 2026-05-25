# PDA Simulator — Balanced Parentheses

An interactive web app that simulates a **Pushdown Automaton (PDA)** to check whether a string of parentheses is balanced. Built as a personal project to better understand Theory of Computation concepts through visualization.

---

## Live Demo

👉 https://pda-simulator-9dcy.vercel.app

---

## What it does

You type a string like `(())` or `)(`, and the simulator runs a PDA on it step by step — showing you the stack, the input tape, and whether the string gets accepted or rejected.

You can either run the full simulation at once, or go one character at a time using Step Mode to see exactly what happens at each transition.

---

## Why I built this

Automata theory can feel abstract when you're just reading about it. I wanted to actually see the stack grow and shrink as each character is processed. Building this helped me understand PDAs a lot better than just studying them on paper.

---

## Features

- Full simulation and step-by-step mode
- Visual input tape with a read-head that moves as characters are processed
- Live stack that updates with each push and pop
- Execution log showing every transition made
- Handles edge cases — empty string, invalid characters, unmatched brackets
- Reset button to start over

---

## Tech stack

- React 18 + Vite
- Plain JavaScript and CSS (no UI libraries)
- React hooks for state management

---

## How to run locally

```bash
git clone https://github.com/hasinik-code/pda-simulator.git
cd pda-simulator
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## How the PDA works

For each character in the input:
- `(` → push onto the stack
- `)` → pop from the stack (if stack is empty, reject immediately)

At the end of the input:
- Stack is empty → **Accept**
- Stack still has items → **Reject**

---

## Project structure

```
src/
├── App.jsx              # Root component
├── usePDA.js            # PDA logic and state
└── components/
    ├── Controls.jsx
    ├── StackVisualizer.jsx
    ├── InputTape.jsx
    ├── ExecutionLog.jsx
    └── ResultDisplay.jsx
```

---

## Author

**Hasin**
GitHub: [@hasinik-code](https://github.com/hasinik-code)
LinkedIn: [hasini-katam](https://www.linkedin.com/in/hasini-katam-60b148348/)
