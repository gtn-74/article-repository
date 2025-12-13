import { useState, useEffect } from "react";
import { Observable } from "../utils/observable";

// メッセージの型定義
type Message = {
  id: number;
  text: string;
  timestamp: number;
};

// メッセージ用のObservableを作成
const messageObservable = new Observable<Message>();

// メッセージ履歴を表示するコンポーネント
function MessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 新しいメッセージが来たら履歴に追加
    const addMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Observableに登録
    messageObservable.subscribe(addMessage);

    // クリーンアップ：コンポーネントがアンマウントされたら登録解除
    return () => {
      messageObservable.unsubscribe(addMessage);
    };
  }, []);

  return (
    <div style={{ border: "2px solid blue", padding: "10px", margin: "10px" }}>
      <h3>📜 メッセージ履歴</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {messages.length === 0 ? (
          <p>まだメッセージがありません</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: "5px",
                margin: "5px 0",
                backgroundColor: "#f0f0f0",
              }}
            >
              {msg.text}
              <span style={{ fontSize: "0.8em", color: "#666", marginLeft: "10px" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        メッセージ数: {messages.length}
      </p>
    </div>
  );
}

// 最新メッセージだけを表示するコンポーネント
function LatestMessage() {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);

  useEffect(() => {
    // 最新メッセージを更新
    const updateLatest = (message: Message) => {
      setLatestMessage(message);
    };

    // Observableに登録
    messageObservable.subscribe(updateLatest);

    return () => {
      messageObservable.unsubscribe(updateLatest);
    };
  }, []);

  return (
    <div style={{ border: "2px solid green", padding: "10px", margin: "10px" }}>
      <h3>🔔 最新の通知</h3>
      {latestMessage ? (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#d4edda",
            borderRadius: "5px",
          }}
        >
          <strong>{latestMessage.text}</strong>
          <br />
          <small>{new Date(latestMessage.timestamp).toLocaleString()}</small>
        </div>
      ) : (
        <p>通知はまだありません</p>
      )}
    </div>
  );
}

// メッセージ統計を表示するコンポーネント
function MessageStats() {
  const [totalMessages, setTotalMessages] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");

  useEffect(() => {
    const updateStats = (message: Message) => {
      setTotalMessages((prev) => prev + 1);
      setLastUpdateTime(new Date(message.timestamp).toLocaleTimeString());
    };

    messageObservable.subscribe(updateStats);

    return () => {
      messageObservable.unsubscribe(updateStats);
    };
  }, []);

  return (
    <div style={{ border: "2px solid orange", padding: "10px", margin: "10px" }}>
      <h3>📊 統計情報</h3>
      <p>総メッセージ数: <strong>{totalMessages}</strong></p>
      <p>最終更新: {lastUpdateTime || "未更新"}</p>
    </div>
  );
}

// メッセージを送信するコンポーネント
function MessageSender() {
  const [inputText, setInputText] = useState("");
  const [messageId, setMessageId] = useState(1);

  const sendMessage = () => {
    if (inputText.trim() === "") {
      alert("メッセージを入力してください");
      return;
    }

    // 新しいメッセージを作成
    const newMessage: Message = {
      id: messageId,
      text: inputText,
      timestamp: Date.now(),
    };

    // Observableを通じて全ての購読者に通知
    messageObservable.notify(newMessage);

    // 入力をリセット
    setInputText("");
    setMessageId(messageId + 1);
  };

  const sendPresetMessage = (text: string) => {
    const newMessage: Message = {
      id: messageId,
      text,
      timestamp: Date.now(),
    };

    messageObservable.notify(newMessage);
    setMessageId(messageId + 1);
  };

  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px" }}>
      <h3>✉️ メッセージを送信</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="メッセージを入力..."
          style={{ padding: "5px", width: "200px", marginRight: "5px" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 15px" }}>
          送信
        </button>
      </div>

      <div>
        <p style={{ fontSize: "0.9em", marginBottom: "5px" }}>
          クイック送信:
        </p>
        <button
          onClick={() => sendPresetMessage("こんにちは！")}
          style={{ margin: "2px", padding: "5px 10px" }}
        >
          こんにちは
        </button>
        <button
          onClick={() => sendPresetMessage("重要なお知らせです")}
          style={{ margin: "2px", padding: "5px 10px" }}
        >
          お知らせ
        </button>
        <button
          onClick={() => sendPresetMessage("タスクが完了しました")}
          style={{ margin: "2px", padding: "5px 10px" }}
        >
          完了通知
        </button>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function ObservableDemo() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📡 Observable パターン デモ</h1>
      <p style={{ color: "#666" }}>
        メッセージを送信すると、全てのコンポーネントがリアルタイムで更新されます
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        <MessageSender />
        <LatestMessage />
        <MessageHistory />
        <MessageStats />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>🎯 Observable パターンのポイント</h3>
        <ul>
          <li>
            <strong>1つのObservable</strong> に複数のコンポーネントが購読（subscribe）
          </li>
          <li>
            メッセージが送信されると <strong>notify()</strong> で全購読者に通知
          </li>
          <li>
            各コンポーネントは独立して動作し、同じデータの変更を監視
          </li>
          <li>
            コンポーネントのアンマウント時に <strong>unsubscribe()</strong> で登録解除
          </li>
        </ul>
      </div>
    </div>
  );
}
