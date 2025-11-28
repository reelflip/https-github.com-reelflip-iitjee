import { Subject, Chapter } from './types';

export const SYLLABUS_DATA: Chapter[] = [
  // Physics
  { id: 'p1', subject: Subject.PHYSICS, name: 'Kinematics', totalTopics: 5 },
  { id: 'p2', subject: Subject.PHYSICS, name: 'Laws of Motion', totalTopics: 4 },
  { id: 'p3', subject: Subject.PHYSICS, name: 'Work, Energy and Power', totalTopics: 3 },
  { id: 'p4', subject: Subject.PHYSICS, name: 'Rotational Motion', totalTopics: 6 },
  { id: 'p5', subject: Subject.PHYSICS, name: 'Thermodynamics', totalTopics: 4 },
  { id: 'p6', subject: Subject.PHYSICS, name: 'Electrostatics', totalTopics: 5 },
  { id: 'p7', subject: Subject.PHYSICS, name: 'Optics', totalTopics: 7 },
  
  // Chemistry
  { id: 'c1', subject: Subject.CHEMISTRY, name: 'Atomic Structure', totalTopics: 4 },
  { id: 'c2', subject: Subject.CHEMISTRY, name: 'Chemical Bonding', totalTopics: 6 },
  { id: 'c3', subject: Subject.CHEMISTRY, name: 'Thermodynamics (Chem)', totalTopics: 3 },
  { id: 'c4', subject: Subject.CHEMISTRY, name: 'Equilibrium', totalTopics: 5 },
  { id: 'c5', subject: Subject.CHEMISTRY, name: 'Organic Chemistry - Basic Principles', totalTopics: 8 },
  { id: 'c6', subject: Subject.CHEMISTRY, name: 'Hydrocarbons', totalTopics: 5 },

  // Math
  { id: 'm1', subject: Subject.MATH, name: 'Sets, Relations and Functions', totalTopics: 3 },
  { id: 'm2', subject: Subject.MATH, name: 'Complex Numbers', totalTopics: 4 },
  { id: 'm3', subject: Subject.MATH, name: 'Quadratic Equations', totalTopics: 3 },
  { id: 'm4', subject: Subject.MATH, name: 'Sequences and Series', totalTopics: 4 },
  { id: 'm5', subject: Subject.MATH, name: 'Calculus - Limits & Continuity', totalTopics: 5 },
  { id: 'm6', subject: Subject.MATH, name: 'Coordinate Geometry', totalTopics: 7 },
];

export const MOCK_TEST_RESULTS = [
  {
    id: 't1',
    testName: 'Mock Test 1 - Full Syllabus',
    date: '2023-10-15',
    score: 180,
    totalScore: 300,
    subjectBreakdown: {
      [Subject.PHYSICS]: 60,
      [Subject.CHEMISTRY]: 70,
      [Subject.MATH]: 50,
    }
  },
  {
    id: 't2',
    testName: 'Mock Test 2 - Mechanics Special',
    date: '2023-11-02',
    score: 210,
    totalScore: 300,
    subjectBreakdown: {
      [Subject.PHYSICS]: 80,
      [Subject.CHEMISTRY]: 70,
      [Subject.MATH]: 60,
    }
  },
  {
    id: 't3',
    testName: 'Mock Test 3 - Full Syllabus',
    date: '2023-11-20',
    score: 195,
    totalScore: 300,
    subjectBreakdown: {
      [Subject.PHYSICS]: 65,
      [Subject.CHEMISTRY]: 65,
      [Subject.MATH]: 65,
    }
  }
];