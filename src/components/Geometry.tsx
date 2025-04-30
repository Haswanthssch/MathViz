import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type Shape = 'cube' | 'sphere' | 'cylinder' | 'cone';

const Geometry = () => {
  const [selectedShape, setSelectedShape] = useState<Shape>('cube');
  const [size, setSize] = useState(1);

  const shapes = [
    { id: 'cube', label: 'Cube' },
    { id: 'sphere', label: 'Sphere' },
    { id: 'cylinder', label: 'Cylinder' },
    { id: 'cone', label: 'Cone' }
  ] as const;

  const Shape = () => {
    switch (selectedShape) {
      case 'cube':
        return (
          <mesh>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      case 'sphere':
        return (
          <mesh>
            <sphereGeometry args={[size / 2, 32, 32]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      case 'cylinder':
        return (
          <mesh>
            <cylinderGeometry args={[size / 2, size / 2, size, 32]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      case 'cone':
        return (
          <mesh>
            <coneGeometry args={[size / 2, size, 32]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          {shapes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedShape(id)}
              className={`px-4 py-2 rounded-lg ${
                selectedShape === id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {size}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="h-[600px] bg-gray-50 rounded-lg">
        <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
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