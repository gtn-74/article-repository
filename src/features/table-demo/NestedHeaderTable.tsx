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

interface EmployeeContact {
  name: string;
  phone: string;
  email: string;
  department: string;
}

const data: EmployeeContact[] = [
  { 
    name: '田中太郎',
    phone: '090-1234-5678',
    email: 'tanaka@example.com',
    department: '営業部'
  },
  { 
    name: '佐藤花子',
    phone: '090-8765-4321',
    email: 'sato@example.com',
    department: '開発部'
  },
  { 
    name: '山田次郎',
    phone: '090-5555-6666',
    email: 'yamada@example.com',
    department: 'マーケティング部'
  },
  { 
    name: '鈴木美咲',
    phone: '090-7777-8888',
    email: 'suzuki@example.com',
    department: '人事部'
  }
];

const NestedHeaderTable: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle',
                fontWeight: 'bold',
                backgroundColor: 'grey.100'
              }}
            >
              名前
            </TableCell>
            <TableCell 
              colSpan={2}
              align="center"
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'grey.100'
              }}
            >
              連絡先
            </TableCell>
            <TableCell 
              rowSpan={2}
              sx={{ 
                verticalAlign: 'middle',
                fontWeight: 'bold',
                backgroundColor: 'grey.100'
              }}
            >
              部署
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'grey.50'
              }}
            >
              電話番号
            </TableCell>
            <TableCell
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: 'grey.50'
              }}
            >
              メール
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: EmployeeContact, index: number) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NestedHeaderTable;