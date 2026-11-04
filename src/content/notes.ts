export interface Note {
  id: string
  index: string
  title: string
  teaser: string
  question: string
  date: string
  tag: string
  status: string
  paragraphs: string[]
  repo: string
  repoLabel: string
}

export const notes: Note[] = [
  {
    id: 'path-is-not-a-controller',
    index: '01',
    title: 'A path is not a controller',
    teaser:
      'A* can return a clean route that a differential-drive robot still cannot follow without a control loop.',
    question: 'What sits between a planned path and an actual trajectory?',
    date: 'Nov 2026',
    tag: 'ATLAS / planning',
    status: 'Working note',
    paragraphs: [
      'The Phase 2 planner produces a sequence of grid cells. That is a geometric answer: which cells to cross, not how to turn the wheels over time.',
      'A differential drive has a nonholonomic constraint. It can move forward and rotate, but it cannot slide sideways. A route with sharp corners in grid space becomes a set of poses that a controller has to approach, correct, and settle into. The controller also has to absorb integration error, timing error, and the collision margin added during planning.',
      'The current simulator can integrate wheel speeds and detect collisions. It does not close the loop around a planned path yet. That is Phase 3, and I am keeping the claim separate from the current state.',
      'The useful takeaway: planning and control are separate layers with separate failure modes. A* finding a route says nothing about whether the robot can track it.',
    ],
    repo: 'https://github.com/rahullamani01/Atlas',
    repoLabel: 'Read the ATLAS repository',
  },
  {
    id: 'framing-bytes',
    index: '02',
    title: 'Framing bytes on a TCP stream',
    teaser:
      'TCP delivers a stream, not messages. The parser has to decide where one message ends and the next begins.',
    question: 'How do you keep messages intact when the network has no message boundaries?',
    date: 'Nov 2026',
    tag: 'SOCKET CHAT / protocol',
    status: 'Working note',
    paragraphs: [
      'If two JSON messages arrive in one read, or one message is split across two reads, a parser that assumes boundaries will fail intermittently. That is the kind of bug that looks like a random client disconnect until you log the raw reads.',
      'The chat protocol starts every frame with two 4-byte big-endian lengths: JSON payload and binary payload. The receiver reads eight bytes, then the exact payload lengths. That makes message boundaries explicit and keeps file chunks in raw binary without Base64 overhead.',
      'The server uses one thread per client and a bounded send queue. A slow client cannot stall the broadcast loop; it is dropped when its queue fills. That is a deliberate trade-off: protect the group, and accept that a slow participant loses the connection.',
      'Still missing: TLS and authentication. Encryption is a roadmap item, not a property of the current build.',
    ],
    repo: 'https://github.com/rahullamani01/python-socket-chat',
    repoLabel: 'Read the chat repository',
  },
  {
    id: 'score-vs-detector',
    index: '03',
    title: 'The gap between a good score and a good detector',
    teaser:
      'Accuracy is the least interesting number in a spoofing detector. The split and the metric can hide the failure you care about.',
    question: 'When does a voice-clone score actually measure detection instead of memorisation?',
    date: 'Nov 2026',
    tag: 'VOICE DETECTOR / evaluation',
    status: 'Open investigation',
    paragraphs: [
      'Accuracy is a poor first question for a spoofing detector. If the test set shares speakers or generators with training, a high score can measure memorisation rather than detection.',
      'EER and AUC describe how separable the score distributions are. Precision and recall describe what happens at a chosen threshold. None of them tells you whether the model generalises to a new vocoder. That requires a held-out generator and, ideally, a different dataset.',
      'The voice-clone detector pipeline and training code are in place. I have not published a metric here because I have not reproduced an evaluation I trust for the current checkpoint. The next step is a documented, speaker-disjoint split, a fixed threshold policy, and a cross-generator test.',
      'The uncomfortable part is that a false negative in a security context is not symmetric with a false positive. The metric has to reflect the cost of the mistake, not just the convenience of a single number.',
    ],
    repo: 'https://github.com/rahullamani01/voice_clone_detector',
    repoLabel: 'Read the detector repository',
  },
]
