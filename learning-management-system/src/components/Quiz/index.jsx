import { Button } from '@mui/material';
import React, { useState } from 'react';

const Quiz = ({ quizzes }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
  };

  const handleSubmit = () => {
    let score = 0;
    quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.correctAnswer) {
        score++;
      }
    });
    setResult(`You scored ${score} out of ${quizzes.length}`);
  };

  return (
    <div>
      {quizzes.map((quiz, index) => (
        <div key={index}>
          <h3>{quiz.question}</h3>
          {quiz.options.map((option, optIndex) => (
            <label key={optIndex}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={answers[index] === option}
                onChange={() => handleChange(index, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <Button onClick={handleSubmit}
       sx={{
        border: '2px solid #1976d2', 
        borderRadius: '20px',
        '&:hover': {
          borderColor: '#1565c0', 
        },
      }}
       >Submit</Button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default Quiz;
