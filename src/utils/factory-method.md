# Factory Method Pattern（ファクトリーメソッドパターン）

## 概要

Factory Method Patternは、**オブジェクトの生成をサブクラスに委譲する**デザインパターンです。オブジェクトを直接`new`で作成するのではなく、ファクトリーメソッドを通じて生成することで、柔軟性と拡張性を高めます。

## なぜFactory Method Patternが必要なのか？

### 問題: 直接的なオブジェクト生成

例えば、通知システムを実装する場合、以下のようなコードになりがちです。

```typescript
class NotificationService {
  sendNotification(type: string, message: string) {
    if (type === "email") {
      const notification = new EmailNotification("user@example.com");
      notification.send(message);
    } else if (type === "sms") {
      const notification = new SMSNotification("090-1234-5678");
      notification.send(message);
    } else if (type === "push") {
      const notification = new PushNotification("device-123");
      notification.send(message);
    }
  }
}
```

**問題点:**
- 新しい通知タイプを追加するたびに、このメソッドを修正する必要がある
- `NotificationService`が具体的なクラス（`EmailNotification`など）に依存している
- テストがしにくい
- 開放閉鎖の原則（OCP）に違反している

### 解決策: Factory Method Pattern

Factory Method Patternを使うと、オブジェクトの生成ロジックをサブクラスに委譲できます。

```typescript
abstract class NotificationCreator {
  abstract createNotification(): Notification;

  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification("user@example.com");
  }
}
```

## Factory Method Patternの構成要素

### 1. Product（製品）
生成されるオブジェクトの共通インターフェース

```typescript
interface Notification {
  send(message: string): void;
}
```

### 2. Concrete Product（具体的な製品）
Productインターフェースを実装した具体的なクラス

```typescript
class EmailNotification implements Notification {
  send(message: string): void {
    console.log("メール送信:", message);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log("SMS送信:", message);
  }
}
```

### 3. Creator（作成者）
Factory Methodを宣言する抽象クラスまたはインターフェース

```typescript
abstract class NotificationCreator {
  // Factory Method
  abstract createNotification(): Notification;

  // テンプレートメソッド
  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}
```

### 4. Concrete Creator（具体的な作成者）
Factory Methodをオーバーライドして、具体的な製品を返す

```typescript
class EmailNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new SMSNotification();
  }
}
```

## 実装パターン

### パターン1: クラシックなFactory Method

オブジェクト指向の教科書的な実装

```typescript
abstract class Creator {
  abstract createProduct(): Product;

  operation(): void {
    const product = this.createProduct();
    product.doSomething();
  }
}

class ConcreteCreator extends Creator {
  createProduct(): Product {
    return new ConcreteProduct();
  }
}
```

### パターン2: シンプルなFactory（Static Factory）

静的メソッドを使ったシンプルなアプローチ

```typescript
class LoggerFactory {
  static createLogger(type: string): Logger {
    switch (type) {
      case "console":
        return new ConsoleLogger();
      case "file":
        return new FileLogger();
      default:
        throw new Error("Unknown logger type");
    }
  }
}

// 使用例
const logger = LoggerFactory.createLogger("console");
```

### パターン3: パラメータ化されたFactory Method

パラメータに応じて異なるオブジェクトを生成

```typescript
class DatabaseFactory {
  static createConnection(
    type: "mysql" | "postgresql",
    config: Config
  ): DatabaseConnection {
    switch (type) {
      case "mysql":
        return new MySQLConnection(config);
      case "postgresql":
        return new PostgreSQLConnection(config);
    }
  }
}
```

## 実用例

### 例1: 通知システム

```typescript
const emailCreator = new EmailNotificationCreator("user@example.com");
emailCreator.notify("ご注文が完了しました");

const smsCreator = new SMSNotificationCreator("090-1234-5678");
smsCreator.notify("認証コード: 123456");
```

### 例2: ドキュメント作成

```typescript
const wordCreator = new WordDocumentCreator();
wordCreator.processDocument("会議議事録");

const pdfCreator = new PDFDocumentCreator();
pdfCreator.processDocument("契約書");
```

### 例3: UI要素の生成

```typescript
const submitButton = UIComponentFactory.createButton("送信", "primary");
const emailInput = UIComponentFactory.createInput("メールアドレス", "email");
const checkbox = UIComponentFactory.createCheckbox("利用規約に同意");
```

## Factory Method Patternのメリット

### 1. 疎結合
クライアントコードが具体的なクラスに依存しない

