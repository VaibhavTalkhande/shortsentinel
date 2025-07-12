# ShortSentinel 🚀

A secure, full-stack URL shortener platform with built-in live analytics, geo-location tracking, and comprehensive data export capabilities.

## ✨ Features

### 🔗 **URL Shortening**
- Create shortened URLs with custom codes
- Automatic unique code generation
- User authentication and URL ownership
- Real-time URL creation and management

### 📊 **Live Analytics Dashboard**
- **Real-time Click Tracking**: Live updates via WebSocket
- **Geographic Analytics**: Country, city, and ISP breakdown
- **Device Analytics**: User agent and browser information
- **Interactive Charts**: Visual data representation with Recharts
- **Click Timeline**: Recent clicks with detailed information

### 📈 **Data Export**
- **CSV Export**: Download analytics data in CSV format
- **Excel Export**: Download analytics data in Excel format
- **Comprehensive Data**: Includes all click metadata and analytics

### 🔒 **Security Features**
- **JWT Authentication**: Secure user authentication
- **Rate Limiting**: DDoS protection with request limiting
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP header security

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop and mobile
- **Modern Interface**: Built with Tailwind CSS
- **Real-time Updates**: Live feed of click events
- **Copy to Clipboard**: One-click URL copying
- **Loading States**: Smooth user experience

### 🌍 **Geo-location Tracking**
- **IP Geolocation**: Automatic location detection
- **Country/City Data**: Geographic click analytics
- **ISP Information**: Network provider tracking
- **Location Coordinates**: Latitude/longitude data

## 🛠️ Tech Stack

### **Backend**
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **PostgreSQL** database with **Prisma** ORM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation
- **Helmet** for security headers

### **Frontend**
- **React 19** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Socket.io Client** for real-time updates
- **Recharts** for data visualization
- **Electronjs** for desktop version

### **Infrastructure**
- **PostgreSQL** database
- **Prisma** for database management
- **WebSocket** for real-time features
- **Environment-based configuration**

## 📁 Project Structure

```
shortSentinel/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication endpoints
│   │   │   ├── shorten.ts       # URL shortening logic
│   │   │   └── analytics.ts     # Analytics and export
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts # JWT authentication
│   │   │   ├── rateLimiter.ts   # Rate limiting
│   │   │   └── blacklist.ts     # IP blacklisting
│   │   ├── utils/
│   │   │   ├── auth.ts          # Auth utilities
│   │   │   ├── geoIp.ts         # Geolocation service
│   │   │   └── validation.ts    # Zod schemas
│   │   ├── types/
│   │   │   └── auth-request.ts  # TypeScript types
│   │   └── index.ts             # Main server file
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Login.tsx        # Login page
│   │   │   └── Register.tsx     # Registration page
│   │   ├── component/
│   │   │   ├── AuthForm.tsx     # Authentication form
│   │   │   ├── Navbar.tsx       # Navigation bar
│   │   │   └── LiveFeed.tsx     # Real-time click feed
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── utils/
│   │   │   ├── auth.ts          # Auth utilities
│   │   │   └── axios.ts         # HTTP client setup
│   │   └── App.tsx              # Main app component
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shortSentinel
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your database URL and other settings
   
   # Set up database
   npx prisma generate
   npx prisma db push
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your backend API URL
   
   # Start development server
   npm run dev
   ```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/shortsentinel"
JWT_SECRET="your-jwt-secret"
BASE_URL="http://localhost:5000"
PORT=5000
```

**Frontend (.env)**
```env
VITE_API_URL="http://localhost:5000"
```

## 📖 Usage

### 1. **Authentication**
- Register a new account or login with existing credentials
- JWT tokens are automatically managed

### 2. **URL Shortening**
- Enter a long URL in the dashboard
- Optionally provide a custom short code
- Click "Shorten" to create the shortened URL
- Copy the generated URL with one click

### 3. **Analytics Dashboard**
- View all your shortened URLs in a table
- See real-time click counts
- Click "Details" to view comprehensive analytics
- Export data as CSV or Excel

### 4. **Live Feed**
- Monitor real-time click events
- See geographic and device information
- Track user behavior patterns

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user info

### URL Shortening
- `POST /api/shorten` - Create shortened URL
- `GET /:code` - Redirect to original URL

### Analytics
- `GET /api/analytics` - Get user's URLs and analytics
- `GET /api/analytics/:shortCode` - Get specific URL analytics
- `GET /api/analytics/exports` - Download CSV export
- `GET /api/analytics/export-excel` - Download Excel export

## 🗄️ Database Schema

### Users
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `createdAt`

### URLs
- `id` (CUID)
- `shortCode` (unique)
- `original` (long URL)
- `custom` (boolean)
- `userId` (foreign key)
- `createdAt`

### Clicks
- `id` (CUID)
- `urlId` (foreign key)
- `ip` (IP address)
- `city`, `region`, `country`
- `org` (ISP)
- `loc` (coordinates)
- `userAgent`
- `createdAt`

## 🔧 Development

### Available Scripts

**Backend**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

**Frontend**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Real-time Features
- WebSocket connection for live updates
- Automatic click count updates
- Live feed of click events
- Real-time analytics refresh

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Render, Heroku, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**ShortSentinel** - Secure URL shortening with powerful analytics! 🔗📊
