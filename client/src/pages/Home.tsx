import { FaRocket, FaLink, FaChartBar, FaFileExport, FaLock, FaPalette, FaGlobe } from 'react-icons/fa';

const features = [
    {
        icon: <FaLink className="text-blue-500 text-3xl" />,
        title: 'URL Shortening',
        details: [
            'Create shortened URLs with custom codes',
            'Automatic unique code generation',
            'User authentication and URL ownership',
            'Real-time URL creation and management',
        ],
    },
    {
        icon: <FaChartBar className="text-green-500 text-3xl" />,
        title: 'Live Analytics Dashboard',
        details: [
            'Real-time Click Tracking: Live updates via WebSocket',
            'Geographic Analytics: Country, city, and ISP breakdown',
            'Device Analytics: User agent and browser information',
            'Interactive Charts: Visual data representation with Recharts',
            'Click Timeline: Recent clicks with detailed information',
        ],
    },
    {
        icon: <FaFileExport className="text-yellow-500 text-3xl" />,
        title: 'Data Export',
        details: [
            'CSV Export: Download analytics data in CSV format',
            'Excel Export: Download analytics data in Excel format',
            'Comprehensive Data: Includes all click metadata and analytics',
        ],
    },
    {
        icon: <FaLock className="text-red-500 text-3xl" />,
        title: 'Security Features',
        details: [
            'JWT Authentication: Secure user authentication',
            'Rate Limiting: DDoS protection with request limiting',
            'Input Validation: Zod schema validation',
            'CORS Protection: Cross-origin request security',
            'Helmet Security: HTTP header security',
        ],
    },
    {
        icon: <FaPalette className="text-pink-500 text-3xl" />,
        title: 'Modern UI/UX',
        details: [
            'Responsive Design: Works on desktop and mobile',
            'Modern Interface: Built with Tailwind CSS',
            'Real-time Updates: Live feed of click events',
            'Copy to Clipboard: One-click URL copying',
            'Loading States: Smooth user experience',
        ],
    },
    {
        icon: <FaGlobe className="text-indigo-500 text-3xl" />,
        title: 'Geo-location Tracking',
        details: [
            'IP Geolocation: Automatic location detection',
            'Country/City Data: Geographic click analytics',
            'ISP Information: Network provider tracking',
        ],
    },
];

const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-gray-900 text-green-800">
        {/* Hero Section */}
        <section className="h-screen relative overflow-hidden flex items-center justify-center py-20 px-4">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 opacity-20 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-4xl mx-auto text-center z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FaRocket className="text-5xl text-purple-500 drop-shadow-lg animate-bounce" />
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        ShortSentinel <span role="img" aria-label="rocket">🚀</span>
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
                    Secure, full-stack URL shortener with live analytics, geo-location, and data export.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition">
                        Get Started
                    </button>
                    <button className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="bg-gradient-to-br from-white/90 to-slate-100/80 rounded-2xl shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <span className="bg-white rounded-full shadow p-3">{feature.icon}</span>
                            <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                            {feature.details.map((detail) => (
                                <li key={detail} className="text-base">{detail}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to shorten your first link?</h3>
            <p className="mb-8 text-lg">Sign up now and experience secure, real-time URL management with analytics.</p>
            <button className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-purple-100 transition">
                Sign Up Free
            </button>
        </section>
    </div>
);

export default HomePage;
