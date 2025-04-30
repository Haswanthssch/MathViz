import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Calculator as CalculatorIcon, Box, Activity, Shapes, Binary, LineChart, Compass } from 'lucide-react';
import Landing from './components/Landing';
import Graph2D from './components/Graph2D';
import Graph3D from './components/Graph3D';
import Calculator from './components/Calculator';
import NumberTheory from './components/NumberTheory';
import Statistics from './components/Statistics';
import Geometry from './components/Geometry';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const features = [
    {
      title: '2D Graphing',
      icon: <Activity className="w-6 h-6 text-primary-600" />,
      view: '2d',
      path: '/2d',
      description: 'Plot and analyze functions in two dimensions with interactive tools'
    },
    {
      title: '3D Visualization',
      icon: <Box className="w-6 h-6 text-primary-600" />,
      view: '3d',
      path: '/3d',
      description: 'Explore three-dimensional mathematical concepts and surfaces'
    },
    {
      title: 'Scientific Calculator',
      icon: <CalculatorIcon className="w-6 h-6 text-primary-600" />,
      view: 'calculator',
      path: '/calculator',
      description: 'Advanced calculator with support for complex mathematical operations'
    },
    {
      title: 'Number Theory',
      icon: <Binary className="w-6 h-6 text-primary-600" />,
      view: 'numberTheory',
      path: '/number-theory',
      description: 'Explore prime numbers, factorization, and number properties'
    },
    {
      title: 'Statistical Analysis',
      icon: <LineChart className="w-6 h-6 text-primary-600" />,
      view: 'statistics',
      path: '/statistics',
      description: 'Comprehensive statistical calculations and data visualization'
    },
    {
      title: 'Geometry Tools',
      icon: <Compass className="w-6 h-6 text-primary-600" />,
      view: 'geometry',
      path: '/geometry',
      description: 'Interactive geometric construction and measurement tools'
    }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 group"
            >
              <Shapes className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                MathViz
              </span>
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {features.map((feature) => (
              <button
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="nav-link text-base font-medium transition-colors text-gray-500 hover:text-gray-900"
              >
                {feature.title}
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white shadow-lg">
            <div className="space-y-1 pb-3 pt-2">
              {features.map((feature) => (
                <button
                  key={feature.path}
                  onClick={() => {
                    navigate(feature.path);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-base font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className="flex items-center space-x-2">
                    {feature.icon}
                    <span>{feature.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
          {children}
        </div>
      </main>
      <footer className="bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 MathVerse. All rights reserved. Advanced Mathematics Calculator Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/2d" element={<Layout><Graph2D /></Layout>} />
        <Route path="/3d" element={<Layout><Graph3D /></Layout>} />
        <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
        <Route path="/number-theory" element={<Layout><NumberTheory /></Layout>} />
        <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
        <Route path="/geometry" element={<Layout><Geometry /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;