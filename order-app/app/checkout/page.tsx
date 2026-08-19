// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

export default function CheckoutPage() {
  const [total, setTotal] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  // マウント時に localStorage からカートを読み込み、合計を計算
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const sum = savedCart.reduce(
      (acc: number, item: any) => acc + Number(item.price),
      0
    );
    setTotal(sum);
  }, []);

  const handleConfirm = () => {
    // localStorage をクリア
    localStorage.removeItem("cart");
    setConfirmed(true);
  };

  if (confirmed) {
    // サンクス画面
    return (
      <div className={styles.thankyou}>
        <h1>ありがとうございました</h1>
        <Image src="/group_sushi.png" alt="寿司のイメージ画像" width={400} height={400}/>
        <h3>またのご来店をお待ちしております。</h3>
        <button onClick={() => router.push("/")}>トップに戻る</button>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <h1>お会計</h1>
      <p className={styles.total}>合計金額：{total.toLocaleString()}円(税込)</p>
      <h3>お会計いたします、よろしいですか？</h3>
      <button className={styles.confirmButton} onClick={handleConfirm}>
        会計する
      </button>
    </div>
  );
}
