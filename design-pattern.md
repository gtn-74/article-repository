# design pattern

## proxy pattern

### Reflect API とは？

**Reflect**は、JavaScript のオブジェクト操作を行うための組み込み API です。ES6（ES2015）で導入されました。

#### 従来の方法 vs Reflect API

```javascript
// 従来の方法
obj.name = "John"; // プロパティの設定
const value = obj.name; // プロパティの取得
delete obj.name; // プロパティの削除
"name" in obj; // プロパティの存在チェック

// Reflect APIを使う方法
Reflect.set(obj, "name", "John"); // プロパティの設定
const value = Reflect.get(obj, "name"); // プロパティの取得
Reflect.deleteProperty(obj, "name"); // プロパティの削除
Reflect.has(obj, "name"); // プロパティの存在チェック
```

### なぜ Reflect が必要なのか？

#### 1. **一貫性のある API**

従来は様々な構文が混在していました：

- プロパティアクセス: `obj.prop`, `obj[prop]`
- 削除: `delete` 演算子
- 存在チェック: `in` 演算子
- 関数呼び出し: `func.apply()`

Reflect は全てを**関数呼び出し**として統一します。

#### 2. **関数型プログラミングとの相性**

```javascript
// 従来: 演算子ベース（関数として扱えない）
delete obj.prop;

// Reflect: 関数として扱える（map, filterなどで使える）
Reflect.deleteProperty(obj, "prop");

// 例: 複数のプロパティを削除
["prop1", "prop2", "prop3"].forEach((prop) =>
  Reflect.deleteProperty(obj, prop)
);
```

#### 3. **エラーハンドリングが明確**

```javascript
// 従来: 厳格モードでないとエラーが無視される
obj.readOnlyProp = "変更できない"; // エラーが無視される可能性

// Reflect: 成功/失敗がbooleで返る
const success = Reflect.set(obj, "readOnlyProp", "変更できない");
if (!success) {
  console.log("設定に失敗しました");
}
```

#### 4. **Proxy と対になる設計**

Proxy のトラップと Reflect のメソッドは**1 対 1 で対応**しています：

| Proxy トラップ   | Reflect メソッド           | 説明                   |
| ---------------- | -------------------------- | ---------------------- |
| `get`            | `Reflect.get()`            | プロパティ取得         |
| `set`            | `Reflect.set()`            | プロパティ設定         |
| `has`            | `Reflect.has()`            | プロパティ存在チェック |
| `deleteProperty` | `Reflect.deleteProperty()` | プロパティ削除         |
| `apply`          | `Reflect.apply()`          | 関数呼び出し           |
| `construct`      | `Reflect.construct()`      | コンストラクタ呼び出し |

### personProxy1 vs personProxy2 の違い

#### personProxy1（従来の方法）

```typescript
const personProxy1 = new Proxy(person, {
  get: <K extends keyof Person>(obj: Person, prop: K): Person[K] => {
    console.log(`The value of ${String(prop)} is ${obj[prop]}`);
    return obj[prop]; // ← ブラケット記法で直接アクセス
  },
  set: <K extends keyof Person>(
    obj: Person,
    prop: K,
    value: Person[K]
  ): boolean => {
    console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}`);
    obj[prop] = value; // ← 直接代入
    return true;
  },
});
```

**特徴:**

- ✅ シンプルで直感的
- ✅ パフォーマンスが若干良い（関数呼び出しのオーバーヘッドがない）
- ❌ Proxy の思想と一貫性がない
- ❌ 複雑なケースで問題が起きる可能性

#### personProxy2（Reflect API を使う方法）

```typescript
const personProxy2 = new Proxy(person, {
  get: <K extends keyof Person>(obj: Person, prop: K): Person[K] => {
    const value = Reflect.get(obj, prop); // ← Reflect APIを使用
    console.log(`The value of ${prop} is ${value}`);
    return value;
  },
  set: <K extends keyof Person>(
    obj: Person,
    prop: K,
    value: Person[K]
  ): boolean => {
    console.log(`Changed ${prop} from ${Reflect.get(obj, prop)} to ${value}`);
    return Reflect.set(obj, prop, value); // ← Reflect APIを使用
  },
});
```

**特徴:**

- ✅ Proxy との思想的一貫性
- ✅ より安全（エラーハンドリングが明確）
- ✅ ベストプラクティス
- ✅ 複雑なケース（getter/setter があるオブジェクトなど）でも正しく動作
- ❌ 若干のパフォーマンスオーバーヘッド（実用上は無視できる）

### 実際の違いが出るケース

#### ケース 1: getter/setter があるオブジェクト

```typescript
const user = {
  _name: "John",
  get name() {
    console.log("getterが呼ばれた");
    return this._name;
  },
  set name(value) {
    console.log("setterが呼ばれた");
    this._name = value;
  },
};

