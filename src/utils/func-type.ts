export {};

//! default-parameters

// export const nextYearSalary = (currentSalary: number, rate: number) => {
//   return currentSalary * rate;
// };

//! rateが与えられなかったら、引数で宣言しているデフォルト引数が引数となる
export const nextYearSalary = (currentSalary: number, rate: number = 1.1) => {
  return currentSalary * rate;
};

console.log(nextYearSalary(1000));

//! reducer
const reducer = (accumulator: number, currentValue: number) => {
  console.log({ accumulator, currentValue });
  return accumulator + currentValue;
};

//! rest-parameters
const sum: (...values: number[]) => number = (...values: number[]): number => {
  return values.reduce(reducer);
};
console.log(sum(1, 2, 3, 4, 5));

//! シグネイチャ
function double(value: number): number; // シグネイチャ
function double(value: string): string; // シグネイチャ

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function double(value: any): any {
  return value * 2;
}

//! overloads
// function double(value: number): number {
//   return value * 2;
// }

// function double(value: string): string {
//   return value + value;
// }

console.log(double(100));
console.log(double("Go "));
