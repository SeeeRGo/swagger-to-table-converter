'use client'
import Popup from "@/components/popup";
import { Test } from "@/components/test";
import { useEffect, useState } from "react";

export default function Home() {
  const [show, setShow] = useState(true)
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => {
        setShow(!show)
      }}>Show {show}</button>
      {show ? <Test /> : null}
      {/* <Popup /> */}
    </div>
  );
}
