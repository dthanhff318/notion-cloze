"use client";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { ModeToggle } from "~@/components/modeToggle";
import useScrollTop from "~@/hooks/useScrollTop";
import { cn } from "~@/lib/utils";
import Logo from "./logo";
import { Button } from "~@/components/ui/button";
import { Spinner } from "~@/components/spinner";
import { APP_ROUTE } from "~@/constanst/router";
import { useLocale } from "next-intl";
import { Link } from "~@/navigation";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const locale = useLocale();
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton
              mode="modal"
            >
              <Button variant={"ghost"} size="sm">
                Log in
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href={APP_ROUTE.DOCUMENTS} locale={locale}>
                Start tizZote
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
