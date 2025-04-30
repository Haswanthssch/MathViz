import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { evaluate, derivative } from 'mathjs';

const AdvancedGraphTool = () => {
  const [equation, setEquation] = useState('x^2 - 4');
  const [range, setRange] = useState({ min: -10, max: 10, steps: 200 });
  const [showRoots, setShowRoots] = useState(false);
  const [tangentX, setTangentX] = useState('');
  const [tangentLine, setTangentLine] = useState([]);

  const xValues = Array.from({ length: range.steps }, (_, i) => range.min + (i * (range.max - range.min)) / (range.steps - 1));

  const calculatePoints = useCallback(() => {
    try {
      return xValues.map(x => ({ x, y: evaluate(equation, { x }) }));
    } catch (error) {
      return [];
    }
  }, [equation, xValues]);

  const findRoots = (points) => {
    return points.reduce((acc, point, i) => {
      if (i > 0 && points[i - 1].y * point.y <= 0) {
        acc.push((points[i - 1].x + point.x) / 2);
      }
      return acc;
    }, []);
  };

  const calculateTangent = () => {
    const x0 = parseFloat(tangentX);
    if (isNaN(x0)) return;

    try {
      const slope = derivative(equation, 'x').evaluate({ x: x0 });
      const y0 = evaluate(equation, { x: x0 });
      setTangentLine(xValues.map(x => ({ x, y: slope * (x - x0) + y0 })));
    } catch (error) {
      setTangentLine([]);
    }
  };

  const points = calculatePoints();
  const roots = findRoots(points);

  return (
    <Card sx={{ padding: 3, backgroundColor: '#f0f4ff', color: '#1e3a8a', borderRadius: 3 }}> 
      <CardHeader title="Advanced 2D Graphing Tool" sx={{ textAlign: 'center', color: '#1e3a8a' }} />
      <CardContent>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Enter a mathematical function to visualize its graph. You can also find roots and draw a tangent at any point.
        </Typography>

        <TextField
          label="Function"
          variant="outlined"
          fullWidth
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          helperText="Example: x^2 - 4, sin(x), log(x)"
          sx={{ backgroundColor: 'white', borderRadius: 1 }}
        />

        <div style={{ marginTop: 16, display: 'flex', gap: '10px' }}>
          <Button onClick={() => setShowRoots(!showRoots)} variant="contained" color="primary">
            {showRoots ? "Hide Roots" : "Show Roots"}
          </Button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: '10px' }}>
          <TextField
            label="Tangent at x"
            variant="outlined"
            value={tangentX}
            onChange={(e) => setTangentX(e.target.value)}
            helperText="Enter an x-value"
            sx={{ width: '120px', backgroundColor: 'white', borderRadius: 1 }}
          />
          <Button onClick={calculateTangent} variant="contained" color="secondary">
            Show Tangent
          </Button>
        </div>

        <div style={{ height: 400, width: "100%", marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
          <ResponsiveContainer>
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" domain={[range.min, range.max]} />
              <YAxis type="number" domain={['auto', 'auto']} />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} name={equation} />

              {showRoots &&
                roots.map((x, i) => (
                  <ReferenceLine key={`root-${i}`} x={x} stroke="red" label={`Root: ${x.toFixed(2)}`} />
                ))}

              {tangentLine.length > 0 && (
                <>
                  <ReferenceLine x={parseFloat(tangentX)} stroke="purple" label={`Tangent at x=${tangentX}`} />
                  <Line type="monotone" data={tangentLine} stroke="purple" dot={false} strokeDasharray="5 5" name="Tangent Line" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedGraphTool;
