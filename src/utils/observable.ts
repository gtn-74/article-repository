export type Observer<T> = (data: T) => void;

export class Observable<T> {
  private observers: Observer<T>[];

  constructor() {
    // 特定のイベントが発生するたびに通知を受け取る。
    this.observers = [];
  }

  // Observer を Observer のリストに追加するためのメソッド
  subscribe(func: Observer<T>): void {
    this.observers.push(func);
    console.log(this.observers);
  }

  // Observer のリストから Observer を削除するメソッド
  unsubscribe(func: Observer<T>): void {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  // 特定のイベントが発生したときに、すべての Observer に通知するメソッド
  notify(data: T): void {
    this.observers.forEach((observer) => observer(data));
  }
}
