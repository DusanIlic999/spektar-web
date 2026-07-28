export default function SearchPage() {
  return (
    <div className="w-full h-150 rounded-2xl ">
      <input
        type="search"
        placeholder="🔍 Pretrazi postove, korisnike..."
        className="py-3 bg-black/80 rounded-2xl px-5 text-white w-full search-input"
      />
    </div>
  );
}
