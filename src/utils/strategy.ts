// Strategy Pattern（ストラテジーパターン）
// アルゴリズムを実行時に切り替えられるようにするデザインパターン

// ============================================
// 例1: 支払い方法の戦略
// ============================================

// 支払い戦略のインターフェース
interface PaymentStrategy {
  pay(amount: number): void;
}

// 具体的な戦略1: クレジットカード決済
class CreditCardPayment implements PaymentStrategy {
  private cardNumber: string;
  private name: string;

  constructor(cardNumber: string, name: string) {
    this.cardNumber = cardNumber;
    this.name = name;
  }

  pay(amount: number): void {
    console.log(`${amount}円をクレジットカード（${this.cardNumber}）で支払いました。`);
  }
}

// 具体的な戦略2: PayPal決済
class PayPalPayment implements PaymentStrategy {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  pay(amount: number): void {
    console.log(`${amount}円をPayPal（${this.email}）で支払いました。`);
  }
}

// 具体的な戦略3: 銀行振込
class BankTransferPayment implements PaymentStrategy {
  private accountNumber: string;

  constructor(accountNumber: string) {
    this.accountNumber = accountNumber;
  }

  pay(amount: number): void {
    console.log(`${amount}円を銀行振込（口座番号: ${this.accountNumber}）で支払いました。`);
  }
}

// コンテキスト: 支払い処理を行うクラス
class ShoppingCart {
  private paymentStrategy: PaymentStrategy | null = null;

  // 支払い方法を設定（実行時に切り替え可能）
  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  // 支払いを実行
  checkout(amount: number): void {
    if (!this.paymentStrategy) {
      console.log("支払い方法が設定されていません。");
      return;
    }
    this.paymentStrategy.pay(amount);
  }
}

// 使用例1
console.log("=== 支払い方法の例 ===");
const cart = new ShoppingCart();

// クレジットカードで支払い
cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456", "山田太郎"));
cart.checkout(5000);

// PayPalに切り替えて支払い
cart.setPaymentStrategy(new PayPalPayment("yamada@example.com"));
cart.checkout(3000);

// 銀行振込に切り替えて支払い
cart.setPaymentStrategy(new BankTransferPayment("1234567890"));
cart.checkout(10000);

// ============================================
// 例2: ソート戦略（関数型アプローチ）
// ============================================

// TypeScriptでは、関数もStrategyとして使える
type SortStrategy<T> = (a: T, b: T) => number;

class Sorter<T> {
  private strategy: SortStrategy<T>;

  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  // 戦略を変更
  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  // 戦略を使ってソート
  sort(data: T[]): T[] {
    return [...data].sort(this.strategy);
  }
}

// 使用例2
console.log("\n=== ソート戦略の例 ===");
const numbers = [5, 2, 8, 1, 9, 3];

// 昇順ソート
const ascendingSorter = new Sorter<number>((a, b) => a - b);
console.log("昇順:", ascendingSorter.sort(numbers));

// 降順ソートに切り替え
ascendingSorter.setStrategy((a, b) => b - a);
console.log("降順:", ascendingSorter.sort(numbers));

// ============================================
// 例3: データ圧縮戦略
// ============================================

interface CompressionStrategy {
  compress(data: string): string;
  decompress(data: string): string;
}

class ZipCompression implements CompressionStrategy {
  compress(data: string): string {
    return `[ZIP圧縮] ${data}`;
  }

  decompress(data: string): string {
    return data.replace("[ZIP圧縮] ", "");
  }
}

class RarCompression implements CompressionStrategy {
  compress(data: string): string {
    return `[RAR圧縮] ${data}`;
  }

  decompress(data: string): string {
    return data.replace("[RAR圧縮] ", "");
  }
}

class FileCompressor {
  private strategy: CompressionStrategy;

  constructor(strategy: CompressionStrategy) {
    this.strategy = strategy;
  }

  setCompressionStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  compressFile(data: string): string {
    console.log("圧縮中...");
    return this.strategy.compress(data);
  }

  decompressFile(data: string): string {
    console.log("解凍中...");
    return this.strategy.decompress(data);
  }
}

// 使用例3
console.log("\n=== 圧縮戦略の例 ===");
const fileData = "重要なデータ";
const compressor = new FileCompressor(new ZipCompression());

const compressedZip = compressor.compressFile(fileData);
console.log("圧縮後:", compressedZip);

// RAR圧縮に切り替え
compressor.setCompressionStrategy(new RarCompression());
const compressedRar = compressor.compressFile(fileData);
console.log("圧縮後:", compressedRar);

// ============================================
// 例4: 割引戦略（実践的な例）
// ============================================

interface DiscountStrategy {
  calculate(price: number): number;
}

// 割引なし
class NoDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price;
  }
}

// 固定額割引
class FixedDiscount implements DiscountStrategy {
  constructor(private discountAmount: number) {}

  calculate(price: number): number {
    return Math.max(0, price - this.discountAmount);
  }
}

// パーセント割引
class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculate(price: number): number {
    return price * (1 - this.percentage / 100);
  }
}

// 会員ランク別割引
class MembershipDiscount implements DiscountStrategy {
  constructor(private membershipLevel: "bronze" | "silver" | "gold") {}

  calculate(price: number): number {
    const discountRates = {
      bronze: 5,
      silver: 10,
      gold: 20,
    };
    const discount = discountRates[this.membershipLevel];
    return price * (1 - discount / 100);
  }
}

class PriceCalculator {
  private discountStrategy: DiscountStrategy = new NoDiscount();

  setDiscountStrategy(strategy: DiscountStrategy): void {
    this.discountStrategy = strategy;
  }

  calculateFinalPrice(originalPrice: number): number {
    const finalPrice = this.discountStrategy.calculate(originalPrice);
    console.log(`元の価格: ${originalPrice}円 → 最終価格: ${finalPrice}円`);
    return finalPrice;
  }
}

// 使用例4
console.log("\n=== 割引戦略の例 ===");
const calculator = new PriceCalculator();
const originalPrice = 10000;

// 割引なし
calculator.calculateFinalPrice(originalPrice);

// 1000円引き
calculator.setDiscountStrategy(new FixedDiscount(1000));
calculator.calculateFinalPrice(originalPrice);

// 20%オフ
calculator.setDiscountStrategy(new PercentageDiscount(20));
calculator.calculateFinalPrice(originalPrice);

// ゴールド会員割引
calculator.setDiscountStrategy(new MembershipDiscount("gold"));
calculator.calculateFinalPrice(originalPrice);

export {
  PaymentStrategy,
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
  ShoppingCart,
  CompressionStrategy,
  ZipCompression,
  RarCompression,
  FileCompressor,
  DiscountStrategy,
  NoDiscount,
  FixedDiscount,
  PercentageDiscount,
  MembershipDiscount,
  PriceCalculator,
};
