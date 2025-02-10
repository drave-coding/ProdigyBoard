import { Skeleton } from "@/components/ui/skeleton";
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='flex flex-col items-center text-center space-y-4'>
        {/* White circle around the logo */}
        <div className='relative w-32 h-32   flex items-center justify-center mb-3'>
          <Image className="rounded-full" src="/logo.png" alt='Logo' height={400} width={400}  />
        </div>

        <ClerkLoaded>
          <div className='mt-2'>
            <SignIn path='/sign-in' />
          </div>
        </ClerkLoaded>
        <ClerkLoading>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </ClerkLoading>
      </div>
    </div>
  );
}
