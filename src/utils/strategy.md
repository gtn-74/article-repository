# Strategy Pattern（ストラテジーパターン）

## 概要

Strategy Pattern は、**アルゴリズムや振る舞いを実行時に切り替えられるようにする**デザインパターンです。複数の異なる処理方法を用意し、状況に応じて適切なものを選択できます。

## なぜ Strategy Pattern が必要なのか？

### 問題: if/else 地獄

例えば、支払い方法を実装する場合、以下のようなコードになりがちです。

```typescript
class Payment {
  pay(amount: number, method: string) {
    if (method === "creditcard") {
      // クレジットカード処理
      console.log("クレジットカードで支払い");
    } else if (method === "paypal") {
      // PayPal処理
      console.log("PayPalで支払い");
    } else if (method === "banktransfer") {
      // 銀行振込処理
      console.log("銀行振込で支払い");
    }
    // 新しい支払い方法を追加するたびにif/elseが増える...
  }
}
```

**問題点:**

- 支払い方法を追加するたびに、このクラスを修正する必要がある
- コードが長くなり、読みにくくなる
- テストがしにくい
- 開放閉鎖の原則（OCP）に違反している

### 解決策: Strategy Pattern

Strategy Pattern を使うと、各支払い方法を独立したクラスとして実装できます。

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log("クレジットカードで支払い");
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log("PayPalで支払い");
  }
}

class ShoppingCart {
  private paymentStrategy: PaymentStrategy;

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(amount: number): void {
    this.paymentStrategy.pay(amount);
  }
}
```

## Strategy Pattern の構成要素

### 1. Strategy（戦略インターフェース）

共通のインターフェースを定義します。

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}
```

### 2. Concrete Strategy（具体的な戦略）

インターフェースを実装した具体的なアルゴリズムです。

```typescript
class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    // クレジットカード固有の処理
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): void {
    // PayPal固有の処理
  }
}
```

### 3. Context（コンテキスト）

戦略を使用するクラスです。実行時に戦略を切り替えられます。

```typescript
class ShoppingCart {
  private paymentStrategy: PaymentStrategy;

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(amount: number): void {
    this.paymentStrategy.pay(amount);
  }
}
```

## 実用例

### 例 1: 支払い方法の切り替え

```typescript
const cart = new ShoppingCart();

// クレジットカードで支払い
cart.setPaymentStrategy(new CreditCardPayment("1234-5678", "山田太郎"));
cart.checkout(5000);

// PayPalに切り替え
cart.setPaymentStrategy(new PayPalPayment("yamada@example.com"));
cart.checkout(3000);
```

### 例 2: ソート方法の切り替え

```typescript
const numbers = [5, 2, 8, 1, 9];
const sorter = new Sorter<number>((a, b) => a - b);

// 昇順でソート
console.log(sorter.sort(numbers)); // [1, 2, 5, 8, 9]

// 降順に切り替え
sorter.setStrategy((a, b) => b - a);
console.log(sorter.sort(numbers)); // [9, 8, 5, 2, 1]
```

### 例 3: 割引計算の切り替え

```typescript
const calculator = new PriceCalculator();

// 通常価格
calculator.calculateFinalPrice(10000); // 10000円

// 1000円引き
calculator.setDiscountStrategy(new FixedDiscount(1000));
calculator.calculateFinalPrice(10000); // 9000円

// 20%オフ
calculator.setDiscountStrategy(new PercentageDiscount(20));
calculator.calculateFinalPrice(10000); // 8000円
```

## Strategy Pattern のメリット

### 1. 開放閉鎖の原則（OCP）に従う

新しい戦略を追加する際、既存のコードを変更せずに拡張できます。

```typescript
// 新しい支払い方法を追加
class BitcoinPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log("Bitcoinで支払い");
  }
}

// 既存のコードは一切変更しない
cart.setPaymentStrategy(new BitcoinPayment());
```

### 2. テストしやすい

各戦略を独立してテストできます。

```typescript
// クレジットカード決済のテスト
test("クレジットカード決済", () => {
  const payment = new CreditCardPayment("1234", "太郎");
  // payment.payのテスト
});

// PayPal決済のテスト
test("PayPal決済", () => {
  const payment = new PayPalPayment("test@example.com");
  // payment.payのテスト
});
```

### 3. コードの再利用性が高い

同じ戦略を複数の場所で使い回せます。

### 4. 実行時に動作を変更できる

プログラム実行中に戦略を切り替えられます。

## Strategy Pattern のデメリット

### 1. クラス数が増える

戦略ごとにクラスが必要になるため、ファイル数が増えます。

### 2. クライアントが戦略を知る必要がある

どの戦略を使うか、クライアント側で選択する必要があります。

## TypeScript での実装のコツ

### 1. インターフェースを活用

```typescript
interface Strategy {
  execute(): void;
}
```

### 2. 関数型アプローチも可能

TypeScript では、関数自体を戦略として使えます。

```typescript
type SortStrategy<T> = (a: T, b: T) => number;

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  sort(data: T[]): T[] {
    return [...data].sort(this.strategy);
  }
}
```

### 3. ジェネリクスで型安全に

```typescript
class Context<T extends Strategy> {
  constructor(private strategy: T) {}
}
```

## 実際の使用例

### React Hook での活用

```typescript
// カスタムフック
function usePayment() {
  const [strategy, setStrategy] = useState<PaymentStrategy>(
    new CreditCardPayment()
  );

  const pay = (amount: number) => {
    strategy.pay(amount);
  };

  return { setStrategy, pay };
}
```

### バリデーション戦略

```typescript
interface ValidationStrategy {
  validate(value: string): boolean;
}

class EmailValidation implements ValidationStrategy {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

class PhoneValidation implements ValidationStrategy {
  validate(value: string): boolean {
    return /^\d{3}-\d{4}-\d{4}$/.test(value);
  }
}
```

## まとめ

Strategy Pattern は以下の場合に有効です：

- **複数のアルゴリズム**が存在し、実行時に切り替える必要がある
- **if/else や switch 文**が増えすぎている
- **同じインターフェース**を持つ異なる実装が必要
- **振る舞いを動的に変更**したい

Strategy Pattern を使うことで、コードの柔軟性、保守性、テスト容易性が向上します。

```ts
npx tsx src/utils/strategy.ts
```
