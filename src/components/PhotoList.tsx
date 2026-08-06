import type { IPost } from "../types/post";

export default function PhotoList({ photos }: { photos: IPost[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {photos.map((photo) => (
        <div className="w-full h-full max-h-75">
          <img src={photo.imageUrl} className="w-full h-full object-contain object-center"/>
        </div>
      ))}
    </div>
  );
}
