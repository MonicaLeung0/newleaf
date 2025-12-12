"use client";

import { useUserAuth } from "@/app/utils/auth-context";

export default function TestLogin() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <div>
      <h1>Login Test</h1>

      {user ? (
        <>
          <p>Logged in as: {user.displayName}</p>
          <button onClick={firebaseSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={gitHubSignIn}>Sign In with GitHub</button>
      )}
    </div>
  );
}
