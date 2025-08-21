import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center space-y-4 border-b border-border/50 bg-gradient-to-br from-background to-muted/20 px-6 py-8 text-center">
       
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-foreground">Welcome to Domain Nest</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Manage your domains with powerful tools and insights
            </p>
          </div>
        </div>

        <div className=" px-6 py-8">
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              disabled={signInClicked}
              onClick={() => {
                setSignInClicked(true);
                signIn("google", { redirect: false }).then(() =>
                  setTimeout(() => {
                    setShowSignInModal(false);
                  }, 400),
                );
              }}
              className="w-full border-border/50  transition-all duration-300 hover:border-primary/50 "
            >
              {signInClicked ? (
                <Icons.spinner className="mr-3 size-4 animate-spin" />
              ) : (
                <Icons.google className="mr-3 size-4" />
              )}
              Continue with Google
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our terms and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