```typescript
// ❌ 密結合
const notification = new EmailNotification();

// ✅ 疎結合
const notification = creator.createNotification();
```

### 2. 開放閉鎖の原則（OCP）
新しい製品タイプを追加する際、既存のコードを変更せずに拡張できる

```typescript
// 新しい通知タイプを追加
class SlackNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new SlackNotification();
  }
}
// 既存のコードは一切変更しない
```

### 3. 単一責任の原則（SRP）
オブジェクト生成のロジックを一箇所に集約

### 4. テストしやすい
モックやスタブに置き換えやすい

```typescript
class MockNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new MockNotification();
  }
}
```

## Factory Method Patternのデメリット

### 1. コードの複雑さが増す
シンプルなケースでは過剰設計になる可能性がある

### 2. クラス数が増える
製品ごとにCreatorクラスが必要になる

### 3. 学習コストが高い
初心者には理解しにくい場合がある

## いつ使うべきか？

### 使うべき場合

✅ 生成するオブジェクトのタイプが実行時に決まる
✅ 複数の関連するオブジェクトを生成する必要がある
✅ オブジェクト生成のロジックが複雑
✅ 将来的に新しいタイプが追加される可能性がある

### 使わない方が良い場合

❌ 生成するオブジェクトが1種類しかない
❌ オブジェクト生成が非常にシンプル
❌ プロジェクトが小規模で変更の可能性が低い

## TypeScriptでの実装のコツ

### 1. 抽象クラスとインターフェースを使い分ける

```typescript
// 共通の振る舞いがある場合: 抽象クラス
abstract class Creator {
  abstract createProduct(): Product;

  // 共通のロジック
  operation(): void {
    const product = this.createProduct();
    // 共通処理
  }
}

// 契約だけを定義: インターフェース
interface Product {
  doSomething(): void;
}
```

### 2. ジェネリクスで型安全に

```typescript
abstract class Creator<T extends Product> {
  abstract createProduct(): T;
}

class ConcreteCreator extends Creator<ConcreteProduct> {
  createProduct(): ConcreteProduct {
    return new ConcreteProduct();
  }
}
```

### 3. 関数型アプローチ

```typescript
type Factory<T> = () => T;

const emailNotificationFactory: Factory<Notification> = () =>
  new EmailNotification();

const smsNotificationFactory: Factory<Notification> = () =>
  new SMSNotification();
```

## 実際の使用例

### Reactでの活用

```typescript
// コンポーネントファクトリー
class ComponentFactory {
  static createForm(type: "login" | "signup"): React.FC {
    switch (type) {
      case "login":
        return LoginForm;
      case "signup":
        return SignupForm;
    }
  }
}

// 使用例
const FormComponent = ComponentFactory.createForm("login");
<FormComponent />;
```

### APIクライアントの作成

```typescript
class APIClientFactory {
  static createClient(env: "dev" | "prod"): APIClient {
    const config =
      env === "dev"
        ? { baseURL: "http://localhost:3000" }
        : { baseURL: "https://api.example.com" };

    return new APIClient(config);
  }
}
```

### バリデーターの生成

```typescript
class ValidatorFactory {
  static createValidator(type: string): Validator {
    switch (type) {
      case "email":
        return new EmailValidator();
      case "phone":
        return new PhoneValidator();
      case "url":
        return new URLValidator();
      default:
        return new DefaultValidator();
    }
  }
}
```

## Abstract FactoryとSimple Factoryの違い

### Simple Factory
単純なswitch文やif文でオブジェクトを生成

```typescript
class SimpleFactory {
  static create(type: string): Product {
    if (type === "A") return new ProductA();
    if (type === "B") return new ProductB();
  }
}
```

### Factory Method
サブクラスがオブジェクト生成を担当

```typescript
abstract class FactoryMethod {
  abstract create(): Product;
}
```

### Abstract Factory
関連するオブジェクト群を生成（別のパターン）

```typescript
interface AbstractFactory {
  createProductA(): ProductA;
  createProductB(): ProductB;
}
```

## まとめ

Factory Method Patternは以下の場合に有効です：

- **オブジェクトの生成ロジック**を隠蔽したい
- **具体的なクラスに依存したくない**
- **新しいタイプの追加**が頻繁に発生する
- **テスト容易性**を高めたい

Factory Method Patternを使うことで、柔軟で拡張性の高いコードを書くことができます。ただし、シンプルなケースでは過剰設計にならないよう注意が必要です。
