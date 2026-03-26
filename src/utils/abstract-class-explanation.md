# Abstract Class（抽象クラス）の使い方と理由

## Q1: なんで`abstract`を使って書いたんですか？

Factory Method Patternで`abstract`を使った理由は、**抽象メソッドと共通ロジックの両方を持つため**です。

### 抽象クラスを使う理由

#### 1. 共通のロジック（テンプレートメソッド）を持つ

factory-method.ts の例：

```typescript
abstract class NotificationCreator {
  // 抽象メソッド：サブクラスが実装
  abstract createNotification(): Notification;

  // 共通ロジック：すべてのサブクラスで共有
  notify(message: string): void {
    const notification = this.createNotification(); // ←ここで抽象メソッドを呼ぶ
    notification.send(message);
  }
}
```

**ポイント:**
- `notify()`メソッドは**共通の処理フロー**を定義
- すべての通知Creator（Email、SMS、Push）で同じ処理をする
- しかし`createNotification()`の部分だけサブクラスに任せる

#### 2. インターフェースとの違い

**❌ インターフェースの場合**

```typescript
interface NotificationCreator {
  createNotification(): Notification;
  notify(message: string): void; // ←実装を持てない
}

// 各サブクラスでnotify()を重複実装する必要がある
class EmailNotificationCreator implements NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification(this.email);
  }

  // 同じロジックを何度も書く必要がある
  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}
```

**✅ 抽象クラスの場合**

```typescript
abstract class NotificationCreator {
  abstract createNotification(): Notification;

  // 一度だけ書けば、すべてのサブクラスで使える
  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification(this.email);
  }
  // notify()は継承されるので書く必要なし
}
```

### Strategy Patternとの比較

Strategy Patternでは主に`interface`を使用：

```typescript
// Strategy Pattern: 共通ロジックが不要
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    // クレジットカード固有の処理
  }
}
```

**なぜインターフェース？**
- 各戦略（Strategy）は**独立した実装**
- 共通の処理フローがない
- ただ「同じメソッドを持つ」という契約だけが必要

### まとめ（最初の質問）

| パターン | 使用 | 理由 |
|---------|------|------|
| Factory Method | `abstract class` | 共通ロジック（テンプレートメソッド）+ 抽象メソッド |
| Strategy | `interface` | 契約のみ、共通ロジック不要 |

**選択基準:**
- **共通の処理フローがある** → `abstract class`
- **契約だけ定義したい** → `interface`
- **複数の親を持ちたい** → `interface`（TypeScriptは多重継承不可）

---

## Q2: 継承などの共通ロジックについてabstractが必要な感じですかね？

**その理解でほぼ合っています！**

より正確に言うと：**共通ロジック（実装）を持ちつつ、一部をサブクラスに強制したい場合**に`abstract class`が必要です。

### `abstract class`が必要な条件

```typescript
// ✅ 抽象クラス：共通ロジック + 強制実装
abstract class Animal {
  // 共通ロジック（すべての動物に共通）
  breathe(): void {
    console.log("呼吸している");
  }

  sleep(): void {
    console.log("眠っている");
  }

  // 抽象メソッド（各動物で実装を強制）
  abstract makeSound(): void;
}

class Dog extends Animal {
  makeSound(): void {
    console.log("ワンワン");
  }
  // breathe()とsleep()は継承されるので書かなくてOK
}

class Cat extends Animal {
  makeSound(): void {
    console.log("ニャー");
  }
}
```

### 選択肢の比較

#### 1. `interface` - 契約のみ

```typescript
interface Animal {
  breathe(): void;
  sleep(): void;
  makeSound(): void;
}

class Dog implements Animal {
  breathe(): void {
    console.log("呼吸している"); // ← 毎回同じコードを書く必要がある
  }

  sleep(): void {
    console.log("眠っている"); // ← 毎回同じコードを書く必要がある
  }

  makeSound(): void {
    console.log("ワンワン");
  }
}
// 共通ロジックがコピペになる！
```

#### 2. 通常の`class` - 共通ロジックのみ

```typescript
class Animal {
  breathe(): void {
    console.log("呼吸している");
  }

  sleep(): void {
    console.log("眠っている");
  }

  makeSound(): void {
    console.log("..."); // ← デフォルト実装があるので、強制できない
  }
}

class Dog extends Animal {
  // makeSound()をオーバーライドし忘れてもエラーにならない
}
```

#### 3. `abstract class` - 共通ロジック + 強制実装

```typescript
abstract class Animal {
  breathe(): void {
    console.log("呼吸している"); // ← 共通ロジック
  }

  abstract makeSound(): void; // ← 実装を強制
}

class Dog extends Animal {
  // makeSound()を実装しないとコンパイルエラー！
  makeSound(): void {
    console.log("ワンワン");
  }
}
```

### 実践的な使い分け

**❌ ダメな例：interfaceで共通ロジックを重複**

```typescript
interface Logger {
  log(message: string): void;
  error(message: string): void;
  formatMessage(message: string): string;
}

class ConsoleLogger implements Logger {
  formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`; // ← 重複
  }
  log(message: string): void {
    console.log(this.formatMessage(message));
  }
  error(message: string): void {
    console.error(this.formatMessage(message));
  }
}

