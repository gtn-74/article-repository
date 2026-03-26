# TypeScript コレクション完全ガイド
## Object / Record / Map の使い方と実装方法

このドキュメントは、TypeScriptでデータを管理する3つの主要な方法（オブジェクト、Record、Map）について、基礎から実践まで解説します。

---

## 目次

1. [3つのデータ構造の概要](#3つのデータ構造の概要)
2. [オブジェクト（Plain Object）](#オブジェクトplain-object)
3. [Record型](#record型)
4. [Map](#map)
5. [どれを使うべきか？](#どれを使うべきか)
6. [実践例：今回のcheckState問題](#実践例今回のcheckstate問題)
7. [よくある間違いと解決策](#よくある間違いと解決策)

---

## 3つのデータ構造の概要

### 簡単な比較表

| 特徴 | オブジェクト | Record | Map |
|------|------------|--------|-----|
| **書き方** | `{}` | `Record<K, V>` | `new Map()` |
| **型安全性** | 弱い | 強い | 最強 |
| **キーの型** | string/symbol | 指定可能 | 任意の型 |
| **値の型** | 任意 | 指定可能 | 指定可能 |
| **パフォーマンス** | 普通 | 普通 | 高速 |
| **JSON変換** | ✅ 可能 | ✅ 可能 | ❌ 不可 |
| **反復処理** | for-in | Object.entries | forEach/for-of |
| **サイズ取得** | Object.keys().length | Object.keys().length | map.size |
| **おすすめ用途** | 固定構造 | 動的キー | 頻繁な追加削除 |

---

## オブジェクト（Plain Object）

### 基本的な使い方

```typescript
// 作成
const user = {
  name: "太郎",
  age: 25,
  email: "taro@example.com"
};

// アクセス
console.log(user.name);        // "太郎"
console.log(user["name"]);     // "太郎" (ブラケット記法)

// 追加
user.address = "東京";

// 更新
user.age = 26;

// 削除
delete user.email;

// 存在チェック
if ("name" in user) {
  console.log("nameプロパティが存在します");
}

// キーの一覧
const keys = Object.keys(user);  // ["name", "age", "address"]

// 値の一覧
const values = Object.values(user);  // ["太郎", 26, "東京"]

// エントリの一覧（[キー, 値]の配列）
const entries = Object.entries(user);  // [["name", "太郎"], ["age", 26], ...]
```

### 反復処理

```typescript
const scores = { math: 90, english: 85, science: 92 };

// 方法1: for-in（あまり推奨されない）
for (const key in scores) {
  console.log(`${key}: ${scores[key]}`);
}

// 方法2: Object.entries（推奨）
for (const [subject, score] of Object.entries(scores)) {
  console.log(`${subject}: ${score}`);
}

// 方法3: forEach（配列メソッド）
Object.entries(scores).forEach(([subject, score]) => {
  console.log(`${subject}: ${score}`);
});
```

### 型定義

```typescript
// 型推論
const user1 = { name: "太郎", age: 25 };  // 型が推論される

// 明示的な型定義
type User = {
  name: string;
  age: number;
  email?: string;  // オプショナル
};

const user2: User = {
  name: "花子",
  age: 23
};

// インターフェース
interface Product {
  id: number;
  name: string;
  price: number;
}

const product: Product = {
  id: 1,
  name: "ノートPC",
  price: 120000
};
```

### メリット・デメリット

**メリット：**
- シンプルで直感的
- JSON.stringify/parseで簡単にシリアライズできる
- リテラル記法が使える
- プロパティアクセスが簡潔（`obj.prop`）

**デメリット：**
- 動的なキーの型安全性が低い
- プロトタイプチェーンの影響を受ける
- キーは文字列/Symbolのみ

---

## Record型

### 基本的な使い方

`Record<K, V>`は「キーの型がK、値の型がV」のオブジェクトを表す型です。

```typescript
// 基本的な定義
type CheckState = Record<string, boolean>;

const checkState: CheckState = {
  "0": true,
  "1": false,
  "2": true
};

// 型安全性
checkState["3"] = true;   // ✅ OK
checkState["4"] = "yes";  // ❌ エラー: boolean型ではない
```

### 実践的な例

```typescript
// ユーザーIDをキー、ユーザー情報を値とする
type UserRecord = Record<string, { name: string; age: number }>;

const users: UserRecord = {
  "user1": { name: "太郎", age: 25 },
  "user2": { name: "花子", age: 23 }
};

// アクセス
const user1 = users["user1"];
console.log(user1.name);  // "太郎"

// 追加
users["user3"] = { name: "次郎", age: 30 };

// 反復処理（型安全）
for (const [userId, user] of Object.entries(users)) {
  console.log(`${userId}: ${user.name} (${user.age}歳)`);
}
```

### より厳密な型定義

```typescript
// キーを特定の文字列に制限
type Status = "pending" | "approved" | "rejected";
type StatusCount = Record<Status, number>;

const counts: StatusCount = {
  pending: 5,
  approved: 10,
  rejected: 2
};

// ✅ 定義されたキーのみ許可される
counts.pending = 6;

// ❌ エラー: 'unknown' は Status 型ではない
// counts.unknown = 1;
```

### 部分的なRecord（Partial）

```typescript
// すべてのキーがオプショナル
type PartialCheckState = Partial<Record<string, boolean>>;

const checkState: PartialCheckState = {
  "0": true
  // 他のキーは省略可能
};
```

### メリット・デメリット

**メリット：**
- 型安全性が高い
- キーと値の型を明示できる
- オブジェクトの利点をそのまま継承

**デメリット：**
- 実行時はただのオブジェクト
- キーは文字列/Symbolのみ
- 動的なキーの追加・削除の型チェックが甘い場合がある

---

## Map

### 基本的な使い方

`Map`はキーと値のペアを保持するデータ構造で、**どんな型でもキーにできる**のが特徴です。

```typescript
// 作成
const map = new Map<number, string>();

// 追加・更新（set）
map.set(1, "one");
map.set(2, "two");
map.set(3, "three");

// 取得（get）
const value = map.get(1);  // "one"
const notFound = map.get(99);  // undefined

// 存在チェック（has）
if (map.has(2)) {
  console.log("キー2が存在します");
}

// 削除（delete）
map.delete(2);

// サイズ取得
console.log(map.size);  // 2

// 全削除（clear）
map.clear();

// 空チェック
if (map.size === 0) {
  console.log("Mapが空です");
}
```

### 反復処理

```typescript
const scores = new Map<string, number>();
scores.set("math", 90);
scores.set("english", 85);
scores.set("science", 92);

// 方法1: forEach
scores.forEach((score, subject) => {
  console.log(`${subject}: ${score}`);
});

// 方法2: for-of（キーと値）
for (const [subject, score] of scores) {
  console.log(`${subject}: ${score}`);
}

// 方法3: for-of（キーのみ）
for (const subject of scores.keys()) {
  console.log(subject);
}

// 方法4: for-of（値のみ）
for (const score of scores.values()) {
  console.log(score);
}
```

### オブジェクトをキーとして使う

```typescript
// オブジェクトをキーにできる（Mapの最大の特徴）
type User = { id: number; name: string };

const userPermissions = new Map<User, string[]>();

const user1: User = { id: 1, name: "太郎" };
const user2: User = { id: 2, name: "花子" };

userPermissions.set(user1, ["read", "write"]);
userPermissions.set(user2, ["read"]);

console.log(userPermissions.get(user1));  // ["read", "write"]
```

### 配列からMapを作成

```typescript
// 配列からMapを作成
const entries: [number, string][] = [
  [1, "one"],
  [2, "two"],
  [3, "three"]
];

const map = new Map(entries);

// または
const map2 = new Map<number, string>([
  [1, "one"],
  [2, "two"],
  [3, "three"]
]);
```

### MapからオブジェクトやRecordへ変換

```typescript
const map = new Map<string, number>([
  ["a", 1],
  ["b", 2],
  ["c", 3]
]);

// Map → オブジェクト
const obj = Object.fromEntries(map);
console.log(obj);  // { a: 1, b: 2, c: 3 }

// Map → Record
const record: Record<string, number> = Object.fromEntries(map);
```

### オブジェクト/RecordからMapへ変換

```typescript
const obj = { a: 1, b: 2, c: 3 };

// オブジェクト → Map
const map = new Map(Object.entries(obj));

// Record → Map
const record: Record<string, number> = { x: 10, y: 20 };
const map2 = new Map(Object.entries(record));
```

### メリット・デメリット

**メリット：**
- **任意の型をキーにできる**（オブジェクト、配列、関数なども可）
- 頻繁な追加・削除が高速
- サイズを`size`プロパティで簡単に取得
- 挿入順序が保証される
- プロトタイプチェーンの影響を受けない

**デメリット：**
- JSON.stringifyで直接シリアライズできない
- リテラル記法が使えない
- プロパティアクセス（`map.key`）ができない（`map.get(key)`を使う）

---

## どれを使うべきか？

### 判断フローチャート

```
データを保存したい
  ↓
構造が固定？
  Yes → オブジェクト（type/interface で定義）
  No → 動的なキー？
    ↓
    Yes → キーが文字列のみ？
      ↓
      Yes → Record<string, V>
      No → Map<K, V>
    ↓
    頻繁な追加・削除？
      ↓
      Yes → Map
      No → Record
```

### 具体的な使い分け

#### オブジェクト（type/interface）を使う場合

```typescript
// ✅ 構造が固定されている
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: "太郎",
  email: "taro@example.com"
};

// ✅ 設定ファイル
type Config = {
  apiUrl: string;
  timeout: number;
  retries: number;
};

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};
```

#### Record を使う場合

```typescript
// ✅ 動的なキー（文字列）で値を管理
const checkState: Record<string, boolean> = {
  "0": true,
  "1": false,
  "2": true
};

// ✅ IDをキーとしたデータ管理
const userById: Record<string, User> = {
  "user_1": { id: 1, name: "太郎" },
  "user_2": { id: 2, name: "花子" }
};

// ✅ 集計結果
const countByStatus: Record<string, number> = {
  pending: 5,
  approved: 10,
  rejected: 2
};
```

#### Map を使う場合

```typescript
// ✅ 数値をキーとして使いたい
const seqToIndex = new Map<number, number>();
seqToIndex.set(1, 0);
seqToIndex.set(3, 1);
seqToIndex.set(5, 2);

// ✅ オブジェクトをキーとして使いたい
const cache = new Map<User, Data>();
cache.set(user, data);

// ✅ 頻繁な追加・削除がある
const activeConnections = new Map<string, WebSocket>();
activeConnections.set(connectionId, socket);
activeConnections.delete(connectionId);

// ✅ キーの順序が重要
const orderedTasks = new Map<string, Task>();
// 挿入順が保証される
```

---

## 実践例：今回のcheckState問題

今回の`foo.ts`で実装した内容を詳しく解説します。

### 問題の整理

```typescript
// 状況
const array1 = [
  { seq: 1, ... },  // index 0
  { seq: 2, ... },  // index 1
  { seq: 3, ... },  // index 2 ← チェック済み
  { seq: 4, ... },  // index 3 ← チェック済み
  { seq: 5, ... }   // index 4 ← チェック済み
];

// checkState（Recordを使用）
const checkState: Record<string, boolean> = {
  "2": true,  // array1のindex 2（seq: 3）
  "3": true,  // array1のindex 3（seq: 4）
  "4": true   // array1のindex 4（seq: 5）
};

// fetch後
const array2 = [
  { seq: 1, ... },  // index 0
  { seq: 2, ... },  // index 1
  { seq: 4, ... }   // index 2  ← seq: 3, 5 が削除された
];

// やりたいこと
// checkStateを更新して、array2に存在するseqだけを残す
// しかも、indexも新しい配列に合わせる
```

### 解決策の実装

#### ステップ1: Mapで seq → index の対応表を作成

```typescript
/**
 * なぜMapを使うのか？
 * - キーが数値（seq）だから
 * - 高速な検索が必要だから
 * - has()メソッドで存在チェックが簡単だから
 */
function createSeqToIndexMap(array: ArrayT[]): Map<number, number> {
  const seqToIndex = new Map<number, number>();

  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
    // seq: 1 → index: 0
    // seq: 2 → index: 1
    // seq: 4 → index: 2
  });

  return seqToIndex;
}

// 使用例
const array2 = [
  { seq: 1, ... },  // index 0
  { seq: 2, ... },  // index 1
  { seq: 4, ... }   // index 2
];

const seqToIndex = createSeqToIndexMap(array2);

console.log(seqToIndex.get(1));  // 0
console.log(seqToIndex.get(2));  // 1
console.log(seqToIndex.get(4));  // 2
console.log(seqToIndex.has(3));  // false（seq: 3は存在しない）
console.log(seqToIndex.has(5));  // false（seq: 5は存在しない）
```

**ポイント：**
- `Map<number, number>` を使うことで、数値のseqから数値のindexへの対応を型安全に管理
- `forEach`で配列を走査し、`set(seq, index)`でMapに登録
- 後で`has(seq)`で存在チェック、`get(seq)`でindexを取得

#### ステップ2: checkStateを変換

```typescript
/**
 * なぜRecordを使うのか？
 * - checkStateは文字列のキー（"0", "1", "2"...）を使う
 * - 共通コンポーネントの仕様で決まっている
 * - JSON.stringifyでシリアライズできる必要がある
 */
function processCheckStateEntries(
  oldArray: ArrayT[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> {
  const newCheckState: Record<string, boolean> = {};

  // oldCheckStateの各エントリを処理
  for (const [indexStr, isChecked] of Object.entries(oldCheckState)) {
    if (!isChecked) continue;  // チェックされていないものはスキップ

    // 文字列のindexを数値に変換
    const oldIndex = parseInt(indexStr, 10);  // "2" → 2

    // oldArrayからその要素を取得
    const oldItem = oldArray[oldIndex];  // { seq: 3, ... }

    if (!oldItem) continue;  // 要素が存在しない場合はスキップ

    // oldItemのseqが新配列に存在するか確認
    const newIndex = seqToNewIndex.get(oldItem.seq);

    if (newIndex !== undefined) {
      // 存在する場合、新しいindexでcheckStateに追加
      newCheckState[newIndex.toString()] = true;
    }
  }

  return newCheckState;
}

// 実行の流れ
// oldCheckState["2"] = true
//   → oldIndex = 2
//   → oldItem = array1[2] = { seq: 3, ... }
//   → seqToNewIndex.get(3) = undefined（array2にseq:3は存在しない）
//   → 新checkStateに追加しない
//
// oldCheckState["3"] = true
//   → oldIndex = 3
//   → oldItem = array1[3] = { seq: 4, ... }
//   → seqToNewIndex.get(4) = 2（array2のindex 2にseq:4が存在）
//   → newCheckState["2"] = true に追加
//
// oldCheckState["4"] = true
//   → oldIndex = 4
//   → oldItem = array1[4] = { seq: 5, ... }
//   → seqToNewIndex.get(5) = undefined（array2にseq:5は存在しない）
//   → 新checkStateに追加しない
//
// 結果: newCheckState = { "2": true }
```

**ポイント：**
- `Object.entries(oldCheckState)` でRecordを反復処理
- Mapの`get()`で高速に新しいindexを検索
- `undefined`チェックで存在しないseqを除外

#### ステップ3: メイン関数

```typescript
function updateCheckState(
  oldArray: ArrayT[],
  newArray: ArrayT[],
  oldCheckState: Record<string, boolean>
): Record<string, boolean> {
  // 1. 新配列のseq→indexマップを作成（Map使用）
  const seqToNewIndex = createSeqToIndexMap(newArray);

  // 2. checkStateを変換（Record使用）
  return processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);
}
```

### なぜこの組み合わせ？

| 用途 | 使用したもの | 理由 |
|------|------------|------|
| seq→indexの対応表 | `Map<number, number>` | キーが数値、高速検索、has()が便利 |
| checkState | `Record<string, boolean>` | 共通コンポーネントの仕様、文字列キー |

---

## よくある間違いと解決策

### 間違い1: Mapを直接JSONに変換しようとする

```typescript
// ❌ 間違い
const map = new Map([["a", 1], ["b", 2]]);
const json = JSON.stringify(map);
console.log(json);  // "{}" （空オブジェクトになってしまう）

// ✅ 正しい方法
const obj = Object.fromEntries(map);
const json = JSON.stringify(obj);
console.log(json);  // '{"a":1,"b":2}'
```

### 間違い2: Recordのキーを数値として扱う

```typescript
// ⚠️ 注意が必要
const record: Record<number, string> = {
  1: "one",
  2: "two"
};

// ❌ これは動作しない（キーは内部で文字列に変換される）
const value = record[1];  // TypeScript上は動くが...

// ✅ 明示的に文字列に変換する
const value = record["1"];

// または、最初からRecord<string, string>を使う
const record2: Record<string, string> = {
  "1": "one",
  "2": "two"
};
```

### 間違い3: for-inで配列を反復処理

```typescript
const checkState: Record<string, boolean> = {
  "0": true,
  "1": false,
  "2": true
};

// ❌ 非推奨（プロトタイプチェーンの影響を受ける可能性）
for (const key in checkState) {
  console.log(key, checkState[key]);
}

// ✅ 推奨
for (const [key, value] of Object.entries(checkState)) {
  console.log(key, value);
}

// または
Object.entries(checkState).forEach(([key, value]) => {
  console.log(key, value);
});
```

### 間違い4: Mapのgetの戻り値をチェックしない

```typescript
const map = new Map<number, string>();
map.set(1, "one");

// ❌ 危険（存在しないキーの場合undefinedが返る）
const value = map.get(2);
console.log(value.toUpperCase());  // エラー！

// ✅ 安全
const value = map.get(2);
if (value !== undefined) {
  console.log(value.toUpperCase());
}

// または has() でチェック
if (map.has(2)) {
  const value = map.get(2)!;  // non-null assertion
  console.log(value.toUpperCase());
}
```

### 間違い5: RecordとMapを混同する

```typescript
// ❌ これはMapではない
const record: Record<string, number> = { a: 1, b: 2 };
record.set("c", 3);  // エラー！ set()メソッドは存在しない

// ✅ Recordは普通のオブジェクト
record["c"] = 3;
record.c = 3;  // これでもOK

// ✅ Mapを使う場合
const map = new Map<string, number>();
map.set("a", 1);
map.set("b", 2);
map.set("c", 3);
```

---

## チートシート

### オブジェクト/Record

```typescript
// 作成
const obj = { key: "value" };
const record: Record<string, string> = { key: "value" };

// 取得
const value = obj.key;
const value = obj["key"];

// 追加・更新
obj.key = "newValue";
obj["key"] = "newValue";

// 削除
delete obj.key;

// 存在チェック
"key" in obj
obj.hasOwnProperty("key")

// 反復処理
for (const [key, value] of Object.entries(obj)) { }

// サイズ
Object.keys(obj).length

// キー一覧
Object.keys(obj)

// 値一覧
Object.values(obj)
```

### Map

```typescript
// 作成
const map = new Map<K, V>();
const map = new Map([[key1, value1], [key2, value2]]);

// 取得
const value = map.get(key);

// 追加・更新
map.set(key, value);

// 削除
map.delete(key);

// 全削除
map.clear();

// 存在チェック
map.has(key)

// 反復処理
for (const [key, value] of map) { }
map.forEach((value, key) => { });

// サイズ
map.size

// キー一覧
Array.from(map.keys())

// 値一覧
Array.from(map.values())

// オブジェクトに変換
Object.fromEntries(map)
```

---

## まとめ

### 重要なポイント

1. **構造が固定** → オブジェクト（type/interface）
2. **動的なキー（文字列）** → Record
3. **動的なキー（任意の型）** → Map
4. **頻繁な追加・削除** → Map
5. **JSON変換が必要** → オブジェクト/Record

### 今回の学び

- **Map は seq→index のような対応表に最適**
  - 数値キーが使える
  - has()/get() で高速検索

- **Record は文字列キーの動的データに最適**
  - 型安全
  - JSON変換可能
  - 共通コンポーネントとの互換性

- **使い分けが重要**
  - 内部処理でMapを使い、外部インターフェースでRecordを使う
  - それぞれの強みを活かす

---

*このドキュメントは foo.ts のリファクタリング体験から作成されました。*
