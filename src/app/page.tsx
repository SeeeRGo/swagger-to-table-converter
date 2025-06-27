'use client'
import { mockReqBody } from "@/__tests__/mockReqBody";
import Popup from "@/components/popup";
import axios from "axios";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <button onClick={() => {
      fetch('/api/convert-batch', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mockReqBody)
      })
        .then(data => data.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)        
        const a = document.createElement('a')
        a.href = url
        a.download = `1.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
      }}>Parse</button> */}
      <Popup />
    </div>
  );
}
