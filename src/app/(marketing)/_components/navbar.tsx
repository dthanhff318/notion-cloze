"use client";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { ModeToggle } from "~@/components/modeToggle";
import useScrollTop from "~@/hooks/useScrollTop";
import { cn } from "~@/lib/utils";
import Logo from "./logo";
import { Button } from "~@/components/ui/button";
import { Spinner } from "~@/components/spinner";
import Link from "next/link";
import { APP_ROUTE } from "~@/constanst/router";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
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
              fallbackRedirectUrl={APP_ROUTE.DOCUMENTS}
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
              <Link href={APP_ROUTE.DOCUMENTS}>Start tizZote</Link>
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
