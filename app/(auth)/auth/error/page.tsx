import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

interface AuthErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = searchParams;

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Configuration Error",
          description: "There is a problem with the server configuration. Please try again later or contact support.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to sign in.",
        };
      case "Verification":
        return {
          title: "Unable to Verify",
          description: "The verification token has expired or has already been used.",
        };
      case "Default":
      default:
        return {
          title: "Authentication Error",
          description: "An error occurred during authentication. Please try again.",
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Icons.warning className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {errorInfo.title}
          </CardTitle>
          <CardDescription className="text-center">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">
                Error code: <code className="font-mono">{error}</code>
              </p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <Link href="/login">
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
