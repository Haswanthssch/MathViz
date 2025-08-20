import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { evaluate } from 'mathjs';
import { Box, Card, CardContent, Chip, Grid, Paper, Slider, Stack, Switch, TextField, Typography, Button, FormControlLabel } from '@mui/material';

type Range = { min: number; max: number; steps: number };

const presets: { label: string; eq: string; desc: string }[] = [
  { label: 'Paraboloid', eq: 'x^2 + y^2', desc: 'Bowl-shaped surface opening upward' },
  { label: 'Saddle', eq: 'x^2 - y^2', desc: 'Hyperbolic paraboloid (saddle shape)' },
  { label: 'SinCos', eq: 'sin(x) * cos(y)', desc: 'Waves along x and y directions' },
  { label: 'Ripple', eq: 'sin(x^2 + y^2)', desc: 'Circular ripples expanding from origin' },
  { label: 'Cone', eq: 'sqrt(x^2 + y^2)', desc: 'Right circular cone (non-differentiable at 0)' },
];

const Graph3D: React.FC = () => {
  // z = f(x, y)
  const [equation, setEquation] = useState<string>('x^2 + y^2');
  const [range, setRange] = useState<Range>({ min: -5, max: 5, steps: 60 });
  const [wireframe, setWireframe] = useState<boolean>(true);
  const [showSlice, setShowSlice] = useState<boolean>(false);
  const [sliceZ, setSliceZ] = useState<number>(0);

  const stepSize = useMemo(() => (range.max - range.min) / range.steps, [range.max, range.min, range.steps]);

  // Build BufferGeometry for z = f(x,y)
  const surfaceGeometry = useMemo(() => {
    const vertices: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= range.steps; i++) {
      for (let j = 0; j <= range.steps; j++) {
        const x = range.min + i * stepSize;
        const y = range.min + j * stepSize;
        let z = 0;
        try {
          z = Number(evaluate(equation, { x, y }));
          if (!Number.isFinite(z)) z = 0;
        } catch {
          z = 0;
        }
        vertices.push(x, y, z);
      }
    }
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
  }, [equation, range.min, range.steps, stepSize]);

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(120deg, #e0f2fe 0%, #f5d0fe 50%, #fde68a 100%)',
      p: 2
    }}>
      {/* Hero Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: 'linear-gradient(135deg,#111827,#1f2937)' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                3D Surface Visualization
              </Typography>
              <Typography variant="body1" sx={{ color: '#d1d5db', mb: 2 }}>
                Explore classic mathematical surfaces and your own functions. Enter z = f(x, y) and interact with the model.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip label="Paraboloid (x^2 + y^2)" color="primary" variant="outlined" sx={{ color: '#93c5fd', borderColor: '#60a5fa' }} />
                <Chip label="Saddle (x^2 - y^2)" color="secondary" variant="outlined" sx={{ color: '#fca5a5', borderColor: '#f87171' }} />
                <Chip label="Ripple (sin(x^2 + y^2))" variant="outlined" sx={{ color: '#fcd34d', borderColor: '#f59e0b' }} />
                <Chip label="SinCos (sin x · cos y)" variant="outlined" sx={{ color: '#c4b5fd', borderColor: '#a78bfa' }} />
                <Chip label="Cone (sqrt(x^2 + y^2))" variant="outlined" sx={{ color: '#86efac', borderColor: '#34d399' }} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Presets</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {presets.map(p => (
                    <Button key={p.label} size="small" variant="contained" onClick={() => setEquation(p.eq)}>
                      {p.label}
                    </Button>
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Equation (z = f(x, y))</Typography>
                <TextField
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="e.g. sin(x)*cos(y)"
                  size="small"
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Controls + Visualization */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundImage: 'linear-gradient(135deg,#dbeafe,#bfdbfe)' }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">Domain</Typography>
              <Typography variant="caption" color="text.secondary">X/Y min: {range.min}</Typography>
              <Slider value={range.min} min={-10} max={range.max - 1} step={1} onChange={(_, v) => setRange(r => ({ ...r, min: v as number }))} />
              <Typography variant="caption" color="text.secondary">X/Y max: {range.max}</Typography>
              <Slider value={range.max} min={range.min + 1} max={10} step={1} onChange={(_, v) => setRange(r => ({ ...r, max: v as number }))} />
              <Typography variant="caption" color="text.secondary">Resolution: {range.steps}</Typography>
              <Slider value={range.steps} min={20} max={200} step={5} onChange={(_, v) => setRange(r => ({ ...r, steps: v as number }))} />

              <Typography variant="subtitle2" color="text.secondary">Display</Typography>
              <FormControlLabel control={<Switch checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />} label="Wireframe" />
              <FormControlLabel control={<Switch checked={showSlice} onChange={(e) => setShowSlice(e.target.checked)} />} label="Show Z-slice" />
              {showSlice && (
                <>
                  <Typography variant="caption" color="text.secondary">Z = {sliceZ.toFixed(2)}</Typography>
                  <Slider value={sliceZ} min={range.min} max={range.max} step={0.1} onChange={(_, v) => setSliceZ(v as number)} />
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={6} sx={{ p: 1.5, borderRadius: 3, backgroundImage: 'linear-gradient(180deg,#0f172a,#111827)' }}>
            <Box sx={{ height: 540, borderRadius: 2, overflow: 'hidden' }}>
              <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <mesh geometry={surfaceGeometry}>
                  <meshStandardMaterial color="#60a5fa" wireframe={wireframe} side={THREE.DoubleSide} />
                </mesh>
                {showSlice && (
                  <mesh position={[0, 0, sliceZ]} rotation={[Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[range.max - range.min, range.max - range.min, 1, 1]} />
                    <meshBasicMaterial color="#f87171" transparent opacity={0.15} />
                  </mesh>
                )}
                <gridHelper args={[20, 20, '#334155', '#1f2937']} />
                <axesHelper args={[5]} />
                <OrbitControls />
              </Canvas>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Graph3D;
