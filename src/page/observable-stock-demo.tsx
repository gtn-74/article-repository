import { useState, useEffect } from "react";
import { Observable } from "../utils/observable";

// 株価データの型
type StockPrice = {
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
};

// 株価Observableを作成
const stockObservable = new Observable<StockPrice>();

// 株価を定期的に更新するシミュレーター
let intervalId: NodeJS.Timeout | null = null;

const startStockSimulator = () => {
  if (intervalId) return; // 既に動いている場合は何もしない

  intervalId = setInterval(() => {
    const basePrice = 1000;
    const randomChange = (Math.random() - 0.5) * 50;
    const newPrice = basePrice + randomChange;

    const stockData: StockPrice = {
      symbol: "AAPL",
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(randomChange * 100) / 100,
      timestamp: Date.now(),
    };

    stockObservable.notify(stockData);
  }, 2000); // 2秒ごとに更新
};

const stopStockSimulator = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// リアルタイム価格表示
function LivePrice() {
  const [currentPrice, setCurrentPrice] = useState<StockPrice | null>(null);

  useEffect(() => {
    const updatePrice = (data: StockPrice) => {
      setCurrentPrice(data);
    };

    stockObservable.subscribe(updatePrice);

    return () => {
      stockObservable.unsubscribe(updatePrice);
    };
  }, []);

  return (
    <div style={{ border: "2px solid #007bff", padding: "15px", margin: "10px" }}>
      <h3>📈 リアルタイム価格</h3>
      {currentPrice ? (
        <div>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
            ${currentPrice.price}
          </div>
          <div
            style={{
              color: currentPrice.change >= 0 ? "green" : "red",
              fontSize: "1.2em",
            }}
          >
            {currentPrice.change >= 0 ? "▲" : "▼"} {Math.abs(currentPrice.change)}
          </div>
          <small>{new Date(currentPrice.timestamp).toLocaleTimeString()}</small>
        </div>
      ) : (
        <p>データを待っています...</p>
      )}
    </div>
  );
}

// 価格履歴グラフ（簡易版）
function PriceHistory() {
  const [history, setHistory] = useState<StockPrice[]>([]);

  useEffect(() => {
    const addToHistory = (data: StockPrice) => {
      setHistory((prev) => [...prev.slice(-10), data]); // 最新10件を保持
    };

    stockObservable.subscribe(addToHistory);

    return () => {
      stockObservable.unsubscribe(addToHistory);
    };
  }, []);

  const maxPrice = Math.max(...history.map((h) => h.price), 0);
  const minPrice = Math.min(...history.map((h) => h.price), Infinity);

  return (
    <div style={{ border: "2px solid #28a745", padding: "15px", margin: "10px" }}>
      <h3>📊 価格履歴</h3>
      <div style={{ display: "flex", alignItems: "flex-end", height: "100px", gap: "5px" }}>
        {history.map((item, index) => {
          const heightPercent =
            ((item.price - minPrice) / (maxPrice - minPrice || 1)) * 100;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                backgroundColor: item.change >= 0 ? "#28a745" : "#dc3545",
                height: `${heightPercent}%`,
                minHeight: "10px",
                position: "relative",
              }}
              title={`$${item.price}`}
            />
          );
        })}
      </div>
      <div style={{ fontSize: "0.8em", marginTop: "5px" }}>
        最高: ${maxPrice.toFixed(2)} / 最低: ${minPrice.toFixed(2)}
      </div>
    </div>
  );
}

// アラート機能
function PriceAlert() {
  const [alertPrice, setAlertPrice] = useState<number>(1020);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const checkAlert = (data: StockPrice) => {
      if (data.price > alertPrice) {
        const message = `⚠️ 価格が目標の$${alertPrice}を超えました！現在: $${data.price}`;
        setAlerts((prev) => [...prev, message]);
      }
    };

    stockObservable.subscribe(checkAlert);

    return () => {
      stockObservable.unsubscribe(checkAlert);
    };
  }, [alertPrice]);

  return (
    <div style={{ border: "2px solid #ffc107", padding: "15px", margin: "10px" }}>
      <h3>🔔 価格アラート</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>
          アラート価格: $
          <input
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(Number(e.target.value))}
            style={{ marginLeft: "5px", padding: "5px", width: "80px" }}
          />
        </label>
      </div>
      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
        {alerts.length === 0 ? (
          <p style={{ color: "#666" }}>まだアラートはありません</p>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                padding: "5px",
                margin: "5px 0",
                backgroundColor: "#fff3cd",
                borderRadius: "3px",
                fontSize: "0.9em",
              }}
            >
              {alert}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 統計情報
function PriceStats() {
  const [stats, setStats] = useState({
    count: 0,
    average: 0,
    highest: 0,
    lowest: Infinity,
  });

  useEffect(() => {
    const updateStats = (data: StockPrice) => {
      setStats((prev) => {
        const newCount = prev.count + 1;
        const newAverage = (prev.average * prev.count + data.price) / newCount;
        const newHighest = Math.max(prev.highest, data.price);
        const newLowest = Math.min(prev.lowest, data.price);

        return {
          count: newCount,
          average: newAverage,
          highest: newHighest,
          lowest: newLowest === Infinity ? data.price : newLowest,
        };
      });
    };

    stockObservable.subscribe(updateStats);

    return () => {
      stockObservable.unsubscribe(updateStats);
    };
  }, []);

  return (
    <div style={{ border: "2px solid #6c757d", padding: "15px", margin: "10px" }}>
      <h3>📊 統計情報</h3>
      <div>
        <p>更新回数: {stats.count}</p>
        <p>平均価格: ${stats.average.toFixed(2)}</p>
        <p>最高価格: ${stats.highest.toFixed(2)}</p>
        <p>最低価格: ${stats.lowest === Infinity ? "-" : `$${stats.lowest.toFixed(2)}`}</p>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function ObservableStockDemo() {
  const [isRunning, setIsRunning] = useState(false);

  const toggleSimulator = () => {
    if (isRunning) {
      stopStockSimulator();
      setIsRunning(false);
    } else {
      startStockSimulator();
      setIsRunning(true);
    }
  };

  useEffect(() => {
    return () => {
      stopStockSimulator();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📈 株価監視システム (Observable パターン)</h1>
      <p style={{ color: "#666" }}>
        リアルタイムで株価が更新され、4つのコンポーネントが同時に反応します
      </p>

      <div style={{ margin: "20px 0" }}>
        <button
          onClick={toggleSimulator}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            backgroundColor: isRunning ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isRunning ? "⏸ 停止" : "▶️ 開始"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "10px",
        }}
      >
        <LivePrice />
        <PriceHistory />
        <PriceAlert />
        <PriceStats />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>🎯 このパターンの実用例</h3>
        <ul>
          <li>株価・為替レート監視システム</li>
          <li>IoTセンサーデータのリアルタイム表示</li>
          <li>ゲームのスコアボード</li>
          <li>サーバー監視ダッシュボード</li>
          <li>オンラインオークションの入札状況</li>
        </ul>
      </div>
    </div>
  );
}
