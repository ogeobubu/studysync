// client/src/services/demoData.ts
import { Role } from '../types';

// Demo users
export const DEMO_USERS = {
  student: {
    _id: 'student-demo-123',
    name: 'John Smith',
    email: 'john.student@demo.com',
    role: Role.STUDENT,
    matricNumber: 'CS/ENG/22/1234',
    program: 'Computer Science with Mathematics',
    level: 'Part III',
    phoneNumber: '+234-801-234-5678',
    address: '123 University Road, Ibadan',
    gender: 'male',
    profilePhoto: 'default.jpg',
    active: true,
    createdAt: '2022-09-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
    settings: {
      notifications: { email: true, sms: false },
      preferences: { language: 'en', theme: 'light' },
      privacy: { shareData: true, profileVisible: true }
    }
  },
  advisor: {
    _id: 'advisor-demo-456',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.advisor@demo.com',
    role: Role.ADVISOR,
    specialization: 'Computer Science with Mathematics',
    phoneNumber: '+234-802-345-6789',
    profilePhoto: 'default.jpg',
    active: true,
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
    settings: {
      notifications: { email: true, sms: true },
      preferences: { language: 'en', theme: 'light' },
      privacy: { shareData: true, profileVisible: false }
    }
  },
  admin: {
    _id: 'admin-demo-789',
    name: 'Michael Admin',
    email: 'michael.admin@demo.com',
    role: Role.ADMIN,
    phoneNumber: '+234-803-456-7890',
    profilePhoto: 'default.jpg',
    active: true,
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
    settings: {
      notifications: { email: true, sms: false },
      preferences: { language: 'en', theme: 'dark' },
      privacy: { shareData: false, profileVisible: false }
    }
  }
};

