import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  alpha
} from '@mui/material';

interface EmployeeWithId {
  id: number;
  name: string;
  age: number;
  job: string;
}

const data: EmployeeWithId[] = [
  { id: 1, name: '田中太郎', age: 30, job: 'エンジニア' },
  { id: 2, name: '佐藤花子', age: 25, job: 'デザイナー' },
  { id: 3, name: '山田次郎', age: 35, job: 'マネージャー' },
  { id: 4, name: '鈴木美咲', age: 28, job: 'プロダクトマネージャー' },
  { id: 5, name: '高橋健太', age: 32, job: 'バックエンドエンジニア' },
  { id: 6, name: '渡辺恵子', age: 27, job: 'フロントエンドエンジニア' }
];

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar({ numSelected }: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} 件選択中
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          社員一覧
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="削除">
          <IconButton>
            {/* DeleteIcon can be added here */}
            🗑️
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}

const SelectableTable: React.FC = () => {
  const [selected, setSelected] = useState<readonly number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number): boolean => selected.indexOf(id) !== -1;

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>名前</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>年齢</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>職業</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: EmployeeWithId, index: number) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell>{row.job}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SelectableTable;