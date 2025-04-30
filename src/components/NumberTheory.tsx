import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, Button, Typography, List, ListItem, ListItemText, Box, TextField } from "@mui/material";
import { VennDiagram } from "react-venn-diagram";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function NumberTheory() {
  const [chartData, setChartData] = useState(null);
  const [primes, setPrimes] = useState([]);
  const [inputValue, setInputValue] = useState(0);

  // Set initial chart data
  useEffect(() => {
    setChartData({
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "Sample Data",
          data: [10, 20, 30, 40, 50],
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    });
  }, []);

  // Function to generate prime numbers using Sieve of Eratosthenes
  const generatePrimes = (n) => {
    const sieve = Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false; // 0 and 1 are not prime numbers
    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= n; j += i) {
          sieve[j] = false;
        }
      }
    }
    return sieve.map((isPrime, index) => (isPrime ? index : null)).filter(Number);
  };

  // Handle generating primes and updating state
  const handleGeneratePrimes = () => {
    const generatedPrimes = generatePrimes(inputValue);
    setPrimes(generatedPrimes);
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(Number(e.target.value));
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "white", color: "blue" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "blue" }}>
        Number Theory Visualizations
      </Typography>
      
      {/* Prime Numbers Visualization */}
      <Card sx={{ marginBottom: 2, border: "2px solid blue", padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "blue" }}>
            Prime Numbers
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "blue" }}>
            Visualize prime distributions along the number line and interactively simulate the Sieve of Eratosthenes.
          </Typography>
          
          {/* Input for Prime Number Generation */}
          <TextField
            label="Enter number limit"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ marginBottom: 2, width: "200px" }}
          />
          <Button variant="contained" color="primary" onClick={handleGeneratePrimes} sx={{ marginBottom: 2 }}>
            Generate Primes
          </Button>
          <List>
            {primes.length > 0 ? (
              primes.map((prime) => (
                <ListItem key={prime}>
                  <ListItemText primary={prime} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No primes generated yet." />
              </ListItem>
            )}
          </List>
          <Canvas style={{ height: 300 }}> {/* React-Three-Fiber visualization */}
            {/* Add 3D representation of prime numbers here */}
          </Canvas>
        </CardContent>
      </Card>
      
      {/* Factorization and Divisors */}
      <Card sx={{ marginBottom: 2, border: "2px solid blue", padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "blue" }}>
            Factorization and Divisors
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "blue" }}>
            Visualize factor trees for integers and explore Venn diagrams for GCD and LCM relationships.
          </Typography>
          
          {/* Venn Diagram for GCD/LCM */}
          <VennDiagram
            sets={{ A: [1, 2, 3, 4, 5], B: [4, 5, 6] }} // Example data, replace with dynamic inputs
            setLabels={["Set A", "Set B"]}
            style={{ height: 300, width: "100%" }}
          />
          
          {chartData ? (
            <Chart data={chartData} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No chart data available.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      {/* Modular Arithmetic */}
      <Card sx={{ marginBottom: 2, border: "2px solid blue", padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "blue" }}>
            Modular Arithmetic
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "blue" }}>
            Visualizing modular congruences and residue class patterns with interactive tools.
          </Typography>
          
          {/* Circular Visualization for Modular Arithmetic */}
          <Canvas style={{ height: 300 }}> {/* React-Three-Fiber visualization */}</Canvas>
          
          {chartData ? (
            <Chart data={chartData} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No chart data available.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      {/* Sequences and Series */}
      <Card sx={{ marginBottom: 2, border: "2px solid blue", padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "blue" }}>
            Sequences and Series
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "blue" }}>
            Explore Fibonacci, arithmetic, and geometric progressions, as well as convergence and growth patterns.
          </Typography>
          
          {/* Fibonacci Sequence Visualization */}
          <Canvas style={{ height: 300 }}>
            {/* Add visual representation of Fibonacci Sequence here */}
          </Canvas>
          
          {chartData ? (
            <Chart data={chartData} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No chart data available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default NumberTheory;
