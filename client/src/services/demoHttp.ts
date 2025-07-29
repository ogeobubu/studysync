// client/src/services/demoHttp.ts
import { 
  getDemoData, 
  setDemoData, 
  getDemoUser, 
  generateId,
  DEMO_USERS,
  initializeDemoData 
} from './demoData';
import { Role } from '../types';

// Initialize demo data when service is imported
initializeDemoData();

export class DemoHttpService {
  private currentUser: any = null;
  private isDemo = true;

  // Simulate network delay
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock response wrapper - Fixed to match expected API structure
  private createResponse(data: any, message?: string) {
    return {
      data: { 
        data, 
        message: message || 'Success',
        success: true 
      }
    };
  }

  private createErrorResponse(message: string, status: number = 400) {
    return Promise.reject({
      response: {
        data: { 
          data: { message, error: message },
          message,
          success: false 
        },
        status,
        statusText: 'Error'
      },
      message
    });
  }

  // Auth endpoints
  async login(email: string, password: string) {
    await this.delay();
    
    // Find user by email
    const users = Object.values(DEMO_USERS);
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      return this.createErrorResponse('Invalid email or password', 401);
    }

    // For demo, any password works
    const token = `demo-token-${user._id}`;
    this.currentUser = user;
    
    // Store current user for session
    localStorage.setItem('demo_current_user', JSON.stringify(user));
    localStorage.setItem('demo_token', token);

