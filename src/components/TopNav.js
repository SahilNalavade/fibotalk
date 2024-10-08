import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Progress } from '@chakra-ui/react';

const TopNav = () => {
  return (
    <header className="bg-white shadow-sm p-4 fixed top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">fibotalk</h1>
        
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
export default TopNav;