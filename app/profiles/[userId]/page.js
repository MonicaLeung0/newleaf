"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { getPetsByUserId } from "@/app/_servies/petService";
import { useUserAuth } from "@/app/utils/auth-context";
import PetCard from "../components/PetCard";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId;
  const { user: currentUser } = useUserAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = currentUser && userId === currentUser.uid;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get user profile from Firestore
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          setError("User profile not found");
          setLoading(false);
          return;
        }

        setUserProfile(userDoc.data());

        // Load user's pets
        const userPets = await getPetsByUserId(userId);
        setPets(userPets);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-pale flex items-center justify-center">
        <div className="text-center">
          <p className="text-green-medium text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-green-pale flex items-center justify-center">
        <div className="text-center">
          <p className="text-pink-red text-lg mb-4">{error || "Profile not found"}</p>
          <Link
            href="/community"
            className="text-green-dark hover:text-green-medium underline"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-pale">
      <div className="max-w-5xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-green-dark hover:text-green-medium flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        {/* Profile Header */}
        <div className="w-full mb-8">
          {/* Cover Banner */}
          <div className="w-full h-32 sm:h-40 rounded-b-2xl shadow-sm overflow-hidden">
            <img
              src={userProfile?.coverPhotoURL || "/default-cover.jpg"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

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
                {userProfile?.displayName || "New User"}
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
          </div>

          {/* Divider */}
          <div className="border-b-2 border-green-light mt-8"></div>
        </div>

        {/* Pets Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-green-dark mb-4">
            {isOwnProfile ? "Your Animals" : "Animals"}
          </h2>

          {pets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-green-medium text-lg">
                {isOwnProfile ? "No pets yet. Add your first pet!" : "No pets yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="bg-pink-white border border-green-light rounded-xl shadow-md p-4 hover:shadow-lg transition"
                >
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-4 shadow-sm">
                    <img
                      src={pet.image || "/pet-placeholder.png"}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold text-green-dark">{pet.name}</h3>
                    <p className="text-green-medium">{pet.type}</p>
                    <p className="text-green-light text-sm">{pet.age}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

