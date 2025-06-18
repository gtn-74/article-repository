import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import BasicTable from '../features/table-demo/BasicTable';
import NestedHeaderTable from '../features/table-demo/NestedHeaderTable';
import ComplexNestedHeaderTable from '../features/table-demo/ComplexNestedHeaderTable';
import TransposedComplexNestedHeaderTable from '../features/table-demo/TransposedComplexNestedHeaderTable';
import SortableTable from '../features/table-demo/SortableTable';
import SelectableTable from '../features/table-demo/SelectableTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TableDemoPage: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          テーブル実装デモ
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          HTMLとMUIを使った様々なテーブルパターンの実装例
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={value} onChange={handleChange} aria-label="table examples">
            <Tab label="基本テーブル" {...a11yProps(0)} />
            <Tab label="ネストヘッダー" {...a11yProps(1)} />
            <Tab label="複雑なネストヘッダー" {...a11yProps(2)} />
            <Tab label="転置された複雑なネストヘッダー" {...a11yProps(3)} />
            <Tab label="ソート機能" {...a11yProps(4)} />
            <Tab label="選択機能" {...a11yProps(5)} />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <Typography variant="h5" gutterBottom>基本的なテーブル</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            MUIの基本的なテーブルコンポーネントの使用例です。
          </Typography>
          <BasicTable />
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Typography variant="h5" gutterBottom>ネストされたヘッダー</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            colSpanとrowSpanを使用したシンプルなネストヘッダーの例です。
          </Typography>
          <NestedHeaderTable />
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <Typography variant="h5" gutterBottom>複雑なネストヘッダー</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            3層構造の複雑なネストヘッダーの実装例です。
          </Typography>
          <ComplexNestedHeaderTable />
        </TabPanel>
        
        <TabPanel value={value} index={3}>
          <Typography variant="h5" gutterBottom>転置された複雑なネストヘッダー</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            複雑なネストヘッダーテーブルを転置（行と列を入れ替え）した実装例です。
          </Typography>
          <TransposedComplexNestedHeaderTable />
        </TabPanel>
        
        <TabPanel value={value} index={4}>
          <Typography variant="h5" gutterBottom>ソート機能付きテーブル</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            列ヘッダーをクリックしてソート機能を体験できます。
          </Typography>
          <SortableTable />
        </TabPanel>
        
        <TabPanel value={value} index={5}>
          <Typography variant="h5" gutterBottom>選択機能付きテーブル</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            チェックボックスを使った行選択機能の実装例です。
          </Typography>
          <SelectableTable />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default TableDemoPage;