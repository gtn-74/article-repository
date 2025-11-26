// Personオブジェクトの型定義
type Person = {
  name: string;
  age: number;
  nationality: string;
};

// 初期値
const person: Person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};

// Proxyを使用してプロパティのアクセスと変更を監視
const personProxy1 = new Proxy(person, {
  // getトラップ: プロパティの読み取り時に呼ばれる
  get: <K extends keyof Person>(obj: Person, prop: K): Person[K] => {
    console.log(`The value of ${String(prop)} is ${obj[prop]}`);
    // 重要: getトラップは値を返す必要がある
    return obj[prop];
  },
  // setトラップ: プロパティの書き込み時に呼ばれる
  // ジェネリクスを使用することで、propとvalueの型の対応関係を保証
  set: <K extends keyof Person>(
    obj: Person,
    prop: K,
    value: Person[K]
  ): boolean => {
    console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}`);
    // propが"name"なら、valueもstring型
    // propが"age"なら、valueもnumber型となるため、型安全
    obj[prop] = value;
    // 成功を示すためtrueを返す
    return true;
  },
});

const personProxy2 = new Proxy(person, {
  // getトラップ: プロパティの読み取り時に呼ばれる
  get: <K extends keyof Person>(obj: Person, prop: K): Person[K] => {
    const value = Reflect.get(obj, prop);
    console.log(`The value of ${prop} is ${value}`);
    // ✅ 重要: 値を返す必要がある
    return value;
  },
  // setトラップ: プロパティの書き込み時に呼ばれる
  set: <K extends keyof Person>(obj: Person, prop: K, value: Person[K]): boolean => {
    console.log(`Changed ${prop} from ${Reflect.get(obj, prop)} to ${value}`);
    // Reflect.setを使うことで、より安全にプロパティを設定
    return Reflect.set(obj, prop, value);
  }
});


console.log(personProxy1.name);
// personProxy.name = "扇谷";
personProxy2.age = 43;


// <K extends keyof Person>