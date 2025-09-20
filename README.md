# 🌙 Sno Cast - Sleep Podcast App

A beautiful sleep-themed podcast app that helps you fall asleep with boring podcasts. Built with React Native and MongoDB.

## ✨ Features

- **Beautiful Sleep-Themed UI** - Calming design with custom illustrations
- **User Authentication** - Secure signup/signin with JWT tokens
- **MongoDB Database** - Persistent user data and listening history
- **Sleep Preferences** - Customize your sleep schedule and podcast preferences
- **Listening History** - Track your sleep podcast sessions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Expo CLI
- React Native development environment

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sno-cast
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:19006
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or run on simulator: `npm run ios` or `npm run android`

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  profile: {
    firstName: String
    lastName: String
    avatar: String
    sleepPreferences: {
      preferredSleepTime: String
      wakeUpTime: String
      favoritePodcastCategories: [String]
    }
  }
  subscription: {
    plan: String (free/premium)
    startDate: Date
    endDate: Date
  }
  listeningHistory: [{
    podcastId: String
    podcastTitle: String
    listenedAt: Date
    duration: Number
    completed: Boolean
  }]
  isActive: Boolean
  lastLogin: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/listening-history` - Get listening history
- `POST /api/user/listening-history` - Add to listening history
- `DELETE /api/user/account` - Deactivate account

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- AsyncStorage
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## 📱 Screens

1. **Landing Page** - Beautiful sleep-themed welcome screen
2. **Sign In** - User authentication
3. **Sign Up** - User registration
4. **Home** - Main app interface (when authenticated)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 🎨 Design Features

- Custom sleep-themed illustrations
- Gradient backgrounds
- Smooth animations
- Responsive design
- Beautiful typography
- Consistent color scheme

## 📦 Project Structure

```
sno-cast/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── user.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── screens/
│   ├── SignInScreen.js
│   └── SignUpScreen.js
├── services/
│   ├── api.js
│   └── authService.js
├── assets/
│   ├── girl.png
│   └── sleeping.png
├── App.js
└── package.json
```

## 🚀 Deployment

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy backend to your preferred platform

### Frontend (Expo)
1. Build for production: `expo build`
2. Submit to app stores or use Expo Go

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment variables are set correctly
4. Check network connectivity

---

**Sweet dreams! 🌙✨**