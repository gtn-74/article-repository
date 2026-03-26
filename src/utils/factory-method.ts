// Factory Method Pattern（ファクトリーメソッドパターン）
// オブジェクトの生成をサブクラスに委譲するデザインパターン

// ============================================
// 例1: 通知システム
// ============================================

// 通知の抽象クラス（Product）
abstract class Notification {
  abstract send(message: string): void;
}

// 具体的な通知クラス（Concrete Product）
class EmailNotification extends Notification {
  constructor(private email: string) {
    super();
  }

  send(message: string): void {
    console.log(`📧 メール送信先: ${this.email}`);
    console.log(`   内容: ${message}\n`);
  }
}

class SMSNotification extends Notification {
  constructor(private phoneNumber: string) {
    super();
  }

  send(message: string): void {
    console.log(`📱 SMS送信先: ${this.phoneNumber}`);
    console.log(`   内容: ${message}\n`);
  }
}

class PushNotification extends Notification {
  constructor(private deviceId: string) {
    super();
  }

  send(message: string): void {
    console.log(`🔔 プッシュ通知先: ${this.deviceId}`);
    console.log(`   内容: ${message}\n`);
  }
}

// 通知作成者の抽象クラス（Creator）
abstract class NotificationCreator {
  // Factory Method: サブクラスでオーバーライドする
  abstract createNotification(): Notification;

  // テンプレートメソッド: Factory Methodを使用
  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

// 具体的な作成者クラス（Concrete Creator）
class EmailNotificationCreator extends NotificationCreator {
  constructor(private email: string) {
    super();
  }

  createNotification(): Notification {
    return new EmailNotification(this.email);
  }
}

class SMSNotificationCreator extends NotificationCreator {
  constructor(private phoneNumber: string) {
    super();
  }

  createNotification(): Notification {
    return new SMSNotification(this.phoneNumber);
  }
}

class PushNotificationCreator extends NotificationCreator {
  constructor(private deviceId: string) {
    super();
  }

  createNotification(): Notification {
    return new PushNotification(this.deviceId);
  }
}

// 使用例1
console.log("=== 通知システムの例 ===");
const emailCreator = new EmailNotificationCreator("user@example.com");
emailCreator.notify("ご注文が完了しました");

const smsCreator = new SMSNotificationCreator("090-1234-5678");
smsCreator.notify("認証コード: 123456");

const pushCreator = new PushNotificationCreator("device-abc-123");
pushCreator.notify("新しいメッセージがあります");

// ============================================
// 例2: ドキュメント作成システム
// ============================================

// ドキュメントのインターフェース（Product）
interface Document {
  open(): void;
  save(content: string): void;
  close(): void;
}

// 具体的なドキュメントクラス（Concrete Product）
class WordDocument implements Document {
  open(): void {
    console.log("📄 Wordドキュメントを開きました");
  }

  save(content: string): void {
    console.log(`💾 Wordドキュメントを保存: "${content}"`);
  }

  close(): void {
    console.log("❌ Wordドキュメントを閉じました\n");
  }
}

class PDFDocument implements Document {
  open(): void {
    console.log("📕 PDFドキュメントを開きました");
  }

  save(content: string): void {
    console.log(`💾 PDFドキュメントを保存: "${content}"`);
  }

  close(): void {
    console.log("❌ PDFドキュメントを閉じました\n");
  }
}

class ExcelDocument implements Document {
  open(): void {
    console.log("📊 Excelドキュメントを開きました");
  }

  save(content: string): void {
    console.log(`💾 Excelドキュメントを保存: "${content}"`);
  }

  close(): void {
    console.log("❌ Excelドキュメントを閉じました\n");
  }
}

// ドキュメント作成者の抽象クラス（Creator）
abstract class DocumentCreator {
  abstract createDocument(): Document;

