"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  getPetById, 
  getPetsByUserId,
  createAdoptionRequest,
  getAdoptionRequestsByPetId,
  acceptAdoptionRequest,
  rejectAdoptionRequest,
  hasAdoptionRequest
} from "@/app/_servies/petService";
import { useUserAuth } from "@/app/utils/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params?.petId;
  const { user } = useUserAuth();

  const [pet, setPet] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const isOwner = user && pet && pet.ownerId === user.uid;

  useEffect(() => {
    const loadPet = async () => {
      if (!petId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get pet by ID (userId parameter is not used but kept for backward compatibility)
        const petData = await getPetById(petId, "");
        
        if (!petData) {
          setError("Pet not found");
          setLoading(false);
          return;
        }

        setPet(petData);

        // Load other pets from the same owner
        if (petData.ownerId) {
          const pets = await getPetsByUserId(petData.ownerId);
          // Filter out the current pet
          setOwnerPets(pets.filter(p => p.id !== petId));
        }

        // Load adoption requests if user is the owner
        if (user && petData.ownerId === user.uid) {
          try {
            const requests = await getAdoptionRequestsByPetId(petId, petData.ownerId);
            setAdoptionRequests(requests);
            
            // Load requester profiles
            const requesterProfiles = await Promise.all(
              requests.map(async (req) => {
                try {
                  const userRef = doc(db, "users", req.requesterId);
                  const userDoc = await getDoc(userRef);
                  return {
                    ...req,
                    requesterProfile: userDoc.exists() ? userDoc.data() : null,
                  };
                } catch (err) {
                  console.error("Error loading requester profile:", err);
                  return { ...req, requesterProfile: null };
                }
              })
            );
            setRequesters(requesterProfiles);
          } catch (err) {
            console.error("Error loading adoption requests:", err);
            // Don't fail the whole page if adoption requests can't be loaded
            setAdoptionRequests([]);
            setRequesters([]);
          }
        }

        // Check if current user has already requested adoption
        if (user && petData.ownerId !== user.uid) {
          try {
            const hasRequest = await hasAdoptionRequest(petId, user.uid);
            setHasRequested(hasRequest);
          } catch (err) {
            console.error("Error checking adoption request:", err);
            setHasRequested(false);
          }
        }
      } catch (err) {
        console.error("Error loading pet:", err);
        setError("Failed to load pet information");
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [petId, user]);

  const handleAdoptionRequest = async () => {
    if (!user) {
      alert("Please log in to request adoption");
      return;
    }

    if (!confirm(`Are you sure you want to request to adopt ${pet.name}?`)) {
      return;
    }

    try {
      setRequesting(true);
      await createAdoptionRequest(petId, user.uid);
      setHasRequested(true);
      alert("Adoption request submitted successfully!");
    } catch (err) {
      console.error("Error creating adoption request:", err);
      alert("Failed to submit adoption request. Please try again.");
    } finally {
      setRequesting(false);
    }
  };

  const handleAcceptRequest = async (requestId, requesterId) => {
    if (!confirm(`Are you sure you want to accept this adoption request? This will transfer ownership of ${pet.name} to the requester.`)) {
      return;
    }

    if (!user) {
      alert("You must be logged in to accept adoption requests");
      return;
    }

    try {
      await acceptAdoptionRequest(requestId, petId, requesterId, user.uid);
      alert("Adoption request accepted! Ownership has been transferred.");
      router.push("/profiles");
    } catch (err) {
      console.error("Error accepting adoption request:", err);
      alert(err.message || "Failed to accept adoption request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!confirm("Are you sure you want to reject this adoption request?")) {
      return;
    }

    try {
      await rejectAdoptionRequest(requestId);
      // Reload requests
      const requests = await getAdoptionRequestsByPetId(petId);
      setAdoptionRequests(requests);
      const requesterProfiles = await Promise.all(
        requests.map(async (req) => {
          try {
            const userRef = doc(db, "users", req.requesterId);
            const userDoc = await getDoc(userRef);
            return {
              ...req,
              requesterProfile: userDoc.exists() ? userDoc.data() : null,
            };
          } catch (err) {
            return { ...req, requesterProfile: null };
          }
        })
      );
      setRequesters(requesterProfiles);
    } catch (err) {
      console.error("Error rejecting adoption request:", err);
      alert("Failed to reject adoption request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-pale flex items-center justify-center">
        <div className="text-center">
          <p className="text-green-medium text-lg">Loading pet profile...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-green-pale flex items-center justify-center">
        <div className="text-center">
          <p className="text-pink-red text-lg mb-4">{error || "Pet not found"}</p>
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
      <div className="max-w-4xl mx-auto p-6">
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

        {/* Pet Profile Card */}
        <div className="bg-pink-white rounded-2xl p-8 shadow-lg border-2 border-green-light">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Pet Image */}
            <div className="flex-shrink-0">
              <div className="w-full md:w-80 h-80 rounded-xl overflow-hidden border-4 border-green-light shadow-md">
                <img
                  src={pet.image || "/pet-placeholder.png"}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Pet Information */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-green-dark mb-2">{pet.name}</h1>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-green-medium font-medium">Type:</span>
                  <span className="text-green-dark">{pet.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-medium font-medium">Age:</span>
                  <span className="text-green-dark">{pet.age}</span>
                </div>
              </div>

              {/* Adoption Status */}
              {pet.waitingForAdoption && (
                <div className="mt-4 px-4 py-2 bg-green-pale rounded-lg border-2 border-green-light">
                  <p className="text-green-dark font-semibold">✓ Available for Adoption</p>
                </div>
              )}

              {/* Adoption Request Button */}
              {pet.waitingForAdoption && !isOwner && user && (
                <div className="mt-6">
                  {hasRequested ? (
                    <div className="px-4 py-3 bg-gray-200 rounded-lg text-gray-700">
                      <p className="font-medium">Adoption request submitted</p>
                      <p className="text-sm">Waiting for owner's response...</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdoptionRequest}
                      disabled={requesting}
                      className="w-full bg-green-dark text-white py-3 rounded-lg hover:bg-green-medium transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {requesting ? "Submitting Request..." : "Request to Adopt"}
                    </button>
                  )}
                </div>
              )}

              {/* Owner Info */}
              {pet.ownerId && (
                <div className="mt-8 pt-6 border-t-2 border-green-light">
                  <p className="text-sm text-green-medium mb-2">Owned by</p>
                  <Link
                    href={`/profiles/${pet.ownerId}`}
                    className="text-green-dark hover:text-green-medium font-semibold"
                  >
                    View Owner Profile →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Adoption Requests (Owner Only) */}
        {isOwner && requesters.length > 0 && (
          <div className="mt-8 bg-pink-white rounded-2xl p-6 shadow-lg border-2 border-green-light">
            <h2 className="text-2xl font-bold text-green-dark mb-4">
              Adoption Requests
            </h2>
            <div className="space-y-4">
              {requesters.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-green-pale rounded-lg border-2 border-green-light"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-light">
                        <img
                          src={request.requesterProfile?.photoURL || "/avatar-placeholder.png"}
                          alt="Requester"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/profiles/${request.requesterId}`}
                          className="text-lg font-semibold text-green-dark hover:text-green-medium"
                        >
                          {request.requesterProfile?.displayName || "Unknown User"}
                        </Link>
                        <p className="text-sm text-green-medium">wants to adopt {pet.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id, request.requesterId)}
                        className="px-4 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 bg-pink-red text-white rounded-lg hover:bg-pink-dark transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Pets from Same Owner */}
        {ownerPets.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-green-dark mb-4">
              Other Animals from This Owner
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerPets.map((otherPet) => (
                <Link
                  key={otherPet.id}
                  href={`/pets/${otherPet.id}`}
                  className="bg-pink-white rounded-xl p-4 border-2 border-green-light hover:border-green-medium transition shadow-md"
                >
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-3">
                    <img
                      src={otherPet.image || "/pet-placeholder.png"}
                      alt={otherPet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-green-dark">{otherPet.name}</h3>
                  <p className="text-green-medium">{otherPet.type}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
