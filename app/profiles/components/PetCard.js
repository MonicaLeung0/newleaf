"use client";

import Link from "next/link";
import { useUserAuth } from "@/app/utils/auth-context";

export default function PetCard({ pet, onEdit, onDelete }) {
  const { user } = useUserAuth();

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
      onDelete(pet);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(pet);
  };

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="
        bg-pink-white border border-green-light rounded-xl
        shadow-md p-4 hover:shadow-lg transition 
        flex flex-col justify-between
        block
      "
    >
      {/* Pet Image */}
      <div className="w-full h-40 rounded-lg overflow-hidden mb-4 shadow-sm">
        <img
          src={pet.image || "/pet-placeholder.png"}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pet Info */}
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-xl font-semibold text-green-dark">{pet.name}</h3>
        <p className="text-green-medium">{pet.type}</p>
        <p className="text-green-light text-sm">{pet.age}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-auto pt-3 border-t border-green-light/40" onClick={(e) => e.stopPropagation()}>
        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="
            bg-green-dark text-white px-4 py-1 rounded-lg text-sm
            hover:bg-green-medium transition shadow-sm
          "
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          className="
            bg-pink-red text-white px-4 py-1 rounded-lg text-sm
            hover:bg-pink-dark transition shadow-sm
          "
        >
          Delete
        </button>
      </div>
    </Link>
  );
}
