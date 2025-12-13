import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zodスキーマ定義
const schema = z.object({
  name: z
    .string()
    .min(2, { message: "名前は2文字以上で入力してください" })
    .max(20, { message: "名前は20文字以内で入力してください" }),
  age: z
    .number()
    .min(0, { message: "年齢は0以上で入力してください" })
    .max(120, { message: "年齢は120以下で入力してください" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
});

type FormData = z.infer<typeof schema>;

export default function RhfZodForm() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    setSubmittedData(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Hook Form + Zod</h1>
      <p>min/maxバリデーションのデモ</p>

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
              {...register("age", { valueAsNumber: true })}
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

          <div>
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
              <p
                style={{ color: "red", fontSize: "14px", margin: "5px 0 0 0" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

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
