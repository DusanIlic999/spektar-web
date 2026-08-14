import { PiMailboxLight } from "react-icons/pi";
import { useFullSizeImage } from "../context/full.image.context.use";
import type { IPost } from "../types/post";

export default function PhotoList({ photos }: { photos: IPost[] }) {
  const { openFullSizeImage } = useFullSizeImage();

  const handleOpenFullSizeImage = (img: string) => {
    return openFullSizeImage(
      <div className="space-y-5 w-full h-full">
        <img
          src={img}
          className="w-full h-full max-h-150 max-w-2xl object-contain object-center"
        />
      </div>,
    );
  };

  return (
    <div
      className={`${photos && photos.length > 0 && "grid grid-cols-1 lg:grid-cols-2 gap-2"}`}
    >
      {photos && photos.length > 0 ? (
        photos.map((photo) => (
          <div className="w-full h-full max-h-75">
            <img
              src={photo.imageUrl}
              className="w-full h-full object-contain object-center cursor-pointer"
              onClick={() => handleOpenFullSizeImage(photo.imageUrl)}
            />
          </div>
        ))
      ) : (
        <>
          <div className="w-full bg-black/80 rounded-2xl p-10 border flex flex-col items-center gap-3 border-white/15 text-center">
            <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
              <PiMailboxLight size="40" />
            </div>
            <div className="font-bold text-lg">Nema Objava</div>
            <div className="text-sm text-gray-400">
              Budi prvi koji ce nesto objaviti!
            </div>
          </div>
        </>
      )}
    </div>
  );
}
