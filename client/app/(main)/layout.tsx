export default function Container({ children }) {
  return (
    <div className="bg-gray-50 flex flex-1 justify-stretch items-stretch">
      <div className="container p-4 mx-auto text-gray-800 md:px-12">
        <div className="block h-full px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
