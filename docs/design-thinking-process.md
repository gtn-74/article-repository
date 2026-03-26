# 保守性の高いコードを書くための設計思考プロセス

このドキュメントは、複雑なロジックをテストしやすく、読みやすいコードに変換するための思考プロセスをまとめたものです。

---

## 設計プロセスの 6 ステップ

### 1. 問題を言語化する

まず「何をしたいのか」を日本語で明確にします。

**例：**

```
fetch前のcheckStateを、fetch後の配列に合わせて更新したい
```

**ポイント：**

- コードを書く前に、目的を 1 文で説明できるようにする
- この 1 文が関数のドキュメントコメントのベースになる

---

### 2. 処理を分解する（What → How）

大きな処理を**名詞と動詞**で分解します。

**例：**

- 「**新配列から seq→index のマップを作る**」（準備）
- 「**旧 checkState の各エントリを変換する**」（変換）
- 「**新 checkState を返す**」（統合）

**ポイント：**

- 動詞（〜する）に注目する
- 各ステップが独立していることを確認する
- 3〜5 ステップ程度に分解できると理想的

---

### 3. 各処理を関数化する（単一責任の原則）

分解した各処理 = 1 つの関数にします。

**❌ 悪い例：1 つの関数で全部やる**

```typescript
function doEverything() {
  // マップ作成
  const map = new Map();
  array.forEach(...);

  // ループ処理
  for (const item of items) {
    // 変換
    // 条件チェック
    // 更新
  }

  // 返却
  return result;
}
```

**✅ 良い例：責任を分ける**

```typescript
function createSeqToIndexMap(array: ArrayT[]): Map<number, number> {
  const seqToIndex = new Map<number, number>();
  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
  });
  return seqToIndex;
}

function processCheckStateEntries(
  oldArray: ArrayT[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> {
  // 変換ロジック
}

function updateCheckState(
  oldArray: ArrayT[],
  newArray: ArrayT[],
  oldCheckState: Record<string, boolean>
): Record<string, boolean> {
  const seqToNewIndex = createSeqToIndexMap(newArray);
  return processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);
}
```

**メリット：**

- 各関数を独立してテストできる
- 関数名を見ただけで処理の流れが分かる
- バグが見つかったとき、どの関数を修正すればいいか明確

---

### 4. 命名で意図を伝える

変数名・関数名で「何をしているか」「何を表すか」を明確にします。

**❌ 悪い例：意図が不明瞭**

```typescript
const setA = new Set(array1.map(i => i.seq));
const setB = new Set(array2.map(i => i.seq));
const matched = array1.filter(item => rowIndex.includes(item.rowIndex));
const asdf = remapCheckedState(...);
```

**✅ 良い例：意図が明確**

```typescript
const oldSeqSet = new Set(oldArray.map(item => item.seq));
const newSeqSet = new Set(newArray.map(item => item.seq));
const checkedItems = oldArray.filter(item => checkedIndexes.includes(item.index));
const updatedCheckState = updateCheckState(...);
```

**命名のコツ：**

- `tmp`, `data`, `result` などの汎用的な名前は避ける
- 略語は一般的なもののみ使う（`idx` より `index`、`cnt` より `count`）
- boolean は `is`, `has`, `should` で始める
- 配列/リストは複数形にする（`items`, `users`）
- Set/Map には `Set`, `Map` を含める（`seqToIndexMap`）

---

### 5. データの流れを意識する

データがどのように変換されていくかを図解します。

**例：**

```
入力データ → 中間データ → 出力データ
    ↓
oldArray, newArray → seqToIndexMap → newCheckState
```

**コードでの表現：**

```typescript
// データの流れが一目瞭然
function updateCheckState(...) {
  const seqToNewIndex = createSeqToIndexMap(newArray);  // 中間データ生成
  return processCheckStateEntries(..., seqToNewIndex);   // 最終データ生成
}
```

**ポイント：**

- 変数名が変換の流れを表現する
- 各ステップで何が生成されるか明確にする
- 副作用を避け、新しいデータを生成して返す

---

### 6. テスト可能性を考える

関数を書く前に「この関数、テストできる？」と自問します。

**チェックリスト：**

- [ ] 引数だけで結果が決まる？（純粋関数）
- [ ] 副作用がない？（グローバル変数の変更、API 呼び出しなど）
- [ ] 1 つのことだけしている？（単一責任）
- [ ] 引数は 3 つ以内？
- [ ] 戻り値の型が明確？

