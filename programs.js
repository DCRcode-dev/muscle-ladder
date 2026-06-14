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
            id: "leg_press", name: "Superset 1: Leg Press", superset: "A",
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "30–60 sec",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Superset 1: Dumbbell Lateral Raise", superset: "A",
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
            id: "barbell_romanian_deadlift", name: "Barbell Romanian Deadlift", superset: null,
            warmupSets: "2–3", workingSets: 2, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Romanian Deadlift", "Hip Thrust"],
            notes: ""
          },
          {
            id: "machine_chest_press", name: "Superset 2: Machine Chest Press", superset: "B",
            warmupSets: "1–2", workingSets: 3, reps: "6–8",
            rest: "1–2 min",
            substitutions: ["Bench Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Superset 2: Standing Calf Raise", superset: "B",
            warmupSets: "0–1", workingSets: 3, reps: "6–8",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
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
            id: "incline_dumbbell_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Bench Press"],
            notes: ""
          },
          {
            id: "chest_supported_t_bar_row", name: "Chest-Supported T-Bar Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "ez_bar_biceps_curl", name: "Superset 1: EZ-Bar Biceps Curl", superset: "A",
            warmupSets: "0–1", workingSets: 2, reps: "6–8",
            rest: "30 sec",
            substitutions: ["Standing Barbell Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "Superset 1: EZ-Bar Skullcrusher", superset: "A",
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
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
            id: "barbell_back_squat", name: "Barbell Back Squat", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "chest_supported_t_bar_row", name: "Chest-Supported T-Bar Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Row", "Cable Row"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Preacher Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
        ]
      },
      {
        id: "p4_s2",
        name: "Full Body #2",
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
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
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
            id: "incline_dumbbell_press", name: "Incline Dumbbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Incline Machine Chest Press", "Incline Barbell Bench Press"],
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
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "plate_weighted_decline_sit_up", name: "Plate-Weighted Decline Sit-Up", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Cable Crunch", "Plank"],
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
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "Superset 1: EZ-Bar Skullcrusher", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
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
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p7_s3",
        name: "Upper #2",
        exercises: [
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Pull-Up (Optional Assistance)", "Chin-Up"],
            notes: ""
          },
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Superset 1: Triceps Pressdown", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Triceps Kickback (Cable)", "EZ-Bar Skullcrusher"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Superset 1: Bayesian Cable Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
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
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
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
            id: "dumbbell_lateral_raise", name: "Dumbbell Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Superset 1: Seated Calf Raise", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
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
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p10_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Superset 1: Triceps Pressdown", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["EZ-Bar Skullcrusher", "Triceps Kickback (Cable)"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Superset 1: Bayesian Cable Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "30 sec",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
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
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "leg_press", name: "Leg Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "lat_pulldown", name: "Lat Pulldown", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
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
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s2",
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
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dumbbell Shoulder Press (Seated)", "Barbell Upright Row"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lat Pullover", "Cable Lat Pull-In"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s3",
        name: "Full Body #3",
        exercises: [
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Shrug", "Trap Bar Shrug"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Triceps Pressdown", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Triceps Kickback (Cable)", "EZ-Bar Skullcrusher"],
            notes: ""
          },
          {
            id: "dumbbell_biceps_curl", name: "Dumbbell Biceps Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Standing Barbell Curl"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "30 sec",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
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
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Machine Lateral Raise", "Dumbbell Lateral Raise"],
            notes: ""
          },
          {
            id: "cable_lat_pull_in", name: "Cable Lat Pull-In", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Lat Pullover", "Dumbbell Lat Pullover"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Dumbbell Skullcrusher"],
            notes: ""
          },
        ]
      },
      {
        id: "p12_s5",
        name: "Full Body #5",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "15–20",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Pec Deck"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
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
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Cable Lateral Raise", "Machine Lateral Raise"],
            notes: ""
          },
          {
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Superset 1: Preacher Curl", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "30 sec",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "Superset 1: EZ-Bar Skullcrusher", superset: "A",
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "30 sec",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
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
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p14_s3",
        name: "Push #1 (Hypertrophy Focus)",
        exercises: [
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
            notes: ""
          },
          {
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Machine Lateral Raise", "Dumbbell Lateral Raise"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Pec Deck"],
            notes: ""
          },
          {
            id: "triceps_kickback_cable", name: "Triceps Kickback (Cable)", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Triceps Pressdown"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Dumbbell Skullcrusher"],
            notes: ""
          },
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
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "cable_lat_pull_in", name: "Cable Lat Pull-In", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Cable Lat Pullover", "Dumbbell Lat Pullover"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Shrug", "Trap Bar Shrug"],
            notes: ""
          },
          {
            id: "hammer_curl", name: "Hammer Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Biceps Curl", "EZ-Bar Biceps Curl"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "30 sec",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
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
            id: "rope_facepull", name: "Rope Facepull", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Reverse Pec Deck", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "preacher_curl", name: "Preacher Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Biceps Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
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
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s3",
        name: "Upper #2 (Hypertrophy Focus)",
        exercises: [
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "overhead_barbell_press", name: "Overhead Barbell Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "3–4 min",
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lat Pullover", "Cable Lat Pull-In"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Pec Deck"],
            notes: ""
          },
          {
            id: "hammer_curl", name: "Hammer Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Biceps Curl", "EZ-Bar Biceps Curl"],
            notes: ""
          },
          {
            id: "triceps_kickback_cable", name: "Triceps Kickback (Cable)", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Triceps Pressdown"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "30 sec",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s5",
        name: "Upper #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
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
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Machine Lateral Raise", "Dumbbell Lateral Raise"],
            notes: ""
          },
          {
            id: "dumbbell_row", name: "Dumbbell Row", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Dumbbell Skullcrusher"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
        ]
      },
      {
        id: "p16_s6",
        name: "Lower #3 (Muscle Endurance Focus)",
        exercises: [
          {
            id: "lunge_barbell", name: "Lunge (Barbell)", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "6–8",
            rest: "2–3 min",
            substitutions: ["Dumbbell Lunge", "Leg Press"],
            notes: ""
          },
          {
            id: "good_morning", name: "Good Morning", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "goblet_squat", name: "Goblet Squat", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Leg Extension", "Front Squat"],
            notes: ""
          },
          {
            id: "cable_hip_abduction", name: "Cable Hip Abduction", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Machine Hip Abduction", "Weighted Hip Abduction"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "plank", name: "Plank", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "30–60s",
            rest: "1–2 min",
            substitutions: ["LLPT Plank", "Cable Crunch"],
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
            id: "bench_press", name: "Bench Press", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "3–5",
            rest: "3–4 min",
            substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
            notes: ""
          },
          {
            id: "dumbbell_shoulder_press_seated", name: "Dumbbell Shoulder Press (Seated)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Overhead Barbell Press", "Barbell Upright Row"],
            notes: ""
          },
          {
            id: "pec_deck", name: "Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Push-Up"],
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
            id: "ez_bar_skullcrusher", name: "EZ-Bar Skullcrusher", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Skullcrusher", "Overhead Triceps Extension"],
            notes: ""
          },
          {
            id: "triceps_pressdown", name: "Triceps Pressdown", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Triceps Kickback (Cable)", "EZ-Bar Skullcrusher"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s2",
        name: "Pull #1 (Strength Focus)",
        exercises: [
          {
            id: "barbell_row", name: "Barbell Row", superset: null,
            warmupSets: "2–3", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Pendlay Row", "Dumbbell Row"],
            notes: ""
          },
          {
            id: "pull_up_optional_assistance", name: "Pull-Up (Optional Assistance)", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["Lat Pulldown", "Chin-Up"],
            notes: ""
          },
          {
            id: "rope_facepull", name: "Rope Facepull", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Reverse Pec Deck", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "cable_lat_pullover", name: "Cable Lat Pullover", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Dumbbell Lat Pullover", "Cable Lat Pull-In"],
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
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Standing Barbell Curl", "Dumbbell Biceps Curl"],
            notes: ""
          },
        ]
      },
      {
        id: "p19_s3",
        name: "Legs #1 (Strength Focus)",
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
            rest: "3–4 min",
            substitutions: ["Barbell Front Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "glute_ham_raise", name: "Glute Ham Raise", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "8–10",
            rest: "2–3 min",
            substitutions: ["45° Back Extension", "Lying Leg Curl"],
            notes: ""
          },
          {
            id: "seated_calf_raise", name: "Seated Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "8–10",
            rest: "1–2 min",
            substitutions: ["Standing Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "cable_crunch", name: "Cable Crunch", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Plate-Weighted Decline Sit-Up", "Hanging Leg Raise"],
            notes: ""
          },
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
            substitutions: ["Dumbbell Shoulder Press (Standing)", "Dumbbell Shoulder Press (Seated)"],
            notes: ""
          },
          {
            id: "flat_dumbbell_press", name: "Flat Dumbbell Press", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Dip", "Bench Press"],
            notes: ""
          },
          {
            id: "cable_lateral_raise", name: "Cable Lateral Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Machine Lateral Raise", "Dumbbell Lateral Raise"],
            notes: ""
          },
          {
            id: "cable_fly", name: "Cable Fly", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Dumbbell Fly", "Pec Deck"],
            notes: ""
          },
          {
            id: "triceps_kickback_cable", name: "Triceps Kickback (Cable)", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Triceps Pressdown"],
            notes: ""
          },
          {
            id: "overhead_triceps_extension", name: "Overhead Triceps Extension", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["EZ-Bar Skullcrusher", "Dumbbell Skullcrusher"],
            notes: ""
          },
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
            rest: "2–3 min",
            substitutions: ["Chest-Supported T-Bar Row", "Barbell Row"],
            notes: ""
          },
          {
            id: "cable_lat_pull_in", name: "Cable Lat Pull-In", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–12",
            rest: "1–2 min",
            substitutions: ["Cable Lat Pullover", "Dumbbell Lat Pullover"],
            notes: ""
          },
          {
            id: "reverse_pec_deck", name: "Reverse Pec Deck", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Rope Facepull", "Reverse Cable Fly"],
            notes: ""
          },
          {
            id: "barbell_shrug", name: "Barbell Shrug", superset: null,
            warmupSets: "0–1", workingSets: 2, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Shrug", "Trap Bar Shrug"],
            notes: ""
          },
          {
            id: "hammer_curl", name: "Hammer Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Dumbbell Biceps Curl", "EZ-Bar Biceps Curl"],
            notes: ""
          },
          {
            id: "bayesian_cable_curl", name: "Bayesian Cable Curl", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "12–15",
            rest: "1–2 min",
            substitutions: ["Incline Dumbbell Curl", "Preacher Curl"],
            notes: ""
          },
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
            substitutions: ["Leg Press", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "45_back_extension", name: "45° Back Extension", superset: null,
            warmupSets: "1–2", workingSets: 3, reps: "10–12",
            rest: "2–3 min",
            substitutions: ["Good Morning", "Glute Ham Raise"],
            notes: ""
          },
          {
            id: "leg_extension", name: "Leg Extension", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Goblet Squat", "Dumbbell Lunge"],
            notes: ""
          },
          {
            id: "seated_leg_curl", name: "Seated Leg Curl", superset: null,
            warmupSets: "1–2", workingSets: 2, reps: "12–15",
            rest: "2–3 min",
            substitutions: ["Lying Leg Curl", "Nordic Ham Curl"],
            notes: ""
          },
          {
            id: "standing_calf_raise", name: "Standing Calf Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "15–20",
            rest: "1–2 min",
            substitutions: ["Seated Calf Raise", "Leg Press Calf Press"],
            notes: ""
          },
          {
            id: "roman_chair_leg_raise", name: "Roman Chair Leg Raise", superset: null,
            warmupSets: "0–1", workingSets: 3, reps: "10–20",
            rest: "1–2 min",
            substitutions: ["Hanging Leg Raise", "Bent-Knee Leg Raise"],
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
