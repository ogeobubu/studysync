const Course = require('../models/Course');

const oauCseCourses = [
  // Part I (common / Computer Science)
  { code: 'MTH 101', title: 'Elementary Mathematics I', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'MTH 102', title: 'Elementary Mathematics II', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'MTH 104', title: 'Basic Mathematics', level: 'Part I', program: 'Computer Science', credits: 2, semester: 'First' },
  { code: 'PHY 101', title: 'Physics I', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'PHY 102', title: 'Physics II', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CHM 101', title: 'General Chemistry I', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CHM 102', title: 'General Chemistry II', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CHM 103', title: 'Chemistry Laboratory I', level: 'Part I', program: 'Computer Science', credits: 1, semester: 'First' },
  { code: 'CHM 104', title: 'Chemistry Laboratory II', level: 'Part I', program: 'Computer Science', credits: 1, semester: 'Second' },
  { code: 'CSC 101', title: 'Introduction to Computer Science', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 102', title: 'Computing Fundamentals', level: 'Part I', program: 'Computer Science', credits: 2, semester: 'Second' },
  { code: 'TPD 101', title: 'Technical and Professional Development I', level: 'Part I', program: 'Computer Science', credits: 1, semester: 'First' },
  { code: 'SEO 001', title: 'General Orientation (SEO)', level: 'Part I', program: 'Computer Science', credits: 0, semester: 'First' },
  { code: 'SER 001', title: 'General Orientation (SER)', level: 'Part I', program: 'Computer Science', credits: 0, semester: 'First' },

  // Part I - courses that are "Same as Computer Science" for other programs
  // For "Computer Science with Mathematics"
  { code: 'MTH 101', title: 'Elementary Mathematics I', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'MTH 102', title: 'Elementary Mathematics II', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'MTH 104', title: 'Basic Mathematics', level: 'Part I', program: 'Computer Science with Mathematics', credits: 2, semester: 'First' },
  { code: 'PHY 101', title: 'Physics I', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'PHY 102', title: 'Physics II', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CHM 101', title: 'General Chemistry I', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CHM 102', title: 'General Chemistry II', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CHM 103', title: 'Chemistry Laboratory I', level: 'Part I', program: 'Computer Science with Mathematics', credits: 1, semester: 'First' },
  { code: 'CHM 104', title: 'Chemistry Laboratory II', level: 'Part I', program: 'Computer Science with Mathematics', credits: 1, semester: 'Second' },
  { code: 'CSC 101', title: 'Introduction to Computer Science', level: 'Part I', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 102', title: 'Computing Fundamentals', level: 'Part I', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },
  { code: 'TPD 101', title: 'Technical and Professional Development I', level: 'Part I', program: 'Computer Science with Mathematics', credits: 1, semester: 'First' },
  { code: 'SEO 001', title: 'General Orientation (SEO)', level: 'Part I', program: 'Computer Science with Mathematics', credits: 0, semester: 'First' },
  { code: 'SER 001', title: 'General Orientation (SER)', level: 'Part I', program: 'Computer Science with Mathematics', credits: 0, semester: 'First' },

  // For "Computer Engineering" Part I (same as Computer Science with Mathematics per doc)
  { code: 'MTH 101', title: 'Elementary Mathematics I', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'MTH 102', title: 'Elementary Mathematics II', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'MTH 104', title: 'Basic Mathematics', level: 'Part I', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'PHY 101', title: 'Physics I', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'PHY 102', title: 'Physics II', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CHM 101', title: 'General Chemistry I', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CHM 102', title: 'General Chemistry II', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CHM 103', title: 'Chemistry Laboratory I', level: 'Part I', program: 'Computer Engineering', credits: 1, semester: 'First' },
  { code: 'CHM 104', title: 'Chemistry Laboratory II', level: 'Part I', program: 'Computer Engineering', credits: 1, semester: 'Second' },
  { code: 'CSC 101', title: 'Introduction to Computer Science', level: 'Part I', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CSC 102', title: 'Computing Fundamentals', level: 'Part I', program: 'Computer Engineering', credits: 2, semester: 'Second' },
  { code: 'TPD 101', title: 'Technical and Professional Development I', level: 'Part I', program: 'Computer Engineering', credits: 1, semester: 'First' },
  { code: 'SEO 001', title: 'General Orientation (SEO)', level: 'Part I', program: 'Computer Engineering', credits: 0, semester: 'First' },
  { code: 'SER 001', title: 'General Orientation (SER)', level: 'Part I', program: 'Computer Engineering', credits: 0, semester: 'First' },

  // Part II - Computer Science (main)
  { code: 'CSC 201', title: 'Computer Programming I', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'First', prerequisites: ['CSC 101'] },
  { code: 'CSC 202', title: 'Computer Programming II', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'Second', prerequisites: ['CSC 201'] },
  { code: 'CPE 203', title: 'Digital Logic Design', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CPE 204', title: 'Circuits and Systems I', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 206', title: 'Introduction to Computer Engineering', level: 'Part II', program: 'Computer Science', credits: 2, semester: 'First' },
  { code: 'MTH 201', title: 'Calculus I', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'First', prerequisites: ['MTH 101'] },
  { code: 'MTH 202', title: 'Calculus II', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'Second', prerequisites: ['MTH 201'] },
  { code: 'MTH 205', title: 'Linear Algebra', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'STT 201', title: 'Introductory Statistics I', level: 'Part II', program: 'Computer Science', credits: 2, semester: 'First' },
  { code: 'STT 202', title: 'Introductory Statistics II', level: 'Part II', program: 'Computer Science', credits: 2, semester: 'Second' },

  // Part II - Computer Science with Mathematics (document lines)
  { code: 'CSC 201', title: 'Computer Programming I', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'First', prerequisites: ['CSC 101'] },
  { code: 'CSC 202', title: 'Computer Programming II', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second', prerequisites: ['CSC 201'] },
  { code: 'CPE 203', title: 'Digital Logic Design', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CPE 204', title: 'Circuits and Systems I', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 206', title: 'Introduction to Computer Engineering', level: 'Part II', program: 'Computer Science with Mathematics', credits: 2, semester: 'First' },
  { code: 'MTH 201', title: 'Calculus I', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'First', prerequisites: ['MTH 101'] },
  { code: 'MTH 202', title: 'Calculus II', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second', prerequisites: ['MTH 201'] },
  { code: 'MTH 205', title: 'Linear Algebra', level: 'Part II', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'ECN 201', title: 'Introduction to Microeconomics', level: 'Part II', program: 'Computer Science with Mathematics', credits: 2, semester: 'First' },
  { code: 'ECN 202', title: 'Introduction to Macroeconomics', level: 'Part II', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },
  { code: 'ECN 203', title: 'Mathematical Economics I', level: 'Part II', program: 'Computer Science with Mathematics', credits: 2, semester: 'First' },
  { code: 'ECN 204', title: 'Mathematical Economics II', level: 'Part II', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },

  // Part II - Computer Engineering (document columns)
  { code: 'CSC 201', title: 'Computer Programming I', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'First', prerequisites: ['CSC 101'] },
  { code: 'CSC 202', title: 'Computer Programming II', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'Second', prerequisites: ['CSC 201'] },
  { code: 'CPE 203', title: 'Digital Logic Design', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 204', title: 'Circuits and Systems I', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 206', title: 'Introduction to Computer Engineering', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'MTH 201', title: 'Calculus I', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'First', prerequisites: ['MTH 101'] },
  { code: 'MTH 202', title: 'Calculus II', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'Second', prerequisites: ['MTH 201'] },
  { code: 'MEE 203', title: 'Engineering Workshop I', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'MEE 204', title: 'Engineering Workshop II', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'Second' },
  { code: 'MEE 205', title: 'Mechanics I', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'MEE 206', title: 'Mechanics II', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'Second' },
  { code: 'CHE 201', title: 'Physical Chemistry for Engineers', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'EEE 201', title: 'Basic Electrical Engineering I', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'EEE 202', title: 'Basic Electrical Engineering II', level: 'Part II', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'EEE 291', title: 'Electrical Laboratory I', level: 'Part II', program: 'Computer Engineering', credits: 1, semester: 'First' },
  { code: 'EEE 292', title: 'Electrical Laboratory II', level: 'Part II', program: 'Computer Engineering', credits: 1, semester: 'Second' },
  { code: 'AGE 202', title: 'Engineering Geology', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'Second' },
  { code: 'CVE 202', title: 'Engineering Drawing', level: 'Part II', program: 'Computer Engineering', credits: 2, semester: 'Second' },

  // Part III - Computer Science
  { code: 'CPE 301', title: 'Computer Architecture I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 302', title: 'Data Structures', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First', prerequisites: ['CSC 202'] },
  { code: 'CSC 304', title: 'Algorithms I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 305', title: 'Operating Systems I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 306', title: 'Database Systems I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 307', title: 'Software Engineering I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 308', title: 'Computer Networks I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 311', title: 'Formal Languages & Automata', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 312', title: 'Programming Languages', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 315', title: 'Human Computer Interaction', level: 'Part III', program: 'Computer Science', credits: 2, semester: 'Second' },
  { code: 'CSC 317', title: 'Theory of Computation', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 302', title: 'Data Structures', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' }, // duplicate to reflect table ordering
  { code: 'CSC 312', title: 'Programming Languages', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 315', title: 'Human Computer Interaction', level: 'Part III', program: 'Computer Science', credits: 2, semester: 'Second' },

  { code: 'CPE 309', title: 'Microprocessors I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 310', title: 'Embedded Systems I', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 314', title: 'Logic Design II', level: 'Part III', program: 'Computer Science', credits: 2, semester: 'First' },
  { code: 'CPE 316', title: 'Digital Systems Design', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },

  { code: 'MTH 301', title: 'Advanced Calculus', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'MTH 302', title: 'Complex Analysis or Applied Maths', level: 'Part III', program: 'Computer Science', credits: 3, semester: 'Second' },

  // Part III - Computer Science with Mathematics (entries per table)
  { code: 'CPE 301', title: 'Computer Architecture I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 302', title: 'Data Structures', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First', prerequisites: ['CSC 202'] },
  { code: 'CSC 304', title: 'Algorithms I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 305', title: 'Operating Systems I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 306', title: 'Database Systems I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 307', title: 'Software Engineering I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 308', title: 'Computer Networks I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 311', title: 'Formal Languages & Automata', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 312', title: 'Programming Languages', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 315', title: 'Human Computer Interaction', level: 'Part III', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },
  { code: 'CPE 310', title: 'Embedded Systems I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 316', title: 'Digital Systems Design', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },

  { code: 'MTH 301', title: 'Advanced Calculus', level: 'Part III', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'ECN 301', title: 'Intermediate Microeconomics', level: 'Part III', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },
  { code: 'ECN 302', title: 'Intermediate Macroeconomics', level: 'Part III', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },
  { code: 'ECN 313', title: 'Mathematical Economics II', level: 'Part III', program: 'Computer Science with Mathematics', credits: 2, semester: 'First' },
  { code: 'ECN 314', title: 'Econometrics I', level: 'Part III', program: 'Computer Science with Mathematics', credits: 2, semester: 'Second' },

  // Part III - Computer Engineering (document column)
  { code: 'CPE 301', title: 'Computer Architecture I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 303', title: 'Signals & Systems I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 309', title: 'Microprocessors I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 310', title: 'Embedded Systems I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 316', title: 'Digital Systems Design', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CSC 302', title: 'Data Structures', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CSC 306', title: 'Database Systems I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CSC 307', title: 'Software Engineering I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'Second' },

  { code: 'EEE 301', title: 'Electronics I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'EEE 302', title: 'Electronics II', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'EEE 305', title: 'Electrical Machines I', level: 'Part III', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'MEE 303', title: 'Thermodynamics', level: 'Part III', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'CHE 305', title: 'Engineering Chemistry', level: 'Part III', program: 'Computer Engineering', credits: 2, semester: 'Second' },
  { code: 'CHE 306', title: 'Chemical Engineering Lab', level: 'Part III', program: 'Computer Engineering', credits: 1, semester: 'Second' },
  { code: 'AGE 302', title: 'Geomechanics', level: 'Part III', program: 'Computer Engineering', credits: 2, semester: 'First' },
  { code: 'MME 201', title: 'Materials Engineering', level: 'Part III', program: 'Computer Engineering', credits: 2, semester: 'Second' },

  // Part IV - Computer Science
  { code: 'CPE 401', title: 'Computer Architecture II', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 400', title: 'SIWES (Industrial Training)', level: 'Part IV', program: 'Computer Science', credits: 6, semester: 'Placement' },
  { code: 'CSC 403', title: 'Systems Analysis & Design', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 407', title: 'Advanced Operating Systems', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 405', title: 'VLSI & Microelectronics', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 415', title: 'Artificial Intelligence I', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 501', title: 'Project I', level: 'Part IV', program: 'Computer Science', credits: 6, semester: 'Second' },
  { code: 'CSC 503', title: 'Advanced Topics in Computing', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 505', title: 'Distributed Systems', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 515', title: 'Computer Graphics', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 523', title: 'Information Security', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 517', title: 'Advanced Digital Systems', level: 'Part IV', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'TPD 501', title: 'Technical & Professional Development II', level: 'Part IV', program: 'Computer Science', credits: 1, semester: 'First' },

  // Part IV - Computer Science with Mathematics
  { code: 'CPE 401', title: 'Computer Architecture II', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 400', title: 'SIWES (Industrial Training)', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 6, semester: 'Placement' },
  { code: 'CSC 403', title: 'Systems Analysis & Design', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 407', title: 'Advanced Operating Systems', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 405', title: 'VLSI & Microelectronics', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 415', title: 'Artificial Intelligence I', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 501', title: 'Project I', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 6, semester: 'Second' },
  { code: 'CSC 503', title: 'Advanced Topics in Computing', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 505', title: 'Distributed Systems', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 509', title: 'Advanced Microprocessor Systems', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 511', title: 'Advanced Embedded Systems', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CPE 517', title: 'Advanced Digital Systems', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'TPD 501', title: 'Technical & Professional Development II', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 1, semester: 'First' },
  { code: 'ECN 421', title: 'Economics Research Project', level: 'Part IV', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },

  // Part IV - Computer Engineering
  { code: 'CPE 401', title: 'Computer Architecture II', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 400', title: 'SIWES (Industrial Training)', level: 'Part IV', program: 'Computer Engineering', credits: 6, semester: 'Placement' },
  { code: 'CSC 403', title: 'Systems Analysis & Design', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CSC 407', title: 'Advanced Operating Systems', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 405', title: 'VLSI & Microelectronics', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 409', title: 'Control Systems I', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 503', title: 'Advanced Computer Engineering Topics', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 509', title: 'Advanced Microprocessor Systems', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 511', title: 'Advanced Embedded Systems', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 517', title: 'Advanced Digital Systems', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'TPD 501', title: 'Technical & Professional Development II', level: 'Part IV', program: 'Computer Engineering', credits: 1, semester: 'First' },
  { code: 'EEE', title: 'EEE elective', level: 'Part IV', program: 'Computer Engineering', credits: 3, semester: 'Second', note: 'One EEE elective per table' },

  // Part V - Computer Science
  { code: 'CPE 502', title: 'Computer Systems Design II', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CPE 506', title: 'Advanced VLSI', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CPE 508', title: 'Signal Processing', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CPE 510', title: 'Advanced Embedded Systems II', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 504', title: 'Project II', level: 'Part V', program: 'Computer Science', credits: 6, semester: 'Second' },
  { code: 'CSC 514', title: 'Advanced Database Systems', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 520', title: 'Machine Learning', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 522', title: 'Advanced Algorithms', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'CSC 524', title: 'Advanced Software Engineering', level: 'Part V', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'TPD 502', title: 'Technical & Professional Development III', level: 'Part V', program: 'Computer Science', credits: 1, semester: 'First' },

  // Part V - Computer Science with Mathematics
  { code: 'CPE 502', title: 'Computer Systems Design II', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CPE 506', title: 'Advanced VLSI', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CPE 508', title: 'Signal Processing', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CPE 510', title: 'Advanced Embedded Systems II', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 504', title: 'Project II', level: 'Part V', program: 'Computer Science with Mathematics', credits: 6, semester: 'Second' },
  { code: 'CSC 514', title: 'Advanced Database Systems', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 520', title: 'Machine Learning', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'CSC 522', title: 'Advanced Algorithms', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'First' },
  { code: 'CSC 524', title: 'Advanced Software Engineering', level: 'Part V', program: 'Computer Science with Mathematics', credits: 3, semester: 'Second' },
  { code: 'TPD 502', title: 'Technical & Professional Development III', level: 'Part V', program: 'Computer Science with Mathematics', credits: 1, semester: 'First' },

  // Part V - Computer Engineering
  { code: 'CPE 502', title: 'Computer Systems Design II', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 506', title: 'Advanced VLSI', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CPE 504', title: 'Control Systems II', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 508', title: 'Signal Processing', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'First' },
  { code: 'CPE 510', title: 'Advanced Embedded Systems II', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'Second' },
  { code: 'CSC 504', title: 'Project II', level: 'Part V', program: 'Computer Engineering', credits: 6, semester: 'Second' },
  { code: 'TPD 502', title: 'Technical & Professional Development III', level: 'Part V', program: 'Computer Engineering', credits: 1, semester: 'First' },
  { code: 'CSC 514', title: 'Advanced Database Systems', level: 'Part V', program: 'Computer Engineering', credits: 3, semester: 'First' },

  // Misc / Electives placeholder entries where doc suggests electives
  { code: 'CSC 514', title: 'Advanced Database Systems (elective)', level: 'Part V', program: 'Elective', credits: 3, semester: 'First' },
  { code: 'CSC 520', title: 'Machine Learning (elective)', level: 'Part V', program: 'Elective', credits: 3, semester: 'Second' },
  { code: 'CSC 522', title: 'Advanced Algorithms (elective)', level: 'Part V', program: 'Elective', credits: 3, semester: 'First' },
  { code: 'CSC 524', title: 'Advanced Software Engineering (elective)', level: 'Part V', program: 'Elective', credits: 3, semester: 'Second' },

  // Add any extra missing singletons from table not yet captured
  { code: 'CPE 316', title: 'Digital Systems Design', level: 'Part III', program: 'General', credits: 3, semester: 'First' },
  { code: 'CPE 317', title: 'Capstone Systems', level: 'Part III', program: 'General', credits: 3, semester: 'Second' },
];

const seedCourses = async () => {
  try {
    await Course.deleteMany({});
    await Course.insertMany(oauCseCourses);
    console.log('OAU CSE courses seeded successfully');
  } catch (err) {
    console.error('Error seeding courses:', err);
  }
};

module.exports = seedCourses;