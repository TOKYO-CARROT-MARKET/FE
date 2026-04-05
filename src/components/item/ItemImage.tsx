import Image from "next/image";

export default function ItemImage({
  image_url,
  title,
}: {
  image_url: string | undefined;
  title: string;
}) {
  return image_url ? (
    <img
      src={image_url}
      alt={title}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
    />
  ) : (
    <Image src={"/default.png"} fill alt="item_img" className="grayscale " />
  );
}
