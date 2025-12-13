//protected (requires login)
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileHeader from "./components/ProfileHeader";
import PetCard from "./components/PetCard";
import AddPetModal from "./components/AddPetModal";
import { getPetsByUserId } from "../_servies/petService";
import { useUserAuth } from "../utils/auth-context";

export default function ProfilesPage() {
  const { user } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load pets from Firebase when component mounts or user changes
  useEffect(() => {
    const loadPets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const userPets = await getPetsByUserId(user.uid);
        setPets(userPets);
      } catch (err) {
        console.error("Error loading pets:", err);
        setError("Failed to load pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [user]);

  const addPet = async (newPet) => {
    // Refresh pets list after adding
    if (user) {
      try {
        const userPets = await getPetsByUserId(user.uid);
        setPets(userPets);
      } catch (err) {
        console.error("Error refreshing pets:", err);
      }
    }
    setIsModalOpen(false); // close modal after adding
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <ProfileHeader />

        {/* Section header + Add button */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-2xl font-semibold text-green-dark">
            Your Animals
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="
              bg-green-dark text-white px-4 py-2 rounded-lg
              hover:bg-green-medium transition shadow-md
            "
          >
            + Add Pet
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-green-medium">Loading pets...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-pink-red">{error}</p>
          </div>
        )}

        {/* Pet grid */}
        {!loading && !error && (
          <>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-medium text-lg">No pets yet. Add your first pet!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addPet}
      />
    </ProtectedRoute>
  );
}
