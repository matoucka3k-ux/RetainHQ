@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #080c14;
  --surface: #111827;
  --border: #1e2d45;
}

* { box-sizing: border-box; }

body {
  background: var(--bg);
  color: #f1f5f9;
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, #60a5fa, #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .bg-mesh {
    background:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(59,130,246,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6,182,212,0.07) 0%, transparent 60%);
  }
  .border-glow {
    border-color: rgba(59,130,246,0.4);
    box-shadow: 0 0 20px rgba(59,130,246,0.15);
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Selection */
::selection { background: rgba(59,130,246,0.3); }