    return { data: { token, user } };
  }

  async register(userData: any) {
    await this.delay();
    
    const users = getDemoData('users') || DEMO_USERS;
    const existingUser = Object.values(users).find((u: any) => u.email === userData.email);
    
    if (existingUser) {
      return this.createErrorResponse('User already exists');
    }

    const newUser = {
      _id: generateId(),
      ...userData,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users[userData.role] = newUser;
    setDemoData('users', users);

    return this.createResponse({ message: 'User registered successfully' });
  }

  async verifyEmail(otp: string) {
    await this.delay();
    // For demo, any OTP works
    return this.createResponse({ message: 'Email verified successfully' });
  }

  async forgotPassword(email: string) {
    await this.delay();
    return this.createResponse({ message: 'Password reset link sent' });
  }

  async resetPassword(data: any) {
    await this.delay();
    return this.createResponse({ message: 'Password reset successfully' });
  }

  // User endpoints
  async getCurrentUser() {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    return this.createResponse(currentUser);
  }

  async updateUser(userId: string, userData: any) {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    const updatedUser = { ...currentUser, ...userData, updatedAt: new Date().toISOString() };
    localStorage.setItem('demo_current_user', JSON.stringify(updatedUser));

    // Update in demo_users as well
    const users = getDemoData('users') || DEMO_USERS;
    const userRole = updatedUser.role.toLowerCase();
    if (users[userRole]) {
      users[userRole] = updatedUser;
      setDemoData('users', users);
    }

    return this.createResponse(updatedUser);
  }

  async getUsers(role?: string) {
    await this.delay();
    
    const users = getDemoData('users') || DEMO_USERS;
    let userList = Object.values(users);
    
    if (role) {
      userList = userList.filter((user: any) => user.role === role);
    }

    return this.createResponse(userList);
  }

  // Analytics endpoints
  async getAnalytics(type: 'overview' | 'advisor' = 'overview') {
    await this.delay();
    
    const analytics = getDemoData('analytics');
    return this.createResponse(analytics[type]);
  }

  // Advising endpoints
  async getAdvisingRequests(filter?: string) {
    await this.delay();
    
    let requests = getDemoData('advising_requests');
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    
    if (filter === 'my' && currentUser) {
      requests = requests.filter((req: any) => req.user._id === currentUser._id);
    } else if (filter === 'pending') {
      requests = requests.filter((req: any) => req.status === 'Pending');
    } else if (filter === 'advisor/my-pending' && currentUser) {
      requests = requests.filter((req: any) => 
        req.advisor?._id === currentUser._id && req.status === 'Pending'
      );
    }

    return this.createResponse(requests);
  }

  async createAdvisingRequest(requestData: any) {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    const requests = getDemoData('advising_requests');
    const newRequest = {
      _id: generateId(),
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.profilePhoto || 'default.jpg'
      },
      ...requestData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      advisor: null,
      notes: {}
    };

    requests.push(newRequest);
    setDemoData('advising_requests', requests);

    return this.createResponse(newRequest);
  }

  async assignAdvisorToRequest(requestId: string, advisorId: string, notes?: string) {
    await this.delay();
    
    const requests = getDemoData('advising_requests');
    const requestIndex = requests.findIndex((req: any) => req._id === requestId);
    
    if (requestIndex === -1) {
      return this.createErrorResponse('Request not found', 404);
    }

    const users = getDemoData('users') || DEMO_USERS;
    const advisor = Object.values(users).find((user: any) => user._id === advisorId);
    
    if (!advisor) {
      return this.createErrorResponse('Advisor not found', 404);
    }

    requests[requestIndex] = {
      ...requests[requestIndex],
      advisor: {
        _id: advisor._id,
        name: advisor.name,
        email: advisor.email,
        avatar: advisor.profilePhoto || 'default.jpg'
      },
      status: 'Assigned',
      updatedAt: new Date().toISOString(),
      notes: { advisorNotes: notes || '' }
    };

    setDemoData('advising_requests', requests);
    return this.createResponse(requests[requestIndex]);
  }

  // Course endpoints
  async getCourses(program?: string) {
    await this.delay();
    
    let courses = getDemoData('courses');
    
    if (program) {
      courses = courses.filter((course: any) => course.program === program);
    }

    return this.createResponse(courses);
  }

  async getRecommendations() {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser || currentUser.role !== 'student') {
      return this.createErrorResponse('Access denied', 403);
    }

    // For demo, return some courses as recommendations
    const courses = getDemoData('courses');
    const registrations = getDemoData('registrations').filter((reg: any) => 
      reg.studentId === currentUser._id
    );
    
    const registeredCourseIds = registrations.map((reg: any) => reg.courseId._id);
    const recommendations = courses.filter((course: any) => 
      !registeredCourseIds.includes(course._id) && 
      course.program === currentUser.program
    );

    return this.createResponse(recommendations);
  }

  // Registration endpoints
  async getRegistrations(studentId: string) {
    await this.delay();
    
    const registrations = getDemoData('registrations').filter((reg: any) => 
      reg.studentId === studentId
    );

    return this.createResponse(registrations);
  }

  async createRegistration(registrationData: any) {
    await this.delay();
    
    const registrations = getDemoData('registrations');
    const courses = getDemoData('courses');
    
    const course = courses.find((c: any) => c._id === registrationData.courseId);
    if (!course) {
      return this.createErrorResponse('Course not found', 404);
    }

    // Check if already registered
    const existingReg = registrations.find((reg: any) => 
      reg.studentId === registrationData.studentId && 
      reg.courseId._id === registrationData.courseId
    );

    if (existingReg) {
      return this.createErrorResponse('Already registered for this course', 400);
    }

    const newRegistration = {
      _id: generateId(),
      studentId: registrationData.studentId,
      courseId: course,
      session: registrationData.session,
      semester: registrationData.semester,
      createdAt: new Date().toISOString()
    };

    registrations.push(newRegistration);
    setDemoData('registrations', registrations);

    return this.createResponse(newRegistration);
  }

  async updateGrade(registrationId: string, gradeData: any) {
    await this.delay();
    
    const registrations = getDemoData('registrations');
    const registrationIndex = registrations.findIndex((reg: any) => reg._id === registrationId);
    
    if (registrationIndex === -1) {
      return this.createErrorResponse('Registration not found', 404);
    }

    // Calculate grade based on score
    const { score } = gradeData;
    let grade = 'F';
    let gradePoint = 0;

    if (score >= 70) { grade = 'A'; gradePoint = 5.0; }
    else if (score >= 60) { grade = 'B'; gradePoint = 4.0; }
    else if (score >= 50) { grade = 'C'; gradePoint = 3.0; }
    else if (score >= 45) { grade = 'D'; gradePoint = 2.0; }
    else if (score >= 40) { grade = 'E'; gradePoint = 1.0; }

    registrations[registrationIndex] = {
      ...registrations[registrationIndex],
      score,
      grade,
      gradePoint,
      updatedAt: new Date().toISOString()
    };

    setDemoData('registrations', registrations);
    return this.createResponse(registrations[registrationIndex]);
  }

  // Chat endpoints
  async getChats() {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    const chats = getDemoData('chats').filter((chat: any) => 
      chat.student._id === currentUser._id || chat.advisor._id === currentUser._id
    );

    return this.createResponse(chats);
  }

  async getChat(chatId: string) {
    await this.delay();
    
    const chats = getDemoData('chats');
    const chat = chats.find((c: any) => c._id === chatId);
    
    if (!chat) {
      return this.createErrorResponse('Chat not found', 404);
    }

    const messages = getDemoData('messages').filter((msg: any) => msg.chatId === chatId);
    
    return this.createResponse({ chat, messages });
  }

  async startChat(advisorId: string) {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    const users = getDemoData('users') || DEMO_USERS;
    const advisor = Object.values(users).find((user: any) => user._id === advisorId);
    
    if (!advisor) {
      return this.createErrorResponse('Advisor not found', 404);
    }

    // Check if chat already exists
    const existingChats = getDemoData('chats');
    const existingChat = existingChats.find((chat: any) => 
      chat.student._id === currentUser._id && chat.advisor._id === advisorId
    );

    if (existingChat) {
      return this.createResponse(existingChat);
    }

    const chats = getDemoData('chats');
    const newChat = {
      _id: generateId(),
      student: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePhoto: currentUser.profilePhoto || 'default.jpg'
      },
      advisor: {
        _id: advisor._id,
        name: advisor.name,
        profilePhoto: advisor.profilePhoto || 'default.jpg'
      },
      isActive: true,
      appointment: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    chats.push(newChat);
    setDemoData('chats', chats);

    return this.createResponse(newChat);
  }

  async sendMessage(chatId: string, content: string) {
    await this.delay();
    
    const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
    if (!currentUser) {
      return this.createErrorResponse('User not authenticated', 401);
    }

    const messages = getDemoData('messages');
    const newMessage = {
      _id: generateId(),
      chatId,
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
        profilePhoto: currentUser.profilePhoto || 'default.jpg'
      },
      content,
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    setDemoData('messages', messages);

    return this.createResponse(newMessage);
  }
}

export const demoHttpService = new DemoHttpService();