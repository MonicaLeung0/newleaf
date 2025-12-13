"use client";

import { useUserAuth } from "@/app/utils/auth-context";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileHeader() {
  const { user, userProfile, loading } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* {userProfile?.bio?.trim() !== "" && (
        <p className="text-green-dark mt-2 text-sm max-w-md">
          {userProfile.bio}
        </p>
      )} */}

      {/* Cover Banner */}
      <div className="w-full h-32 sm:h-40 rounded-b-2xl shadow-sm overflow-hidden">
        <img
          src={userProfile?.coverPhotoURL || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Profile Section */}
      <div
        className="
        relative max-w-5xl mx-auto px-6 
        -mt-16 sm:-mt-20
        flex flex-col sm:flex-row items-center sm:items-end
        gap-6 sm:gap-10
      "
      >
        {/* Avatar */}
        <div
          className="
          w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden
          border-4 border-white shadow-xl bg-white
        "
        >
          <img
            src={
              userProfile?.photoURL ||
              user?.photoURL ||
              "/avatar-placeholder.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          {/* Display Name */}
          <h1 className="text-3xl sm:text-4xl font-bold text-green-dark drop-shadow-sm">
            {userProfile?.displayName || user?.displayName || "New User"}
          </h1>

          <p className="text-green-medium mt-1 text-lg">
            Member of NewLeaf Community
          </p>

          {/* Bio */}
          {userProfile?.bio?.trim() !== "" && (
            <p className="text-green-dark mt-2 text-sm max-w-md">
              {userProfile.bio}
            </p>
          )}

          {/* City */}
          {userProfile?.city && (
            <p className="text-green-light mt-1 text-sm">
              📍 {userProfile.city}
            </p>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            sm:ml-auto bg-pink-medium text-white px-6 py-2 rounded-lg 
            hover:bg-pink-dark transition shadow-md
            mt-4 sm:mt-0
          "
        >
          Edit Profile
        </button>
      </div>

      {/* Divider */}
      <div className="border-b-2 border-green-light mt-8"></div>
    </div>
  );
}