  // ドキュメントを作成して処理するテンプレートメソッド
  processDocument(content: string): void {
    const doc = this.createDocument();
    doc.open();
    doc.save(content);
    doc.close();
  }
}

// 具体的な作成者クラス（Concrete Creator）
class WordDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new WordDocument();
  }
}

class PDFDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new PDFDocument();
  }
}

class ExcelDocumentCreator extends DocumentCreator {
  createDocument(): Document {
    return new ExcelDocument();
  }
}

// 使用例2
console.log("=== ドキュメント作成の例 ===");
const wordCreator = new WordDocumentCreator();
wordCreator.processDocument("会議議事録");

const pdfCreator = new PDFDocumentCreator();
pdfCreator.processDocument("契約書");

const excelCreator = new ExcelDocumentCreator();
excelCreator.processDocument("売上データ");

// ============================================
// 例3: ロガーシステム（シンプルな関数型アプローチ）
// ============================================

// ロガーのインターフェース（Product）
interface Logger {
  log(message: string, level: string): void;
}

// 具体的なロガークラス（Concrete Product）
class ConsoleLogger implements Logger {
  log(message: string, level: string): void {
    console.log(`[${level}] ${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private filename: string) {}

  log(message: string, level: string): void {
    console.log(`[${level}] ${this.filename}に書き込み: ${message}`);
  }
}

class CloudLogger implements Logger {
  constructor(private endpoint: string) {}

  log(message: string, level: string): void {
    console.log(`[${level}] ${this.endpoint}に送信: ${message}`);
  }
}

// Factory関数（シンプルなアプローチ）
type LoggerType = "console" | "file" | "cloud";

class LoggerFactory {
  static createLogger(
    type: LoggerType,
    config?: { filename?: string; endpoint?: string }
  ): Logger {
    switch (type) {
      case "console":
        return new ConsoleLogger();
      case "file":
        return new FileLogger(config?.filename || "app.log");
      case "cloud":
        return new CloudLogger(config?.endpoint || "https://logs.example.com");
      default:
        throw new Error(`Unknown logger type: ${type}`);
    }
  }
}

// 使用例3
console.log("\n=== ロガーシステムの例 ===");
const consoleLogger = LoggerFactory.createLogger("console");
consoleLogger.log("アプリケーション起動", "INFO");

const fileLogger = LoggerFactory.createLogger("file", {
  filename: "error.log",
});
fileLogger.log("データベース接続エラー", "ERROR");

const cloudLogger = LoggerFactory.createLogger("cloud", {
  endpoint: "https://monitoring.example.com",
});
cloudLogger.log("API呼び出し成功", "DEBUG");

// ============================================
// 例4: UI要素のファクトリー（実践的な例）
// ============================================

// UI要素のインターフェース（Product）
interface UIComponent {
  render(): string;
  onClick?(): void;
}

// 具体的なUI要素クラス（Concrete Product）
class Button implements UIComponent {
  constructor(private label: string, private variant: "primary" | "secondary") {}

  render(): string {
    return `<button class="${this.variant}">${this.label}</button>`;
  }

  onClick(): void {
    console.log(`${this.label}ボタンがクリックされました`);
  }
}

class Input implements UIComponent {
  constructor(private placeholder: string, private type: string) {}

  render(): string {
    return `<input type="${this.type}" placeholder="${this.placeholder}" />`;
  }
}

class Checkbox implements UIComponent {
  constructor(private label: string, private checked: boolean) {}

  render(): string {
    const checkedAttr = this.checked ? "checked" : "";
    return `<label><input type="checkbox" ${checkedAttr} /> ${this.label}</label>`;
  }

  onClick(): void {
    console.log(`${this.label}チェックボックスが切り替えられました`);
  }
}

// UI要素のファクトリー
class UIComponentFactory {
  static createButton(
    label: string,
    variant: "primary" | "secondary" = "primary"
  ): UIComponent {
    return new Button(label, variant);
  }

  static createInput(placeholder: string, type: string = "text"): UIComponent {
    return new Input(placeholder, type);
  }

  static createCheckbox(label: string, checked: boolean = false): UIComponent {
    return new Checkbox(label, checked);
  }
}

// 使用例4
console.log("\n=== UI要素の例 ===");
const submitButton = UIComponentFactory.createButton("送信", "primary");
console.log(submitButton.render());
submitButton.onClick?.();

const emailInput = UIComponentFactory.createInput("メールアドレス", "email");
console.log(emailInput.render());

const agreeCheckbox = UIComponentFactory.createCheckbox(
  "利用規約に同意する",
  false
);
console.log(agreeCheckbox.render());

// ============================================
// 例5: データベース接続（パラメータ化されたFactory Method）
// ============================================

// データベース接続のインターフェース（Product）
interface DatabaseConnection {
  connect(): void;
  query(sql: string): void;
  disconnect(): void;
}

// 具体的なデータベース接続クラス（Concrete Product）
class MySQLConnection implements DatabaseConnection {
  constructor(private host: string, private database: string) {}

  connect(): void {
    console.log(`🔌 MySQL接続: ${this.host}/${this.database}`);
  }

  query(sql: string): void {
    console.log(`   MySQL Query: ${sql}`);
  }

  disconnect(): void {
    console.log(`   MySQL切断\n`);
  }
}

class PostgreSQLConnection implements DatabaseConnection {
  constructor(private host: string, private database: string) {}

  connect(): void {
    console.log(`🔌 PostgreSQL接続: ${this.host}/${this.database}`);
  }

  query(sql: string): void {
    console.log(`   PostgreSQL Query: ${sql}`);
  }

  disconnect(): void {
    console.log(`   PostgreSQL切断\n`);
  }
}

class MongoDBConnection implements DatabaseConnection {
  constructor(private host: string, private database: string) {}

  connect(): void {
    console.log(`🔌 MongoDB接続: ${this.host}/${this.database}`);
  }

  query(sql: string): void {
    console.log(`   MongoDB Query: ${sql}`);
  }

  disconnect(): void {
    console.log(`   MongoDB切断\n`);
  }
}

// データベースファクトリー
type DatabaseType = "mysql" | "postgresql" | "mongodb";

class DatabaseFactory {
  static createConnection(
    type: DatabaseType,
    host: string,
    database: string
  ): DatabaseConnection {
    switch (type) {
      case "mysql":
        return new MySQLConnection(host, database);
      case "postgresql":
        return new PostgreSQLConnection(host, database);
      case "mongodb":
        return new MongoDBConnection(host, database);
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}

// 使用例5
console.log("\n=== データベース接続の例 ===");
const mysqlConn = DatabaseFactory.createConnection(
  "mysql",
  "localhost:3306",
  "myapp"
);
mysqlConn.connect();
mysqlConn.query("SELECT * FROM users");
mysqlConn.disconnect();

const postgresConn = DatabaseFactory.createConnection(
  "postgresql",
  "localhost:5432",
  "analytics"
);
postgresConn.connect();
postgresConn.query("SELECT COUNT(*) FROM events");
postgresConn.disconnect();

export {
  // 通知システム
  Notification,
  EmailNotification,
  SMSNotification,
  PushNotification,
  NotificationCreator,
  EmailNotificationCreator,
  SMSNotificationCreator,
  PushNotificationCreator,
  // ドキュメントシステム
  Document,
  WordDocument,
  PDFDocument,
  ExcelDocument,
  DocumentCreator,
  WordDocumentCreator,
  PDFDocumentCreator,
  ExcelDocumentCreator,
  // ロガーシステム
  Logger,
  ConsoleLogger,
  FileLogger,
  CloudLogger,
  LoggerFactory,
  // UI要素
  UIComponent,
  Button,
  Input,
  Checkbox,
  UIComponentFactory,
  // データベース接続
  DatabaseConnection,
  MySQLConnection,
  PostgreSQLConnection,
  MongoDBConnection,
  DatabaseFactory,
};
