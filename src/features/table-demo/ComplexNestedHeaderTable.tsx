import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

interface EmployeePerformance {
  name: string;
  q1_2023: number;
  q2_2023: number;
  q3_2023: number;
  q4_2023: number;
  q1_2024: number;
  q2_2024: number;
  q3_2024: number;
  q4_2024: number;
}

const data: EmployeePerformance[] = [
  {
    name: '田中太郎',
    q1_2023: 100, q2_2023: 120, q3_2023: 110, q4_2023: 130,
    q1_2024: 140, q2_2024: 150, q3_2024: 160, q4_2024: 170
  },
  {
    name: '佐藤花子',
    q1_2023: 90, q2_2023: 115, q3_2023: 105, q4_2023: 125,
    q1_2024: 135, q2_2024: 145, q3_2024: 155, q4_2024: 165
  },
  {
    name: '山田次郎',
    q1_2023: 85, q2_2023: 95, q3_2023: 100, q4_2023: 115,
    q1_2024: 125, q2_2024: 135, q3_2024: 145, q4_2024: 155
  }
];

const ComplexNestedHeaderTable: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* 第1層ヘッダー */}
          <TableRow>
            <TableCell 
              rowSpan={3}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              社員名
            </TableCell>
            <TableCell 
              colSpan={4}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'secondary.light',
                color: 'secondary.contrastText'
              }}
            >
              2023年度実績
            </TableCell>
            <TableCell 
              colSpan={4}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'success.light',
                color: 'success.contrastText'
              }}
            >
              2024年度実績
            </TableCell>
          </TableRow>
          
          {/* 第2層ヘッダー */}
          <TableRow>
            <TableCell 
              colSpan={2}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText'
              }}
            >
              上半期
            </TableCell>
            <TableCell 
              colSpan={2}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText'
              }}
            >
              下半期
            </TableCell>
            <TableCell 
              colSpan={2}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'success.main',
                color: 'success.contrastText'
              }}
            >
              上半期
            </TableCell>
            <TableCell 
              colSpan={2}
              align="center"
              sx={{ 
                fontWeight: 'bold', 
                backgroundColor: 'success.main',
                color: 'success.contrastText'
              }}
            >
              下半期
            </TableCell>
          </TableRow>
          
          {/* 第3層ヘッダー */}
          <TableRow>
            {(['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter: string, index: number) => (
              <TableCell 
                key={quarter + index}
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: index < 4 ? 'secondary.dark' : 'success.dark',
                  color: index < 4 ? 'secondary.contrastText' : 'success.contrastText'
                }}
              >
                {quarter}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: EmployeePerformance, index: number) => (
            <TableRow 
              key={index}
              sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                {row.name}
              </TableCell>
              <TableCell align="center">{row.q1_2023}</TableCell>
              <TableCell align="center">{row.q2_2023}</TableCell>
              <TableCell align="center">{row.q3_2023}</TableCell>
              <TableCell align="center">{row.q4_2023}</TableCell>
              <TableCell align="center">{row.q1_2024}</TableCell>
              <TableCell align="center">{row.q2_2024}</TableCell>
              <TableCell align="center">{row.q3_2024}</TableCell>
              <TableCell align="center">{row.q4_2024}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComplexNestedHeaderTable;