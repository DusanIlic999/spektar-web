import { useFullSizeImage } from "../context/full.image.context.use";
import type { IPost } from "../types/post";

export default function PhotoList({ photos }: { photos: IPost[] }) {
  const { openFullSizeImage } = useFullSizeImage();

  const handleOpenFullSizeImage = (img: string) => {
    return openFullSizeImage(
      <div className="space-y-5 w-full h-full">
        <img
          src={img}
          className="w-full h-full max-w-2xl object-contain object-center"
        />
      </div>,
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {photos && photos.length > 0 && photos.map((photo) => (
        <div className="w-full h-full max-h-75">
          <img
            src={photo.imageUrl}
            className="w-full h-full object-contain object-center cursor-pointer"
            onClick={() => handleOpenFullSizeImage(photo.imageUrl)}
          />
        </div>
      ))}
    </div>
  );
}
