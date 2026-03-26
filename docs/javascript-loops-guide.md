# JavaScript/TypeScript ループ完全ガイド
## for / forEach / for...of / for...in の使い方と使い分け

このドキュメントは、JavaScriptとTypeScriptで使える様々なループ（繰り返し処理）について、基礎から実践まで解説します。

---

## 目次

1. [ループとは何か](#ループとは何か)
2. [ループの種類一覧](#ループの種類一覧)
3. [各ループの詳細解説](#各ループの詳細解説)
4. [使い分けフローチャート](#使い分けフローチャート)
5. [実践例：今回のコード](#実践例今回のコード)
6. [よくある間違いと解決策](#よくある間違いと解決策)

---

## ループとは何か

**ループ（繰り返し処理）** は、同じ処理を複数回実行するための仕組みです。

### 例：ループを使わない場合

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

console.log(fruits[0]);  // りんご
console.log(fruits[1]);  // バナナ
console.log(fruits[2]);  // オレンジ
```

### 例：ループを使う場合

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

**メリット：**
- コードが短くなる
- 要素の数が変わっても対応できる
- 処理を一箇所にまとめられる

---

## ループの種類一覧

JavaScriptには主に5種類のループがあります：

| 種類 | 書き方 | 用途 | 推奨度 |
|------|--------|------|--------|
| **for** | `for (let i = 0; i < n; i++)` | インデックスが必要な場合 | ⭐⭐⭐ |
| **forEach** | `array.forEach(item => {})` | 配列の全要素を処理 | ⭐⭐⭐⭐⭐ |
| **for...of** | `for (const item of array)` | 配列・Set・Mapの反復 | ⭐⭐⭐⭐⭐ |
| **for...in** | `for (const key in object)` | オブジェクトのキー | ⭐⭐ |
| **while** | `while (condition)` | 条件付き繰り返し | ⭐⭐⭐ |

---

## 各ループの詳細解説

### 1. 従来の for ループ

最も基本的なループです。インデックス（番号）を使って配列を操作します。

#### 基本構文

```typescript
for (初期化; 条件; 増減) {
  // 処理
}
```

#### 具体例

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

for (let i = 0; i < fruits.length; i++) {
  console.log(`${i}番目: ${fruits[i]}`);
}

// 出力：
// 0番目: りんご
// 1番目: バナナ
// 2番目: オレンジ
```

#### 動作の流れ

```typescript
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// ステップ1: i = 0（初期化）
// ステップ2: i < 3? → true（条件チェック）
// ステップ3: console.log(0)（処理実行）
// ステップ4: i++（i = 1に増加）
// ステップ5: i < 3? → true
// ステップ6: console.log(1)
// ステップ7: i++（i = 2に増加）
// ステップ8: i < 3? → true
// ステップ9: console.log(2)
// ステップ10: i++（i = 3に増加）
// ステップ11: i < 3? → false（ループ終了）
```

#### メリット・デメリット

**メリット：**
- インデックスが使える
- 逆順や2つ飛ばしなど柔軟
- break/continueが使える

**デメリット：**
- 書くのが面倒
- インデックスミスが起きやすい

#### 使うべき場面

```typescript
// ✅ インデックスが必要な場合
for (let i = 0; i < items.length; i++) {
  console.log(`${i}番目: ${items[i]}`);
}

// ✅ 逆順
for (let i = items.length - 1; i >= 0; i--) {
  console.log(items[i]);
}

// ✅ 2つ飛ばし
for (let i = 0; i < items.length; i += 2) {
  console.log(items[i]);
}

// ✅ 途中で終了
for (let i = 0; i < items.length; i++) {
  if (items[i] === "target") {
    break;  // ループを抜ける
  }
}
```

---

### 2. forEach（最も推奨）

配列の各要素に対して関数を実行します。**最も読みやすく、現代的な書き方**です。

#### 基本構文

```typescript
array.forEach((要素, インデックス, 配列全体) => {
  // 処理
});
```

#### 具体例

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

// 要素だけ使う（最も一般的）
fruits.forEach((fruit) => {
  console.log(fruit);
});

// インデックスも使う
fruits.forEach((fruit, index) => {
  console.log(`${index}番目: ${fruit}`);
});

// 配列全体も使う（あまり使わない）
fruits.forEach((fruit, index, array) => {
  console.log(`${index}/${array.length}: ${fruit}`);
});
```

#### アロー関数の書き方いろいろ

```typescript
const numbers = [1, 2, 3];

// パターン1: 1行で書く
numbers.forEach(n => console.log(n));

// パターン2: 複数行
numbers.forEach(n => {
  const doubled = n * 2;
  console.log(doubled);
});

// パターン3: 従来の関数式
numbers.forEach(function(n) {
  console.log(n);
});
```

#### Object.entries と組み合わせる

```typescript
const checkState: Record<string, boolean> = {
  "0": true,
  "1": false,
  "2": true
};

// オブジェクトを配列に変換してからforEach
Object.entries(checkState).forEach(([key, value]) => {
  console.log(`キー: ${key}, 値: ${value}`);
});

// 出力：
// キー: 0, 値: true
// キー: 1, 値: false
// キー: 2, 値: true
```

#### メリット・デメリット

**メリット：**
- 読みやすい
- インデックスミスがない
- 配列の要素を直接扱える
- モダンな書き方

**デメリット：**
- break/continueが使えない（returnで代用）
- 非同期処理（async/await）との相性が悪い

#### break/continue の代わり

```typescript
const numbers = [1, 2, 3, 4, 5];

// ❌ break は使えない
// numbers.forEach(n => {
//   if (n === 3) break;  // エラー！
// });

// ✅ continue の代わりに return
numbers.forEach(n => {
  if (n === 3) return;  // この反復をスキップ
  console.log(n);
});
// 出力: 1, 2, 4, 5

// ✅ break の代わりに every/some を使う
numbers.every(n => {
  if (n === 3) return false;  // ループを抜ける
  console.log(n);
  return true;
});
// 出力: 1, 2
```

---

### 3. for...of（配列・Set・Map用）

配列、Set、Mapなどの **反復可能なオブジェクト** をループします。

#### 基本構文

```typescript
for (const 要素 of 配列) {
  // 処理
}
```

#### 具体例

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

for (const fruit of fruits) {
  console.log(fruit);
}

// 出力：
// りんご
// バナナ
// オレンジ
```

#### インデックスも取得したい場合

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

// entries()を使う
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}番目: ${fruit}`);
}

// 出力：
// 0番目: りんご
// 1番目: バナナ
// 2番目: オレンジ
```

#### Set や Map でも使える

```typescript
// Set の場合
const uniqueNumbers = new Set([1, 2, 3, 2, 1]);

for (const num of uniqueNumbers) {
  console.log(num);  // 1, 2, 3（重複なし）
}

// Map の場合
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3]
]);

for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}
// 出力：
// a: 1
// b: 2
// c: 3
```

#### Object.entries と組み合わせる

```typescript
const checkState: Record<string, boolean> = {
  "0": true,
  "1": false,
  "2": true
};

// オブジェクトを反復可能にする
for (const [key, value] of Object.entries(checkState)) {
  console.log(`${key}: ${value}`);
}
```

#### メリット・デメリット

**メリット：**
- シンプルで読みやすい
- break/continueが使える
- Set、Mapも扱える
- 配列の要素を直接扱える

**デメリット：**
- プレーンなオブジェクトには直接使えない（Object.entries が必要）

---

### 4. for...in（オブジェクトのキー用）

オブジェクトの **キー（プロパティ名）** をループします。

#### 基本構文

```typescript
for (const キー in オブジェクト) {
  // 処理
}
```

#### 具体例

```typescript
const user = {
  name: "太郎",
  age: 25,
  email: "taro@example.com"
};

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// 出力：
// name: 太郎
// age: 25
// email: taro@example.com
```

#### ⚠️ 注意点：配列には使わない

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

// ❌ 非推奨（動くが、予期しない動作の可能性）
for (const index in fruits) {
  console.log(fruits[index]);
}

// ✅ 配列には for...of か forEach を使う
for (const fruit of fruits) {
  console.log(fruit);
}
```

#### メリット・デメリット

**メリット：**
- オブジェクトのキーを取得できる

**デメリット：**
- プロトタイプチェーンの影響を受ける
- 配列には不向き
- **基本的に Object.entries() + forEach か for...of を使う方が良い**

#### 推奨される書き方

```typescript
const user = {
  name: "太郎",
  age: 25,
  email: "taro@example.com"
};

// ❌ for...in（古い書き方）
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// ✅ Object.entries + forEach（推奨）
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// ✅ Object.entries + for...of（推奨）
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

---

### 5. while / do...while

条件が真の間、処理を繰り返します。

#### while の基本構文

```typescript
while (条件) {
  // 処理
}
```

#### 具体例

```typescript
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}

// 出力：
// 0
// 1
// 2
```

#### do...while（必ず1回は実行される）

```typescript
let count = 0;

do {
  console.log(count);
  count++;
} while (count < 3);

// 出力：
// 0
// 1
// 2
```

#### 使うべき場面

```typescript
// ✅ 回数が不明な場合
let input = "";
while (input !== "exit") {
  input = prompt("コマンドを入力してください（exitで終了）");
}

// ✅ ファイル読み込み
while (reader.hasNext()) {
  const line = reader.readLine();
  console.log(line);
}
```

---

## 使い分けフローチャート

```
配列を処理したい？
  ↓
  Yes → インデックスが必要？
    ↓
    Yes → 特殊な処理（逆順・スキップ）？
      ↓
      Yes → 従来の for ループ
      No → forEach（インデックス付き）
    ↓
    No → break/continue が必要？
      ↓
      Yes → for...of
      No → forEach（最も推奨）

オブジェクトを処理したい？
  ↓
  Yes → Object.entries + forEach
       または
       Object.entries + for...of

条件が満たされるまで繰り返したい？
  ↓
  Yes → while
```

---

## 実践例：今回のコード

### Before: for...of を使った実装

```typescript
const processCheckStateEntries = (
  oldArray: ArrayT[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> => {
  const newCheckState: Record<string, boolean> = {};

  // for...of でループ
  for (const [indexStr, isChecked] of Object.entries(oldCheckState)) {
    if (!isChecked) continue;  // continueでスキップ

    const oldIndex = parseInt(indexStr, 10);
    const oldItem = oldArray[oldIndex];

    if (!oldItem) continue;

    const newIndex = seqToNewIndex.get(oldItem.seq);
    if (newIndex !== undefined) {
      newCheckState[newIndex.toString()] = true;
    }
  }

  return newCheckState;
};
```

### After: forEach を使った実装

```typescript
const processCheckStateEntries = (
  oldArray: ArrayT[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> => {
  const newCheckState: Record<string, boolean> = {};

  // forEach でループ
  Object.entries(oldCheckState).forEach(([indexStr, isChecked]) => {
    if (!isChecked) return;  // returnでスキップ（continueの代わり）

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

### 違いの解説

| 項目 | for...of | forEach |
|------|----------|---------|
| **スキップの方法** | `continue` | `return` |
| **ループ脱出** | `break` | できない（every/some を使う） |
| **読みやすさ** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **モダン度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**どちらも正解です！** 今回は forEach の方が：
- メソッドチェーンが使いやすい
- 関数型プログラミング的
- より宣言的

という理由で選びました。

---

## よくある間違いと解決策

### 間違い1: forEach で break を使おうとする

```typescript
// ❌ エラーになる
array.forEach(item => {
  if (item === "target") {
    break;  // エラー！ break は forEach では使えない
  }
});

// ✅ for...of を使う
for (const item of array) {
  if (item === "target") {
    break;  // OK
  }
}

// ✅ every を使う（途中で止める）
array.every(item => {
  if (item === "target") {
    return false;  // ループを停止
  }
  console.log(item);
  return true;  // 継続
});

// ✅ some を使う（条件に合う要素を探す）
const found = array.some(item => {
  return item === "target";
});
```

### 間違い2: for...in を配列に使う

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

// ❌ 非推奨
for (const index in fruits) {
  console.log(fruits[index]);
}

// ✅ for...of を使う
for (const fruit of fruits) {
  console.log(fruit);
}

// ✅ forEach を使う
fruits.forEach(fruit => {
  console.log(fruit);
});
```

### 間違い3: forEach 内の return を誤解する

```typescript
const numbers = [1, 2, 3, 4, 5];

// ⚠️ これは関数全体を抜けるわけではない
function processNumbers() {
  numbers.forEach(n => {
    if (n === 3) {
      return;  // forEach のこの反復を抜けるだけ
    }
    console.log(n);
  });
  console.log("処理完了");  // これは実行される
}

processNumbers();
// 出力：
// 1
// 2
// 4
// 5
// 処理完了
```

### 間違い4: forEach で async/await を使う

```typescript
// ❌ 期待通りに動かない
const urls = ["url1", "url2", "url3"];

urls.forEach(async (url) => {
  const data = await fetch(url);  // 並列で実行される
  console.log(data);
});

// ✅ for...of + async/await を使う（順次実行）
for (const url of urls) {
  const data = await fetch(url);
  console.log(data);
}

// ✅ Promise.all を使う（並列実行）
await Promise.all(
  urls.map(async (url) => {
    const data = await fetch(url);
    console.log(data);
  })
);
```

### 間違い5: ループ内で配列を変更する

```typescript
const numbers = [1, 2, 3, 4, 5];

// ❌ 危険（予期しない動作）
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    numbers.splice(i, 1);  // 配列を変更している
  }
}

// ✅ filter を使う
const oddNumbers = numbers.filter(n => n % 2 !== 0);

// ✅ 逆順でループ
for (let i = numbers.length - 1; i >= 0; i--) {
  if (numbers[i] % 2 === 0) {
    numbers.splice(i, 1);
  }
}
```

---

## 配列メソッドとの使い分け

ループの代わりに配列メソッドを使うと、よりシンプルになる場合があります。

### map（変換）

```typescript
const numbers = [1, 2, 3];

// ❌ forEach で新しい配列を作る
const doubled = [];
numbers.forEach(n => {
  doubled.push(n * 2);
});

// ✅ map を使う
const doubled = numbers.map(n => n * 2);
```

### filter（絞り込み）

```typescript
const numbers = [1, 2, 3, 4, 5];

// ❌ forEach で条件付き配列を作る
const evens = [];
numbers.forEach(n => {
  if (n % 2 === 0) {
    evens.push(n);
  }
});

// ✅ filter を使う
const evens = numbers.filter(n => n % 2 === 0);
```

### reduce（集計）

```typescript
const numbers = [1, 2, 3, 4, 5];

// ❌ forEach で合計を計算
let sum = 0;
numbers.forEach(n => {
  sum += n;
});

// ✅ reduce を使う
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

### find（検索）

```typescript
const users = [
  { id: 1, name: "太郎" },
  { id: 2, name: "花子" },
  { id: 3, name: "次郎" }
];

// ❌ forEach で検索
let target = null;
users.forEach(user => {
  if (user.id === 2) {
    target = user;
  }
});

// ✅ find を使う
const target = users.find(user => user.id === 2);
```

---

## チートシート

### 配列のループ

```typescript
const fruits = ["りんご", "バナナ", "オレンジ"];

// 従来の for
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// forEach（推奨）
fruits.forEach(fruit => {
  console.log(fruit);
});

// forEach（インデックス付き）
fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});

// for...of（推奨）
for (const fruit of fruits) {
  console.log(fruit);
}

// for...of（インデックス付き）
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
```

### オブジェクトのループ

```typescript
const user = { name: "太郎", age: 25 };

// Object.entries + forEach（推奨）
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Object.entries + for...of（推奨）
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// for...in（非推奨）
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
```

### Map のループ

```typescript
const map = new Map([["a", 1], ["b", 2]]);

// forEach
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for...of
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}
```

---

## まとめ

### 推奨される使い方

1. **配列の全要素を処理** → `forEach` または `for...of`
2. **インデックスが必要** → `forEach((item, index) => {})` または `for (const [index, item] of array.entries())`
3. **特殊な処理（逆順・スキップ）** → 従来の `for`
4. **オブジェクトの処理** → `Object.entries() + forEach` または `for...of`
5. **Map/Setの処理** → `forEach` または `for...of`
6. **break/continue が必要** → `for...of`
7. **条件付き繰り返し** → `while`

### 避けるべき使い方

- ❌ 配列に `for...in` を使う
- ❌ `forEach` で `break` を使おうとする
- ❌ `forEach` で `async/await` を使う（順次実行が必要な場合）

### 最も重要なこと

**配列の処理には `forEach` か `for...of` を使いましょう！**

これらは：
- 読みやすい
- 間違いが少ない
- モダンな書き方

---

*このドキュメントは foo.ts のリファクタリング体験から作成されました。*
