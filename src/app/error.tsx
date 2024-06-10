"use client";
import React from "react";
import Image from "next/image";
import { Button } from "~@/components/ui/button";
import Link from "next/link";
import { APP_ROUTE } from "~@/constanst/router";

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        alt="Error"
        height="300"
        width="300"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        alt="Error"
        height="300"
        width="300"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">Something went wrong</h2>
      <Button asChild>
        <Link href={APP_ROUTE.DOCUMENTS}>Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