// Demo courses
export const DEMO_COURSES = [
  {
    _id: 'course-1',
    code: 'CSC 201',
    title: 'Computer Programming II',
    description: 'Advanced programming concepts and data structures',
    credits: 3,
    semester: 'First',
    prerequisites: ['CSC 101'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-2',
    code: 'MTH 201',
    title: 'Mathematical Methods I',
    description: 'Linear algebra and differential equations',
    credits: 3,
    semester: 'First',
    prerequisites: ['MTH 101'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-3',
    code: 'CSC 301',
    title: 'Data Structures and Algorithms',
    description: 'Advanced data structures and algorithm analysis',
    credits: 3,
    semester: 'First',
    prerequisites: ['CSC 201'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-4',
    code: 'CSC 302',
    title: 'Database Systems',
    description: 'Database design and management systems',
    credits: 3,
    semester: 'Second',
    prerequisites: ['CSC 201'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-5',
    code: 'MTH 301',
    title: 'Numerical Analysis',
    description: 'Numerical methods for solving mathematical problems',
    credits: 3,
    semester: 'Second',
    prerequisites: ['MTH 201'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-6',
    code: 'CSC 401',
    title: 'Software Engineering',
    description: 'Software development methodologies and project management',
    credits: 3,
    semester: 'First',
    prerequisites: ['CSC 301'],
    program: 'Computer Science with Mathematics'
  },
  {
    _id: 'course-7',
    code: 'CSC 402',
    title: 'Artificial Intelligence',
    description: 'Introduction to AI concepts and machine learning',
    credits: 3,
    semester: 'Second',
    prerequisites: ['CSC 301'],
    program: 'Computer Science with Mathematics'
  }
];

// Demo registrations
export const DEMO_REGISTRATIONS = [
  {
    _id: 'reg-1',
    studentId: 'student-demo-123',
    courseId: DEMO_COURSES[0],
    session: '2023/2024',
    semester: 'First',
    score: 85,
    grade: 'A',
    gradePoint: 5.0,
    createdAt: '2023-09-15T00:00:00.000Z'
  },
  {
    _id: 'reg-2',
    studentId: 'student-demo-123',
    courseId: DEMO_COURSES[1],
    session: '2023/2024',
    semester: 'First',
    score: 78,
    grade: 'B+',
    gradePoint: 4.5,
    createdAt: '2023-09-15T00:00:00.000Z'
  },
  {
    _id: 'reg-3',
    studentId: 'student-demo-123',
    courseId: DEMO_COURSES[2],
    session: '2024/2025',
    semester: 'First',
    score: 92,
    grade: 'A',
    gradePoint: 5.0,
    createdAt: '2024-09-15T00:00:00.000Z'
  },
  {
    _id: 'reg-4',
    studentId: 'student-demo-123',
    courseId: DEMO_COURSES[3],
    session: '2024/2025',
    semester: 'Second',
    score: undefined, // Not graded yet
    grade: undefined,
    gradePoint: undefined,
    createdAt: '2024-11-15T00:00:00.000Z'
  }
];

// Demo advising requests
export const DEMO_ADVISING_REQUESTS = [
  {
    _id: 'req-1',
    user: {
      _id: 'student-demo-123',
      name: 'John Smith',
      email: 'john.student@demo.com',
      avatar: 'default.jpg'
    },
    reason: 'course-selection',
    additionalInfo: 'I need help choosing electives for next semester',
    preferredDays: ['monday', 'wednesday', 'friday'],
    preferredTimeRange: { start: '10:00', end: '12:00' },
    status: 'Pending',
    createdAt: '2024-12-01T08:30:00.000Z',
    updatedAt: '2024-12-01T08:30:00.000Z',
    advisor: null,
    notes: {}
  },
  {
    _id: 'req-2',
    user: {
      _id: 'student-demo-123',
      name: 'John Smith',
      email: 'john.student@demo.com',
      avatar: 'default.jpg'
    },
    reason: 'academic-concerns',
    additionalInfo: 'Struggling with Mathematics courses',
    preferredDays: ['tuesday', 'thursday'],
    preferredTimeRange: { start: '14:00', end: '16:00' },
    status: 'Assigned',
    createdAt: '2024-11-15T10:15:00.000Z',
    updatedAt: '2024-11-16T09:20:00.000Z',
    advisor: {
      _id: 'advisor-demo-456',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.advisor@demo.com',
      avatar: 'default.jpg'
    },
    notes: {
      advisorNotes: 'Scheduled meeting for Thursday 2 PM'
    }
  },
  {
    _id: 'req-3',
    user: {
      _id: 'student-other-456',
      name: 'Jane Doe',
      email: 'jane.student@demo.com',
      avatar: 'default.jpg'
    },
    reason: 'graduation-check',
    additionalInfo: 'Need to verify graduation requirements',
    preferredDays: ['monday', 'tuesday'],
    preferredTimeRange: { start: '09:00', end: '11:00' },
    status: 'Pending',
    createdAt: '2024-11-20T14:20:00.000Z',
    updatedAt: '2024-11-20T14:20:00.000Z',
    advisor: null,
    notes: {}
  }
];

// Demo chats
export const DEMO_CHATS = [
  {
    _id: 'chat-1',
    student: {
      _id: 'student-demo-123',
      name: 'John Smith',
      profilePhoto: 'default.jpg'
    },
    advisor: {
      _id: 'advisor-demo-456',
      name: 'Dr. Sarah Johnson',
      profilePhoto: 'default.jpg'
    },
    isActive: true,
    appointment: null,
    createdAt: '2024-11-20T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z'
  }
];

// Demo messages
export const DEMO_MESSAGES = [
  {
    _id: 'msg-1',
    chatId: 'chat-1',
    sender: {
      _id: 'student-demo-123',
      name: 'John Smith',
      profilePhoto: 'default.jpg'
    },
    content: 'Hello Dr. Johnson, I wanted to discuss my course selection for next semester.',
    timestamp: '2024-11-20T10:30:00.000Z'
  },
  {
    _id: 'msg-2',
    chatId: 'chat-1',
    sender: {
      _id: 'advisor-demo-456',
      name: 'Dr. Sarah Johnson',
      profilePhoto: 'default.jpg'
    },
    content: 'Hi John! I\'d be happy to help you with course selection. What specific areas are you interested in?',
    timestamp: '2024-11-20T11:15:00.000Z'
  },
  {
    _id: 'msg-3',
    chatId: 'chat-1',
    sender: {
      _id: 'student-demo-123',
      name: 'John Smith',
      profilePhoto: 'default.jpg'
    },
    content: 'I\'m particularly interested in machine learning and data science courses.',
    timestamp: '2024-11-20T11:45:00.000Z'
  },
  {
    _id: 'msg-4',
    chatId: 'chat-1',
    sender: {
      _id: 'advisor-demo-456',
      name: 'Dr. Sarah Johnson',
      profilePhoto: 'default.jpg'
    },
    content: 'Great choices! I recommend starting with our Artificial Intelligence course (CSC 402) and Mathematical Methods. These will give you a solid foundation.',
    timestamp: '2024-11-20T12:00:00.000Z'
  }
];

// Demo analytics data
export const DEMO_ANALYTICS = {
  overview: {
    totalAdvisors: 5,
    totalStudents: 150,
    pendingRequests: 12
  },
  advisor: {
    assignedStudents: 25,
    upcomingSessions: 3,
    recentCompleted: 8,
    pendingRequests: 4,
    commonTopics: [
      { topic: 'Course Selection', count: 15 },
      { topic: 'Academic Concerns', count: 8 },
      { topic: 'Career Guidance', count: 5 },
      { topic: 'Graduation Planning', count: 3 }
    ]
  }
};

// Additional demo users for variety
export const DEMO_ADDITIONAL_USERS = [
  {
    _id: 'advisor-demo-789',
    name: 'Prof. David Wilson',
    email: 'david.advisor@demo.com',
    role: Role.ADVISOR,
    specialization: 'Computer Engineering',
    phoneNumber: '+234-804-567-8901',
    profilePhoto: 'default.jpg',
    active: true,
    createdAt: '2019-08-20T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z'
  },
  {
    _id: 'student-demo-456',
    name: 'Mary Johnson',
    email: 'mary.student@demo.com',
    role: Role.STUDENT,
    matricNumber: 'CS/ENG/23/5678',
    program: 'Computer Science with Economics',
    level: 'Part II',
    phoneNumber: '+234-805-678-9012',
    profilePhoto: 'default.jpg',
    active: true,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z'
  }
];

// Initialize demo data in localStorage
export const initializeDemoData = () => {
  try {
    // Check if already initialized
    if (localStorage.getItem('demo_initialized') === 'true') {
      return;
    }

    console.log('Initializing demo data...');

    // Combine all users
    const allUsers = {
      ...DEMO_USERS,
      // Add additional users as separate entries
      advisor2: DEMO_ADDITIONAL_USERS[0],
      student2: DEMO_ADDITIONAL_USERS[1]
    };

    // Initialize all demo data
    localStorage.setItem('demo_users', JSON.stringify(allUsers));
    localStorage.setItem('demo_courses', JSON.stringify(DEMO_COURSES));
    localStorage.setItem('demo_registrations', JSON.stringify(DEMO_REGISTRATIONS));
    localStorage.setItem('demo_advising_requests', JSON.stringify(DEMO_ADVISING_REQUESTS));
    localStorage.setItem('demo_chats', JSON.stringify(DEMO_CHATS));
    localStorage.setItem('demo_messages', JSON.stringify(DEMO_MESSAGES));
    localStorage.setItem('demo_analytics', JSON.stringify(DEMO_ANALYTICS));
    
    // Mark as initialized
    localStorage.setItem('demo_initialized', 'true');
    
    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};

// Helper functions to get demo data
export const getDemoUser = (role: Role) => {
  try {
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}');
    return users[role.toLowerCase()];
  } catch (error) {
    console.error('Error getting demo user:', error);
    return null;
  }
};

export const getDemoData = (key: string) => {
  try {
    const data = localStorage.getItem(`demo_${key}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting demo data for ${key}:`, error);
    return [];
  }
};

export const setDemoData = (key: string, data: any) => {
  try {
    localStorage.setItem(`demo_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting demo data for ${key}:`, error);
  }
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Reset demo data function
export const resetDemoData = () => {
  try {
    // Clear all demo-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('demo_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Reinitialize
    initializeDemoData();
    
    console.log('Demo data reset successfully');
  } catch (error) {
    console.error('Error resetting demo data:', error);
  }
};