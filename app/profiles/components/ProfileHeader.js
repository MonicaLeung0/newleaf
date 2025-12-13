"use client";

import { useUserAuth } from "@/app/utils/auth-context";

export default function ProfileHeader() {
  const { user } = useUserAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b-2 border-green-light">
      
      {/* Avatar */}
      <div className="w-32 h-32 rounded-full bg-green-pale border-4 border-green-medium overflow-hidden shadow-lg">
        <img
          src={user?.photoURL || "/avatar-placeholder.png"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-green-dark">
          {user?.displayName || user?.email?.split("@")[0]}
        </h1>
        <p className="text-green-medium mt-1">
          Member of NewLeaf Community
        </p>
      </div>

      {/* Edit Button */}
      <button className="
        bg-pink-medium text-white px-5 py-2 rounded-lg 
        hover:bg-pink-dark transition shadow-md
      ">
        Edit Profile
      </button>
    </div>
  );
}
