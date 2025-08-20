import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="pb-6 sm:pb-16">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/30 md:p-3.5 ">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
            <Image
              className="size-full object-cover object-center"
              src="/main.png"
              alt="preview landing"
              width={2000}
              height={1100}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
