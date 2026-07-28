export default function TrandingPage() {
  return (
    <div className="w-full h-150 p-5 rounded-2xl bg-black/60 text-white">
      <div className="flex gap-5 items-center">
        <div className="px-4 py-2 bg-green-400/40 rounded-2xl cursor-pointer">
          Danas
        </div>
        <div className="px-4 py-2 bg-gray-800 rounded-2xl cursor-pointer">
          Ove nedelje
        </div>
        <div className="px-4 py-2 bg-gray-800 rounded-2xl cursor-pointer">
          Ovog meseca
        </div>
        <div className="px-4 py-2 bg-gray-800 rounded-2xl cursor-pointer">
          Svih vremena
        </div>
      </div>
    </div>
  );
}
