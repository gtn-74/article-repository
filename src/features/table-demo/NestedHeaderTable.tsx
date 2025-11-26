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
    <div style={{ display: 'flex', gap: '20px' }}>
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
                colSpan={3}
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: 'grey.100'
                }}
              >
                連絡先
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
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: 'grey.50'
                }}
              >
                部署
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
    
    {/* このテーブルのrowSpan, colSpanの説明 */}
    <div style={{ minWidth: '350px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>このテーブルのrowSpan, colSpan</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>第1行目</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>「名前」セル:</strong> rowSpan=&#123;2&#125;
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
            → 2行分を縦方向に結合
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>「連絡先」セル:</strong> colSpan=&#123;3&#125;
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            → 3列分（電話番号、メール、部署）を横方向に結合
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>第2行目</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>「電話番号」「メール」「部署」:</strong> 通常のセル
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            → rowSpan, colSpanの指定なし（デフォルト値1）
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>テーブル構造</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontSize: '14px' }}>
          <pre style={{ margin: 0, fontFamily: 'monospace' }}>
{`┌─────┬─────────────────┐
│名前  │      連絡先       │
│     ├─────┬─────┬─────┤
│     │電話 │メール│部署  │
└─────┴─────┴─────┴─────┘`}
          </pre>
        </div>
      </div>
    </div>
  </div>
  );
};

export default NestedHeaderTable;