class FileLogger implements Logger {
  formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`; // ← 同じコードを書いている
  }
  // ...
}
```

**✅ 良い例：abstract classで共通ロジックを共有**

```typescript
abstract class Logger {
  // 共通ロジック（すべてのLoggerで同じ）
  protected formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }

  // 抽象メソッド（各Loggerで実装を強制）
  abstract log(message: string): void;
  abstract error(message: string): void;
}

class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(this.formatMessage(message)); // ← formatMessageを再利用
  }
  error(message: string): void {
    console.error(this.formatMessage(message));
  }
}

class FileLogger extends Logger {
  log(message: string): void {
    fs.writeFileSync("log.txt", this.formatMessage(message)); // ← formatMessageを再利用
  }
  error(message: string): void {
    fs.writeFileSync("error.txt", this.formatMessage(message));
  }
}
```

### まとめ（2つ目の質問）

| 状況 | 使うもの | 理由 |
|------|---------|------|
| 契約だけ定義したい | `interface` | 実装の共有不要 |
| 共通ロジックを共有したい | 通常の`class` | 継承で共有できる |
| 共通ロジック + 一部を強制したい | `abstract class` | 実装の共有 + 強制 |

**フレームワークとの関連:**
- React、Angular、Vueなどのフレームワークでは、ライフサイクルメソッドなど「共通の処理フロー + カスタマイズポイント」があるので、内部的に`abstract class`的な設計が使われることが多い
- ただし最近のReact（Hooks）などは、継承ではなく**Composition（合成）**を重視する傾向にある

---

## Q3: フレームワークだとabstractを書かなくても内部的に共通ロジックとして処理してくれたりするから私が理解してなかったけど、共通ロジックにはabstractが必要ということですよね？

### ❌ 誤解：共通ロジック = abstract が必要

### ✅ 正解：共通ロジックだけなら通常の`class`でOK

```typescript
// 共通ロジックだけなら abstract は不要
class BaseLogger {
  // 共通ロジック
  protected formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }

  // 共通ロジック
  log(message: string): void {
    console.log(this.formatMessage(message));
  }
}

// 継承して使える
class CustomLogger extends BaseLogger {
  // formatMessage()とlog()が使える
}
```

### `abstract`が必要なのは

**「共通ロジック」 + 「一部の実装を強制したい」とき**

```typescript
abstract class BaseLogger {
  // 共通ロジック（すべてのサブクラスで使える）
  protected formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }

  // 抽象メソッド（サブクラスに実装を強制）
  abstract output(message: string): void;

  // 共通ロジック（outputを使う）
  log(message: string): void {
    const formatted = this.formatMessage(message);
    this.output(formatted); // ← サブクラスの実装を呼ぶ
  }
}

class ConsoleLogger extends BaseLogger {
  // これを実装しないとエラー
  output(message: string): void {
    console.log(message);
  }
}

class FileLogger extends BaseLogger {
  // これを実装しないとエラー
  output(message: string): void {
    fs.writeFileSync("log.txt", message);
  }
}
```

## フレームワークの話

### Reactの場合（Class Component時代）

```typescript
// React内部（簡略化）
class Component {
  // 共通ロジック
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.forceUpdate(); // 再レンダリング
  }

  // デフォルト実装（オーバーライド任意）
  componentDidMount() {}
  render() { return null; }
}

// ユーザー側
class MyComponent extends Component {
  componentDidMount() {
    // フレームワークが自動で呼んでくれる
  }

  render() {
    return <div>Hello</div>;
  }
}
```

**ポイント:**
- Reactは`abstract`を使っていない（デフォルト実装がある）
- フレームワークが**いつどのメソッドを呼ぶか**を管理している
- ユーザーは継承を意識せず、「オーバーライドすれば呼ばれる」という感覚

### 最近のReact（Hooks）

```typescript
// 継承ではなく関数で提供
function MyComponent() {
  useEffect(() => {
    // フレームワークが適切なタイミングで実行
  }, []);

  return <div>Hello</div>;
}
```

これは**Composition（合成）**パターンで、`abstract`とは別のアプローチです。

## 最終まとめ

| 状況 | 使うもの | 例 |
|------|---------|-----|
| 共通ロジックだけ | 通常の`class` | `class Base { common() {} }` |
| 共通ロジック + 実装を強制 | `abstract class` | `abstract class Base { abstract foo(); }` |
| 契約だけ | `interface` | `interface I { foo(): void }` |
| 継承したくない | Composition/Hooks | `useEffect`, `useMemo` |

### 正確には:

- **共通ロジック → 通常の`class`で十分**
- **共通ロジック + 強制 → `abstract class`が必要**

フレームワークが`abstract`を使わずに共通ロジックを提供できるのは、内部で**デフォルト実装を持つ通常のクラス**や、**Composition（Hooks、依存性注入など）**を使っているからです。

## 重要なポイント

1. `abstract class`は「共通ロジック」と「実装の強制」を両方やりたいときに使う
2. 共通ロジックだけなら通常の`class`で十分
3. フレームワークは`abstract`を使わず、別の方法（デフォルト実装、Composition）で同様の効果を実現している
4. 継承よりも合成（Composition）を優先する設計が最近のトレンド
