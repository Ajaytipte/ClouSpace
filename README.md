# ☁️ CloudSpace – Cloud Storage with AWS Cognito Authentication

CloudSpace is a premium, Google Drive-inspired cloud storage frontend built with **React (Vite)**, **Tailwind CSS v4**, and **AWS Cognito** for secure authentication. It features a modern, responsive UI with support for both light and dark modes, comprehensive file management, and enterprise-grade authentication.

---

## ✨ Key Features

### 🔐 **AWS Cognito Authentication**
- ✅ Email + Password authentication
- ✅ Email verification flow
- ✅ JWT token management
- ✅ Protected routes with route guards
- ✅ Secure logout
- ✅ Authorization Code + PKCE flow (no client secret required)
- ✅ Password strength enforcement
- ✅ User-friendly error handling

### 📁 **File Management**
- Upload files to cloud storage
- Grid/List view toggle for files
- Folder organization system
- Recent files with timeline grouping
- Trash system with restore functionality
- File preview and download
- Global upload progress tracking

### 🎨 **Modern UI/UX**
- Glassmorphism design effects
- Premium color palettes
- Dark/Light mode toggle (persisted)
- Fully responsive layouts
- Smooth animations and transitions
- Beautiful popup alerts
- SEO optimized with semantic HTML

### 📊 **Dashboard Features**
- Quick stats overview (Files, Storage, Folders, Shares)
- Storage usage visualization
- Folder management cards
- Recent files preview
- Interactive navigation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- AWS Cognito account (already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CloudSpace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🔐 AWS Cognito Configuration

### Pre-configured Settings
- **AWS Region**: `ap-south-1` (Mumbai)
- **User Pool ID**: `ap-south-1_8vQ8smdoZ`
- **User Pool Web Client ID**: `7vbnfgktemk29lf55up1lo3a4c`
- **Authentication Flow**: Authorization Code + PKCE
- **Token Storage**: localStorage (`cloudspace_token`)

### First Time Usage

1. **Sign Up** (`/signup`)
   - Enter name, email, and password
   - Password must have: 8+ chars, uppercase, lowercase, number, special character
   - Receive verification code via email
   - Enter code to verify account

2. **Log In** (`/login`)
   - Enter email and password
   - JWT token automatically stored
   - Redirected to dashboard

3. **Access Protected Routes**
   - All dashboard routes require authentication
   - Auto-redirect to login if not authenticated

---

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite 7** - Lightning-fast build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Modern CSS-first framework

### Authentication & Backend
- **AWS Amplify** - AWS SDK for JavaScript
- **AWS Cognito** - User authentication service
- **Axios** - HTTP client with JWT interceptors

### UI/UX Libraries
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes

### State Management
- React Context API (Auth, Theme, File Upload)

---

## 📁 Project Structure

```
CloudSpace/
├── src/
│   ├── auth/                    # 🔐 Authentication
│   │   ├── Login.jsx           # Login page with AWS Cognito
│   │   ├── Signup.jsx          # Signup with email verification
│   │   ├── ProtectedRoute.jsx  # Route protection guard
│   │   └── authUtils.js        # Auth utility functions
│   ├── components/             # 🧩 Reusable components
│   │   ├── Navbar.jsx          # Top navigation with user menu
│   │   └── Sidebar.jsx         # Side navigation
│   ├── context/                # ⚙️ React Context
│   │   ├── ThemeContext.jsx    # Dark/light mode
│   │   └── FileUploadContext.jsx
│   ├── pages/                  # 📄 Page components
│   │   ├── Dashboard.jsx       # Home with stats
│   │   ├── Recent.jsx          # Recent files timeline
│   │   ├── MyFiles.jsx         # All files grid/list
│   │   ├── Trash.jsx           # Deleted files
│   │   ├── Profile.jsx         # User profile
│   │   └── BuyStorage.jsx      # Storage plans
│   ├── layouts/                # 🎨 Layout wrappers
│   │   └── DashboardLayout.jsx
│   ├── examples/               # 📚 Example code
│   │   └── ExampleAuthUsage.jsx
│   ├── aws-config.js           # AWS Amplify configuration
│   ├── App.jsx                 # Main app & routing
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── docs/                       # 📚 Documentation
│   ├── AWS_COGNITO_AUTH_GUIDE.md
│   ├── TESTING_GUIDE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── QUICK_REFERENCE.md
│   └── AUTH_FLOW_DIAGRAM.txt
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 📱 Available Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/login` | Login page with AWS Cognito |
| `/signup` | Signup with email verification |

### Protected Routes (Authentication Required)
| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats overview |
| `/my-files` | All files with grid/list view |
| `/recent` | Recent files with timeline |
| `/trash` | Deleted files |
| `/profile` | User profile settings |
| `/buy-storage` | Storage upgrade plans |

---

## 🔑 Authentication API

### Available Functions

```javascript
import { 
  getCurrentUser,   // Get logged-in user details
  getToken,         // Get JWT token
  isAuthenticated,  // Check auth status
  signOutUser       // Logout user
} from './auth/authUtils';
```

### Usage Examples

**Get Current User**
```javascript
const user = await getCurrentUser();
console.log(user.email, user.name, user.userId);
// Returns: { userId, username, email, name, emailVerified, tokens }
```

**Get JWT Token for API Calls**
```javascript
const token = getToken();
fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Check Authentication Status**
```javascript
const authenticated = await isAuthenticated();
if (authenticated) {
  // User is logged in
}
```

**Logout**
```javascript
await signOutUser();
navigate('/login');
```

---

## 🎯 Available Scripts

```bash
# Development
npm run dev      # Start dev server (port 5173)

# Production
npm run build    # Build for production
npm run preview  # Preview production build

# Code Quality
npm run lint     # Run ESLint
```

---

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#3b82f6',
    600: '#2563eb',
  }
}
```

### Add New Protected Page
1. Create page in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```javascript
<Route path="new-page" element={
  <Suspense fallback={<PageLoader />}>
    <NewPage />
  </Suspense>
} />
```
3. Add link in `src/components/Sidebar.jsx`

---

## 🧪 Testing

See `docs/TESTING_GUIDE.md` for comprehensive testing instructions.

**Quick Test:**
1. Navigate to `/signup`
2. Create account with real email
3. Verify email with AWS code
4. Login at `/login`
5. Access protected routes
6. Test logout functionality

---

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

Output: `dist/` folder ready for deployment

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Deploy automatically
3. Environment variables auto-configured

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### AWS Amplify Hosting
```bash
amplify init
amplify add hosting
amplify publish
```

---

## 🔒 Security Features

✅ **No Client Secret** - Frontend-safe configuration  
✅ **PKCE Flow** - Enhanced security for SPAs  
✅ **JWT Tokens** - Secure authentication  
✅ **Email Verification** - Required for signup  
✅ **Password Requirements** - Strong password enforcement  
✅ **Auto Token Refresh** - Handled by AWS Amplify  
✅ **Protected Routes** - Route-level authentication guards  
✅ **Secure Logout** - Complete session termination  

---

## 🐛 Troubleshooting

**Can't sign up**
- Check password requirements (8+ chars, uppercase, lowercase, number, special char)
- Verify email format is valid

**Verification code not received**
- Check spam/junk folder
- Ensure email is correct
- Try signing up again

**Can't access protected routes**
- Make sure you're logged in
- Check localStorage: `cloudspace_token`
- Try logout and login again

**Token expired**
- Tokens auto-refresh via AWS Amplify
- If issue persists, logout and login

---

## 📚 Documentation

Comprehensive guides available in `docs/` folder:

- 📘 **AWS_COGNITO_AUTH_GUIDE.md** - Complete authentication guide
- 📗 **TESTING_GUIDE.md** - Step-by-step testing instructions
- 📕 **IMPLEMENTATION_SUMMARY.md** - Implementation details
- 📙 **QUICK_REFERENCE.md** - Commands, snippets, tips
- 📊 **AUTH_FLOW_DIAGRAM.txt** - Visual authentication flow

---

## 🎯 Roadmap

- [ ] File sharing with public links
- [ ] Real-time collaboration
- [ ] Advanced search & filters
- [ ] File versioning
- [ ] Mobile app (React Native)
- [ ] Multi-Factor Authentication (MFA)
- [ ] Social login (Google, GitHub)
- [ ] Offline mode with sync

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

MIT License - Free to use for personal and commercial projects

---

## 🙏 Acknowledgments

- **AWS Cognito** - Secure authentication service
- **Tailwind CSS** - Modern styling framework
- **Lucide** - Beautiful icon library
- **React Team** - Amazing framework
- **Vite** - Lightning-fast build tool

---

## 📞 Support

Need help?
- 📖 Check documentation in `docs/` folder
- 📝 Review `QUICK_REFERENCE.md`
- 🐛 Open an issue on GitHub
- 💬 Join our community

---

**Built with ❤️ using React, AWS Cognito, Vite, and Tailwind CSS**

**Start building amazing cloud storage features today! 🚀**
