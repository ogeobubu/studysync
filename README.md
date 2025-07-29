# Academic Connect

A comprehensive academic advising and management system built with React and Node.js, designed to connect students with academic advisors and streamline the academic guidance process.

![Academic Connect Dashboard](https://i.ibb.co/LD6XLJyZ/Screenshot-2025-07-29-at-17-34-07.png?text=Academic+Connect+Dashboard)

## 🌟 Features

### For Students
- **Dashboard Overview**: Personalized dashboard with academic summary and quick actions
- **Course Management**: Register for courses, view academic records, and track progress
- **Academic Advising**: Request advising sessions with preferred scheduling
- **Real-time Chat**: Direct messaging with assigned academic advisors
- **Course Recommendations**: AI-powered course suggestions based on academic progress
- **Grade Tracking**: Monitor scores, GPA, and CGPA with visual progress indicators
- **Profile Management**: Update personal information and academic details

### For Advisors
- **Student Management**: View and manage assigned students
- **Advising Requests**: Handle incoming student requests and assign appointments
- **Real-time Messaging**: Communicate directly with students
- **Progress Tracking**: Monitor student academic performance
- **Dashboard Analytics**: Overview of advising activities and student metrics

### For Administrators
- **System Overview**: Comprehensive dashboard with system-wide analytics
- **User Management**: Manage students, advisors, and system users
- **Request Management**: Oversee and assign advising requests
- **Analytics & Reporting**: Track system usage and performance metrics
- **System Configuration**: Manage system settings and configurations

## 🚀 Demo Mode

Experience Academic Connect without setting up a backend server! Our demo mode provides a fully functional preview with sample data.

### Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Student | `john.student@demo.com` | Any password | Full student experience with sample academic data |
| Advisor | `sarah.advisor@demo.com` | Any password | Complete advisor dashboard with student management |
| Admin | `michael.admin@demo.com` | Any password | System administration with full analytics |

### Activating Demo Mode

1. Click the **"Enable Demo"** button in the bottom-left corner of the login page
2. Log in with any of the demo accounts above
3. Explore all features with pre-populated sample data
4. Use **"Disable Demo Mode"** to return to production mode

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing and navigation
- **TanStack Query** - Powerful data synchronization for React
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Beautiful & customizable SVG icons
- **date-fns** - Modern JavaScript date utility library

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **Bcrypt** - Password hashing for security
- **Multer** - File upload handling
- **Nodemailer** - Email sending capabilities

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local installation or cloud connection)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/academic-connect.git
   cd academic-connect
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies (if applicable)
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_DEMO_MODE=false
   ```

   Create a `.env` file in the server directory (if using backend):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/academic-connect
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the development servers**
   ```bash
   # Start the client (from client directory)
   npm run dev

   # Start the server (from server directory, if applicable)
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🎯 Usage Guide

### Getting Started

1. **First Time Setup**
   - Enable demo mode for instant access, or
   - Register a new account with your preferred role
   - Verify your email address (in production mode)

2. **Student Workflow**
   - Complete your profile with academic information
   - Register for courses based on your program
   - Submit advising requests when needed
   - Chat with your assigned advisor
   - Track your academic progress

3. **Advisor Workflow**
   - Review incoming advising requests
   - Assign yourself to student requests
   - Communicate with students via chat
   - Monitor student progress
   - Provide academic guidance

4. **Admin Workflow**
   - Monitor system-wide analytics
   - Manage user accounts and permissions
   - Oversee advising request assignments
   - Configure system settings

## 🗂️ Project Structure

```
academic-connect/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── api/                     # API integration layer
│   │   │   ├── http.ts             # Basic HTTP client
│   │   │   ├── httpEnhanced.ts     # Enhanced HTTP client with demo support
│   │   │   └── useHttp.ts          # React Query hooks
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── advisor/            # Advisor-specific components
│   │   │   ├── student/            # Student-specific components
│   │   │   ├── chat/               # Chat system components
│   │   │   └── ui/                 # Base UI components
│   │   ├── context/                # React context providers
│   │   ├── layouts/                # Layout components
│   │   ├── pages/                  # Page components
│   │   ├── routes/                 # Routing configuration
│   │   ├── services/               # Business logic services
│   │   ├── types/                  # TypeScript type definitions
│   │   └── lib/                    # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/                         # Node.js backend (if applicable)
│   ├── controllers/                # Route controllers
│   ├── middleware/                 # Express middleware
│   ├── models/                     # Database models
│   ├── routes/                     # API routes
│   ├── utils/                      # Utility functions
│   └── server.js                   # Main server file
└── README.md
```

## 🔧 Key Features Deep Dive

### Demo System
The application includes a sophisticated demo system that:
- Simulates real API responses with realistic data
- Maintains state across sessions using localStorage
- Provides three different user role experiences
- Includes complete CRUD operations for all features
- Demonstrates the full application workflow

### Authentication System
- JWT-based authentication with role-based access control
- Email verification for new accounts
- Password reset functionality with OTP verification
- Secure session management
- Protected routes based on user roles

### Real-time Chat System
- Direct messaging between students and advisors
- Message history persistence
- Real-time message delivery
- File sharing capabilities (in production)
- Chat session management

### Academic Progress Tracking
- GPA and CGPA calculations
- Course registration and grade management
- Academic standing monitoring
- Progress visualization with charts
- Transcript generation

## 🎨 Design System

The application uses a consistent design system built with Tailwind CSS:

- **Color Palette**: Professional blue and gray theme
- **Typography**: Clear hierarchy with readable fonts
- **Components**: Consistent button styles, form elements, and cards
- **Responsive Design**: Mobile-first approach with breakpoint considerations
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🧪 Testing

```bash
# Run client tests
cd client
npm run test

# Run server tests (if applicable)
cd server
npm run test

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   Set the following in your deployment platform:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_DEMO_MODE=true  # Enable for demo deployments
   ```

### Full Stack Deployment (Railway/Heroku)

1. **Prepare for deployment**
   ```bash
   # Add build scripts to package.json
   "scripts": {
     "build": "cd client && npm install && npm run build",
     "start": "node server/server.js"
   }
   ```

2. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway deploy
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add amazing feature that does X"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper type definitions
- Include JSDoc comments for complex functions
- Write tests for new features
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & FAQ

### Common Issues

**Q: Demo mode isn't working properly**
A: Make sure you've clicked "Enable Demo" and are using the correct demo credentials. Clear your browser cache if issues persist.

**Q: Real-time chat isn't updating**
A: The demo chat updates when you send messages. In production, this would use WebSocket connections for real-time updates.

**Q: Course registration fails**
A: Ensure you've selected valid session and semester values, and that you're not already registered for the course.

### Getting Help

- 📧 Email: support@academicconnect.com
- 💬 Discord: [Join our community](https://discord.gg/academicconnect)
- 📚 Documentation: [Full Documentation](https://docs.academicconnect.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/yourusername/academic-connect/issues)

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon set
- **TanStack** - For the powerful React Query library
- **Vercel** - For easy deployment and hosting

---

**Built with ❤️ for academic institutions worldwide**

*Academic Connect - Bridging the gap between students and academic success*