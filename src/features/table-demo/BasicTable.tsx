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

interface Employee {
  name: string;
  age: number;
  job: string;
}

const data: Employee[] = [
  { name: '田中太郎', age: 30, job: 'エンジニア' },
  { name: '佐藤花子', age: 25, job: 'デザイナー' },
  { name: '山田次郎', age: 35, job: 'マネージャー' },
  { name: '鈴木美咲', age: 28, job: 'プロダクトマネージャー' },
  { name: '高橋健太', age: 32, job: 'バックエンドエンジニア' }
];

const BasicTable: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>名前</TableCell>
            <TableCell align="right">年齢</TableCell>
            <TableCell align="right">職業</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: Employee) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.age}</TableCell>
              <TableCell align="right">{row.job}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;