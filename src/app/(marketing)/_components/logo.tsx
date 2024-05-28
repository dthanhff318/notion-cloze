import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "~@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/logo.png" height={"40"} width={"40"} alt="Logo" className="dark:hidden"/>
      <Image src="/logo-dark.png" height={"40"} width={"40"} alt="Logo" className="dark:block hidden"/>
      <p className={cn("font-semibold", font.className)}>Notioz</p>
    </div>
  );
};

export default Logo;
