import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundVideo from './BackgroundVideo';  // Add this import

// Update DashboardContainer to include color white
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;  // Add this line
`;

// Add this to your component's return statement
const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(''); // Add this state
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('adminData'));

  const years = ['1', '2', '3', '4'];
  const semesters = {
    '1': ['1', '2'],
    '2': ['1', '2'],
    '3':['1', '2'],
    '4': ['1', '2'],
  };

  useEffect(() => {
    if (!adminData) {
      navigate('/admin');
      return;
    }
  }, [adminData, navigate]);

  const handleYearChange = async (year) => {
    setSelectedYear(year);
    setSelectedSem('');
    setSubjects([]);
  };

  const handleSemChange = async (sem) => {
    setSelectedSem(sem);
    if (selectedYear && sem) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/questions?branch=${adminData.branch}&year=${selectedYear}&sem=${sem}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch subjects');
        
        const data = await response.json();
        const uniqueSubjects = [...new Set(data.questions.map(q => q.sname))];
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchResults = async (subject) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/results?branch=${adminData.branch}&year=${selectedYear}&sem=${selectedSem}&subject=${subject}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch results');
    }
  };

  // Add these after DashboardContainer and before AdminDashboard component
  const FilterSection = styled.div`
    margin: 20px 0;
    display: flex;
    gap: 20px;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
  `;
  
  const Select = styled.select`
    padding: 12px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 16px;
    backdrop-filter: blur(5px);
  
    option {
      background: #2c3e50;
      color: white;
    }
  `;
  
  const ReportButton = styled.button`
    padding: 12px 24px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
  
    &:hover {
      background: #45a049;
    }
  
    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  `;
  
  const ResultsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
  
    th, td {
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      text-align: left;
    }
  
    th {
      background: rgba(255, 255, 255, 0.2);
    }
  
    tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.05);
    }
  `;
  
  // Then in your return statement, remove the styled components and keep only the JSX:
  return (
    <>
      <BackgroundVideo />
      <DashboardContainer>
        <h1>Results Dashboard - {adminData?.branch}</h1>
        <FilterSection>
          <div>
            <label>Year: </label>
            <Select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}>
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </div>

          {selectedYear && (
            <div>
              <label>Semester: </label>
              <Select value={selectedSem} onChange={(e) => handleSemChange(e.target.value)}>
                <option value="">Select Semester</option>
                {semesters[selectedYear].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </Select>
            </div>
          )}

          {subjects.length > 0 && (
            <>
              <div>
                <label>Subject: </label>
                <Select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Select>
              </div>
              <ReportButton 
                onClick={() => fetchResults(selectedSubject)}
                disabled={!selectedSubject}
              >
                View Report
              </ReportButton>
            </>
          )}
        </FilterSection>

        {results.length > 0 && (
          <ResultsTable>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Student ID</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q5</th>
             
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.CNAME}</td>
                  <td>{result.REGNO}</td>
                  <td>{result.YEAR}</td>
                  <td>{result.SEM}</td>
                  <td>{result.Q1}</td>
                  <td>{result.Q2}</td>
                  <td>{result.Q3}</td>
                  <td>{result.Q4}</td>
                  <td>{result.Q5}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: '#e6e6e6' }}>
                <td colSpan="4">Question Totals</td>
                <td>{results.reduce((sum, r) => sum + Number(r.Q1), 0)}</td>
                <td>{results.reduce((sum, r) => sum + Number(r.Q2), 0)}</td>
                <td>{results.reduce((sum, r) => sum + Number(r.Q3), 0)}</td>
                <td>{results.reduce((sum, r) => sum + Number(r.Q4), 0)}</td>
                <td>{results.reduce((sum, r) => sum + Number(r.Q5), 0)}</td>
              </tr>
              <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                <td colSpan="4">Average of Total</td>
                <td colSpan="5">
                  {(results.reduce((sum, r) => 
                    sum + Number(r.Q1) + Number(r.Q2) + Number(r.Q3) + Number(r.Q4) + Number(r.Q5), 
                    0) / (results.length * 5)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </ResultsTable>
          )}
        </DashboardContainer>
      </>
    );
};

export default AdminDashboard;