import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box
} from '@mui/material';

interface EmployeeWithSalary {
  name: string;
  age: number;
  job: string;
  salary: number;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof EmployeeWithSalary;

const data: EmployeeWithSalary[] = [
  { name: '田中太郎', age: 30, job: 'エンジニア', salary: 550000 },
  { name: '佐藤花子', age: 25, job: 'デザイナー', salary: 480000 },
  { name: '山田次郎', age: 35, job: 'マネージャー', salary: 720000 },
  { name: '鈴木美咲', age: 28, job: 'プロダクトマネージャー', salary: 650000 },
  { name: '高橋健太', age: 32, job: 'バックエンドエンジニア', salary: 600000 },
  { name: '渡辺恵子', age: 27, job: 'フロントエンドエンジニア', salary: 520000 }
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof EmployeeWithSalary;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: '名前',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: '年齢',
  },
  {
    id: 'job',
    numeric: false,
    disablePadding: false,
    label: '職業',
  },
  {
    id: 'salary',
    numeric: true,
    disablePadding: false,
    label: '給与',
  },
];

interface EnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EmployeeWithSalary) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) {
  const createSortHandler =
    (property: keyof EmployeeWithSalary) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ 
                  border: 0,
                  clip: 'rect(0 0 0 0)',
                  height: 1,
                  margin: -1,
                  overflow: 'hidden',
                  padding: 0,
                  position: 'absolute',
                  top: 20,
                  width: 1,
                }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const SortableTable: React.FC = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof EmployeeWithSalary,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = stableSort(data, getComparator(order, orderBy));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {visibleRows.map((row: EmployeeWithSalary, index: number) => (
            <TableRow
              hover
              tabIndex={-1}
              key={row.name}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.age}</TableCell>
              <TableCell>{row.job}</TableCell>
              <TableCell align="right">
                ¥{row.salary.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SortableTable;