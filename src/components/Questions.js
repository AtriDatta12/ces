import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundVideo from './BackgroundVideo';

const QuestionsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  color: white;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 10px 0px;
    width: 95%;
  }
`;

const QuestionCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px 0px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  p {
    color: white;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
    padding-right: 20px;
  }

  div {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 20px 0px;
    
    p {
      font-size: 14px;
      padding-right: 10px;
    }

    div {
      gap: 10px;
    }
  }
`;

const OptionButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
  transition: all 0.3s ease;
  
  &.average {
    background: rgba(255, 99, 71, 0.5); // Tomato red
    &.selected {
      background: #FF4136; // Brighter red
      transform: scale(1.05);
    }
  }

  &.moderate {
    background: rgba(255, 215, 0, 0.5); // Gold
    &.selected {
      background: #FFD700; // Brighter gold
      transform: scale(1.05);
    }
  }

  &.good {
    background: rgba(46, 204, 113, 0.5); // Emerald green
    &.selected {
      background: #2ECC71; // Brighter green
      transform: scale(1.05);
    }
  }

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

const SubmitButton = styled.button`
  width: 200px;
  padding: 12px;
  margin: 20px auto;
  display: block;
  border: none;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(54, 113, 250) 0%, rgb(250, 9, 9) 100%);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }
`;

const SubjectSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const SubjectTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  text-transform:uppercase;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false); // Add this line
  const navigate = useNavigate();
  const studentData = JSON.parse(localStorage.getItem('studentData'));

  useEffect(() => {
    if (!studentData) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/questions?branch=${studentData.branch}&sem=${studentData.semester}&year=${studentData.year}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const data = await response.json();
        console.log('Raw data from server:', data); // Debug log
        
        // Handle both array and object responses
        const questionsList = Array.isArray(data) ? data : data.questions || [];
        console.log('Processed questions:', questionsList); // Debug log
        
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error:', error);
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, [studentData, navigate]);

  const handleOptionSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Add these styled components after your existing styled components
  // Move these styled components to the top of the file, after other styled components and before the Questions component
  // Move these styled components outside the Questions component, to the top level
  const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  `;
  
  const PopupContent = styled.div`
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
    h2 {
      color: #2ECC71;
      margin-bottom: 20px;
      font-size: 28px;
    }
  
    p {
      color: #333;
      font-size: 18px;
    }
  `;
  
  // Inside the Questions component, update the handleSubmit function
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/submitAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentAnswers: answers,
          studentData: studentData
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
  
      await response.json();
      setShowPopup(true);
      
      // Increased timeout for better visibility
      setTimeout(() => {
        setShowPopup(false);
        setTimeout(() => {
          localStorage.removeItem('studentData');
          navigate('/');
        }, 500);
      }, 4000);
  
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit answers. Please try again.');
    }
  };
  
  // Add this before the closing tag of your return statement
  

  // Update the buttons in the return statement
  // Add this function to group questions by subject
  const groupQuestionsBySubject = (questions) => {
    return questions.reduce((acc, question) => {
      if (!acc[question.sname]) {
        acc[question.sname] = [];
      }
      acc[question.sname].push(question);
      return acc;
    }, {});
  };

  return (
    <>
      <BackgroundVideo />
      <QuestionsContainer>
        <h1>Welcome, {studentData?.name}</h1>
        {questions && questions.length > 0 ? (
          Object.entries(groupQuestionsBySubject(questions)).map(([subject, subjectQuestions]) => (
            <SubjectSection key={subject}>
              <SubjectTitle>{subject}</SubjectTitle>
              
              {subjectQuestions.map((question, index) => (
                <QuestionCard key={question._id || question.id}>
                  <p><strong>Q{index + 1}.</strong> {question.question || question.que}</p>
                  <div>
                    <OptionButton
                      className={`${answers[question._id || question.id] === 1 ? 'selected' : ''} average`}
                      onClick={() => handleOptionSelect(question._id || question.id, 1)}
                    >
                      Average
                    </OptionButton>
                    <OptionButton
                      className={`${answers[question._id || question.id] === 2 ? 'selected' : ''} moderate`}
                      onClick={() => handleOptionSelect(question._id || question.id, 2)}
                    >
                      Moderate
                    </OptionButton>
                    <OptionButton
                      className={`${answers[question._id || question.id] === 3 ? 'selected' : ''} good`}
                      onClick={() => handleOptionSelect(question._id || question.id, 3)}
                    >
                      Good
                    </OptionButton>
                  </div>
                </QuestionCard>
              ))}
            </SubjectSection>
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <SubmitButton 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
        >
          Submit All Answers
        </SubmitButton>
      </QuestionsContainer>
      {showPopup && (
        <PopupOverlay>
          <PopupContent>
            <h2>Success!</h2>
            <p>Course End Survey Submitted Successfully</p>
          </PopupContent>
        </PopupOverlay>
      )}
    </>
  );
};

export default Questions;