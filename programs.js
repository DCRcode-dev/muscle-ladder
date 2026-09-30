// ============================================================
// MUSCLE LADDER — Jeff Nippard Program Data
// All programs extracted from The Muscle Ladder book
// ============================================================

const PROGRAMS = [

  // ──────────────────────────────────────────────
  // PROGRAM 2: Full Body Split 2x/week
  // ──────────────────────────────────────────────
  {
    id: "p2",
    number: 2,
    name: "Full Body Split",
    daysPerWeek: 2,
    level: "All levels",
    goal: "Time-limited muscle and strength gain",
    timeEstimate: "45–60 min",
    restDays: "2–3 rest days between sessions",
    sessions: [
      {
        id: "p2_s1",
        name: "Full Body #1",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p2_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 4: Full Body Split 3x/week
  // ──────────────────────────────────────────────
  {
    id: "p4",
    number: 4,
    name: "Full Body Split",
    daysPerWeek: 3,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "1–2 rest days between sessions",
    sessions: [
      {
        id: "p4_s1",
        name: "Full Body #1",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p4_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p4_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 7: Upper/Lower Split 4x/week
  // ──────────────────────────────────────────────
  {
    id: "p7",
    number: 7,
    name: "Upper/Lower Split",
    daysPerWeek: 4,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "1–2 rest days between sessions",
    sessions: [
      {
        id: "p7_s1",
        name: "Upper #1",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p7_s2",
        name: "Lower #1",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p7_s3",
        name: "Upper #2",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p7_s4",
        name: "Lower #2",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 10: Full Body Split 4x/week
  // ──────────────────────────────────────────────
  {
    id: "p10",
    number: 10,
    name: "Full Body Split",
    daysPerWeek: 4,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "1–2 rest days between sessions",
    sessions: [
      {
        id: "p10_s1",
        name: "Full Body #1",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p10_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p10_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p10_s4",
        name: "Full Body #4",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 12: Full Body Split 5x/week
  // ──────────────────────────────────────────────
  {
    id: "p12",
    number: 12,
    name: "Full Body Split",
    daysPerWeek: 5,
    level: "Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "Suggested rest day between sessions",
    sessions: [
      {
        id: "p12_s1",
        name: "Full Body #1",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s4",
        name: "Full Body #4",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s5",
        name: "Full Body #5",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 14: Upper/Lower/Push/Pull/Legs 5x/week
  // ──────────────────────────────────────────────
  {
    id: "p14",
    number: 14,
    name: "Upper/Lower/Push/Pull/Legs",
    daysPerWeek: 5,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "Suggested rest day between sessions",
    sessions: [
      {
        id: "p14_s1",
        name: "Upper #1 (Strength Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p14_s2",
        name: "Lower #1 (Strength Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p14_s3",
        name: "Push #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p14_s4",
        name: "Pull #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p14_s5",
        name: "Legs #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 16: Upper/Lower Split 6x/week
  // ──────────────────────────────────────────────
  {
    id: "p16",
    number: 16,
    name: "Upper/Lower Split",
    daysPerWeek: 6,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "Suggested rest day between sessions",
    sessions: [
      {
        id: "p16_s1",
        name: "Upper #1 (Strength Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s2",
        name: "Lower #1 (Strength Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s3",
        name: "Upper #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s4",
        name: "Lower #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s5",
        name: "Upper #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s6",
        name: "Lower #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 19: Push/Pull/Legs Split 6x/week
  // ──────────────────────────────────────────────
  {
    id: "p19",
    number: 19,
    name: "Push/Pull/Legs Split",
    daysPerWeek: 6,
    level: "Intermediate/Advanced",
    goal: "Build muscle and gain strength",
    timeEstimate: "60–90 min",
    restDays: "Suggested rest day between sessions",
    sessions: [
      {
        id: "p19_s1",
        name: "Push #1 (Strength Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s2",
        name: "Pull #1 (Strength Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s3",
        name: "Legs #1 (Strength Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s4",
        name: "Push #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s5",
        name: "Pull #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10",
            rest: "1–2 min",
            substitutions: ["Machine Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s6",
        name: "Legs #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "dragon_flag", name: "Dragon Flag", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Roman Chair Leg Raise"],
            notes: ""
          },
        ]
      },
    ]
  },

];

// Helper: get programs by days per week
function getProgramsByDays(days) {
  return PROGRAMS.filter(p => p.daysPerWeek === days);
}

// Helper: get program by id
function getProgramById(id) {
  return PROGRAMS.find(p => p.id === id);
}

// Helper: get session by id
function getSessionById(programId, sessionId) {
  const prog = getProgramById(programId);
  if (!prog) return null;
  return prog.sessions.find(s => s.id === sessionId);
}

// Export for use in app
if (typeof module !== 'undefined') module.exports = { PROGRAMS, getProgramsByDays, getProgramById, getSessionById };
