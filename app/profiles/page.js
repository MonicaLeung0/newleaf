//protected (requires login)
"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfileHeader from "./components/ProfileHeader";
import PetCard from "./components/PetCard";
import AddPetModal from "./components/AddPetModal";

export default function ProfilesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([
    {
      id: 1,
      name: "Milo",
      type: "Dog",
      age: "2 years",
      image: "/dog-placeholder.png",
    },
    {
      id: 2,
      name: "Luna",
      type: "Cat",
      age: "1 year",
      image: "/cat-placeholder.png",
    },
  ]);

  const addPet = (newPet) => {
    setPets((prev) => [{ id: Date.now(), ...newPet }, ...prev]);
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

        {/* Pet grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
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
