const Course = require('../models/Course');

const oauCseCourses = [
  // Part I
  { code: 'MTH 101', title: 'Elementary Mathematics I', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  { code: 'MTH 102', title: 'Elementary Mathematics II', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'Second' },
  { code: 'CSC 101', title: 'Introduction to Computer Science', level: 'Part I', program: 'Computer Science', credits: 3, semester: 'First' },
  // ... add all other courses from the document
  // Part II
  { code: 'CSC 201', title: 'Computer Programming I', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'First', prerequisites: ['CSC 101'] },
  { code: 'CPE 203', title: 'Digital Logic Design', level: 'Part II', program: 'Computer Science', credits: 3, semester: 'First' },
  // ... continue for all parts
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