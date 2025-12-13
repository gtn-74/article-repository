import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Yupスキーマ定義
const schema = yup.object({
  name: yup
    .string()
    .min(2, "名前は2文字以上で入力してください")
    .max(20, "名前は20文字以内で入力してください")
    .required("名前は必須です"),
  age: yup
    .string()
    .min(0, "年齢は0以上で入力してください")
    .max(120, "年齢は120以下で入力してください")
    .required("年齢は必須です"),
});

type FormData = yup.InferType<typeof schema>;

export default function RhfYupForm() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    setSubmittedData(data);
  };

  // console.log("a".codePointAt(0)?.toString(16));
  // console.log("あ".codePointAt(0)?.toString(16));

  // 引用:https://jsprimer.net/basic/string-unicode/
  function convertCodeUnits(str: string) {
    const codeUnits = [];
    for (let i = 0; i < str.length; i++) {
      codeUnits.push(str.charCodeAt(i).toString(16));
    }
    return codeUnits;
  }

  console.log("𰻞".length);

  // !𰻞
  const str = "𰻞";
  const byan = convertCodeUnits(str);
  console.log(byan);

  // !あ
  const str2 = "あ";
  const a = convertCodeUnits(str2);
  console.log(a);

  console.log("𰻞".codePointAt(0)?.toString(16));
  console.log("\u{d883}\u{dede}");
  console.log("\u{3042}");

  return (
    <div style={{ padding: "20px" }}>
      <h1>デモ</h1>
      {/* <p>min/maxバリデーションのデモ</p> */}

      <div style={{ display: "flex", gap: "40px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            flex: "0 0 400px",
          }}
        >
          <div>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "5px" }}
            >
              名前 (2-20文字)
            </label>
            <input
              id="name"
              {...register("name")}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.name ? "1px solid red" : "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.name && (
              <p
                style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="age"
              style={{ display: "block", marginBottom: "5px" }}
            >
              年齢 (0-120)
            </label>
            <input
              id="age"
              type="number"
              {...register("age")}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.age ? "1px solid red" : "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.age && (
              <p
                style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}
              >
                {errors.age.message}
              </p>
            )}
          </div>

          {/* <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            style={{
              width: "100%",
              padding: "8px",
              border: errors.email ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}>
              {errors.email.message}
            </p>
          )}
        </div> */}

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            送信
          </button>
        </form>

        {submittedData && (
          <div style={{ flex: 1 }}>
            <h2>送信結果</h2>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <pre style={{ margin: 0, fontFamily: "monospace" }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
