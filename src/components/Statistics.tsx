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
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
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

const Statistics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [barData, setBarData] = useState('');
  const [scatterData, setScatterData] = useState('');
  const [pieData, setPieData] = useState('');
  const [descriptiveData, setDescriptiveData] = useState('');
  const [processedBarData, setProcessedBarData] = useState([]);
  const [processedScatterData, setProcessedScatterData] = useState([]);
  const [processedPieData, setProcessedPieData] = useState([]);
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [sampleSize, setSampleSize] = useState(100);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const processBarData = () => {
    try {
      const data = JSON.parse(barData);
      setProcessedBarData(data);
    } catch (error) {
      alert('Please enter valid JSON data format: [{"name": "A", "value": 10}, ...]');
    }
  };

  const processScatterData = () => {
    try {
      const data = JSON.parse(scatterData);
      setProcessedScatterData(data);
    } catch (error) {
      alert('Please enter valid JSON data format: [{"x": 1, "y": 10}, ...]');
    }
  };

  const processPieData = () => {
    try {
      const data = JSON.parse(pieData);
      setProcessedPieData(data);
    } catch (error) {
      alert('Please enter valid JSON data format: [{"name": "A", "value": 10}, ...]');
    }
  };

const calculateStats = (input) => {
  try {
    const values = input.split(',').map(num => parseFloat(num.trim()));



    const n = values.length;
    if (n === 0) {
      alert('Input array is empty');
      return null;
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    const sortedValues = [...values].sort((a, b) => a - b);
    const median = n % 2 === 0
      ? (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2
      : sortedValues[Math.floor(n/2)];

    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    return { 
      mean, 
      median, 
      variance, 
      stdDev, 
      min: Math.min(...values), 
      max: Math.max(...values) 
    };
  } catch (error) {
    alert('Error in calculating statistics');
    return null;
  }
};


  const generateNormalData = () => {
    const data = [];
    for (let i = -4; i <= 4; i += 8/sampleSize) {
      const x = mean + (i * stdDev);
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      data.push({ x, y });
    }
    return data;
  };

  const stats = descriptiveData ? calculateStats(descriptiveData) : null;
  const normalData = generateNormalData();

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', p: 2 }}>
      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Data Visualization" />
          <Tab label="Descriptive Statistics" />
          <Tab label="Inferential Statistics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Bar Chart Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
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
              <Paper elevation={2} sx={{ p: 2 }}>
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
                <Button variant="contained" onClick={processScatterData} sx={{ mb: 2 }}>
                  Generate Scatter Plot
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ScatterChart width={500} height={300}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis dataKey="y" />
                    <Tooltip />
                    <Scatter data={processedScatterData} fill="#8884d8" />
                  </ScatterChart>
                </Box>
              </Paper>
            </Grid>

            {/* Pie Chart Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
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
                      {processedPieData.map((entry, index) => (
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
          <Paper elevation={2} sx={{ p: 2 }}>
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
                  onChange={(e, newValue) => setMean(newValue)}
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
                  onChange={(e, newValue) => setStdDev(newValue)}
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
                  onChange={(e, newValue) => setSampleSize(newValue)}
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