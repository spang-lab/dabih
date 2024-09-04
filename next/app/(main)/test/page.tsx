
'use client';


export default function Test() {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  return (
    <div>
      {
        numbers.map((number) => (
          <div key={number} className="border border-gray-300">
            {number}
          </div>
        ))
      }
    </div>
  );
}
