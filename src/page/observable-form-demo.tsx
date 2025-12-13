import { useEffect, useState } from "react";
import { Observable } from "../utils/observable";

// フォームデータの型
type FormData = {
  email: string;
  password: string;
  username: string;
};

// フォーム変更イベントの型
type FormChangeEvent = {
  field: keyof FormData;
  value: string;
  allData: FormData;
};

// フォーム変更を監視するObservable
const formObservable = new Observable<FormChangeEvent>();

// バリデーション結果の型
type ValidationResult = {
  field: keyof FormData;
  isValid: boolean;
  message: string;
};

// リアルタイムバリデーション表示
function ValidationDisplay() {
  const [validations, setValidations] = useState<
    Record<string, ValidationResult>
  >({});

  useEffect(() => {
    const validate = (event: FormChangeEvent) => {
      const { field, value } = event;
      let result: ValidationResult;

      switch (field) {
        case "email": {
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          result = {
            field,
            isValid: isValidEmail,
            message: isValidEmail
              ? "✓ 有効なメールアドレス"
              : "✗ 無効なメールアドレス",
          };
          break;
        }
        case "password": {
          const isValidPassword = value.length >= 8;
          result = {
            field,
            isValid: isValidPassword,
            message: isValidPassword
              ? "✓ パスワードは十分な長さです"
              : `✗ パスワードは8文字以上必要です (現在: ${value.length}文字)`,
          };
          break;
        }
        case "username": {
          const isValidUsername =
            value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value);
          result = {
            field,
            isValid: isValidUsername,
            message: isValidUsername
              ? "✓ 有効なユーザー名"
              : "✗ ユーザー名は3文字以上の英数字とアンダースコアのみ",
          };
          break;
        }
      }

      setValidations((prev) => ({
        ...prev,
        [field]: result,
      }));
    };

    formObservable.subscribe(validate);

    return () => {
      formObservable.unsubscribe(validate);
    };
  }, []);

  return (
    <div
      style={{ border: "2px solid #007bff", padding: "15px", margin: "10px" }}
    >
      <h3>✓ リアルタイムバリデーション</h3>
      <div>
        {Object.entries(validations).map(([field, result]) => (
          <div
            key={field}
            style={{
              padding: "8px",
              margin: "5px 0",
              backgroundColor: result.isValid ? "#d4edda" : "#f8d7da",
              color: result.isValid ? "#155724" : "#721c24",
              borderRadius: "3px",
            }}
          >
            <strong>{field}:</strong> {result.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// フォーム入力履歴
function InputHistory() {
  const [history, setHistory] = useState<FormChangeEvent[]>([]);

  useEffect(() => {
    const addToHistory = (event: FormChangeEvent) => {
      setHistory((prev) => [...prev, event].slice(-10)); // 最新10件を保持
    };

    formObservable.subscribe(addToHistory);

    return () => {
      formObservable.unsubscribe(addToHistory);
    };
  }, []);

  return (
    <div
      style={{ border: "2px solid #28a745", padding: "15px", margin: "10px" }}
    >
      <h3>📜 入力履歴</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "0.9em" }}>
        {history.length === 0 ? (
          <p style={{ color: "#666" }}>まだ履歴がありません</p>
        ) : (
          history.map((event, index) => (
            <div
              key={index}
              style={{
                padding: "5px",
                margin: "3px 0",
                backgroundColor: "#f0f0f0",
                borderRadius: "3px",
              }}
            >
              <strong>{event.field}</strong>: {event.value || "(空)"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// フォームの完成度メーター
function CompletionMeter() {
  const [completion, setCompletion] = useState({
    email: false,
    password: false,
    username: false,
  });

  useEffect(() => {
    const updateCompletion = (event: FormChangeEvent) => {
      setCompletion((prev) => ({
        ...prev,
        [event.field]: event.value.length > 0,
      }));
    };

    formObservable.subscribe(updateCompletion);

    return () => {
      formObservable.unsubscribe(updateCompletion);
    };
  }, []);

  const completedCount = Object.values(completion).filter(Boolean).length;
  const totalFields = Object.keys(completion).length;
  const percentage = (completedCount / totalFields) * 100;

  return (
    <div
      style={{ border: "2px solid #ffc107", padding: "15px", margin: "10px" }}
    >
      <h3>📊 入力完成度</h3>
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            width: "100%",
            height: "30px",
            backgroundColor: "#e9ecef",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: percentage === 100 ? "#28a745" : "#ffc107",
              transition: "width 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
      <div>
        {Object.entries(completion).map(([field, isComplete]) => (
          <div key={field} style={{ margin: "5px 0" }}>
            {isComplete ? "✓" : "○"} {field}
          </div>
        ))}
      </div>
    </div>
  );
}

// 自動保存インジケーター
function AutoSaveIndicator() {
  const [lastSaved, setLastSaved] = useState<string>("");
  const [saveCount, setSaveCount] = useState(0);

  useEffect(() => {
    const autoSave = () => {
      // 実際にはここでAPIにデータを送信
      setLastSaved(new Date().toLocaleTimeString());
      setSaveCount((prev) => prev + 1);
    };

    formObservable.subscribe(autoSave);

    return () => {
      formObservable.unsubscribe(autoSave);
    };
  }, []);

  return (
    <div
      style={{ border: "2px solid #6c757d", padding: "15px", margin: "10px" }}
    >
      <h3>💾 自動保存</h3>
      <div>
        {saveCount > 0 ? (
          <>
            <p style={{ color: "#28a745", margin: "5px 0" }}>
              ✓ 保存されました
            </p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              最終保存: {lastSaved}
            </p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              保存回数: {saveCount}
            </p>
          </>
        ) : (
          <p style={{ color: "#666" }}>変更はまだ保存されていません</p>
        )}
      </div>
    </div>
  );
}

// メインのフォームコンポーネント
export default function ObservableFormDemo() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Observableで全てのリスナーに通知
    formObservable.notify({
      field,
      value,
      allData: newData,
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📝 フォーム監視システム (Observable パターン)</h1>
      <p style={{ color: "#666" }}>
        フォームに入力すると、複数のコンポーネントがリアルタイムで反応します
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* 左側：フォーム */}
        <div>
          <div style={{ border: "2px solid #dc3545", padding: "20px" }}>
            <h3>📋 入力フォーム</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                ユーザー名:
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1em",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                }}
                placeholder="例: john_doe"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                メールアドレス:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1em",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                }}
                placeholder="例: user@example.com"
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                パスワード:
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1em",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                }}
                placeholder="8文字以上"
              />
            </div>
          </div>

          <ValidationDisplay />
        </div>

        {/* 右側：監視コンポーネント */}
        <div>
          <CompletionMeter />
          <AutoSaveIndicator />
          <InputHistory />
        </div>
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
          <li>リアルタイムフォームバリデーション</li>
          <li>自動保存機能（Google Docsのような）</li>
          <li>複数ステップのフォームウィザード</li>
          <li>入力内容に応じたUIの動的変更</li>
          <li>複数ユーザーの同時編集（Collaborative editing）</li>
        </ul>
      </div>
    </div>
  );
}
