// src/components/SignOutPage.js
import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const SignOutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">You are signed out!</h1>
      <p>Please sign in to access the application.</p>
      <SignInButton mode="modal">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
      </SignInButton>
    </div>
  );
};

export default SignOutPage;
