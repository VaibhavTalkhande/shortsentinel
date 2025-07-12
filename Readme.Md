# ShortSentinel 🚀

A secure, full-stack URL shortener platform with built-in live analytics, geo-location tracking, and comprehensive data export capabilities.

---

## 🌐 Project URLs

- **Frontend URL:** https://shortsentinel-1.onrender.com
- **Backend URL:** https://shortsentinel.onrender.com

---

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
