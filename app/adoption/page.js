"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { getPetsWaitingForAdoption } from "../_servies/petService";
import { useUserAuth } from "../utils/auth-context";

export default function AdoptionPage() {
  const { user } = useUserAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getPetsWaitingForAdoption();
        setPets(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load adoption listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-dark mb-4">
          Adoption Listings
        </h1>
        <p className="text-gray-700 mb-6">
          Browse animals available for adoption. Click on any animal to view their profile and submit an adoption request.
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-green-medium">Loading adoption listings...</p>
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
                  No animals available for adoption at the moment.
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
                      <div className="mt-2 px-2 py-1 bg-green-pale rounded text-xs text-green-dark font-medium">
                        Available for Adoption
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
