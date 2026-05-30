import React, { useState, useMemo } from 'react';
import './AtarCalculator.css';

// Selectable Subject Metadata (22 Subjects)
const SUBJECT_METADATA = {
  english_lang: { name: 'English Language', color: '#10b981', glow: 'rgba(16, 185, 129, 0.3)', isEnglish: true, examMax: 75 },
  biology: { name: 'Biology', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.3)', isEnglish: false, examMax: 120 },
  chemistry: { name: 'Chemistry', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)', isEnglish: false, examMax: 120 },
  softdev: { name: 'Software Dev', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)', isEnglish: false, examMax: 100 },
  spec: { name: 'Specialist Maths', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)', isEnglish: false, examMax: 120 },
  english_main: { name: 'English Mainstream', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)', isEnglish: true, examMax: 60 },
  legal: { name: 'Legal Studies', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)', isEnglish: false, examMax: 80 },
  methods: { name: 'Math Methods', color: '#1d4ed8', glow: 'rgba(29, 78, 216, 0.3)', isEnglish: false, examMax: 120 },
  general_math: { name: 'General Maths', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)', isEnglish: false, examMax: 120 },
  physics: { name: 'Physics', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', isEnglish: false, examMax: 130 },
  pe: { name: 'Physical Education', color: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', isEnglish: false, examMax: 120 },
  data_analytics: { name: 'Data Analytics', color: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.3)', isEnglish: false, examMax: 100 },
  accounting: { name: 'Accounting', color: '#eab308', glow: 'rgba(234, 179, 8, 0.3)', isEnglish: false, examMax: 100 },
  french: { name: 'French', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)', isEnglish: false, examMax: 115 },
  chinese_sl: { name: 'Chinese SL', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)', isEnglish: false, examMax: 115 },
  chinese_sla: { name: 'Chinese SLA', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.3)', isEnglish: false, examMax: 115 },
  algorithmics: { name: 'Algorithmics (HESS)', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)', isEnglish: false, examMax: 100 },
  history_rev: { name: 'History Revolutions', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', isEnglish: false, examMax: 80 },
  geography: { name: 'Geography', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.3)', isEnglish: false, examMax: 80 },
  global_politics: { name: 'Global Politics', color: '#e11d48', glow: 'rgba(225, 29, 72, 0.3)', isEnglish: false, examMax: 80 },
  psychology: { name: 'Psychology', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)', isEnglish: false, examMax: 120 },
  economics: { name: 'Economics', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.3)', isEnglish: false, examMax: 90 }
};

// VCAA Graded Assessment Statistical Parameters (Mean & SD) per subject
const STATS = {
  english_lang: {
    ga1: { mean: 73.0, sd: 14.0, weight: 0.25 },
    ga2: { mean: 74.0, sd: 14.0, weight: 0.25 },
    ga3: { mean: 45.0, sd: 13.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.12 * z) : z
  },
  biology: {
    ga1: { mean: 71.0, sd: 15.0, weight: 0.20 },
    ga2: { mean: 72.0, sd: 15.0, weight: 0.30 },
    ga3: { mean: 65.0, sd: 24.0, weight: 0.50 },
    compositeSD: 0.86,
    adjustZ: (z) => z > 0 ? z * (1 + 0.11 * z) : z
  },
  chemistry: {
    ga1: { mean: 72.0, sd: 16.0, weight: 0.20 },
    ga2: { mean: 73.0, sd: 16.0, weight: 0.30 },
    ga3: { mean: 63.0, sd: 26.0, weight: 0.50 },
    compositeSD: 0.87,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  softdev: {
    ga1: { mean: 73.5, sd: 15.0, weight: 0.20 },
    ga2: { mean: 72.0, sd: 17.5, weight: 0.30 },
    ga3: { mean: 52.5, sd: 20.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  spec: {
    ga1: { mean: 75.0, sd: 16.0, weight: 0.20 },
    ga2: { mean: 74.0, sd: 17.0, weight: 0.20 },
    ga3: { mean: 65.0, sd: 25.0, weight: 0.60 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  english_main: {
    ga1: { mean: 72.0, sd: 14.0, weight: 0.25 },
    ga2: { mean: 73.0, sd: 14.0, weight: 0.25 },
    ga3: { mean: 33.0, sd: 10.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.12 * z) : z
  },
  legal: {
    ga1: { mean: 70.0, sd: 15.0, weight: 0.25 },
    ga2: { mean: 71.0, sd: 15.0, weight: 0.25 },
    ga3: { mean: 45.0, sd: 17.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  methods: {
    ga1: { mean: 74.0, sd: 16.0, weight: 0.34 },
    ga2: { mean: 22.0, sd: 9.0, weight: 0.22 },
    ga3: { mean: 44.0, sd: 18.0, weight: 0.44 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  general_math: {
    ga1: { mean: 74.0, sd: 15.0, weight: 0.20 },
    ga2: { mean: 73.0, sd: 15.0, weight: 0.20 },
    ga3: { mean: 65.0, sd: 24.0, weight: 0.60 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  physics: {
    ga1: { mean: 72.0, sd: 15.0, weight: 0.30 },
    ga2: { mean: 73.0, sd: 15.0, weight: 0.20 },
    ga3: { mean: 70.0, sd: 28.0, weight: 0.50 },
    compositeSD: 0.86,
    adjustZ: (z) => z > 0 ? z * (1 + 0.11 * z) : z
  },
  pe: {
    ga1: { mean: 70.0, sd: 14.0, weight: 0.25 },
    ga2: { mean: 71.0, sd: 14.0, weight: 0.25 },
    ga3: { mean: 62.0, sd: 22.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  data_analytics: {
    ga1: { mean: 73.0, sd: 14.0, weight: 0.30 },
    ga2: { mean: 72.0, sd: 16.0, weight: 0.30 },
    ga3: { mean: 55.0, sd: 18.0, weight: 0.40 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  accounting: {
    ga1: { mean: 71.0, sd: 16.0, weight: 0.25 },
    ga2: { mean: 72.0, sd: 16.0, weight: 0.25 },
    ga3: { mean: 54.0, sd: 20.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  french: {
    ga1: { mean: 37.0, sd: 7.0, weight: 0.25 },
    ga2: { mean: 38.0, sd: 7.0, weight: 0.25 },
    ga3: { mean: 72.0, sd: 18.0, weight: 0.50 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  chinese_sl: {
    ga1: { mean: 38.0, sd: 7.0, weight: 0.25 },
    ga2: { mean: 39.0, sd: 7.0, weight: 0.25 },
    ga3: { mean: 82.0, sd: 16.0, weight: 0.50 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  chinese_sla: {
    ga1: { mean: 38.0, sd: 6.5, weight: 0.25 },
    ga2: { mean: 39.0, sd: 6.5, weight: 0.25 },
    ga3: { mean: 80.0, sd: 17.0, weight: 0.50 },
    compositeSD: 0.88,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  algorithmics: {
    ga1: { mean: 72.0, sd: 15.0, weight: 0.30 },
    ga2: { mean: 73.0, sd: 15.0, weight: 0.20 },
    ga3: { mean: 55.0, sd: 20.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.133 * z) : z
  },
  history_rev: {
    ga1: { mean: 71.0, sd: 15.0, weight: 0.25 },
    ga2: { mean: 72.0, sd: 15.0, weight: 0.25 },
    ga3: { mean: 44.0, sd: 16.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  geography: {
    ga1: { mean: 70.0, sd: 15.0, weight: 0.25 },
    ga2: { mean: 71.0, sd: 15.0, weight: 0.25 },
    ga3: { mean: 43.0, sd: 15.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  global_politics: {
    ga1: { mean: 72.0, sd: 15.0, weight: 0.25 },
    ga2: { mean: 73.0, sd: 15.0, weight: 0.25 },
    ga3: { mean: 45.0, sd: 16.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  psychology: {
    ga1: { mean: 71.0, sd: 14.5, weight: 0.20 },
    ga2: { mean: 72.0, sd: 14.5, weight: 0.30 },
    ga3: { mean: 65.0, sd: 24.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  },
  economics: {
    ga1: { mean: 71.0, sd: 16.0, weight: 0.25 },
    ga2: { mean: 72.0, sd: 16.0, weight: 0.25 },
    ga3: { mean: 54.0, sd: 18.0, weight: 0.50 },
    compositeSD: 0.85,
    adjustZ: (z) => z > 0 ? z * (1 + 0.086 * z) : z
  }
};

// VCAA Graded Assessment Letter Grade Cutoffs (minimum scores)
const GRADE_BOUNDARIES = {
  ga1_standard: [
    { grade: 'A+', min: 90 }, { grade: 'A', min: 82 }, { grade: 'B+', min: 75 },
    { grade: 'B', min: 67 }, { grade: 'C+', min: 59 }, { grade: 'C', min: 50 },
    { grade: 'D+', min: 40 }, { grade: 'D', min: 30 }, { grade: 'E+', min: 20 },
    { grade: 'E', min: 10 }, { grade: 'UG', min: 0 }
  ],
  ga2_standard: [
    { grade: 'A+', min: 90 }, { grade: 'A', min: 82 }, { grade: 'B+', min: 75 },
    { grade: 'B', min: 67 }, { grade: 'C+', min: 59 }, { grade: 'C', min: 50 },
    { grade: 'D+', min: 40 }, { grade: 'D', min: 30 }, { grade: 'E+', min: 20 },
    { grade: 'E', min: 10 }, { grade: 'UG', min: 0 }
  ],
  lote_standard: [
    { grade: 'A+', min: 45 }, { grade: 'A', min: 41 }, { grade: 'B+', min: 37 },
    { grade: 'B', min: 33 }, { grade: 'C+', min: 29 }, { grade: 'C', min: 25 },
    { grade: 'D+', min: 20 }, { grade: 'D', min: 15 }, { grade: 'E+', min: 10 },
    { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
  ],
  methods: {
    ga1: [
      { grade: 'A+', min: 88 }, { grade: 'A', min: 81 }, { grade: 'B+', min: 74 },
      { grade: 'B', min: 66 }, { grade: 'C+', min: 58 }, { grade: 'C', min: 49 },
      { grade: 'D+', min: 39 }, { grade: 'D', min: 29 }, { grade: 'E+', min: 19 },
      { grade: 'E', min: 9 }, { grade: 'UG', min: 0 }
    ],
    ga2: [
      { grade: 'A+', min: 34 }, { grade: 'A', min: 29 }, { grade: 'B+', min: 24 },
      { grade: 'B', min: 19 }, { grade: 'C+', min: 15 }, { grade: 'C', min: 11 },
      { grade: 'D+', min: 8 }, { grade: 'D', min: 6 }, { grade: 'E+', min: 4 },
      { grade: 'E', min: 2 }, { grade: 'UG', min: 0 }
    ],
    ga3: [
      { grade: 'A+', min: 66 }, { grade: 'A', min: 56 }, { grade: 'B+', min: 46 },
      { grade: 'B', min: 37 }, { grade: 'C+', min: 29 }, { grade: 'C', min: 21 },
      { grade: 'D+', min: 14 }, { grade: 'D', min: 9 }, { grade: 'E+', min: 6 },
      { grade: 'E', min: 3 }, { grade: 'UG', min: 0 }
    ]
  },
  spec: {
    ga1: [
      { grade: 'A+', min: 89 }, { grade: 'A', min: 81 }, { grade: 'B+', min: 73 },
      { grade: 'B', min: 65 }, { grade: 'C+', min: 57 }, { grade: 'C', min: 48 },
      { grade: 'D+', min: 38 }, { grade: 'D', min: 28 }, { grade: 'E+', min: 18 },
      { grade: 'E', min: 9 }, { grade: 'UG', min: 0 }
    ],
    ga2: [
      { grade: 'A+', min: 90 }, { grade: 'A', min: 82 }, { grade: 'B+', min: 74 },
      { grade: 'B', min: 66 }, { grade: 'C+', min: 58 }, { grade: 'C', min: 49 },
      { grade: 'D+', min: 39 }, { grade: 'D', min: 29 }, { grade: 'E+', min: 19 },
      { grade: 'E', min: 9 }, { grade: 'UG', min: 0 }
    ],
    ga3: [
      { grade: 'A+', min: 102 }, { grade: 'A', min: 88 }, { grade: 'B+', min: 74 },
      { grade: 'B', min: 60 }, { grade: 'C+', min: 46 }, { grade: 'C', min: 34 },
      { grade: 'D+', min: 24 }, { grade: 'D', min: 16 }, { grade: 'E+', min: 10 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  english_lang: {
    ga3: [
      { grade: 'A+', min: 60 }, { grade: 'A', min: 54 }, { grade: 'B+', min: 48 },
      { grade: 'B', min: 42 }, { grade: 'C+', min: 36 }, { grade: 'C', min: 30 },
      { grade: 'D+', min: 24 }, { grade: 'D', min: 18 }, { grade: 'E+', min: 12 },
      { grade: 'E', min: 6 }, { grade: 'UG', min: 0 }
    ]
  },
  english_main: {
    ga3: [
      { grade: 'A+', min: 51 }, { grade: 'A', min: 45 }, { grade: 'B+', min: 40 },
      { grade: 'B', min: 35 }, { grade: 'C+', min: 30 }, { grade: 'C', min: 25 },
      { grade: 'D+', min: 20 }, { grade: 'D', min: 15 }, { grade: 'E+', min: 10 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  legal: {
    ga3: [
      { grade: 'A+', min: 68 }, { grade: 'A', min: 60 }, { grade: 'B+', min: 52 },
      { grade: 'B', min: 44 }, { grade: 'C+', min: 36 }, { grade: 'C', min: 28 },
      { grade: 'D+', min: 20 }, { grade: 'D', min: 14 }, { grade: 'E+', min: 9 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  softdev: {
    ga1: [
      { grade: 'A+', min: 91 }, { grade: 'A', min: 83 }, { grade: 'B+', min: 76 },
      { grade: 'B', min: 68 }, { grade: 'C+', min: 60 }, { grade: 'C', min: 51 },
      { grade: 'D+', min: 42 }, { grade: 'D', min: 32 }, { grade: 'E+', min: 22 },
      { grade: 'E', min: 12 }, { grade: 'UG', min: 0 }
    ],
    ga2: [
      { grade: 'A+', min: 93 }, { grade: 'A', min: 85 }, { grade: 'B+', min: 77 },
      { grade: 'B', min: 68 }, { grade: 'C+', min: 59 }, { grade: 'C', min: 49 },
      { grade: 'D+', min: 39 }, { grade: 'D', min: 29 }, { grade: 'E+', min: 19 },
      { grade: 'E', min: 10 }, { grade: 'UG', min: 0 }
    ],
    ga3: [
      { grade: 'A+', min: 84 }, { grade: 'A', min: 75 }, { grade: 'B+', min: 66 },
      { grade: 'B', min: 56 }, { grade: 'C+', min: 46 }, { grade: 'C', min: 37 },
      { grade: 'D+', min: 28 }, { grade: 'D', min: 20 }, { grade: 'E+', min: 13 },
      { grade: 'E', min: 7 }, { grade: 'UG', min: 0 }
    ]
  },
  data_analytics: {
    ga2: [
      { grade: 'A+', min: 92 }, { grade: 'A', min: 84 }, { grade: 'B+', min: 76 },
      { grade: 'B', min: 67 }, { grade: 'C+', min: 58 }, { grade: 'C', min: 48 },
      { grade: 'D+', min: 38 }, { grade: 'D', min: 28 }, { grade: 'E+', min: 18 },
      { grade: 'E', min: 9 }, { grade: 'UG', min: 0 }
    ],
    ga3: [
      { grade: 'A+', min: 80 }, { grade: 'A', min: 70 }, { grade: 'B+', min: 60 },
      { grade: 'B', min: 50 }, { grade: 'C+', min: 40 }, { grade: 'C', min: 30 },
      { grade: 'D+', min: 22 }, { grade: 'D', min: 15 }, { grade: 'E+', min: 10 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  physics: {
    ga3: [
      { grade: 'A+', min: 108 }, { grade: 'A', min: 95 }, { grade: 'B+', min: 82 },
      { grade: 'B', min: 68 }, { grade: 'C+', min: 54 }, { grade: 'C', min: 41 },
      { grade: 'D+', min: 29 }, { grade: 'D', min: 19 }, { grade: 'E+', min: 12 },
      { grade: 'E', min: 6 }, { grade: 'UG', min: 0 }
    ]
  },
  accounting: {
    ga3: [
      { grade: 'A+', min: 88 }, { grade: 'A', min: 78 }, { grade: 'B+', min: 68 },
      { grade: 'B', min: 58 }, { grade: 'C+', min: 48 }, { grade: 'C', min: 38 },
      { grade: 'D+', min: 28 }, { grade: 'D', min: 18 }, { grade: 'E+', min: 10 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  lote: {
    ga3: [
      { grade: 'A+', min: 98 }, { grade: 'A', min: 88 }, { grade: 'B+', min: 78 },
      { grade: 'B', min: 68 }, { grade: 'C+', min: 58 }, { grade: 'C', min: 48 },
      { grade: 'D+', min: 36 }, { grade: 'D', min: 25 }, { grade: 'E+', min: 15 },
      { grade: 'E', min: 8 }, { grade: 'UG', min: 0 }
    ]
  },
  geography: {
    ga3: [
      { grade: 'A+', min: 66 }, { grade: 'A', min: 58 }, { grade: 'B+', min: 50 },
      { grade: 'B', min: 42 }, { grade: 'C+', min: 34 }, { grade: 'C', min: 26 },
      { grade: 'D+', min: 18 }, { grade: 'D', min: 12 }, { grade: 'E+', min: 8 },
      { grade: 'E', min: 4 }, { grade: 'UG', min: 0 }
    ]
  },
  global_politics: {
    ga3: [
      { grade: 'A+', min: 70 }, { grade: 'A', min: 62 }, { grade: 'B+', min: 54 },
      { grade: 'B', min: 46 }, { grade: 'C+', min: 38 }, { grade: 'C', min: 30 },
      { grade: 'D+', min: 22 }, { grade: 'D', min: 15 }, { grade: 'E+', min: 10 },
      { grade: 'E', min: 5 }, { grade: 'UG', min: 0 }
    ]
  },
  economics: {
    ga3: [
      { grade: 'A+', min: 77 }, { grade: 'A', min: 69 }, { grade: 'B+', min: 61 },
      { grade: 'B', min: 52 }, { grade: 'C+', min: 43 }, { grade: 'C', min: 34 },
      { grade: 'D+', min: 25 }, { grade: 'D', min: 17 }, { grade: 'E+', min: 11 },
      { grade: 'E', min: 6 }, { grade: 'UG', min: 0 }
    ]
  },
  biology: {
    ga3: [
      { grade: 'A+', min: 96 }, { grade: 'A', min: 84 }, { grade: 'B+', min: 72 },
      { grade: 'B', min: 60 }, { grade: 'C+', min: 48 }, { grade: 'C', min: 36 },
      { grade: 'D+', min: 26 }, { grade: 'D', min: 18 }, { grade: 'E+', min: 12 },
      { grade: 'E', min: 6 }, { grade: 'UG', min: 0 }
    ]
  }
};

// Dual-Year (2024 and 2025) Study Score Scaling Maps
const SCALING_MAPS = {
  2024: {
    english_lang: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 33 }, { raw: 35, scaled: 38 },
      { raw: 40, scaled: 43 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ],
    biology: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 31 }, { raw: 35, scaled: 36 },
      { raw: 40, scaled: 41 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ],
    chemistry: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 10 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 34 }, { raw: 35, scaled: 39 },
      { raw: 40, scaled: 44 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    softdev: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    spec: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 13 }, { raw: 15, scaled: 20 },
      { raw: 20, scaled: 28 }, { raw: 25, scaled: 36 }, { raw: 30, scaled: 43 },
      { raw: 35, scaled: 48 }, { raw: 40, scaled: 51 }, { raw: 45, scaled: 53 },
      { raw: 50, scaled: 55 }
    ],
    english_main: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    legal: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 40 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    methods: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 35 }, { raw: 35, scaled: 41 },
      { raw: 40, scaled: 46 }, { raw: 45, scaled: 48 }, { raw: 50, scaled: 50 }
    ],
    general_math: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    physics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 34 }, { raw: 35, scaled: 40 },
      { raw: 40, scaled: 44 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    pe: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 7 }, { raw: 20, scaled: 17 },
      { raw: 25, scaled: 22 }, { raw: 30, scaled: 27 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    data_analytics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 7 }, { raw: 20, scaled: 16 },
      { raw: 25, scaled: 21 }, { raw: 30, scaled: 26 }, { raw: 35, scaled: 32 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    accounting: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 31 }, { raw: 35, scaled: 36 },
      { raw: 40, scaled: 41 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ],
    french: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 15 }, { raw: 20, scaled: 30 },
      { raw: 25, scaled: 36 }, { raw: 30, scaled: 41 }, { raw: 35, scaled: 45 },
      { raw: 40, scaled: 49 }, { raw: 45, scaled: 51 }, { raw: 50, scaled: 53 }
    ],
    chinese_sl: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 14 }, { raw: 20, scaled: 29 },
      { raw: 25, scaled: 35 }, { raw: 30, scaled: 41 }, { raw: 35, scaled: 45 },
      { raw: 40, scaled: 49 }, { raw: 45, scaled: 52 }, { raw: 50, scaled: 54 }
    ],
    chinese_sla: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 12 }, { raw: 20, scaled: 25 },
      { raw: 25, scaled: 31 }, { raw: 30, scaled: 37 }, { raw: 35, scaled: 43 },
      { raw: 40, scaled: 47 }, { raw: 45, scaled: 51 }, { raw: 50, scaled: 53 }
    ],
    algorithmics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 26 },
      { raw: 25, scaled: 32 }, { raw: 30, scaled: 38 }, { raw: 35, scaled: 43 },
      { raw: 40, scaled: 47 }, { raw: 45, scaled: 49 }, { raw: 50, scaled: 50 }
    ],
    history_rev: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    geography: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    global_politics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 10 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 27 }, { raw: 30, scaled: 33 }, { raw: 35, scaled: 38 },
      { raw: 40, scaled: 42 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    psychology: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    economics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 10 }, { raw: 20, scaled: 21 },
      { raw: 25, scaled: 26 }, { raw: 30, scaled: 32 }, { raw: 35, scaled: 37 },
      { raw: 40, scaled: 42 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ]
  },
  2025: {
    english_lang: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 33 }, { raw: 35, scaled: 38 },
      { raw: 40, scaled: 43 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    biology: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 31 }, { raw: 35, scaled: 36 },
      { raw: 40, scaled: 41 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ],
    chemistry: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 10 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 34 }, { raw: 35, scaled: 39 },
      { raw: 40, scaled: 44 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    softdev: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    spec: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 13 }, { raw: 15, scaled: 20 },
      { raw: 20, scaled: 28 }, { raw: 25, scaled: 36 }, { raw: 30, scaled: 43 },
      { raw: 35, scaled: 48 }, { raw: 40, scaled: 51 }, { raw: 45, scaled: 54 },
      { raw: 50, scaled: 55 }
    ],
    english_main: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    legal: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 40 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    methods: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 35 }, { raw: 35, scaled: 41 },
      { raw: 40, scaled: 46 }, { raw: 45, scaled: 49 }, { raw: 50, scaled: 50 }
    ],
    general_math: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    physics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 28 }, { raw: 30, scaled: 34 }, { raw: 35, scaled: 40 },
      { raw: 40, scaled: 45 }, { raw: 45, scaled: 48 }, { raw: 50, scaled: 50 }
    ],
    pe: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 7 }, { raw: 20, scaled: 17 },
      { raw: 25, scaled: 22 }, { raw: 30, scaled: 27 }, { raw: 35, scaled: 33 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    data_analytics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 7 }, { raw: 20, scaled: 16 },
      { raw: 25, scaled: 21 }, { raw: 30, scaled: 26 }, { raw: 35, scaled: 32 },
      { raw: 40, scaled: 38 }, { raw: 45, scaled: 44 }, { raw: 50, scaled: 50 }
    ],
    accounting: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 31 }, { raw: 35, scaled: 36 },
      { raw: 40, scaled: 41 }, { raw: 45, scaled: 46 }, { raw: 50, scaled: 50 }
    ],
    french: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 15 }, { raw: 20, scaled: 30 },
      { raw: 25, scaled: 36 }, { raw: 30, scaled: 41 }, { raw: 35, scaled: 45 },
      { raw: 40, scaled: 49 }, { raw: 45, scaled: 51 }, { raw: 50, scaled: 53 }
    ],
    chinese_sl: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 14 }, { raw: 20, scaled: 29 },
      { raw: 25, scaled: 35 }, { raw: 30, scaled: 41 }, { raw: 35, scaled: 45 },
      { raw: 40, scaled: 49 }, { raw: 45, scaled: 52 }, { raw: 50, scaled: 54 }
    ],
    chinese_sla: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 12 }, { raw: 20, scaled: 25 },
      { raw: 25, scaled: 31 }, { raw: 30, scaled: 37 }, { raw: 35, scaled: 43 },
      { raw: 40, scaled: 47 }, { raw: 45, scaled: 51 }, { raw: 50, scaled: 53 }
    ],
    algorithmics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 11 }, { raw: 20, scaled: 26 },
      { raw: 25, scaled: 32 }, { raw: 30, scaled: 38 }, { raw: 35, scaled: 43 },
      { raw: 40, scaled: 47 }, { raw: 45, scaled: 50 }, { raw: 50, scaled: 51 }
    ],
    history_rev: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 29 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 40 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    geography: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    global_politics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 10 }, { raw: 20, scaled: 22 },
      { raw: 25, scaled: 27 }, { raw: 30, scaled: 33 }, { raw: 35, scaled: 38 },
      { raw: 40, scaled: 42 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ],
    psychology: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 8 }, { raw: 20, scaled: 18 },
      { raw: 25, scaled: 23 }, { raw: 30, scaled: 28 }, { raw: 35, scaled: 34 },
      { raw: 40, scaled: 39 }, { raw: 45, scaled: 45 }, { raw: 50, scaled: 50 }
    ],
    economics: [
      { raw: 0, scaled: 0 }, { raw: 10, scaled: 9 }, { raw: 20, scaled: 19 },
      { raw: 25, scaled: 25 }, { raw: 30, scaled: 32 }, { raw: 35, scaled: 37 },
      { raw: 40, scaled: 42 }, { raw: 45, scaled: 47 }, { raw: 50, scaled: 50 }
    ]
  }
};

// 2024 VTAC Aggregate to ATAR Conversion Table
const ATAR_MAP_2024 = [
  { aggregate: 0.00, atar: 0.00 },
  { aggregate: 65.62, atar: 30.00 },
  { aggregate: 79.51, atar: 40.00 },
  { aggregate: 93.66, atar: 50.00 },
  { aggregate: 106.90, atar: 60.00 },
  { aggregate: 120.37, atar: 70.00 },
  { aggregate: 135.55, atar: 80.00 },
  { aggregate: 154.85, atar: 90.00 },
  { aggregate: 169.54, atar: 95.00 },
  { aggregate: 192.35, atar: 99.00 },
  { aggregate: 211.60, atar: 99.95 }
];

// 2025 VTAC Aggregate to ATAR Conversion Table
const ATAR_MAP_2025 = [
  { aggregate: 0.00, atar: 0.00 },
  { aggregate: 65.93, atar: 30.00 },
  { aggregate: 80.53, atar: 40.00 },
  { aggregate: 94.06, atar: 50.00 },
  { aggregate: 107.03, atar: 60.00 },
  { aggregate: 125.86, atar: 70.00 },
  { aggregate: 139.75, atar: 80.00 },
  { aggregate: 158.33, atar: 90.00 },
  { aggregate: 171.74, atar: 95.00 },
  { aggregate: 192.10, atar: 99.00 },
  { aggregate: 211.42, atar: 99.95 }
];

export default function AtarCalculator() {
  // Navigation & configuration phase
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(['english_main', 'methods', 'spec', 'chemistry', 'physics']);
  const [cohortStrength, setCohortStrength] = useState('average');
  const [activeTab, setActiveTab] = useState('english_main');

  // Multi-Year Selections
  const [subjectYears, setSubjectYears] = useState({
    english_lang: '2025', biology: '2025', chemistry: '2025', softdev: '2025',
    spec: '2025', english_main: '2025', legal: '2025', methods: '2025',
    general_math: '2025', physics: '2025', pe: '2025', data_analytics: '2025',
    accounting: '2025', french: '2025', chinese_sl: '2025', chinese_sla: '2025',
    algorithmics: '2025', history_rev: '2025', geography: '2025',
    global_politics: '2025', psychology: '2025', economics: '2025'
  });
  const [atarYear, setAtarYear] = useState('2025');

  // Input states for all 22 subjects
  const [subjects, setSubjects] = useState({
    english_lang: { sacU3: 75, sacU4: 75, examScore: 48 },
    biology: { sacU3: 75, sacU4: 75, examScore: 75 },
    chemistry: { sacU3: 75, sacU4: 75, examScore: 75 },
    softdev: { sacU3O1: 75, sacU4O2: 75, satScore: 75, examScore: 75 },
    spec: { sacU3: 75, sacU4: 75, exam1: 25, exam2: 50 },
    english_main: { sacU3: 75, sacU4: 75, examScore: 45 },
    legal: { sacU3: 75, sacU4: 75, examScore: 50 },
    methods: { sacScore: 75, exam1: 25, exam2: 50 },
    general_math: { sacU3: 75, sacU4: 75, exam1: 25, exam2: 50 },
    physics: { sacU3: 75, sacU4: 75, examScore: 75 },
    pe: { sacU3: 75, sacU4: 75, examScore: 75 },
    data_analytics: { sacU3: 75, sacU4: 75, satScore: 75, examScore: 70 },
    accounting: { sacU3: 75, sacU4: 75, examScore: 70 },
    french: { sacU3: 38, sacU4: 38, examOral: 30, examWritten: 55 },
    chinese_sl: { sacU3: 38, sacU4: 38, examOral: 32, examWritten: 60 },
    chinese_sla: { sacU3: 38, sacU4: 38, examOral: 31, examWritten: 58 },
    algorithmics: { sacU3: 75, sacU4: 75, satScore: 75, examScore: 70 },
    history_rev: { sacU3: 75, sacU4: 75, examScore: 50 },
    geography: { sacU3: 75, sacU4: 75, examScore: 50 },
    global_politics: { sacU3: 75, sacU4: 75, examScore: 50 },
    psychology: { sacU3: 75, sacU4: 75, examScore: 75 },
    economics: { sacU3: 75, sacU4: 75, examScore: 55 }
  });

  const getLetterGrade = (score, subjectId, gaKey) => {
    let boundaries = GRADE_BOUNDARIES.ga1_standard;
    if (subjectId === 'french' || subjectId === 'chinese_sl' || subjectId === 'chinese_sla') {
      if (gaKey === 'ga1' || gaKey === 'ga2') boundaries = GRADE_BOUNDARIES.lote_standard;
      else boundaries = GRADE_BOUNDARIES.lote.ga3;
    } else if (subjectId === 'methods') {
      boundaries = GRADE_BOUNDARIES.methods[gaKey];
    } else if (subjectId === 'spec') {
      boundaries = GRADE_BOUNDARIES.spec[gaKey];
    } else if (gaKey === 'ga3') {
      if (subjectId === 'english_lang') boundaries = GRADE_BOUNDARIES.english_lang.ga3;
      else if (subjectId === 'english_main') boundaries = GRADE_BOUNDARIES.english_main.ga3;
      else if (subjectId === 'legal') boundaries = GRADE_BOUNDARIES.legal.ga3;
      else if (subjectId === 'physics') boundaries = GRADE_BOUNDARIES.physics.ga3;
      else if (subjectId === 'accounting') boundaries = GRADE_BOUNDARIES.accounting.ga3;
      else if (subjectId === 'data_analytics' || subjectId === 'softdev' || subjectId === 'algorithmics') boundaries = GRADE_BOUNDARIES.softdev.ga3;
      else if (subjectId === 'economics') boundaries = GRADE_BOUNDARIES.economics.ga3;
      else if (subjectId === 'geography') boundaries = GRADE_BOUNDARIES.geography.ga3;
      else if (subjectId === 'global_politics') boundaries = GRADE_BOUNDARIES.global_politics.ga3;
      else if (subjectId === 'history_rev') boundaries = GRADE_BOUNDARIES.legal.ga3;
      else if (subjectId === 'psychology' || subjectId === 'biology' || subjectId === 'chemistry' || subjectId === 'pe') boundaries = GRADE_BOUNDARIES.biology.ga3;
      else if (subjectId === 'general_math') boundaries = GRADE_BOUNDARIES.spec.ga3;
    } else if (gaKey === 'ga2') {
      if (subjectId === 'softdev' || subjectId === 'data_analytics' || subjectId === 'algorithmics') boundaries = GRADE_BOUNDARIES.softdev.ga2;
    } else if (gaKey === 'ga1') {
      if (subjectId === 'softdev' || subjectId === 'data_analytics' || subjectId === 'algorithmics') boundaries = GRADE_BOUNDARIES.softdev.ga1;
    }

    for (let boundary of boundaries) {
      if (score >= boundary.min) return boundary.grade;
    }
    return 'UG';
  };

  const getScaledScore = (raw, subjectId, year) => {
    const scalingMap = SCALING_MAPS[year][subjectId];
    if (raw <= 0) return 0;
    if (raw >= 50) return scalingMap[scalingMap.length - 1].scaled;

    for (let i = 0; i < scalingMap.length - 1; i++) {
      const p1 = scalingMap[i];
      const p2 = scalingMap[i + 1];
      if (raw >= p1.raw && raw <= p2.raw) {
        const fraction = (raw - p1.raw) / (p2.raw - p1.raw);
        const scaledVal = p1.scaled + fraction * (p2.scaled - p1.scaled);
        return Math.round(scaledVal * 10) / 10;
      }
    }
    return raw;
  };

  const handleInputChange = (subjectId, fieldKey, value, max) => {
    if (value === '') {
      setSubjects(prev => ({
        ...prev,
        [subjectId]: { ...prev[subjectId], [fieldKey]: '' }
      }));
      return;
    }
    const num = Number(value);
    if (isNaN(num)) return;
    const clamped = Math.max(0, Math.min(max, num));
    setSubjects(prev => ({
      ...prev,
      [subjectId]: { ...prev[subjectId], [fieldKey]: clamped }
    }));
  };

  const handleSubjectCheckboxToggle = (id) => {
    setSelectedSubjectIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubjectYearChange = (subjectId, year) => {
    setSubjectYears(prev => ({
      ...prev,
      [subjectId]: year
    }));
  };

  // Run calculation logic for all 22 subjects
  const calculatedResults = useMemo(() => {
    const sacModifier = cohortStrength === 'strong' ? 6 : cohortStrength === 'weak' ? -6 : 0;
    const results = {};

    Object.keys(SUBJECT_METADATA).forEach((subjectId) => {
      const meta = STATS[subjectId];
      const values = subjects[subjectId];
      const selectedYear = subjectYears[subjectId];
      let ga1Score = 0;
      let ga2Score = 0;
      let ga3Score = 0;

      if (subjectId === 'methods') {
        ga1Score = Math.max(0, Math.min(100, Number(values.sacScore || 0) + sacModifier));
        ga2Score = Number(values.exam1 || 0);
        ga3Score = Number(values.exam2 || 0);
      } else if (subjectId === 'spec' || subjectId === 'general_math') {
        ga1Score = Math.max(0, Math.min(100, Number(values.sacU3 || 0) + sacModifier));
        ga2Score = Math.max(0, Math.min(100, Number(values.sacU4 || 0) + sacModifier));
        ga3Score = Math.max(0, Math.min(120, Number(values.exam1 || 0) + Number(values.exam2 || 0)));
      } else if (subjectId === 'softdev') {
        const rawGa1 = (Number(values.sacU3O1 || 0) + Number(values.sacU4O2 || 0)) / 2;
        ga1Score = Math.max(0, Math.min(100, rawGa1 + sacModifier));
        ga2Score = Number(values.satScore || 0);
        ga3Score = Number(values.examScore || 0);
      } else if (subjectId === 'data_analytics' || subjectId === 'algorithmics') {
        const rawGa1 = (Number(values.sacU3 || 0) + Number(values.sacU4 || 0)) / 2;
        ga1Score = Math.max(0, Math.min(100, rawGa1 + sacModifier));
        ga2Score = Number(values.satScore || 0);
        ga3Score = Number(values.examScore || 0);
      } else if (subjectId === 'french' || subjectId === 'chinese_sl' || subjectId === 'chinese_sla') {
        ga1Score = Math.max(0, Math.min(50, Number(values.sacU3 || 0) + sacModifier * 0.5));
        ga2Score = Math.max(0, Math.min(50, Number(values.sacU4 || 0) + sacModifier * 0.5));
        ga3Score = Math.max(0, Math.min(115, Number(values.examOral || 0) + Number(values.examWritten || 0)));
      } else {
        ga1Score = Math.max(0, Math.min(100, Number(values.sacU3 || 0) + sacModifier));
        ga2Score = Math.max(0, Math.min(100, Number(values.sacU4 || 0) + sacModifier));
        ga3Score = Number(values.examScore || 0);
      }

      // Z-scores
      const z1 = (ga1Score - meta.ga1.mean) / meta.ga1.sd;
      const z2 = (ga2Score - meta.ga2.mean) / meta.ga2.sd;
      const z3 = (ga3Score - meta.ga3.mean) / meta.ga3.sd;

      const weightedZ = meta.ga1.weight * z1 + meta.ga2.weight * z2 + meta.ga3.weight * z3;
      const finalZ = meta.adjustZ(weightedZ / meta.compositeSD);

      const rawScore = Math.max(0, Math.min(50, Math.round(30 + 7 * finalZ)));
      const scaledScore = getScaledScore(rawScore, subjectId, selectedYear);

      results[subjectId] = {
        rawScore,
        scaledScore,
        ga1Score, ga2Score, ga3Score,
        grades: {
          ga1: getLetterGrade(ga1Score, subjectId, 'ga1'),
          ga2: getLetterGrade(ga2Score, subjectId, 'ga2'),
          ga3: getLetterGrade(ga3Score, subjectId, 'ga3')
        }
      };
    });

    return results;
  }, [subjects, cohortStrength, subjectYears]);

  // Aggregate and ATAR Calculation Rules
  const atarDetails = useMemo(() => {
    const selectedEnglishIds = selectedSubjectIds.filter(id => SUBJECT_METADATA[id].isEnglish);
    const selectedOtherIds = selectedSubjectIds.filter(id => !SUBJECT_METADATA[id].isEnglish);

    let primaryEnglish = null;
    let pool = [];

    if (selectedEnglishIds.length > 0) {
      const sortedEnglish = selectedEnglishIds.map(id => ({
        id,
        name: SUBJECT_METADATA[id].name,
        scaled: calculatedResults[id].scaledScore
      })).sort((a, b) => b.scaled - a.scaled);

      primaryEnglish = sortedEnglish[0];
      
      for (let i = 1; i < sortedEnglish.length; i++) {
        pool.push(sortedEnglish[i]);
      }
    }

    selectedOtherIds.forEach(id => {
      pool.push({
        id,
        name: SUBJECT_METADATA[id].name,
        scaled: calculatedResults[id].scaledScore
      });
    });

    pool.sort((a, b) => b.scaled - a.scaled);

    const primaryFour = [];
    if (primaryEnglish) {
      primaryFour.push({ ...primaryEnglish, weight: 1.0, isPrimaryEnglish: true });
    }

    const requiredOthersCount = primaryEnglish ? 3 : 4;
    const othersForPrimary = pool.slice(0, requiredOthersCount);
    othersForPrimary.forEach(item => {
      primaryFour.push({ ...item, weight: 1.0, isPrimaryEnglish: false });
    });

    const increments = pool.slice(requiredOthersCount).map(item => ({
      ...item,
      weight: 0.1
    }));

    const primarySum = primaryFour.reduce((sum, item) => sum + item.scaled, 0);
    const incrementSum = increments.reduce((sum, item) => sum + item.scaled * 0.1, 0);
    const totalAggregate = Math.round((primarySum + incrementSum) * 100) / 100;

    // Linear interpolation based on selected global ATAR Year
    let estimatedAtar = '0.00';
    const atarMap = atarYear === '2024' ? ATAR_MAP_2024 : ATAR_MAP_2025;
    const maxAgg = atarYear === '2024' ? 211.60 : 211.42;

    if (totalAggregate > 0) {
      if (totalAggregate >= maxAgg) {
        estimatedAtar = '99.95';
      } else {
        for (let i = 0; i < atarMap.length - 1; i++) {
          const p1 = atarMap[i];
          const p2 = atarMap[i + 1];
          if (totalAggregate >= p1.aggregate && totalAggregate <= p2.aggregate) {
            const fraction = (totalAggregate - p1.aggregate) / (p2.aggregate - p1.aggregate);
            const atarVal = p1.atar + fraction * (p2.atar - p1.atar);
            const rounded = Math.round(atarVal * 20) / 20;
            estimatedAtar = Math.max(30.00, rounded).toFixed(2);
            break;
          }
        }
      }
    }

    const hasEnglish = selectedEnglishIds.length > 0;

    return {
      primaryFour,
      increments,
      totalAggregate,
      estimatedAtar,
      hasEnglish
    };
  }, [calculatedResults, selectedSubjectIds, atarYear]);

  const handleGenerateDashboard = () => {
    if (selectedSubjectIds.length >= 5 && selectedSubjectIds.length <= 6) {
      setActiveTab(selectedSubjectIds[0]);
      setIsConfiguring(false);
    }
  };

  const isSelectionInvalid = selectedSubjectIds.length < 5 || selectedSubjectIds.length > 6;
  const hasSelectedEnglish = selectedSubjectIds.some(id => SUBJECT_METADATA[id].isEnglish);

  if (isConfiguring) {
    return (
      <div className="atar-calculator-app">
        <div className="glass-container selector-view">
          <header className="selector-header">
            <h1 className="app-title">Select VCE Subjects</h1>
            <p className="app-subtitle">Choose exactly 5 or 6 subjects from the list below to proceed.</p>
          </header>

          <div className="subject-selection-grid">
            {Object.keys(SUBJECT_METADATA).map((id) => {
              const meta = SUBJECT_METADATA[id];
              const isChecked = selectedSubjectIds.includes(id);
              return (
                <div
                  key={id}
                  onClick={() => handleSubjectCheckboxToggle(id)}
                  className={`subject-select-card ${isChecked ? 'selected' : ''}`}
                  style={{
                    '--subject-color': meta.color,
                    '--subject-glow': meta.glow
                  }}
                >
                  <div className="checkbox-ring">
                    {isChecked && <div className="checkbox-dot" style={{ backgroundColor: meta.color }}></div>}
                  </div>
                  <div className="subject-info">
                    <span className="subject-select-name">{meta.name}</span>
                    {meta.isEnglish && <span className="english-tag">English Group</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="selector-validation-bar">
            <div className="selection-status">
              <span className={`status-pill ${isSelectionInvalid ? 'invalid' : 'valid'}`}>
                {selectedSubjectIds.length} / 6 Subjects Selected
              </span>
              {!hasSelectedEnglish && (
                <span className="warning-text">
                  ⚠️ Note: At least one English study is required to receive an official ATAR.
                </span>
              )}
            </div>
            
            <button
              disabled={isSelectionInvalid}
              onClick={handleGenerateDashboard}
              className={`generate-dashboard-btn ${isSelectionInvalid ? 'disabled' : ''}`}
            >
              Generate ATAR Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Calculator Dashboard View
  return (
    <div className="atar-calculator-app">
      <div className="glass-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-text-container">
            <button className="change-subjects-back-btn" onClick={() => setIsConfiguring(true)}>
              ← Adjust Selected Subjects
            </button>
            <h1 className="app-title" style={{ marginTop: '10px' }}>VCE Study Score & ATAR Estimator</h1>
            <p className="app-subtitle">Powered by VCAA Graded Assessments & VTAC Historical Datasets</p>
          </div>
          
          <div className="cohort-selector-container">
            <label htmlFor="cohort-select">Cohort Moderation (SAC Offset)</label>
            <select
              id="cohort-select"
              value={cohortStrength}
              onChange={(e) => setCohortStrength(e.target.value)}
              className="cohort-select-input"
            >
              <option value="strong">Strong Cohort (+6 SAC Offset)</option>
              <option value="average">Average Cohort (State Normal)</option>
              <option value="weak">Weak Cohort (-6 SAC Offset)</option>
            </select>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* Left Panel: Subject Tabs & Input Fields */}
          <section className="subject-section glass-panel">
            <div className="tabs-nav-bar">
              {selectedSubjectIds.map((id) => {
                const meta = SUBJECT_METADATA[id];
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`tab-btn ${activeTab === id ? 'active' : ''}`}
                    style={{
                      '--accent-color': meta.color,
                      '--accent-glow': meta.glow
                    }}
                  >
                    {meta.name}
                  </button>
                );
              })}
            </div>

            <div className="tab-pane-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h2 className="subject-panel-title" style={{ color: SUBJECT_METADATA[activeTab].color, margin: 0 }}>
                    {SUBJECT_METADATA[activeTab].name} Inputs
                  </h2>
                  <p className="subject-panel-desc" style={{ margin: '4px 0 0 0' }}>
                    Adjust scores to calculate the raw study score and scaled VTAC score.
                  </p>
                </div>
                
                {/* Year Selector Dropdown on each subject panel */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="subject-year-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Data Year:</label>
                  <select
                    id="subject-year-select"
                    value={subjectYears[activeTab]}
                    onChange={(e) => handleSubjectYearChange(activeTab, e.target.value)}
                    className="cohort-select-input"
                    style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="2025">2025 Scaling</option>
                    <option value="2024">2024 Scaling</option>
                  </select>
                </div>
              </div>

              <div className="subject-inputs-layout">
                <div className="inputs-column">
                  
                  {/* 1. Mathematical Methods */}
                  {activeTab === 'methods' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="methods-sac">Unit 3 & 4 SAC Score (Out of 100)</label>
                        <input
                          id="methods-sac"
                          type="number"
                          value={subjects.methods.sacScore}
                          onChange={(e) => handleInputChange('methods', 'sacScore', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="methods-exam1">Exam 1 (Tech-Free) (Out of 40)</label>
                        <input
                          id="methods-exam1"
                          type="number"
                          value={subjects.methods.exam1}
                          onChange={(e) => handleInputChange('methods', 'exam1', e.target.value, 40)}
                          placeholder="0-40"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="methods-exam2">Exam 2 (Tech-Active) (Out of 80)</label>
                        <input
                          id="methods-exam2"
                          type="number"
                          value={subjects.methods.exam2}
                          onChange={(e) => handleInputChange('methods', 'exam2', e.target.value, 80)}
                          placeholder="0-80"
                        />
                      </div>
                    </>
                  )}

                  {/* 2. Specialist Maths or General Maths */}
                  {(activeTab === 'spec' || activeTab === 'general_math') && (
                    <>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac3`}>Unit 3 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac3`}
                          type="number"
                          value={subjects[activeTab].sacU3}
                          onChange={(e) => handleInputChange(activeTab, 'sacU3', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac4`}>Unit 4 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac4`}
                          type="number"
                          value={subjects[activeTab].sacU4}
                          onChange={(e) => handleInputChange(activeTab, 'sacU4', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-exam1`}>Exam 1 (Technology-Free) (Out of 40)</label>
                        <input
                          id={`${activeTab}-exam1`}
                          type="number"
                          value={subjects[activeTab].exam1}
                          onChange={(e) => handleInputChange(activeTab, 'exam1', e.target.value, 40)}
                          placeholder="0-40"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-exam2`}>Exam 2 (CAS-Active) (Out of 80)</label>
                        <input
                          id={`${activeTab}-exam2`}
                          type="number"
                          value={subjects[activeTab].exam2}
                          onChange={(e) => handleInputChange(activeTab, 'exam2', e.target.value, 80)}
                          placeholder="0-80"
                        />
                      </div>
                    </>
                  )}

                  {/* 3. Software Development */}
                  {activeTab === 'softdev' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="sd-sac3">Unit 3 Outcome 1 SAC Score (%)</label>
                        <input
                          id="sd-sac3"
                          type="number"
                          value={subjects.softdev.sacU3O1}
                          onChange={(e) => handleInputChange('softdev', 'sacU3O1', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sd-sac4">Unit 4 Outcome 2 SAC Score (%)</label>
                        <input
                          id="sd-sac4"
                          type="number"
                          value={subjects.softdev.sacU4O2}
                          onChange={(e) => handleInputChange('softdev', 'sacU4O2', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sd-sat">School-Assessed Task (SAT) Score (Out of 100)</label>
                        <input
                          id="sd-sat"
                          type="number"
                          value={subjects.softdev.satScore}
                          onChange={(e) => handleInputChange('softdev', 'satScore', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sd-exam">Written Exam Score (Out of 100)</label>
                        <input
                          id="sd-exam"
                          type="number"
                          value={subjects.softdev.examScore}
                          onChange={(e) => handleInputChange('softdev', 'examScore', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                    </>
                  )}

                  {/* 4. Data Analytics or Algorithmics */}
                  {(activeTab === 'data_analytics' || activeTab === 'algorithmics') && (
                    <>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac3`}>Unit 3 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac3`}
                          type="number"
                          value={subjects[activeTab].sacU3}
                          onChange={(e) => handleInputChange(activeTab, 'sacU3', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac4`}>Unit 4 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac4`}
                          type="number"
                          value={subjects[activeTab].sacU4}
                          onChange={(e) => handleInputChange(activeTab, 'sacU4', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sat`}>School-Assessed Task (SAT) (Out of 100)</label>
                        <input
                          id={`${activeTab}-sat`}
                          type="number"
                          value={subjects[activeTab].satScore}
                          onChange={(e) => handleInputChange(activeTab, 'satScore', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-exam`}>Written Exam Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-exam`}
                          type="number"
                          value={subjects[activeTab].examScore}
                          onChange={(e) => handleInputChange(activeTab, 'examScore', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                    </>
                  )}

                  {/* 5. French, Chinese Second Language, or Chinese Second Language Advanced */}
                  {(activeTab === 'french' || activeTab === 'chinese_sl' || activeTab === 'chinese_sla') && (
                    <>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac3`}>Unit 3 Coursework SAC (Out of 50)</label>
                        <input
                          id={`${activeTab}-sac3`}
                          type="number"
                          value={subjects[activeTab].sacU3}
                          onChange={(e) => handleInputChange(activeTab, 'sacU3', e.target.value, 50)}
                          placeholder="0-50"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac4`}>Unit 4 Coursework SAC (Out of 50)</label>
                        <input
                          id={`${activeTab}-sac4`}
                          type="number"
                          value={subjects[activeTab].sacU4}
                          onChange={(e) => handleInputChange(activeTab, 'sacU4', e.target.value, 50)}
                          placeholder="0-50"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-oral`}>External Oral Examination (Out of 40)</label>
                        <input
                          id={`${activeTab}-oral`}
                          type="number"
                          value={subjects[activeTab].examOral}
                          onChange={(e) => handleInputChange(activeTab, 'examOral', e.target.value, 40)}
                          placeholder="0-40"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-written`}>External Written Examination (Out of 75)</label>
                        <input
                          id={`${activeTab}-written`}
                          type="number"
                          value={subjects[activeTab].examWritten}
                          onChange={(e) => handleInputChange(activeTab, 'examWritten', e.target.value, 75)}
                          placeholder="0-75"
                        />
                      </div>
                    </>
                  )}

                  {/* 6. General Standard Subjects (English, Bio, Chem, Legal, PE, Physics, Accounting, History, Geography, Politics, Psychology, Economics) */}
                  {activeTab !== 'methods' && activeTab !== 'spec' && activeTab !== 'general_math' && activeTab !== 'softdev' && activeTab !== 'data_analytics' && activeTab !== 'algorithmics' && activeTab !== 'french' && activeTab !== 'chinese_sl' && activeTab !== 'chinese_sla' && (
                    <>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac3`}>Unit 3 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac3`}
                          type="number"
                          value={subjects[activeTab].sacU3}
                          onChange={(e) => handleInputChange(activeTab, 'sacU3', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-sac4`}>Unit 4 SAC Score (Out of 100)</label>
                        <input
                          id={`${activeTab}-sac4`}
                          type="number"
                          value={subjects[activeTab].sacU4}
                          onChange={(e) => handleInputChange(activeTab, 'sacU4', e.target.value, 100)}
                          placeholder="0-100"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`${activeTab}-exam`}>Written Examination (Out of {SUBJECT_METADATA[activeTab].examMax})</label>
                        <input
                          id={`${activeTab}-exam`}
                          type="number"
                          value={subjects[activeTab].examScore}
                          onChange={(e) => handleInputChange(activeTab, 'examScore', e.target.value, SUBJECT_METADATA[activeTab].examMax)}
                          placeholder={`0-${SUBJECT_METADATA[activeTab].examMax}`}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="results-column">
                  <div className="subject-score-badge">
                    <div className="badge-side raw-side">
                      <span className="lbl">Raw Study Score</span>
                      <span className="val">{calculatedResults[activeTab].rawScore}</span>
                    </div>
                    <div className="badge-side scaled-side" style={{ background: SUBJECT_METADATA[activeTab].color }}>
                      <span className="lbl">Scaled Score ({subjectYears[activeTab]})</span>
                      <span className="val">{calculatedResults[activeTab].scaledScore}</span>
                    </div>
                  </div>

                  <div className="grades-card">
                    <h3 className="card-lbl">VCAA Graded Assessment Letter Grades</h3>
                    <div className="grades-row">
                      <div className="grade-pill">
                        <span className="ga-label">GA1 (SAC U3)</span>
                        <span className="ga-val">{calculatedResults[activeTab].grades.ga1}</span>
                      </div>
                      <div className="grade-pill">
                        <span className="ga-label">
                          {activeTab === 'softdev' || activeTab === 'data_analytics' || activeTab === 'algorithmics' ? 'GA2 (SAT)' : 'GA2 (SAC U4)'}
                        </span>
                        <span className="ga-val">{calculatedResults[activeTab].grades.ga2}</span>
                      </div>
                      <div className="grade-pill">
                        <span className="ga-label">GA3 (Exam Component)</span>
                        <span className="ga-val">{calculatedResults[activeTab].grades.ga3}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel: ATAR Summary Card */}
          <section className="atar-summary-section glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>VTAC ATAR Prediction</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label htmlFor="atar-year-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>ATAR Year:</label>
                <select
                  id="atar-year-select"
                  value={atarYear}
                  onChange={(e) => setAtarYear(e.target.value)}
                  className="cohort-select-input"
                  style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <option value="2025">2025 Table</option>
                  <option value="2024">2024 Table</option>
                </select>
              </div>
            </div>
            
            <div className="atar-desktop-layout-container">
              <div className="atar-score-ring-container">
                <div className="atar-score-ring">
                  <span className="atar-value">{atarDetails.estimatedAtar}</span>
                  <span className="atar-label">Estimated ATAR</span>
                </div>
                <div className="aggregate-pill-container">
                  <span className="aggregate-lbl">Total Aggregate ({atarYear}):</span>
                  <span className="aggregate-val">{atarDetails.totalAggregate}</span>
                </div>
              </div>
  
              {/* VTAC Rules List */}
              <div className="atar-breakdown-card">
                <h3 className="breakdown-title">Primary Four (100% weight)</h3>
                <div className="breakdown-items-list">
                  {atarDetails.primaryFour.map((item, idx) => (
                    <div key={item.id} className="breakdown-row">
                      <span className="item-num">{idx + 1}</span>
                      <span className="item-name">
                        {item.name} {item.isPrimaryEnglish && <small>(Primary English)</small>}
                      </span>
                      <span className="item-score">{item.scaled} <small>({subjectYears[item.id]})</small></span>
                    </div>
                  ))}
                  {atarDetails.primaryFour.length === 0 && (
                    <div className="warning-text" style={{ padding: '8px' }}>
                      ⚠️ No subjects populated. Select subjects to calculate.
                    </div>
                  )}
                </div>
  
                <h3 className="breakdown-title" style={{ marginTop: '20px' }}>Increments (10% weight)</h3>
                <div className="breakdown-items-list">
                  {atarDetails.increments.map((item, idx) => (
                    <div key={item.id} className="breakdown-row increment-row">
                      <span className="item-num">{idx + 1 + atarDetails.primaryFour.length}</span>
                      <span className="item-name">{item.name}</span>
                      <span className="item-score">
                        {item.scaled} <small>({subjectYears[item.id]})</small> <small style={{ color: '#c084fc' }}>({(item.scaled * 0.1).toFixed(2)})</small>
                      </span>
                    </div>
                  ))}
                  {atarDetails.increments.length === 0 && (
                    <div className="breakdown-row increment-row" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
                      <span className="item-name" style={{ fontStyle: 'italic' }}>No 5th/6th subject selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!atarDetails.hasEnglish && (
              <div className="vce-rules-alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                <p>
                  <strong>English Requirement Missing:</strong> At least one English study (English Mainstream or English Language) is required to qualify for an official VTAC ATAR.
                </p>
              </div>
            )}

            {atarDetails.hasEnglish && (
              <div className="vce-rules-alert">
                <p>
                  <strong>VTAC Aggregation Rules:</strong> Your highest-scoring English subject is mandatory in your Primary Four. The next top 3 highest scoring subjects complete the Primary Four. The 5th and 6th subjects contribute 10% as increments.
                </p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
