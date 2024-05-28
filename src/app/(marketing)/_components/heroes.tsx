import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] xl:h-[500px] xl:w-[500px]">
          <Image
            src="/document.webp"
            fill
            className="object-contain dark:hidden"
            alt="Notioz"
          />
          <Image
            src="/document-dark.png"
            fill
            className="object-contain dark:block hidden"
            alt="Notioz"
          />
        </div>
      </div>
    </div>
  );
};
