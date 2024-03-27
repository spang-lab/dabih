import 'highlight.js/styles/github.css';
import Sidebar from './Sidebar';

export default function Container({ children }) {
  return (
    <div className="bg-gray-50 flex flex-1 flex-wrap">
      <div className="basis-full md:basis-1/5 pt-5 px-10 ">
        <Sidebar />
      </div>
      <div className="basis-full md:basis-2/3 p-4 text-gray-800">
        <div className="block h-full px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
