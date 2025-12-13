// profiles/page.js
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileHeader from "./components/ProfileHeader";
import PetCard from "./components/PetCard";
import AddPetModal from "./components/AddPetModal";
import EditPetModal from "./components/EditPetModal";   // <-- ADD THIS
import { getPetsByUserId, deletePet } from "../_servies/petService";
import { useUserAuth } from "../utils/auth-context";

export default function ProfilesPage() {
  const { user } = useUserAuth();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedPet, setSelectedPet] = useState(null);

  // Load pets
  useEffect(() => {
    const loadPets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getPetsByUserId(user.uid);
        setPets(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [user]);

  // After Add Pet
  const refreshPets = async () => {
    if (!user) return;
    const result = await getPetsByUserId(user.uid);
    setPets(result);
  };

  // Handle Edit click
  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setIsEditModalOpen(true);
  };

  // Handle Delete click
  const handleDeletePet = async (pet) => {
    if (!confirm(`Delete ${pet.name}?`)) return;

    try {
      await deletePet(pet.id, user.uid);
      refreshPets();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete pet.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <ProfileHeader />

        {/* Section + Add Pet */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="text-2xl font-semibold text-green-dark">
            Your Animals
          </h2>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="
              bg-green-dark text-white px-4 py-2 rounded-lg
              hover:bg-green-medium transition shadow-md
            "
          >
            + Add Pet
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-green-medium">Loading pets...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-pink-red">{error}</p>
          </div>
        )}

        {/* Pets Grid */}
        {!loading && !error && (
          <>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-medium text-lg">
                  No pets yet. Add your first pet!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={handleEditPet}
                    onDelete={handleDeletePet}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async () => {
          await refreshPets();
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Pet Modal */}
      {selectedPet && (
        <EditPetModal
          isOpen={isEditModalOpen}
          pet={selectedPet}
          onClose={() => {
            setSelectedPet(null);
            setIsEditModalOpen(false);
          }}
          onSave={async () => {
            await refreshPets();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </ProtectedRoute>
  );
}