**✅ テストしやすい関数：**

```typescript
function createSeqToIndexMap(array: ArrayT[]): Map<number, number> {
  // 引数だけで結果が決まる
  // 副作用なし
  // マップ作成だけしている
  // 引数1つ
  // 戻り値の型明確
}
```

**❌ テストしにくい関数：**

```typescript
function processData() {
  // グローバル変数に依存
  const data = globalState.data;

  // API呼び出し（副作用）
  await fetchData();

  // 複数のことをしている
  validate();
  transform();
  save();

  // 戻り値なし
}
```

---

## 実践のコツ

### 1. 複雑なコードを書き始めたら一旦止まる

「これ、小さく分けられないかな？」と自問する習慣をつけましょう。

### 2. 関数名を先に考える

良い名前が思いつかない = 関数の責任が曖昧なサイン。
設計を見直すタイミングです。

### 3. 引数は 3 つまで

引数が多すぎる場合は：

- オブジェクトにまとめる
- 関数を分割する
- 関数の責任が大きすぎないか見直す

### 4. コメントより関数名

```typescript
// ❌ コメントで説明
// Seqでマップを作る
const map = new Map();
array.forEach((item, index) => {
  map.set(item.seq, index);
});

// ✅ 関数名で説明
const seqToIndexMap = createSeqToIndexMap(array);
```

### 5. ネストを避ける（早期 return/continue）

```typescript
// ❌ ネストが深い
for (const item of items) {
  if (isChecked) {
    if (oldItem) {
      if (newIndex !== undefined) {
        // 処理
      }
    }
  }
}

// ✅ 早期continue
for (const item of items) {
  if (!isChecked) continue;
  if (!oldItem) continue;
  if (newIndex === undefined) continue;
  // 処理
}
```

### 6. DRY 原則（Don't Repeat Yourself）

同じコードを 3 回書いたら、関数化を検討しましょう。

### 7. 小さくリファクタリング

一気に完璧な設計を目指すのではなく：

1. まず動くコードを書く
2. 動作確認する
3. 小さくリファクタリング
4. テストする
5. 繰り返す

---

## ビフォー・アフター比較

### Before: 試行錯誤中のコード

```typescript
React.useEffect(() => {
  const setA = new Set(records.map((i) => i.onlineShikakuRiyoushaSeq));
  const setB = new Set(
    unableToRegisterNewRiyoushaList.map((i) => i.onlineShikakuRiyoushaSeq)
  );

  const rowIndex: number[] = Object.keys(unableToRegisterSelectedRows)
    .filter((key) => unableToRegisterSelectedRows[key])
    .map((key) => Number(key));

  const matched = unableToRegisterNewRiyoushaList.filter((row) =>
    rowIndex.includes(row.rowIndex)
  );

  const allMatch = Array.from(setB).every((seq) => setA.has(seq));

  if (allMatch) {
    setSelectedRow(unableToRegisterSelectedRows);
  }
}, [
  unableToRegisterSelectedRows,
  setSelectedRow,
  unableToRegisterNewRiyoushaList,
]);
```

**問題点：**

- useEffect 内に大量のロジック
- 変数名が不明瞭（setA, setB）
- 何をしているか追いづらい
- テストが困難

### After: リファクタリング後

```typescript
// ロジックを純粋関数として分離
const updatedCheckState = updateCheckState(oldArray, newArray, checkState);

// useEffect内はシンプルに
React.useEffect(() => {
  if (setSelectedRow && loadingStatus === "Loaded") {
    const newSelectedRows = updateCheckState(
      previousData,
      currentData,
      selectedRows
    );
    setSelectedRow(newSelectedRows);
  }
}, [selectedRows, setSelectedRow, currentData]);
```

**改善点：**

- ロジックが独立した関数に分離
- 関数名で意図が明確
- 純粋関数なのでテスト可能
- useEffect 内はシンプルで読みやすい

---

## まとめ

良い設計は一朝一夕では身につきませんが、このプロセスを意識して練習することで、確実に向上します。

**重要なポイント：**

1. 問題を言語化してから書き始める
2. 大きな処理は小さく分解する
3. 各関数は 1 つのことだけする
4. 名前で意図を伝える
5. テスト可能性を常に考える
6. 小さくリファクタリングを繰り返す

**最初は時間がかかりますが、慣れると自然にできるようになります！**

---

_このドキュメントは foo.ts のリファクタリング体験から作成されました。_
