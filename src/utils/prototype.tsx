export default function Prototype() {
  type DogParams = {
    name: string;
    play?: () => void;
  };

  class Dog {
    name: string;
    play?: (num: number) => void;

    constructor(obj: DogParams) {
      this.name = obj.name;
      // this.play = obj.play;
    }

    bark() {
      return "Woof!";
    }
  }

  class SuperDog extends Dog {
    constructor(obj: DogParams) {
      super(obj);
    }

    fly() {
      console.log("flying");
    }
  }

  // const dog2 = new Dog("max");
  // const dog3 = new Dog("spot");

  // プロトタイプを先に設定
  Dog.prototype.play = () => console.log("playing now!");

  // プロトタイプの設定後にインスタンス化
  const dog1 = new Dog({ name: "daisy" });
  // const dog1 = new Dog({ name: "daisy", play: () => {} });
  // console.log(dog1.play()); // undefinedになる（インスタンスプロパティが優先される）

  console.log("\ndog1のplayプロパティ:", dog1.play);
  console.log("Dog.prototype.play:", Dog.prototype.play);

  const dog2 = new SuperDog({ name: "hoge" });
  // const dog2 = new SuperDog({ name: "hoge", play: () => {} });
  console.log(dog2.bark());
  console.log(dog2.fly());

  // インスタンスプロパティを削除してプロトタイプを使う
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // delete (dog1 as any).play;
  // console.log("\nインスタンスプロパティ削除後:");
  // console.log(dog1.play()); // これで"playing now!"が表示される

  return <div>prototype</div>;
}
