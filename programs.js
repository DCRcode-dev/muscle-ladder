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
            id: "leg_press", name: "Leg Press", superset: "A",
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "30–60 sec",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "db_lateral_raise", name: "Dumbbell Lateral Raise", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "30–60 sec",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "bb_romanian_deadlift", name: "Barbell Romanian Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 2, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "machine_chest_press", name: "Machine Chest Press", superset: "B",
            warmupSets: "1–2", workingSets: 3, reps: "6–8",
            rest: "1–2 min",
            substitutions: ["Bench Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: "B",
            warmupSets: "0–1", workingSets: 3, reps: "6–8",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p2_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "2", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "hack_squat", name: "Hack Squat", superset: null,
            warmupSets: "3–4", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "incline_db_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", ""],
            notes: ""
          },
          {
            id: "chest_supported_tbar_row", name: "Chest-Supported T-Bar Row", superset: "A",
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "bb_biceps_curl", name: "Barbell Biceps Curl", superset: "A",
            warmupSets: "0–1", workingSets: 2, reps: "6–8",
            rest: "0–1 min",
            substitutions: ["Standing Barbell Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: "A",
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "0–1 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      }
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
            id: "bb_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "chest_supported_tbar_row", name: "Chest-Supported T-Bar Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Row", "Cable Row"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", ""],
            notes: ""
          },
          {
            id: "db_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Preacher Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Dropset",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p4_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "3–4 min",
            substitutions: ["Barbell Back Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "pullup_optional", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "romanian_deadlift", name: "Romanian Deadlift", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Dumbbell Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Rear Delt Fly", "Cable Rear Delt Fly"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          }
        ]
      },
      {
        id: "p4_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "incline_db_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Press"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "goblet_squat_or_cable_crunch", name: "Plate-Weighted Decline Sit-Up", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Crunch", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      }
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "db_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pullup_optional", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "30 sec",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "superset1_preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            lastSetTechnique: "Dropset",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p7_s2",
        name: "Lower #1",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Barbell Back Squat", "Hack Squat"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["45° Back Extension", "Dumbbell Romanian Deadlift"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      },
      {
        id: "p7_s3",
        name: "Upper #2",
        exercises: [
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "3–4 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Machine Chest Press", "Dumbbell Shoulder Press"],
            notes: ""
          },
          {
            id: "flat_db_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Bench Press", "Cable Fly"],
            notes: ""
          },
          {
            id: "superset1_triceps_pressdown", name: "Superset 1: Triceps Pressdown", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Rope Kickback", "Triceps Kickback (Cable)"],
            notes: ""
          },
          {
            id: "superset1_preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "superset1_ez_bar_skullcrusher", name: "Superset 1: EZ-Bar Skullcrusher", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          }
        ]
      },
      {
        id: "p7_s4",
        name: "Lower #2",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Goblet Squat"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "barbell_back_squat2", name: "Barbell Back Squat", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Leg Press"],
            notes: ""
          },
          {
            id: "leg_curl_seated", name: "Seated Leg Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Cable Crunch"],
            notes: ""
          }
        ]
      }
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Pendlay Row", "Chest-Supported T-Bar Row"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "db_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "superset1_preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "superset1_standing_calf_raise", name: "Superset 1: Standing Calf Raise", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p10_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "pullup_optional", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "incline_db_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Press"],
            notes: ""
          },
          {
            id: "ez_bar_curl", name: "EZ-Bar Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Preacher Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p10_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Dumbbell Shoulder Press", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Cable Row"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "superset1_triceps_pressdown", name: "Superset 1: Triceps Pressdown", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["EZ-Bar Skullcrusher", "Rope Pressdown"],
            notes: ""
          },
          {
            id: "superset1_bayesian_cable_curl", name: "Superset 1: Bayesian Cable Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
          {
            id: "superset1_seated_calf_raise", name: "Superset 1: Seated Calf Raise", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p10_s4",
        name: "Full Body #4",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Goblet Squat"],
            notes: ""
          },
          {
            id: "flat_db_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Bench Press", "Machine Chest Press"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Pull-Up (Optional Assistance)", "45° Back Extension"],
            notes: ""
          },
          {
            id: "dumbbell_fly", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "pullup_optional", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "leg_curl2", name: "Lying Leg Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Seated Leg Curl", ""],
            notes: ""
          }
        ]
      }
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Preacher Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p12_s2",
        name: "Full Body #2",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "incline_db_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Press"],
            notes: ""
          },
          {
            id: "overhead_cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Dumbbell Pullover", "Straight-Arm Lat Pulldown"],
            notes: ""
          },
          {
            id: "barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Shoulder Press", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "dumbbell_fly_pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          }
        ]
      },
      {
        id: "p12_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Leg Press", "Goblet Squat"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "pendlay_row", name: "Pendlay Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Barbell Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Dropset",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      },
      {
        id: "p12_s4",
        name: "Full Body #4",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Hack Squat"],
            notes: ""
          },
          {
            id: "flat_db_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Bench Press", "Machine Chest Press"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "lying_leg_curl", name: "Lying Leg Curl", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Seated Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "rope_pushdown", name: "Rope Pushdown", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          }
        ]
      },
      {
        id: "p12_s5",
        name: "Full Body #5",
        exercises: [
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Rope Pushdown"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Shrug", "Machine Shrug"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["45° Back Extension", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Rear Delt Fly", "Cable Rear Delt Fly"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set), Myo-reps",
            substitutions: ["Preacher Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Pec Deck", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      }
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pullup_optional", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            lastSetTechnique: "Dropset",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "30 sec",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "superset1_preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p14_s2",
        name: "Lower #1 (Strength Focus)",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Barbell Front Squat", "Hack Squat"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      },
      {
        id: "p14_s3",
        name: "Push #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Shoulder Press", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "incline_db_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Press"],
            notes: ""
          },
          {
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Fly", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Triceps Pressdown", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          }
        ]
      },
      {
        id: "p14_s4",
        name: "Pull #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Cheat Reps",
            substitutions: ["Dumbbell Shrug", "Machine Shrug"],
            notes: ""
          },
          {
            id: "pec_deck_reverse", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Rear Delt Fly", "Dumbbell Rear Delt Fly"],
            notes: ""
          },
          {
            id: "cable_row_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Pullover", "Straight-Arm Lat Pulldown"],
            notes: ""
          },
          {
            id: "reverse_pulldown", name: "Reverse Pulldown", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Pull-In", "Lat Pulldown"],
            notes: ""
          },
          {
            id: "dumbbell_biceps_curl", name: "Dumbbell Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Barbell Biceps Curl", "Preacher Curl"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Hammer Curl", "Incline Dumbbell Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p14_s5",
        name: "Legs #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Goblet Squat"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "lying_leg_curl", name: "Lying Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–15",
            rest: "1–2 min",
            substitutions: ["Seated Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "goblet_squat", name: "Goblet Squat", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Leg Press", "Hack Squat"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          },
          {
            id: "leg_raise", name: "Hanging Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–15",
            rest: "1–2 min",
            substitutions: ["Cable Crunch", "Plate-Weighted Decline Sit-Up"],
            notes: ""
          }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 16: Upper/Lower 6x/week
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Cable Rear Delt Fly", "Dumbbell Rear Delt Fly"],
            notes: ""
          },
          {
            id: "biceps_curl", name: "Barbell Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p16_s2",
        name: "Lower #1 (Strength Focus)",
        exercises: [
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Barbell Front Squat", "Hack Squat"],
            notes: ""
          },
          {
            id: "barbell_front_squat", name: "Barbell Front Squat", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Barbell Back Squat", "Goblet Squat"],
            notes: ""
          },
          {
            id: "romanian_deadlift", name: "Romanian Deadlift", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Good Morning"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "6–8",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          },
          {
            id: "plate_weighted_decline_situp", name: "Plate-Weighted Decline Sit-Up", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Crunch", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      },
      {
        id: "p16_s3",
        name: "Upper #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "pendlay_row", name: "Pendlay Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Barbell Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Dumbbell Pullover", "Straight-Arm Lat Pulldown"],
            notes: ""
          },
          {
            id: "overhead_barbell_press2", name: "Overhead Barbell Press", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Myo-reps",
            substitutions: ["Dumbbell Fly", "Pec Deck"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Pec Deck", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "lat_pulldown2", name: "Lat Pulldown", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "barbell_biceps_curl", name: "Barbell Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p16_s4",
        name: "Lower #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Hack Squat"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Cable Crunch"],
            notes: ""
          }
        ]
      },
      {
        id: "p16_s5",
        name: "Upper #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "flat_db_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Bench Press", "Machine Chest Press"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Row", "Chest-Supported T-Bar Row"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Rope Pushdown", "EZ-Bar Skullcrusher"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Hammer Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p16_s6",
        name: "Lower #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "lunge_barbell", name: "Lunge (Barbell)", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Dumbbell Lunge", "Goblet Squat"],
            notes: ""
          },
          {
            id: "good_morning", name: "Good Morning (Barbell)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["45° Back Extension", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "goblet_squat", name: "Goblet Squat", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Leg Press", "Hack Squat"],
            notes: ""
          },
          {
            id: "cable_hip_abduction", name: "Cable Hip Abduction", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Hip Abduction", "Machine Hip Abduction"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          },
          {
            id: "plank", name: "Plank", superset: null,
            warmupSets: "0", workingSets: 3, reps: "30–60 sec",
            rest: "1–2 min",
            substitutions: ["Cable Crunch", "Dead Bug"],
            notes: ""
          }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────
  // PROGRAM 19: Push/Pull/Legs 6x/week
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "dumbbell_shoulder_press", name: "Dumbbell Shoulder Press", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Overhead Barbell Press", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Pec Deck", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Triceps Pressdown", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Rope Pushdown", "Triceps Kickback"],
            notes: ""
          }
        ]
      },
      {
        id: "p19_s2",
        name: "Pull #1 (Strength Focus)",
        exercises: [
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Pendlay Row"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "rope_facepull", name: "Rope Facepull", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Reverse Pec Deck", "Cable Rear Delt Fly"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Pullover", "Straight-Arm Lat Pulldown"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Preacher Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "ez_bar_biceps_curl", name: "EZ-Bar Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Barbell Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p19_s3",
        name: "Legs #1 (Strength Focus)",
        exercises: [
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–5 min",
            substitutions: ["Barbell Back Squat", "Hack Squat"],
            notes: ""
          },
          {
            id: "deadlift", name: "Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["45° Back Extension", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "leg_press2", name: "Leg Press", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Goblet Squat", ""],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", ""],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          }
        ]
      },
      {
        id: "p19_s4",
        name: "Push #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press", "Machine Shoulder Press"],
            notes: ""
          },
          {
            id: "flat_db_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Bench Press", "Machine Chest Press"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Pec Deck", "Dumbbell Fly"],
            notes: ""
          },
          {
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "triceps_kickback_cable", name: "Triceps Kickback (Cable)", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Myo-reps",
            substitutions: ["Rope Pushdown", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Rope Pushdown"],
            notes: ""
          }
        ]
      },
      {
        id: "p19_s5",
        name: "Pull #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Row", "Chest-Supported T-Bar Row"],
            notes: ""
          },
          {
            id: "pec_deck_reverse", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Rear Delt Fly", "Dumbbell Rear Delt Fly"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Pullover", "Straight-Arm Lat Pulldown"],
            notes: ""
          },
          {
            id: "reverse_pulldown", name: "Pull-In", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Lat Pulldown", "Cable Pullover"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            lastSetTechnique: "Cheat Reps",
            substitutions: ["Dumbbell Shrug", "Machine Shrug"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Hammer Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "hammer_curl", name: "Hammer Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Barbell Biceps Curl", "EZ-Bar Biceps Curl"],
            notes: ""
          }
        ]
      },
      {
        id: "p19_s6",
        name: "Legs #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Goblet Squat"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Good Morning", "Romanian Deadlift"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            lastSetTechnique: "Lengthened Partials (Extended Set)",
            substitutions: ["Hack Squat", ""],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "goblet_squat", name: "Goblet Squat", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "2–3 min",
            substitutions: ["Leg Press", "Barbell Back Squat"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", ""],
            notes: ""
          },
          {
            id: "roman_chair_calf_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Cable Crunch"],
            notes: ""
          }
        ]
      }
    ]
  }

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
