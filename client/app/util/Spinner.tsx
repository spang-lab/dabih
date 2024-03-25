export default function Spinner({ small = false, white = false }) {
  if (small) {
    if (white) {
      return (
        <div className="box-border relative">
          <div className="w-6 h-6 animate-spin-slow rounded-full relative border-4 border-l-white border-t-white">
            <div className="w-3 h-3 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-2 border-l-white border-t-white" />
          </div>
        </div>
      );
    }
    return (
      <div className="box-border relative">
        <div className="w-6 h-6 animate-spin-slow rounded-full relative border-4 border-l-blue border-t-blue">
          <div className="w-3 h-3 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-2 border-l-blue border-t-blue" />
        </div>
      </div>
    );
  }
  if (white) {
    return (
      <div className="box-border relative">
        <div className="w-40 h-40 animate-spin-slow rounded-full relative border-8 border-l-white border-t-white">
          <div className="w-32 h-32 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-[6px] border-l-white border-t-white">
            <div className="w-24 h-24 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-4 border-l-white border-t-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-border relative">
      <div className="w-40 h-40 animate-spin-slow rounded-full relative border-8 border-l-blue border-t-blue">
        <div className="w-32 h-32 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-[6px] border-l-blue border-t-blue">
          <div className="w-24 h-24 animate-spin-reverse rounded-full absolute right-0 bottom-0 left-0 top-0 m-auto origin-center border-4 border-l-blue border-t-blue" />
        </div>
      </div>
    </div>
  );
}
