import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Feature {
  title: string;
  icon: React.ReactNode;
  view: string;
  path: string;
  description: string;
}

interface LandingProps {
  features?: Feature[];
}

function Landing({ features }: LandingProps) {
  const navigate = useNavigate();
  
  const defaultFeatures = [
    {
      title: '2D Graphing',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: '2d',
      path: '/2d',
      description: 'Plot and analyze functions in two dimensions with interactive tools'
    },
    {
      title: '3D Visualization',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: '3d',
      path: '/3d',
      description: 'Explore three-dimensional mathematical concepts and surfaces'
    },
    {
      title: 'Scientific Calculator',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: 'calculator',
      path: '/calculator',
      description: 'Advanced calculator with support for complex mathematical operations'
    },
    {
      title: 'Number Theory',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: 'numberTheory',
      path: '/number-theory',
      description: 'Explore prime numbers, factorization, and number properties'
    },
    {
      title: 'Statistical Analysis',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: 'statistics',
      path: '/statistics',
      description: 'Comprehensive statistical calculations and data visualization'
    },
    {
      title: 'Geometry Tools',
      icon: <ArrowRight className="w-6 h-6 text-primary-600" />,
      view: 'geometry',
      path: '/geometry',
      description: 'Interactive geometric construction and measurement tools'
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-blue-600 opacity-30 animate-pulse sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  Latest Update
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 hover:text-blue-600 transition-colors">
                  <span>New 3D Visualization Tools</span>
                  <ArrowRight className="h-5 w-5 animate-bounce" aria-hidden="true" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Advanced Mathematics
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Explore complex mathematical concepts with our comprehensive suite of tools. From 2D/3D graphing to advanced calculations, we've got everything you need for mathematical excellence.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => navigate('/calculator')}
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </button>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          
          {/* Mathematical Visualization */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32">
            <div className="relative w-[36rem] h-[36rem]">
              <svg className="absolute inset-0 w-full h-full animate-float" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="160" fill="none" stroke="#2563EB" strokeWidth="2" className="animate-pulse" />
                <path d="M 80 200 Q 200 50 320 200" fill="none" stroke="#1E40AF" strokeWidth="3" className="animate-draw" />
                <path d="M 80 150 L 320 250" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                
                <g className="animate-fade-in">
                  <text x="180" y="150" fill="#1E40AF" fontSize="24">∫</text>
                  <text x="220" y="250" fill="#2563EB" fontSize="20">∑</text>
                  <text x="150" y="200" fill="#3B82F6" fontSize="18">π</text>
                  <text x="250" y="180" fill="#60A5FA" fontSize="22">√</text>
                </g>
                
                <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#93C5FD" strokeWidth="0.5" opacity="0.2" />
                </pattern>
                <rect width="400" height="400" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Comprehensive Tools</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for advanced mathematics
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access a complete suite of mathematical tools designed for students, educators, and professionals.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {displayFeatures.map((feature) => (
              <div 
                key={feature.path} 
                className="group hover:scale-105 transition-all duration-300 bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:border-blue-300 hover:shadow-blue-100"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <button
                      onClick={() => navigate(feature.path)}
                      className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 group flex items-center gap-1"
                    >
                      Try now 
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Landing;