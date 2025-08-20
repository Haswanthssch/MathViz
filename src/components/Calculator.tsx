import React, { useMemo, useState } from 'react';
import { evaluate } from 'mathjs';
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Stack, Switch, TextField, Tooltip, Typography, FormControlLabel } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

type Mode = 'DEG' | 'RAD';

const sciRows: string[][] = [
  ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'],
  ['ln', 'log', 'sqrt', 'π', 'e', '^'],
];

const basicRows: string[][] = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
  ['(', ')', 'C', '%'],
];

const Calculator: React.FC = () => {
  const [expr, setExpr] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<Mode>('RAD');

  const scope = useMemo(() => {
    const toRad = (x: number) => (mode === 'DEG' ? (x * Math.PI) / 180 : x);
    const toDeg = (x: number) => (mode === 'DEG' ? (x * 180) / Math.PI : x);
    return {
      sin: (x: number) => Math.sin(toRad(x)),
      cos: (x: number) => Math.cos(toRad(x)),
      tan: (x: number) => Math.tan(toRad(x)),
      asin: (x: number) => toDeg(Math.asin(x)),
      acos: (x: number) => toDeg(Math.acos(x)),
      atan: (x: number) => toDeg(Math.atan(x)),
      ln: (x: number) => Math.log(x),
      log: (x: number) => Math.log10(x),
      sqrt: (x: number) => Math.sqrt(x),
      π: Math.PI,
      e: Math.E,
    } as Record<string, unknown>;
  }, [mode]);

  const append = (token: string) => {
    setError('');
    setResult('');
    if (token === 'π') token = 'π';
    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'sqrt'].includes(token)) {
      setExpr((p) => p + token + '(');
      return;
    }
    if (token === '=') {
      try {
        const out = evaluate(expr, scope);
        setResult(String(out));
      } catch {
        setError('Invalid expression');
      }
      return;
    }
    if (token === 'C') {
      setExpr('');
      setResult('');
      setError('');
      return;
    }
    setExpr((p) => p + token);
  };

  const handleBackspace = () => {
    setError('');
    setExpr((p) => p.slice(0, -1));
  };

  return (
    <Card sx={{
      borderRadius: 3,
      backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #f5d0fe 45%, #fde68a 100%)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    }}>
      <CardHeader title="Scientific Calculator" sx={{
        textAlign: 'center',
        color: '#111827',
        fontWeight: 800,
        '& .MuiCardHeader-title': { fontSize: 24 }
      }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(180deg,#0f172a,#111827)',
              color: '#e5e7eb',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Stack sx={{ flex: 1 }}>
                <TextField
                  value={expr}
                  onChange={(e) => setExpr(e.target.value)}
                  placeholder="Enter expression"
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: 1 },
                  }}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color={error ? 'error' : 'text.secondary'}>
                    {error || ' '}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#93c5fd', fontWeight: 700 }}>
                    {result}
                  </Typography>
                </Stack>
              </Stack>
              <Tooltip title="Backspace">
                <IconButton onClick={handleBackspace} sx={{ color: '#e5e7eb' }}>
                  <BackspaceIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" color="text.secondary">Mode</Typography>
              <FormControlLabel
                control={<Switch checked={mode === 'DEG'} onChange={(e) => setMode(e.target.checked ? 'DEG' : 'RAD')} />}
                label={mode === 'DEG' ? 'DEG' : 'RAD'}
              />
            </Stack>
          </Grid>

          {/* Scientific Rows */}
          {sciRows.map((row, idx) => (
            <Grid key={`sci-${idx}`} item xs={12}>
              <Grid container spacing={1}>
                {row.map((b) => (
                  <Grid key={b} item xs={2}>
                    <Button fullWidth variant="contained" onClick={() => append(b)}>{b}</Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}

          {/* Basic Rows */}
          {basicRows.map((row, idx) => (
            <Grid key={`basic-${idx}`} item xs={12}>
              <Grid container spacing={1}>
                {row.map((b) => (
                  <Grid key={b} item xs={3}>
                    <Button
                      fullWidth
                      variant={b === '=' ? 'contained' : 'outlined'}
                      color={b === '=' ? 'primary' : 'inherit'}
                      onClick={() => append(b)}
                    >
                      {b}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Calculator;