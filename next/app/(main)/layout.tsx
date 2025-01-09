
import Transfers from "./transfers/Transfers";

export default function Container({ children }) {
  return (
    <div className="bg-gray-50 flex flex-row  p-2">
      <Transfers />
      <div className="container h-full p-4 shadow-lg bg-white rounded-lg">
        {children}
      </div>
    </div>
  );
}
