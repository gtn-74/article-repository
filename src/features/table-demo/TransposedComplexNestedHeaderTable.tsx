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
  // 各行の合計値を計算する関数
  const calculateRowSum = (quarter: keyof Omit<EmployeePerformance, 'name'>) => {
    return data.reduce((sum, employee) => sum + employee[quarter], 0);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
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
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }}
              >
                合計
              </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q1_2023')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q2_2023')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q3_2023')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q4_2023')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q1_2024')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q2_2024')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q3_2024')}
            </TableCell>
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'error.light', color: 'error.contrastText' }}>
              {calculateRowSum('q4_2024')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    
    {/* colspan, rowspan の使い方説明 */}
    <div style={{ minWidth: '400px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>colSpan と rowSpan の使い方</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>colSpan（列の結合）</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
          <div>{'<TableCell colSpan={3}>'}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
            → 3つの列を横方向に結合
          </div>
          <div style={{ marginTop: '10px', color: '#007acc' }}>
            例: ヘッダーの「時期」セルは3列分を結合
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>rowSpan（行の結合）</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
          <div>{'<TableCell rowSpan={4}>'}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
            → 4つの行を縦方向に結合
          </div>
          <div style={{ marginTop: '10px', color: '#007acc' }}>
            例: 「2023年度実績」は4行分を縦結合
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>実装例</h4>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
          <div>// 年度セル（4行結合）</div>
          <div>rowSpan=&#123;4&#125;</div>
          <br />
          <div>// 半期セル（2行結合）</div>
          <div>rowSpan=&#123;2&#125;</div>
          <br />
          <div>// ヘッダー（3列結合）</div>
          <div>colSpan=&#123;3&#125;</div>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#666', marginBottom: '10px' }}>注意点</h4>
        <ul style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', fontSize: '14px', margin: 0 }}>
          <li>結合されたセルの分だけ、次の行でセルを省略する</li>
          <li>verticalAlign: 'middle' で縦方向の中央揃え</li>
          <li>結合後の視覚的バランスを考慮してスタイルを調整</li>
        </ul>
      </div>
    </div>
  </div>
  );
};

export default TransposedComplexNestedHeaderTable;