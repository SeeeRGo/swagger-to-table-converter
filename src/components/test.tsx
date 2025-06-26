'use client'
import { useEffect, useState } from "react";

export function Test() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fun = async () => {
      const res = await new Promise<number>((resolve) => setTimeout(() => {
        resolve(7)
      }, 5000))
      console.log('res setting');
      
      setCount(res)
    }
    fun()
    return () => {
      console.log('unmount');
    }
  }, [])
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {count}
    </div>
  );
}