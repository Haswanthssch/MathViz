import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';

type Shape = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'tetrahedron';

const Geometry = () => {
  const [selectedShape, setSelectedShape] = useState<Shape>('cube');
  const [size, setSize] = useState(1.2);
  const [color, setColor] = useState<string>('#4ade80');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showEdges, setShowEdges] = useState<boolean>(true);

  const shapes = [
    { id: 'cube', label: 'Cube' },
    { id: 'sphere', label: 'Sphere' },
    { id: 'cylinder', label: 'Cylinder' },
    { id: 'cone', label: 'Cone' },
    { id: 'torus', label: 'Torus' },
    { id: 'tetrahedron', label: 'Tetrahedron' }
  ] as const;

  // Derived parameters based on `size`
  const params = useMemo(() => {
    const r = size / 2; // radius for round shapes
    const h = size;     // height for cylinder/cone
    const R = size / 2; // torus major radius
    const rTube = size / 6; // torus tube radius
    return { r, h, R, rTube };
  }, [size]);

  // Compute volume and surface area for current shape
  const metrics = useMemo(() => {
    const s = size;
    const { r, h, R, rTube } = params;
    const pi = Math.PI;
    let volume = 0;
    let area = 0;
    switch (selectedShape) {
      case 'cube':
        volume = s ** 3;
        area = 6 * s ** 2;
        break;
      case 'sphere':
        volume = (4 / 3) * pi * r ** 3;
        area = 4 * pi * r ** 2;
        break;
      case 'cylinder':
        volume = pi * r ** 2 * h;
        area = 2 * pi * r * (h + r);
        break;
      case 'cone': {
        volume = (pi * r ** 2 * h) / 3;
        const l = Math.sqrt(r * r + h * h);
        area = pi * r * (r + l);
        break;
      }
      case 'torus':
        volume = 2 * pi * pi * R * rTube * rTube;
        area = 4 * pi * pi * R * rTube;
        break;
      case 'tetrahedron':
        // edge length = s
        volume = s ** 3 / (6 * Math.sqrt(2));
        area = Math.sqrt(3) * s ** 2;
        break;
      default:
        break;
    }
    return {
      volume,
      area,
    };
  }, [selectedShape, size, params]);

  const Shape = () => {
    switch (selectedShape) {
      case 'cube':
        return (
          <mesh>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      case 'sphere':
        return (
          <mesh>
            <sphereGeometry args={[params.r, 32, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      case 'cylinder':
        return (
          <mesh>
            <cylinderGeometry args={[params.r, params.r, params.h, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      case 'cone':
        return (
          <mesh>
            <coneGeometry args={[params.r, params.h, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      case 'torus':
        return (
          <mesh>
            <torusGeometry args={[params.R, params.rTube, 32, 64]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      case 'tetrahedron':
        return (
          <mesh>
            {/* tetrahedronGeometry takes radius, approximate from edge length */}
            <tetrahedronGeometry args={[size / 1.2, 0]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
            {showEdges && <Edges color="#111827" />}
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {shapes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedShape(id)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                selectedShape === id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size: {size.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.6"
              max="2.4"
              step="0.05"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 cursor-pointer rounded-md border border-gray-200"
            />
          </div>

          <div className="flex items-end gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
              Wireframe
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={showEdges} onChange={(e) => setShowEdges(e.target.checked)} />
              Show Edges
            </label>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-3" style={{ background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
          <div className="text-sm opacity-80">Surface Area</div>
          <div className="text-lg font-semibold">{metrics.area.toFixed(4)}</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
          <div className="text-sm opacity-80">Volume</div>
          <div className="text-lg font-semibold">{metrics.volume.toFixed(4)}</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[600px] bg-gray-50 rounded-lg">
        <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />
          <Shape />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Geometry;