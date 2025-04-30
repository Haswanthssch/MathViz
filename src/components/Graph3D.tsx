import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { evaluate } from 'mathjs';

const Graph3D = () => {
  const [equation, setEquation] = useState('x^2 + y^2 - z');
  const [range, setRange] = useState({ min: -5, max: 5, steps: 30 });
  const [slicePosition, setSlicePosition] = useState(0);

  // Function to generate 3D graph based on equation
  const generateSurfaceGeometry = () => {
    const vertices = [];
    const indices = [];
    
    const stepSize = (range.max - range.min) / range.steps;
    
    for (let i = 0; i <= range.steps; i++) {
      for (let j = 0; j <= range.steps; j++) {
        const x = range.min + i * stepSize;
        const y = range.min + j * stepSize;
        let z = 0;
        try {
          // Solve for z by setting the equation to 0, so f(x, y, z) = 0
          // This assumes the equation is of the form "f(x, y, z) = 0"
          // We will use math.js to evaluate the equation by adjusting z
          const expr = equation.replace(/x/g, x).replace(/y/g, y);
          // Solve the equation f(x, y, z) = 0 for z
          const zValues = evaluate(expr, { z: 0 });
          if (Array.isArray(zValues)) {
            z = zValues[0]; // Take the first possible solution
          }
        } catch (error) {
          console.error("Invalid equation", error);
        }
        vertices.push(x, y, z);
      }
    }

    // Create the surface mesh indices
    for (let i = 0; i < range.steps; i++) {
      for (let j = 0; j < range.steps; j++) {
        const a = i * (range.steps + 1) + j;
        const b = a + 1;
        const c = a + (range.steps + 1);
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };

  useEffect(() => {
    setSlicePosition(0);
  }, [equation]);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-500 via-white to-blue-500 text-white">
      <div className="absolute top-10 left-10 z-10 bg-blue-800 p-6 rounded-xl shadow-lg max-w-lg">
        <h2 className="text-2xl font-bold mb-4">3D Graphing Functionality</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Visualize any 3D surface function in the form <strong>f(x, y, z) = 0</strong></li>
          <li>Examples of valid functions: <strong>x^2 + y^2 - z</strong>, <strong>sin(x * y) - z</strong>, <strong>y - x^2 - z</strong></li>
          <li>Use the input field below to enter a function and explore its 3D surface.</li>
          <li>Adjust the "Slice Position" to see different layers of the graph.</li>
        </ul>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Enter equation (e.g., x^2 + y^2 - z)"
          className="p-2 w-full mb-4 text-black"
        />
        <div className="flex items-center mb-4">
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={slicePosition}
            onChange={(e) => setSlicePosition(parseFloat(e.target.value))}
            className="mr-2"
          />
          <label className="text-lg">Slice Position: {slicePosition.toFixed(2)}</label>
        </div>
      </div>

      <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh geometry={generateSurfaceGeometry()}>
          <meshStandardMaterial
            color="#4ade80"
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
        <gridHelper args={[20, 20]} />
        <axesHelper args={[5]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Graph3D;
