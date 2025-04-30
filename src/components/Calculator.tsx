import React, { useState } from 'react';
import { evaluate } from 'mathjs';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    '(', ')', '^', 'C'
  ];

  const handleClick = (value: string) => {
    setError('');
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        const calculatedResult = evaluate(input);
        setResult(calculatedResult.toString());
      } catch (err) {
        setError('Invalid expression');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 text-right text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="0"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {result && <p className="text-right text-2xl font-bold text-indigo-600 mt-2">{result}</p>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className="p-4 text-xl font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;