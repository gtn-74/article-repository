// 下の配列はarray1でした。
// フロント側でレコードにチェックをつけたindexの状態をcheckStateとして保持しています。
// get処理を行ったら、array1は、array2となっていました。
// fetchしたarray2には、チェック状態がありません。
// checkStateのstringは、array1のindex値です。

// やりたいこと
// この場合、"5": trueは、array2には存在しないのでcheckStateから削除してほしい。
// array1のindex2は消えてるけど、配列のindexは要素の数なのでarray1とずれます。seqをユニークキーとしてcheckStateを適切な形に変更してほしいです。

type ArrayT = {
  index: number;
  seq: number;
  name: string;
  desc: string;
};

const array1: ArrayT[] = [
  { index: 0, seq: 1, name: "hoge", desc: "hogehgoe" },
  { index: 1, seq: 2, name: "hoge", desc: "hogehgoe" },
  { index: 2, seq: 3, name: "hoge", desc: "hogehgoe" }, // チェックがついていたレコード
  { index: 3, seq: 4, name: "hoge", desc: "hogehgoe" }, // チェックがついていたレコード
  { index: 4, seq: 5, name: "hoge", desc: "hogehgoe" }, // チェックがついていたレコード
];
const array2: ArrayT[] = [
  { index: 0, seq: 1, name: "hoge", desc: "hogehgoe" },
  { index: 1, seq: 2, name: "hoge", desc: "hogehgoe" },
  { index: 2, seq: 4, name: "hoge", desc: "hogehgoe" },
];

// チェック状態
const checkState: Record<string, boolean> = {
  "0": true,
  "2": true,
  "3": true,
  "4": true,
};

// ========================================
// checkState管理ロジック
// ========================================

/**
 * 配列からseqとindexのマップを作成する
 *
 * @param array 対象の配列
 * @returns seqをキー、配列のindexを値とするMap
 */
const createSeqToIndexMap = (array: ArrayT[]): Map<number, number> => {
  const seqToIndex = new Map<number, number>();
  array.forEach((item, index) => {
    seqToIndex.set(item.seq, index);
  });
  return seqToIndex;
};

/**
 * checkStateの各エントリを処理して新しいcheckStateを作成する
 *
 * @param oldArray fetch前の配列
 * @param oldCheckState 古いcheckState（oldArrayのindex基準）
 * @param seqToNewIndex seqから新配列のindexへのマップ
 * @returns 新しいcheckState（新配列のindex基準）
 */
const processCheckStateEntries = (
  oldArray: ArrayT[],
  oldCheckState: Record<string, boolean>,
  seqToNewIndex: Map<number, number>
): Record<string, boolean> => {
  const newCheckState: Record<string, boolean> = {};

  Object.entries(oldCheckState).forEach(([indexStr, isChecked]) => {
    if (!isChecked) return;

    const oldIndex = parseInt(indexStr, 10);
    const oldItem = oldArray[oldIndex];

    if (!oldItem) return;

    // oldItemのseqがnewArrayに存在するか確認
    const newIndex = seqToNewIndex.get(oldItem.seq);
    if (newIndex !== undefined) {
      newCheckState[newIndex.toString()] = true;
    }
  });

  return newCheckState;
};

/**
 * fetch前後の配列を比較して、checkStateを更新する
 *
 * やっていること：
 * 1. 旧配列のindex → seq に変換
 * 2. そのseqが新配列に存在するか確認
 * 3. 存在する場合、新配列でのindexを取得
 * 4. 新しいcheckStateを作成（新配列のindex基準）
 *
 * @param oldArray fetch前の配列
 * @param newArray fetch後の配列
 * @param oldCheckState 古いcheckState（oldArrayのindex基準）
 * @returns 新しいcheckState（newArrayのindex基準）
 */
const updateCheckState = (
  oldArray: ArrayT[],
  newArray: ArrayT[],
  oldCheckState: Record<string, boolean>
): Record<string, boolean> => {
  const seqToNewIndex = createSeqToIndexMap(newArray);
  return processCheckStateEntries(oldArray, oldCheckState, seqToNewIndex);
};

// ========================================
// 使用例
// ========================================

// fetch前のcheckState: {"2": true, "3": true, "4": true}
// - array1のindex 2（seq: 3）がチェック済み
// - array1のindex 3（seq: 4）がチェック済み
// - array1のindex 4（seq: 5）がチェック済み

const updatedCheckState = updateCheckState(array1, array2, checkState);

console.log("変更前:", checkState);
// {"2": true, "3": true, "4": true}

console.log("変更後:", updatedCheckState);
// {"2": true}
// 理由：
// - array1のindex 2（seq: 3）→ array2に存在しない → 削除
// - array1のindex 3（seq: 4）→ array2のindex 2に存在 → 新checkState["2"] = true
// - array1のindex 4（seq: 5）→ array2に存在しない → 削除
