import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Slider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

type TabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

type BarDatum = { name: string; value: number };
type ScatterDatum = { x: number; y: number };
type PieDatum = { name: string; value: number };

const Statistics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [barData, setBarData] = useState('');
  const [scatterData, setScatterData] = useState('');
  const [pieData, setPieData] = useState('');
  const [descriptiveData, setDescriptiveData] = useState('');
  const [processedBarData, setProcessedBarData] = useState<BarDatum[]>([]);
  const [processedScatterData, setProcessedScatterData] = useState<ScatterDatum[]>([]);
  const [processedPieData, setProcessedPieData] = useState<PieDatum[]>([]);
  const [barError, setBarError] = useState<string>('');
  const [scatterError, setScatterError] = useState<string>('');
  const [pieError, setPieError] = useState<string>('');
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [sampleSize, setSampleSize] = useState(100);
  const [histBins, setHistBins] = useState(10);
  const [showRegression, setShowRegression] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const processBarData = () => {
    try {
      const data = JSON.parse(barData) as BarDatum[];
      if (!Array.isArray(data)) throw new Error();
      setProcessedBarData(data);
      setBarError('');
    } catch {
      setBarError('Invalid JSON. Example: [{"name": "A", "value": 10}]');
    }
  };

  const processScatterData = () => {
    try {
      const data = JSON.parse(scatterData) as ScatterDatum[];
      if (!Array.isArray(data)) throw new Error();
      setProcessedScatterData(data);
      setScatterError('');
    } catch {
      setScatterError('Invalid JSON. Example: [{"x": 1, "y": 10}]');
    }
  };

  const processPieData = () => {
    try {
      const data = JSON.parse(pieData) as PieDatum[];
      if (!Array.isArray(data)) throw new Error();
      setProcessedPieData(data);
      setPieError('');
    } catch {
      setPieError('Invalid JSON. Example: [{"name": "A", "value": 10}]');
    }
  };

  const parseCsvNumbers = (input: string): number[] =>
    input
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((v) => !Number.isNaN(v));

  const calculateStats = (input: string) => {
    try {
      const values = parseCsvNumbers(input);
      const n = values.length;
      if (n === 0) return null;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / n;
      const sorted = [...values].sort((a, b) => a - b);
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      return { mean, median, variance, stdDev, min: sorted[0], max: sorted[n - 1], q1, q3 };
    } catch {
      return null;
    }
  };

  const buildHistogram = (values: number[], bins: number) => {
    if (values.length === 0) return [] as { bin: string; count: number }[];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = (max - min) / bins || 1;
    const counts = new Array(bins).fill(0);
    values.forEach((v) => {
      let idx = Math.floor((v - min) / width);
      if (idx >= bins) idx = bins - 1;
      if (idx < 0) idx = 0;
      counts[idx] += 1;
    });
    return counts.map((c, i) => ({ bin: `${(min + i * width).toFixed(2)}-${(min + (i + 1) * width).toFixed(2)}`, count: c }));
  };

  const linearRegression = (points: ScatterDatum[]) => {
    if (points.length < 2) return { m: 0, b: 0, line: [] as ScatterDatum[] };
    const n = points.length;
    const sumX = points.reduce((a, p) => a + p.x, 0);
    const sumY = points.reduce((a, p) => a + p.y, 0);
    const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
    const sumXX = points.reduce((a, p) => a + p.x * p.x, 0);
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const b = sumY / n - (m * sumX) / n;
    const xs = [...points.map((p) => p.x)].sort((a, b) => a - b);
    const x0 = xs[0];
    const x1 = xs[xs.length - 1];
    return { m, b, line: [{ x: x0, y: m * x0 + b }, { x: x1, y: m * x1 + b }] };
  };

  const generateNormalData = () => {
    const data = [];
    for (let i = -4; i <= 4; i += 8 / sampleSize) {
      const x = mean + (i * stdDev);
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      data.push({ x, y });
    }
    return data;
  };

  const stats = descriptiveData ? calculateStats(descriptiveData) : null;
  const normalData = generateNormalData();
  const histogramData = buildHistogram(parseCsvNumbers(descriptiveData), histBins);
  const regression = linearRegression(processedScatterData);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{
        borderRadius: 3,
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(120deg, #e0f2fe 0%, #f5d0fe 50%, #fde68a 100%)'
      }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Data Visualization" />
          <Tab label="Descriptive Statistics" />
          <Tab label="Inferential Statistics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Bar Chart Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
                <Typography variant="h6">Bar Chart</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={barData}
                  onChange={(e) => setBarData(e.target.value)}
                  placeholder='[{"name": "A", "value": 10}, {"name": "B", "value": 20}]'
                  sx={{ my: 2 }}
                />
                {barError && (<Typography variant="caption" color="error">{barError}</Typography>)}
                <Button variant="contained" onClick={processBarData} sx={{ mb: 2 }}>
                  Generate Bar Chart
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <BarChart width={500} height={300} data={processedBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </Box>
              </Paper>
            </Grid>

            {/* Scatter Plot Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
                <Typography variant="h6">Scatter Plot</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={scatterData}
                  onChange={(e) => setScatterData(e.target.value)}
                  placeholder='[{"x": 1, "y": 10}, {"x": 2, "y": 20}]'
                  sx={{ my: 2 }}
                />
                {scatterError && (<Typography variant="caption" color="error">{scatterError}</Typography>)}
                <Button variant="contained" onClick={processScatterData} sx={{ mb: 2, mr: 2 }}>
                  Generate Scatter Plot
                </Button>
                <Button variant="outlined" onClick={() => setShowRegression((s) => !s)} sx={{ mb: 2 }}>
                  {showRegression ? 'Hide' : 'Show'} Regression
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ComposedChart width={600} height={320} data={processedScatterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" />
                    <YAxis dataKey="y" type="number" />
                    <Tooltip />
                    <Scatter data={processedScatterData} fill="#60a5fa" />
                    {showRegression && regression.line.length === 2 && (
                      <Line type="linear" dataKey="y" data={regression.line} stroke="#f472b6" dot={false} isAnimationActive={false} />
                    )}
                  </ComposedChart>
                </Box>
              </Paper>
            </Grid>

            {/* Pie Chart Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
                <Typography variant="h6">Pie Chart</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={pieData}
                  onChange={(e) => setPieData(e.target.value)}
                  placeholder='[{"name": "A", "value": 10}, {"name": "B", "value": 20}]'
                  sx={{ my: 2 }}
                />
                {pieError && (<Typography variant="caption" color="error">{pieError}</Typography>)}
                <Button variant="contained" onClick={processPieData} sx={{ mb: 2 }}>
                  Generate Pie Chart
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart width={500} height={300}>
                    <Pie
                      data={processedPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                    >
                      {processedPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(180deg,#0f172a,#111827)', color: '#e5e7eb' }}>
            <Typography variant="h6">Descriptive Statistics</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={descriptiveData}
              onChange={(e) => setDescriptiveData(e.target.value)}
              placeholder="Enter comma-separated numbers (e.g., 1, 2, 3, 4, 5)"
              sx={{ my: 2 }}
            />
            {stats && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Statistic</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Mean</TableCell>
                      <TableCell align="right">{stats.mean.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Median</TableCell>
                      <TableCell align="right">{stats.median.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Variance</TableCell>
                      <TableCell align="right">{stats.variance.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Standard Deviation</TableCell>
                      <TableCell align="right">{stats.stdDev.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Minimum</TableCell>
                      <TableCell align="right">{stats.min.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maximum</TableCell>
                      <TableCell align="right">{stats.max.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {/* Histogram */}
            {descriptiveData && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Histogram (bins: {histBins})</Typography>
                <Slider min={3} max={30} step={1} value={histBins} onChange={(_, v) => setHistBins(v as number)} sx={{ maxWidth: 360 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <BarChart width={600} height={300} data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" angle={-30} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#34d399" />
                  </BarChart>
                </Box>
              </Box>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Normal Distribution</Typography>
            <Grid container spacing={3} sx={{ my: 2 }}>
              <Grid item xs={12}>
                <Typography>Mean</Typography>
                <Slider
                  value={mean}
                  onChange={(_, newValue) => setMean(newValue)}
                  min={-5}
                  max={5}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Standard Deviation</Typography>
                <Slider
                  value={stdDev}
                  onChange={(_, newValue) => setStdDev(newValue)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Sample Size</Typography>
                <Slider
                  value={sampleSize}
                  onChange={(_, newValue) => setSampleSize(newValue)}
                  min={10}
                  max={200}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart width={600} height={300} data={normalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis dataKey="y" />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
              </LineChart>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Statistics;