// obj[prop]を使った場合
const proxy1 = new Proxy(user, {
  get(target, prop) {
    return target[prop]; // thisがtargetになる
  },
});

// Reflect.getを使った場合
const proxy2 = new Proxy(user, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver); // thisがreceiverになる（正しい）
  },
});
```

#### ケース 2: 継承があるケース

```typescript
const parent = { x: 1 };
const child = Object.create(parent);
child.y = 2;

const proxy = new Proxy(child, {
  get(target, prop, receiver) {
    // Reflect.getは継承チェーンも正しく処理する
    return Reflect.get(target, prop, receiver);
  },
});
```

### まとめ

| 項目             | `obj[prop]` | `Reflect.get(obj, prop)` |
| ---------------- | ----------- | ------------------------ |
| シンプルさ       | ⭐⭐⭐      | ⭐⭐                     |
| 一貫性           | ⭐          | ⭐⭐⭐                   |
| 安全性           | ⭐⭐        | ⭐⭐⭐                   |
| Proxy での推奨度 | ⭐          | ⭐⭐⭐                   |
| パフォーマンス   | ⭐⭐⭐      | ⭐⭐                     |

**結論:**

- **単純なオブジェクト**なら`obj[prop]`でも問題ない
- **Proxy を使う場合**は`Reflect`を使うのがベストプラクティス
- **ライブラリを作る場合**は必ず`Reflect`を使うべき

### Reflect の主要メソッド一覧

```typescript
// プロパティ操作
Reflect.get(obj, prop); // obj[prop]
Reflect.set(obj, prop, value); // obj[prop] = value
Reflect.has(obj, prop); // prop in obj
Reflect.deleteProperty(obj, prop); // delete obj[prop]

// オブジェクト操作
Reflect.ownKeys(obj); // Object.getOwnPropertyNames() + Object.getOwnPropertySymbols()
Reflect.getPrototypeOf(obj); // Object.getPrototypeOf(obj)
Reflect.setPrototypeOf(obj, prototype); // Object.setPrototypeOf(obj, prototype)

// 関数操作
Reflect.apply(func, thisArg, args); // func.apply(thisArg, args)
Reflect.construct(Constructor, args); // new Constructor(...args)

// プロパティディスクリプタ
Reflect.getOwnPropertyDescriptor(obj, prop); // Object.getOwnPropertyDescriptor()
Reflect.defineProperty(obj, prop, descriptor); // Object.defineProperty()

// 拡張可能性
Reflect.isExtensible(obj); // Object.isExtensible(obj)
Reflect.preventExtensions(obj); // Object.preventExtensions(obj)
```

判断要素 説明
誰が判断？ JavaScript エンジン（V8, SpiderMonkey など）
いつ判断？ コードの構文解析（パース）時
どうやって？ プロパティアクセスの文脈を見る
GET 呼び出し プロパティが値として使われるとき
SET 呼び出し プロパティが代入の左辺にあるとき
プログラマが明示的に指定する必要はなく、JavaScript エンジンが自動的に適切なトラップを選択してくれます！

## C/P(コンテナ・プレゼンテーションパターン)

### presentation
`props`を通じてデータを受け取る。
