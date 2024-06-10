"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "~@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { Spinner } from "~@/components/spinner";
import { SignInButton } from "@clerk/clerk-react";
import Link from "next/link";
import { APP_ROUTE } from "~@/constanst/router";
export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Note your Ideas, Task, & Plans. Unified. Welcome to{" "}
        <span className="underline">tizZote</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        tizZote is a tool for managing and sharing task, <br />
        supporting teamwork, and it's FREE for everyone
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href={APP_ROUTE.DOCUMENTS}>
            Enter tizZote
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal" fallbackRedirectUrl={APP_ROUTE.DOCUMENTS}>
          <Button>
            Get tizZote free <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
