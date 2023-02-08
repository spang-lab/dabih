import React, { useState } from 'react';

function ApiButton() {
  const [data, setData] = useState(null);

  const onClick = async () => {
    const response = await fetch('/api/test');
    const result = await response.json();
    setData(result);
  };
  return (
    <div className="p-5">
      <button
        type="button"
        className="px-5 py-2 rounded text-sky-100 bg-sky-700 hover:bg-sky-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        onClick={onClick}
      >
        Test
      </button>
      <pre className="p-2 m-5 border rounded-lg">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default ApiButton;
