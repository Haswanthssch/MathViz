import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, TextField, Grid, Stack, Slider, FormControlLabel, Switch, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { evaluate, derivative } from 'mathjs';

// Types used throughout the component for clarity
type Point = { x: number; y: number };
type Range = { min: number; max: number; steps: number };

const AdvancedGraphTool: React.FC = () => {
  // Equation string typed for mathjs evaluation
  const [equation, setEquation] = useState<string>('x^2 - 4');
  // Plotting range with sensible defaults (interactive via sliders)
  const [range, setRange] = useState<Range>({ min: -10, max: 10, steps: 200 });
  const [showRoots, setShowRoots] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<string>('');
  const [tangentLine, setTangentLine] = useState<Point[]>([]);
  const [tangentInfo, setTangentInfo] = useState<{ x0: number; y0: number; slope: number } | null>(null);

  // Generate X samples once per range using useMemo to avoid unnecessary recalculation
  const xValues = React.useMemo<number[]>(() => {
    const steps = Math.max(2, Math.floor(range.steps));
    const arr = Array.from({ length: steps }, (_, i) => range.min + (i * (range.max - range.min)) / (steps - 1));
    return arr;
  }, [range.max, range.min, range.steps]);

  // Compute function points safely; if parsing fails, return empty array
  const calculatePoints = useCallback<Point[]>(() => {
    try {
      return xValues.map((x) => ({ x, y: Number(evaluate(equation, { x })) }));
    } catch {
      return [];
    }
  }, [equation, xValues]);

  // Find approximate roots by detecting sign changes between consecutive samples
  // Uses linear interpolation for a better root estimate than midpoint
  const findRoots = useCallback((points: Point[]): number[] => {
    const roots: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const signChange = p0.y === 0 || p1.y === 0 || (p0.y > 0) !== (p1.y > 0);
      if (signChange) {
        if (p0.y === 0) {
          roots.push(p0.x);
        } else if (p1.y === 0) {
          roots.push(p1.x);
        } else {
          // Linear interpolation for zero crossing between (x0,y0) and (x1,y1)
          const t = -p0.y / (p1.y - p0.y);
          const xr = p0.x + t * (p1.x - p0.x);
          roots.push(xr);
        }
      }
    }
    // Deduplicate roots that are numerically very close
    const eps = 1e-6;
    return roots
      .sort((a, b) => a - b)
      .filter((x, idx, arr) => idx === 0 || Math.abs(x - arr[idx - 1]) > eps);
  }, []);

  // Compute tangent line at user-specified x0
  const calculateTangent = useCallback(() => {
    const x0 = parseFloat(tangentX);
    if (Number.isNaN(x0)) return;
    try {
      const slope = derivative(equation, 'x').evaluate({ x: x0 }) as number;
      const y0 = Number(evaluate(equation, { x: x0 }));
      const line = xValues.map<Point>((x) => ({ x, y: slope * (x - x0) + y0 }));
      setTangentLine(line);
      setTangentInfo({ x0, y0, slope });
    } catch {
      setTangentLine([]);
      setTangentInfo(null);
    }
  }, [equation, tangentX, xValues]);

  const points = calculatePoints();
  const roots = React.useMemo(() => findRoots(points), [findRoots, points]);

  // Format numbers for axes and tooltip
  const numFmt = useCallback((v: number) => Number(v).toFixed(2), []);
  const tooltipFormatter = useCallback(
    (value: number | string, name: string): [string, string] => {
      const num = typeof value === 'number' ? value : Number(value);
      const formatted = Number.isFinite(num) ? num.toFixed(4) : String(value);
      return [formatted, name];
    },
    []
  );

  return (
    <Card sx={{
      p: 2,
      borderRadius: 3,
      color: '#0f172a',
      backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #f5d0fe 45%, #fde68a 100%)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    }}> 
      <CardHeader 
        title="Advanced 2D Graphing Tool" 
        sx={{
          textAlign: 'center',
          color: '#111827',
          fontWeight: 800,
          '& .MuiCardHeader-title': { fontSize: 24 }
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Left Controls */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundImage: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
                <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">Function</Typography>
                <TextField
                  placeholder="e.g. x^2 - 4, sin(x), log(x)"
                  variant="outlined"
                  fullWidth
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
                <Stack direction="row" spacing={1}>
                  {['x^2 - 4', 'sin(x)', 'cos(x)', 'x^3 - x', 'exp(x)', 'log(x)'].map((ex) => (
                    <Button key={ex} size="small" variant="contained" color="primary" onClick={() => setEquation(ex)}>
                      {ex}
                    </Button>
                  ))}
                </Stack>
                </Stack>
              </Paper>

              <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundImage: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
                <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">Range</Typography>
                <Typography variant="caption" color="text.secondary">X min: {range.min}</Typography>
                <Slider value={range.min} min={-100} max={range.max - 1} step={1}
                        onChange={(_, v) => setRange(r => ({ ...r, min: v as number }))} />
                <Typography variant="caption" color="text.secondary">X max: {range.max}</Typography>
                <Slider value={range.max} min={range.min + 1} max={100} step={1}
                        onChange={(_, v) => setRange(r => ({ ...r, max: v as number }))} />
                <Typography variant="caption" color="text.secondary">Steps: {range.steps}</Typography>
                <Slider value={range.steps} min={50} max={1000} step={10}
                        onChange={(_, v) => setRange(r => ({ ...r, steps: v as number }))} />
                </Stack>
              </Paper>

              <Paper elevation={4} sx={{ p: 2, borderRadius: 2, backgroundImage: 'linear-gradient(135deg, #fee2e2, #fecdd3)' }}>
                <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">Analysis</Typography>
                <FormControlLabel
                  control={<Switch checked={showRoots} onChange={(e) => setShowRoots(e.target.checked)} />}
                  label="Show Roots"
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Tangent at x"
                    variant="outlined"
                    value={tangentX}
                    onChange={(e) => setTangentX(e.target.value)}
                    sx={{ width: 160, backgroundColor: 'white', borderRadius: 1 }}
                  />
                  <Button onClick={calculateTangent} variant="contained" color="secondary">
                    Compute
                  </Button>
                </Stack>
                {tangentInfo && (
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption">f(x0) = {tangentInfo.y0.toFixed(4)}</Typography>
                    <Typography variant="caption">m = {tangentInfo.slope.toFixed(4)}</Typography>
                  </Stack>
                )}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Chart */}
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Enter a function on the left. Adjust the x-range and sampling resolution. Toggle roots and compute a tangent at any point.
              </Typography>
              <div style={{ 
                height: 520, 
                width: '100%', 
                backgroundImage: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
                padding: 12, 
                borderRadius: 16,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)'
              }}>
                <ResponsiveContainer>
                  <LineChart data={points}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                    <XAxis type="number" dataKey="x" domain={[range.min, range.max]} tickFormatter={numFmt} stroke="#ffffffaa" tick={{ fill: '#ffffffcc' }} />
                    <YAxis type="number" domain={['auto', 'auto']} tickFormatter={numFmt} stroke="#ffffffaa" tick={{ fill: '#ffffffcc' }} />
                    <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: '#111827', color: '#fff', border: '1px solid #374151' }} />
                    <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                    <Line type="monotone" dataKey="y" stroke="#60a5fa" dot={false} strokeWidth={2} name={equation} />

                    {showRoots &&
                      roots.map((x, i) => (
                        <ReferenceLine key={`root-${i}`} x={x} stroke="#f87171" label={`Root: ${x.toFixed(2)}`} />
                      ))}

                    {tangentLine.length > 0 && (
                      <>
                        <ReferenceLine x={tangentInfo ? tangentInfo.x0 : parseFloat(tangentX)} stroke="#c084fc" label={`Tangent at x=${tangentX}`} />
                        <Line type="monotone" data={tangentLine} stroke="#c084fc" dot={false} strokeDasharray="6 6" strokeWidth={2} name="Tangent Line" />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdvancedGraphTool;
