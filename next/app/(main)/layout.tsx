export default function Container({ children }) {
  return (
    <div className="bg-gray-50 flex-1 p-2">
      <div className="container h-full p-4 shadow-lg mx-auto bg-white rounded-lg">
        {children}
      </div>
    </div>
  );
}
