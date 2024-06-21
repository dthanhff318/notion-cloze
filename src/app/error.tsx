"use client";
import React from "react";
import Image from "next/image";
import { Button } from "~@/components/ui/button";
import Link from "next/link";
import { APP_ROUTE } from "~@/constanst/router";

// export default Error;
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
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
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
