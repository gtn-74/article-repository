# テスト駆動開発（TDD）実践ガイド
## 質とスピードを両立するための開発手法

このドキュメントは、テスト駆動開発（Test-Driven Development: TDD）について、基礎から実践まで解説します。

---

## 目次

1. [TDDとは何か](#tddとは何か)
2. [なぜTDDが必要なのか](#なぜtddが必要なのか)
3. [TDDのサイクル：Red-Green-Refactor](#tddのサイクルred-green-refactor)
4. [実践：TypeScriptでTDD](#実践typescriptでtdd)
5. [今回のfoo.tsをTDDで書き直す](#今回のfootsをtddで書き直す)
6. [よくある誤解と落とし穴](#よくある誤解と落とし穴)
7. [TDDのメリット・デメリット](#tddのメリットデメリット)
8. [TDDを始めるための第一歩](#tddを始めるための第一歩)

---

## TDDとは何か

### 一言で言うと

**テストを先に書いて、そのテストを通すために実装する開発手法**

### 従来の開発との違い

```
従来の開発：
1. コードを書く
2. 動作確認する
3. バグが見つかる
4. 修正する
5. また動作確認する
6. （繰り返し）
7. やっと完成
8. テストを書く（書かないことも多い）

TDD：
1. テストを書く（失敗する）
2. テストを通す最小限のコードを書く
3. リファクタリング（コードをきれいにする）
4. （繰り返し）
5. 完成（テストもある）
```

### TDDの3つのルール

1. **失敗するテストを書くまで、実装コードを書いてはいけない**
2. **失敗するテストは最小限に（コンパイルエラーも失敗）**
3. **テストを通す最小限のコードだけ書く**

---

## なぜTDDが必要なのか

### 問題：テストを後から書く場合

```typescript
// 1. とりあえずコードを書く
function calculateTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
    if (item.discount) {
      total -= item.discount;
    }
  }
  return total;
}

// 2. 動いた！完成！
// 3. 本番デプロイ
// 4. バグ発見！（discount が undefined の場合の処理がない）
// 5. 慌てて修正
// 6. また別のバグ...
```

**問題点：**
- バグが本番環境で見つかる
- 修正のたびに手動でテストが必要
- リファクタリングが怖い（壊れるかも）
- テストを書くのが面倒で書かなくなる

### 解決：TDDの場合

```typescript
// 1. まずテストを書く
test('合計金額を計算する', () => {
  const items = [
    { price: 100, quantity: 2, discount: 0 },
    { price: 200, quantity: 1, discount: 10 }
  ];
  expect(calculateTotal(items)).toBe(390); // 100*2 + 200*1 - 10
});

// 2. テストが失敗（関数がまだない）
// 3. テストを通す最小限のコードを書く
// 4. テストが通る
// 5. リファクタリング
// 6. テストが通ることを確認
// 7. 次の機能へ
```

**メリット：**
- バグが開発中に見つかる
- 自動テストがある（何度でも実行できる）
- リファクタリングが安全（テストが保証）
- テストが仕様書になる

---

## TDDのサイクル：Red-Green-Refactor

TDDは3つのステップを繰り返します。

```
🔴 Red（レッド）
   ↓
🟢 Green（グリーン）
   ↓
🔵 Refactor（リファクタリング）
   ↓
🔴 Red（次の機能へ）
```

### 🔴 Red（失敗するテストを書く）

```typescript
// まだ実装していない関数のテストを書く
test('createSeqToIndexMap は配列から seq→index のマップを作る', () => {
  const array = [
    { seq: 1, name: "a" },
    { seq: 3, name: "b" },
    { seq: 5, name: "c" }
  ];

  const map = createSeqToIndexMap(array);

  expect(map.get(1)).toBe(0);
  expect(map.get(3)).toBe(1);
  expect(map.get(5)).toBe(2);
});

// テスト実行 → ❌ 失敗（createSeqToIndexMap が存在しない）
```

**ポイント：**
- 実装より先にテストを書く
- 「どう使いたいか」を先に決める
- 失敗することを確認する（テストが正しく動いているか確認）

### 🟢 Green（テストを通す最小限のコードを書く）

```typescript
// テストを通す最小限の実装
function createSeqToIndexMap(array: any[]): Map<number, number> {
  const map = new Map<number, number>();
  array.forEach((item, index) => {
    map.set(item.seq, index);
  });
  return map;
}

// テスト実行 → ✅ 成功
```

**ポイント：**
- とにかくテストを通すことだけ考える
- きれいなコードは後で（Refactorで）
- 最小限の実装（YAGNI: You Aren't Gonna Need It）

### 🔵 Refactor（リファクタリング）

```typescript
// コードをきれいにする（型を厳密に）
type ArrayItem = { seq: number; [key: string]: any };

function createSeqToIndexMap(array: ArrayItem[]): Map<number, number> {
  const seqToIndex = new Map<number, number>();
  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
  });
  return seqToIndex;
}

// テスト実行 → ✅ 成功（変わらず通る）
```

**ポイント：**
- テストが通っている状態でリファクタリング
- テストが保証してくれるので安心
- 変数名、型、構造を改善

---

## 実践：TypeScriptでTDD

### 環境セットアップ

```bash
# プロジェクト初期化
npm init -y

# TypeScript + Jest インストール
npm install --save-dev typescript jest ts-jest @types/jest

# Jest 設定
npx ts-jest config:init

# tsconfig.json 作成
npx tsc --init
```

### プロジェクト構造

```
project/
├── src/
│   ├── checkState.ts          # 実装コード
│   └── checkState.test.ts     # テストコード
├── package.json
├── tsconfig.json
└── jest.config.js
```

### 基本的なテストの書き方

```typescript
// checkState.test.ts

// テストの書き方の基本
test('テストの説明', () => {
  // 1. Arrange（準備）
  const input = [1, 2, 3];

  // 2. Act（実行）
  const result = sum(input);

  // 3. Assert（検証）
  expect(result).toBe(6);
});

// describe でグループ化
describe('createSeqToIndexMap', () => {
  test('空配列の場合、空のMapを返す', () => {
    const result = createSeqToIndexMap([]);
    expect(result.size).toBe(0);
  });

  test('要素が1つの場合、正しくマップを作成する', () => {
    const array = [{ seq: 1, name: "a" }];
    const result = createSeqToIndexMap(array);

    expect(result.get(1)).toBe(0);
    expect(result.size).toBe(1);
  });

  test('複数要素の場合、正しくマップを作成する', () => {
    const array = [
      { seq: 1, name: "a" },
      { seq: 3, name: "b" },
      { seq: 5, name: "c" }
    ];
    const result = createSeqToIndexMap(array);

    expect(result.get(1)).toBe(0);
    expect(result.get(3)).toBe(1);
    expect(result.get(5)).toBe(2);
    expect(result.size).toBe(3);
  });
});
```

### よく使うJestのマッチャー

```typescript
// 等価性
expect(value).toBe(expected);           // === での比較
expect(value).toEqual(expected);        // オブジェクトの中身を比較
expect(value).not.toBe(expected);       // 否定

// 真偽値
expect(value).toBeTruthy();             // true と評価される
expect(value).toBeFalsy();              // false と評価される
expect(value).toBeNull();               // null
expect(value).toBeUndefined();          // undefined
expect(value).toBeDefined();            // undefined ではない

// 数値
expect(value).toBeGreaterThan(3);       // > 3
expect(value).toBeGreaterThanOrEqual(3);// >= 3
expect(value).toBeLessThan(3);          // < 3
expect(value).toBeLessThanOrEqual(3);   // <= 3

// 配列・文字列
expect(array).toContain(item);          // 配列に含まれる
expect(string).toMatch(/pattern/);      // 正規表現にマッチ

// 例外
expect(() => {
  throw new Error("エラー");
}).toThrow();                           // 例外が投げられる
expect(() => {
  throw new Error("エラー");
}).toThrow("エラー");                    // 特定のメッセージ
```

---

## 今回のfoo.tsをTDDで書き直す

実際に今回実装した関数を、TDDの流れで書き直してみましょう。

### ステップ1: 型定義

```typescript
// src/checkState.ts
export type ArrayItem = {
  index: number;
  seq: number;
  name: string;
  desc: string;
};
```

### ステップ2: createSeqToIndexMap をTDDで実装

#### 🔴 Red - テストを書く

```typescript
// src/checkState.test.ts
import { createSeqToIndexMap, ArrayItem } from './checkState';

describe('createSeqToIndexMap', () => {
  test('空配列の場合、空のMapを返す', () => {
    const result = createSeqToIndexMap([]);
    expect(result.size).toBe(0);
  });

  test('配列からseq→indexのマップを作成する', () => {
    const array: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "desc1" },
      { index: 1, seq: 2, name: "hoge", desc: "desc2" },
      { index: 2, seq: 4, name: "hoge", desc: "desc3" }
    ];

    const result = createSeqToIndexMap(array);

    expect(result.get(1)).toBe(0);
    expect(result.get(2)).toBe(1);
    expect(result.get(4)).toBe(2);
    expect(result.size).toBe(3);
  });

  test('存在しないseqの場合、undefinedを返す', () => {
    const array: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "desc1" }
    ];

    const result = createSeqToIndexMap(array);

    expect(result.get(999)).toBeUndefined();
  });
});
```

#### テスト実行

```bash
npm test

# ❌ 失敗（createSeqToIndexMap が存在しない）
```

#### 🟢 Green - 実装する

```typescript
// src/checkState.ts
export const createSeqToIndexMap = (array: ArrayItem[]): Map<number, number> => {
  const seqToIndex = new Map<number, number>();
  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
  });
  return seqToIndex;
};
```

#### テスト実行

```bash
npm test

# ✅ 成功
```

#### 🔵 Refactor - リファクタリング

```typescript
// すでにきれいなので、この場合は不要
// もし改善点があればここで修正
```

### ステップ3: processCheckStateEntries をTDDで実装

#### 🔴 Red - テストを書く

```typescript
// src/checkState.test.ts
import { processCheckStateEntries } from './checkState';

describe('processCheckStateEntries', () => {
  test('空のcheckStateの場合、空のオブジェクトを返す', () => {
    const oldArray: ArrayItem[] = [];
    const oldCheckState: Record<string, boolean> = {};
    const seqToNewIndex = new Map<number, number>();

    const result = processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);

    expect(result).toEqual({});
  });

  test('新配列に存在するseqのみ、新しいindexでcheckStateを作成する', () => {
    const oldArray: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "desc1" },
      { index: 1, seq: 2, name: "hoge", desc: "desc2" },
      { index: 2, seq: 3, name: "hoge", desc: "desc3" },  // チェック済み
      { index: 3, seq: 4, name: "hoge", desc: "desc4" },  // チェック済み
      { index: 4, seq: 5, name: "hoge", desc: "desc5" }   // チェック済み
    ];

    const oldCheckState: Record<string, boolean> = {
      "2": true,  // seq: 3
      "3": true,  // seq: 4
      "4": true   // seq: 5
    };

    // 新配列には seq: 1, 2, 4 のみ存在
    const seqToNewIndex = new Map<number, number>([
      [1, 0],
      [2, 1],
      [4, 2]  // seq: 4 は新配列の index 2
    ]);

    const result = processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);

    // seq: 3, 5 は新配列に存在しないので削除される
    // seq: 4 のみ残る（新配列の index 2）
    expect(result).toEqual({
      "2": true
    });
  });

  test('チェックされていない要素は無視される', () => {
    const oldArray: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "desc1" },
      { index: 1, seq: 2, name: "hoge", desc: "desc2" }
    ];

    const oldCheckState: Record<string, boolean> = {
      "0": true,
      "1": false  // チェックされていない
    };

    const seqToNewIndex = new Map<number, number>([
      [1, 0],
      [2, 1]
    ]);

    const result = processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);

    expect(result).toEqual({
      "0": true
    });
  });

  test('oldArrayに存在しないindexは無視される', () => {
    const oldArray: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "desc1" }
    ];

    const oldCheckState: Record<string, boolean> = {
      "0": true,
      "999": true  // 存在しないindex
    };

    const seqToNewIndex = new Map<number, number>([
      [1, 0]
    ]);

    const result = processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);

    expect(result).toEqual({
      "0": true
    });
  });
});
```

#### 🟢 Green - 実装する

```typescript
// src/checkState.ts
export const processCheckStateEntries = (
  oldArray: ArrayItem[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> => {
  const newCheckState: Record<string, boolean> = {};

  Object.entries(oldCheckState).forEach(([indexStr, isChecked]) => {
    if (!isChecked) return;

    const oldIndex = parseInt(indexStr, 10);
    const oldItem = oldArray[oldIndex];

    if (!oldItem) return;

    const newIndex = seqToNewIndex.get(oldItem.seq);
    if (newIndex !== undefined) {
      newCheckState[newIndex.toString()] = true;
    }
  });

  return newCheckState;
};
```

#### テスト実行

```bash
npm test

# ✅ 成功
```

### ステップ4: updateCheckState をTDDで実装

#### 🔴 Red - テストを書く

```typescript
// src/checkState.test.ts
import { updateCheckState } from './checkState';

describe('updateCheckState', () => {
  test('統合テスト: fetch前後でcheckStateを正しく更新する', () => {
    const array1: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "hogehgoe" },
      { index: 1, seq: 2, name: "hoge", desc: "hogehgoe" },
      { index: 2, seq: 3, name: "hoge", desc: "hogehgoe" },
      { index: 3, seq: 4, name: "hoge", desc: "hogehgoe" },
      { index: 4, seq: 5, name: "hoge", desc: "hogehgoe" }
    ];

    const array2: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "hogehgoe" },
      { index: 1, seq: 2, name: "hoge", desc: "hogehgoe" },
      { index: 2, seq: 4, name: "hoge", desc: "hogehgoe" }
    ];

    const checkState: Record<string, boolean> = {
      "2": true,  // seq: 3（削除される）
      "3": true,  // seq: 4（残る、新index: 2）
      "4": true   // seq: 5（削除される）
    };

    const result = updateCheckState(array1, array2, checkState);

    expect(result).toEqual({
      "2": true  // seq: 4 が array2 の index 2 に存在
    });
  });

  test('すべての要素が削除された場合、空のオブジェクトを返す', () => {
    const array1: ArrayItem[] = [
      { index: 0, seq: 1, name: "hoge", desc: "hogehgoe" },
      { index: 1, seq: 2, name: "hoge", desc: "hogehgoe" }
    ];

    const array2: ArrayItem[] = [
      { index: 0, seq: 3, name: "hoge", desc: "hogehgoe" }
    ];

    const checkState: Record<string, boolean> = {
      "0": true,
      "1": true
    };

    const result = updateCheckState(array1, array2, checkState);

    expect(result).toEqual({});
  });
});
```

#### 🟢 Green - 実装する

```typescript
// src/checkState.ts
export const updateCheckState = (
  oldArray: ArrayItem[],
  newArray: ArrayItem[],
  oldCheckState: Record<string, boolean>
): Record<string, boolean> => {
  const seqToNewIndex = createSeqToIndexMap(newArray);
  return processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);
};
```

#### テスト実行

```bash
npm test

# ✅ 成功
```

### 完成したコード

```typescript
// src/checkState.ts
export type ArrayItem = {
  index: number;
  seq: number;
  name: string;
  desc: string;
};

export const createSeqToIndexMap = (array: ArrayItem[]): Map<number, number> => {
  const seqToIndex = new Map<number, number>();
  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
  });
  return seqToIndex;
};

export const processCheckStateEntries = (
  oldArray: ArrayItem[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> => {
  const newCheckState: Record<string, boolean> = {};

  Object.entries(oldCheckState).forEach(([indexStr, isChecked]) => {
    if (!isChecked) return;

    const oldIndex = parseInt(indexStr, 10);
    const oldItem = oldArray[oldIndex];

    if (!oldItem) return;

    const newIndex = seqToNewIndex.get(oldItem.seq);
    if (newIndex !== undefined) {
      newCheckState[newIndex.toString()] = true;
    }
  });

  return newCheckState;
};

export const updateCheckState = (
  oldArray: ArrayItem[],
  newArray: ArrayItem[],
  oldCheckState: Record<string, boolean>
): Record<string, boolean> => {
  const seqToNewIndex = createSeqToIndexMap(newArray);
  return processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);
};
```

---

## よくある誤解と落とし穴

### 誤解1: 「TDDは遅い」

```
❌ 間違った認識：
「テストを書く時間がもったいない。直接実装した方が速い」

✅ 実際：
- 初期は遅く感じるが、バグ修正やリファクタリングの時間が激減
- トータルでは速くなる
- 品質も上がる

TDDなし: 実装30分 + デバッグ60分 + 手動テスト30分 = 120分
TDDあり: テスト30分 + 実装30分 + リファクタリング15分 = 75分
```

### 誤解2: 「100%テストカバレッジを目指す」

```
❌ 間違った目標：
「すべてのコードにテストを書く」

✅ 現実的な目標：
- ビジネスロジックに集中
- getter/setterのような単純なコードは不要
- 重要な部分を厚くテストする
```

### 誤解3: 「テストを書けば品質が上がる」

```
❌ テストの質が低い例：
test('updateCheckState が動く', () => {
  const result = updateCheckState(array1, array2, checkState);
  expect(result).toBeDefined();  // これだけ？
});

✅ 良いテストの例：
test('新配列に存在しないseqは削除される', () => {
  // 具体的なケースをテスト
  const result = updateCheckState(array1, array2, checkState);
  expect(result).toEqual({ "2": true });
  expect(result).not.toHaveProperty("0");
  expect(result).not.toHaveProperty("4");
});
```

### 落とし穴1: テストが実装に依存しすぎる

```typescript
// ❌ 悪い例：実装の詳細をテスト
test('createSeqToIndexMap は forEach を使う', () => {
  const spy = jest.spyOn(Array.prototype, 'forEach');
  createSeqToIndexMap(array);
  expect(spy).toHaveBeenCalled();
});

// ✅ 良い例：振る舞いをテスト
test('配列からseq→indexのマップを作成する', () => {
  const result = createSeqToIndexMap(array);
  expect(result.get(1)).toBe(0);
});
```

### 落とし穴2: 大きすぎるテスト

```typescript
// ❌ 1つのテストで複数のことをテスト
test('updateCheckState のすべてのケース', () => {
  // ケース1
  expect(updateCheckState(...)).toEqual(...);
  // ケース2
  expect(updateCheckState(...)).toEqual(...);
  // ケース3
  expect(updateCheckState(...)).toEqual(...);
});

// ✅ 1つのテストで1つのことをテスト
test('新配列に存在するseqのみ残る', () => { ... });
test('チェックされていない要素は無視される', () => { ... });
test('存在しないindexは無視される', () => { ... });
```

### 落とし穴3: テストのDRYを追求しすぎる

```typescript
// ❌ 抽象化しすぎて読みにくい
describe('updateCheckState', () => {
  const testCases = [
    { input: [...], expected: {...} },
    { input: [...], expected: {...} },
  ];

  testCases.forEach(({ input, expected }) => {
    test('case', () => {
      expect(updateCheckState(...input)).toEqual(expected);
    });
  });
});

// ✅ 多少重複してもわかりやすく
describe('updateCheckState', () => {
  test('新配列に存在するseqのみ残る', () => {
    const array1 = [...];
    const array2 = [...];
    const checkState = {...};

    const result = updateCheckState(array1, array2, checkState);

    expect(result).toEqual({ "2": true });
  });
});
```

---

## TDDのメリット・デメリット

### メリット

| メリット | 説明 |
|---------|------|
| **バグの早期発見** | 実装中にバグが見つかる |
| **リファクタリングが安全** | テストが保証してくれる |
| **設計が良くなる** | テストしやすい = 良い設計 |
| **ドキュメントになる** | テストが使い方を示す |
| **デバッグ時間の削減** | 問題箇所がすぐわかる |
| **自信を持ってコードを書ける** | テストがある安心感 |

### デメリット（と対処法）

| デメリット | 対処法 |
|-----------|--------|
| **学習コストがかかる** | 小さな関数から始める |
| **初期は遅く感じる** | 慣れると速くなる、長期的には得 |
| **テストの保守が必要** | 良いテストを書く習慣をつける |
| **すべてがTDD向きではない** | UI、探索的な実装は後からでもOK |

---

## TDDを始めるための第一歩

### 1. 小さく始める

```typescript
// ❌ いきなり複雑な機能をTDDで
function complexBusinessLogic() { ... }

// ✅ 小さな純粋関数から
function add(a: number, b: number): number {
  return a + b;
}

test('2つの数値を足し算する', () => {
  expect(add(1, 2)).toBe(3);
});
```

### 2. 純粋関数から始める

**純粋関数 = 入力が同じなら出力も同じ、副作用なし**

```typescript
// ✅ TDDに向いている（純粋関数）
function calculateTotal(items: Item[]): number { ... }
function filterActive(users: User[]): User[] { ... }
function formatDate(date: Date): string { ... }

// ⚠️ TDDが難しい（副作用がある）
function saveToDatabase(data: Data): void { ... }
function sendEmail(to: string, body: string): void { ... }
```

### 3. テストのテンプレート

```typescript
describe('関数名やクラス名', () => {
  test('正常系: 〜の場合、〜を返す', () => {
    // Arrange（準備）
    const input = ...;

    // Act（実行）
    const result = targetFunction(input);

    // Assert（検証）
    expect(result).toBe(expected);
  });

  test('異常系: 〜の場合、エラーを投げる', () => {
    expect(() => {
      targetFunction(invalidInput);
    }).toThrow();
  });

  test('境界値: 空の場合、〜を返す', () => {
    const result = targetFunction([]);
    expect(result).toEqual([]);
  });
});
```

### 4. 練習問題

以下の関数をTDDで実装してみましょう：

```typescript
// 練習1: 配列の合計を計算する
function sum(numbers: number[]): number {
  // TODO: TDDで実装
}

// 練習2: 配列から重複を削除する
function unique<T>(array: T[]): T[] {
  // TODO: TDDで実装
}

// 練習3: 文字列を反転する
function reverse(str: string): string {
  // TODO: TDDで実装
}
```

### 5. おすすめのリソース

- **書籍**
  - 『テスト駆動開発』Kent Beck（オーム社）
  - 『リファクタリング』Martin Fowler（オーム社）

- **動画**
  - t-wadaさんの講演動画（YouTube）
  - 「質とスピード」などで検索

- **記事**
  - TDD Boot Camp（検索してください）

---

## まとめ

### TDDの本質

1. **テストファースト** - コードより先にテストを書く
2. **小さなサイクル** - Red → Green → Refactor を繰り返す
3. **リファクタリング** - テストがあるから安心して改善できる

### 重要なポイント

- **完璧を目指さない** - まずは小さく始める
- **慣れるまで時間がかかる** - 最初は遅くても継続する
- **すべてにTDDは不要** - 適切に使い分ける
- **テストの質が重要** - 良いテストを書く習慣をつける

### 今日から始められること

```typescript
// 1. 次に書く関数の前に、まずテストを書いてみる
test('この関数は〜する', () => {
  expect(myFunction(input)).toBe(expected);
});

// 2. テストが失敗することを確認する

// 3. 最小限の実装をする

// 4. テストが通ることを確認する

// 5. リファクタリングする
```

**最初は難しく感じますが、続けることで必ず慣れます。質とスピードを両立するために、TDDを始めましょう！**

---

*「動作するきれいなコード」- これがTDDの目指すゴールです。*

*このドキュメントは、テスト駆動開発の実践経験から作成されました。*
