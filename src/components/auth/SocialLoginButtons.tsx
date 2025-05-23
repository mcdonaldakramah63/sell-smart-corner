
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Mail } from "lucide-react";

export default function SocialLoginButtons() {
  const { loginWithGoogle, loginWithGithub, loginWithMicrosoft, loading } = useAuth();

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <Button
        variant="outline"
        onClick={loginWithGoogle}
        disabled={loading}
        type="button"
        className="flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
        Google
      </Button>
      <Button
        variant="outline"
        onClick={loginWithGithub}
        disabled={loading}
        type="button"
        className="flex items-center justify-center gap-2"
      >
        <Github className="h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        onClick={loginWithMicrosoft}
        disabled={loading}
        type="button"
        className="flex items-center justify-center gap-2 col-span-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 23 23"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M0 0h11.5v11.5H0V0z" fill="#f25022" />
          <path d="M11.5 0H23v11.5H11.5V0z" fill="#7fba00" />
          <path d="M0 11.5h11.5V23H0V11.5z" fill="#00a4ef" />
          <path d="M11.5 11.5H23V23H11.5V11.5z" fill="#ffb900" />
        </svg>
        Microsoft
      </Button>
    </div>
  );
}
