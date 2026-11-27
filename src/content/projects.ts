export type ProjectStatus = 'active' | 'experiment' | 'prototype'
export type DiagramKind = 'atlas' | 'tokens' | 'signal' | 'frame'

export interface ProjectCaseSection {
  label: string
  body: string
}

export interface Project {
  id: string
  index: string
  name: string
  tagline: string
  summary: string
  status: string
  statusKind: ProjectStatus
  tech: string[]
  contribution: string
  updated: string
  repo: string
  featured?: boolean
  diagram?: DiagramKind
  caseStudy: ProjectCaseSection[]
}

export const GITHUB_PROFILE = 'https://github.com/rahullamani01'

export const projects: Project[] = [
  {
    id: 'atlas',
    index: '01',
    name: 'ATLAS',
    tagline:
      'A simulated mobile robot that plans routes, repairs its map, and explores unknown space. The latest experiments ask how little LiDAR data it can navigate with.',
    summary:
      'In this 2D Python simulator, a differential-drive robot steers from its estimated pose. It uses LiDAR to update its occupancy map, corrects its trajectory when it revisits a place, and chooses where to explore next.',
    status: 'Active · Phases 0–17 complete',
    statusKind: 'active',
    tech: ['Python', 'NumPy', 'Matplotlib', 'pytest'],
    contribution:
      'Built the simulator and navigation stack, then compared localization and arrival accuracy across repeated drives with different wheel errors and LiDAR return budgets.',
    updated: '28 Nov 2026',
    repo: 'https://github.com/rahullamani01/Atlas',
    featured: true,
    diagram: 'atlas',
    caseStudy: [
      {
        label: 'Problem',
        body:
          'Build a differential-drive robot from the mathematics up — plan a route, follow it with feedback, estimate pose from noisy sensors, and react when the world stops matching the map.',
      },
      {
        label: 'Approach',
        body:
          'Wheel speeds are integrated into a pose over time. The world is rasterised into an occupancy grid, obstacles are inflated, and A* searches the grid with an octile heuristic and 8-connectivity. A PID path follower tracks the route, a 2D LiDAR supplies range scans, and a particle filter fuses those scans with wheel odometry. A dynamic obstacle map turns map-inconsistent returns into confirmed cells, and the supervisor replans or runs a bounded scan/backup/fail recovery.',
      },
      {
        label: 'What works',
        body:
          'When the simulated robot was displaced, it reacquired its pose in 2.35 seconds and finished without a collision. Later scenarios demonstrated map repair, online pose-graph correction, and exploration from an empty map. Across three exploration seeds, it observed 96.2% of truly free space on average.',
      },
      {
        label: 'Limitations',
        body:
          'These results come from simulated routes. In the Phase 15 study, all five drives reached the goal with eight LiDAR returns per filter update; all five collided with two. Choosing the two most widely separated returns in Phase 16 did not prevent those collisions.',
      },
      {
        label: 'What I learned',
        body:
          'A path and a controller are different problems. A* can return a geometrically valid route that a differential-drive robot still cannot track without a control layer.',
      },
      {
        label: 'Latest experiment · Phase 17',
        body:
          'Giving the two widely separated returns more weight lowered mean position RMS error from 0.925 m to 0.128 m. Four of five drives still collided. The fifth reported arrival, but its true position was 0.218 m from the goal, outside the controller’s 0.10 m tolerance.',
      },
    ],
  },
  {
    id: 'tiny-llm',
    index: '02',
    name: 'tiny-llm',
    tagline:
      'A small GPT built from scratch in PyTorch to study language-model internals. Not a product — a working laboratory.',
    summary:
      'Five thousand lines of theory collapse into a few tensor operations. I built the tokenizer, attention stack, training loop, evaluation, and sampling so I could inspect each one.',
    status: 'Active · tested',
    statusKind: 'active',
    tech: ['Python', 'PyTorch', 'NumPy', 'GitHub Actions'],
    contribution:
      'Sole author: tokenizers, transformer, training loop, evaluation, sampling, KV cache, RoPE, and tests.',
    updated: 'Updated Oct 2026',
    repo: 'https://github.com/rahullamani01/tiny-llm',
    diagram: 'tokens',
    caseStudy: [
      {
        label: 'Problem',
        body:
          'I wanted to stop treating language models as an API call. The goal was to implement the pieces — tokenization, attention, training, evaluation, generation — and be able to explain each one.',
      },
      {
        label: 'Approach',
        body:
          'A character-level tokenizer with an optional BPE vocabulary, a bigram baseline, learned embeddings, causal self-attention, multi-head attention, and stacked transformer blocks. Training uses warmup, cosine decay, gradient clipping, resumable checkpoints, and best-checkpoint tracking.',
      },
      {
        label: 'What works',
        body:
          'Evaluation reports cross-entropy loss and perplexity. Generation supports temperature, top-k, top-p, repetition penalty, streaming, and optional KV caching. RoPE and weight tying are selectable. Checkpoints store their tokenizer and position-embedding configuration, and CI runs the test suite.',
      },
      {
        label: 'Limitations',
        body:
          'This is a learning implementation on a small corpus with limited compute. It is not a production LLM and I do not present benchmark numbers. Generation quality is bounded by model size, data, and training time.',
      },
      {
        label: 'What I learned',
        body:
          'KV caching is not just a speed trick; it forces you to reason about exactly which positions the attention mask covers. RoPE changes that reasoning again.',
      },
      {
        label: 'Next',
        body:
          'Run controlled comparisons between tokenizers and position embeddings, then publish the setup alongside the results rather than a single cherry-picked sample.',
      },
    ],
  },
  {
    id: 'voice-clone-detector',
    index: '03',
    name: 'voice_clone_detector',
    tagline:
      'A streaming research prototype for detecting cloned or synthetic speech, built around a CNN + BiLSTM classifier and an honest evaluation problem.',
    summary:
      'The pipeline works end to end: audio is windowed, scored, smoothed, and returned over a WebSocket. The harder question is whether the score means anything on unseen voices. That is still open.',
    status: 'Research prototype · evaluation open',
    statusKind: 'experiment',
    tech: ['PyTorch', 'torchaudio', 'librosa', 'FastAPI', 'WebSocket'],
    contribution:
      'Repository author: model, feature pipeline, VAD and windowing, EMA smoothing, WebSocket server, training and metric code.',
    updated: 'Updated Oct 2026',
    repo: 'https://github.com/rahullamani01/voice_clone_detector',
    diagram: 'signal',
    caseStudy: [
      {
        label: 'Problem',
        body:
          'Synthetic speech is cheap to produce and hard to spot by ear. The project explores whether a learned detector can flag cloned audio in short streaming windows, and where that approach breaks.',
      },
      {
        label: 'Approach',
        body:
          'Audio is converted to features with torchaudio on the streaming path and librosa for training and exploration. Voice activity detection skips silence; a sliding window feeds a CNN + BiLSTM with attention pooling; an exponential moving average smooths per-window scores.',
      },
      {
        label: 'What works',
        body:
          'The pipeline runs end to end: a WebSocket server accepts audio chunks, windows them, scores them, and returns a smoothed verdict. Training reports EER, AUC, precision, recall, and F1, with a language-balanced sampler intended to reduce accent shortcuts.',
      },
      {
        label: 'Limitations',
        body:
          'This is a research prototype, not a dependable security product. I do not publish an accuracy or EER figure here because I have not reproduced a result I trust for the current checkpoint. Dataset leakage, speaker overlap, and cross-dataset generalisation still need to be measured. False positives and false negatives both have real costs.',
      },
      {
        label: 'What I learned',
        body:
          'A good training score is not evidence of a good detector. The split strategy and the metric can hide the exact failure you care about.',
      },
      {
        label: 'Next',
        body:
          'Freeze a documented, speaker-disjoint split, publish the evaluation protocol and baseline, then test on audio from a generator the model has not seen.',
      },
    ],
  },
  {
    id: 'python-socket-chat',
    index: '04',
    name: 'python-socket-chat',
    tagline:
      'A multi-client TCP chat with a custom framing protocol, threaded server, file transfer, and a Tkinter client.',
    summary:
      'Chat looks simple until you have to define message boundaries on a byte stream, keep one slow client from blocking everyone, and move a file without corrupting it.',
    status: 'Working prototype',
    statusKind: 'prototype',
    tech: ['Python', 'TCP sockets', 'threading', 'Tkinter', 'SHA-256'],
    contribution:
      'Sole author: server, framing protocol, Tkinter client, file transfer, history, and protocol tests.',
    updated: 'Updated Oct 2026',
    repo: 'https://github.com/rahullamani01/python-socket-chat',
    diagram: 'frame',
    caseStudy: [
      {
        label: 'Problem',
        body:
          'Build a real-time chat application on raw TCP to understand what a chat framework normally hides: framing, concurrency, backpressure, and file integrity.',
      },
      {
        label: 'Approach',
        body:
          'Every frame begins with two 4-byte big-endian lengths: JSON payload and raw binary payload. The server runs one thread per client with a bounded send queue, so a slow client cannot stall the broadcast loop. File transfer is chunked, requires recipient acceptance, applies backpressure, and verifies SHA-256.',
      },
      {
        label: 'What works',
        body:
          'Multi-client chat, private messages, replay of the last 50 messages, accept/decline file transfer, voice notes, unread counts, and a Tkinter desktop client. Protocol tests are included, and the server uses only the Python standard library.',
      },
      {
        label: 'Limitations',
        body:
          'There is no encryption or authentication yet. Usernames are first-come, first-served, and private messages and files are not replayed in history. It is a local network prototype, not a hardened public service.',
      },
      {
        label: 'What I learned',
        body:
          'TCP gives you a stream, not messages. An explicit length header is the difference between a protocol and a pile of accidental reads.',
      },
      {
        label: 'Next',
        body:
          'TLS and user accounts are the next meaningful additions, followed by timestamps and message search.',
      },
    ],
  },
]

export interface OtherProject {
  name: string
  note: string
  repo: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'sih-voice-detection',
    note: 'team SIH prototype · real-time detection demo',
    repo: 'https://github.com/rahullamani01/sih-voice-detection',
  },
  {
    name: 'nokia-snake',
    note: 'single-file HTML game · no dependencies',
    repo: 'https://github.com/rahullamani01/nokia-snake',
  },
]
