
import Transfers from "./transfers/Transfers";

export default function Container({ children }) {
  return (
    <div className="bg-gray-50 h-full">
      <Transfers />
      <div className="container mx-auto h-full p-4 shadow-lg bg-white rounded-lg">
        {children}
      </div>
    </div>
  );
}
