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

const TransposedComplexNestedHeaderTable: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* 第1層ヘッダー - 時期とデータ */}
          <TableRow>
            <TableCell 
              colSpan={3}
              align="center"
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              時期
            </TableCell>
            {data.map((employee, index) => (
              <TableCell 
                key={employee.name}
                align="center"
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: index % 2 === 0 ? 'secondary.light' : 'success.light',
                  color: index % 2 === 0 ? 'secondary.contrastText' : 'success.contrastText'
                }}
              >
                {employee.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 2023年度 上半期 Q1 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              rowSpan={4}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'secondary.light',
                color: 'secondary.contrastText',
                writingMode: 'vertical-rl',
                textAlign: 'center'
              }}
            >
              2023年度実績
            </TableCell>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText'
              }}
            >
              上半期
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'secondary.dark',
                color: 'secondary.contrastText'
              }}
            >
              Q1
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q1_2023}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2023年度 上半期 Q2 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'secondary.dark',
                color: 'secondary.contrastText'
              }}
            >
              Q2
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q2_2023}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2023年度 下半期 Q3 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText'
              }}
            >
              下半期
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'secondary.dark',
                color: 'secondary.contrastText'
              }}
            >
              Q3
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q3_2023}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2023年度 下半期 Q4 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'secondary.dark',
                color: 'secondary.contrastText'
              }}
            >
              Q4
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q4_2023}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2024年度 上半期 Q1 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              rowSpan={4}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                writingMode: 'vertical-rl',
                textAlign: 'center'
              }}
            >
              2024年度実績
            </TableCell>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'success.main',
                color: 'success.contrastText'
              }}
            >
              上半期
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'success.dark',
                color: 'success.contrastText'
              }}
            >
              Q1
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q1_2024}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2024年度 上半期 Q2 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'success.dark',
                color: 'success.contrastText'
              }}
            >
              Q2
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q2_2024}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2024年度 下半期 Q3 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle', 
                fontWeight: 'bold',
                backgroundColor: 'success.main',
                color: 'success.contrastText'
              }}
            >
              下半期
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'success.dark',
                color: 'success.contrastText'
              }}
            >
              Q3
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q3_2024}
              </TableCell>
            ))}
          </TableRow>
          
          {/* 2024年度 下半期 Q4 */}
          <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
            <TableCell 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'success.dark',
                color: 'success.contrastText'
              }}
            >
              Q4
            </TableCell>
            {data.map((employee) => (
              <TableCell key={employee.name} align="center">
                {employee.q4_2024}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransposedComplexNestedHeaderTable;