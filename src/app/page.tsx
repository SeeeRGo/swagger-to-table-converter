'use client'
import { mockReqBody } from "@/__tests__/mockReqBody";
import Popup from "@/components/popup";
import axios from "axios";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => {
        axios.post('/api/convert-batch', mockReqBody)
      }}>Parse</button>
      <Popup />
    </div>
  );
}
