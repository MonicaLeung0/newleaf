export default function PetCard({ pet }) {
  return (
    <div className="
      bg-pink-white border border-green-light rounded-xl
      shadow-md p-4 hover:shadow-lg transition
    ">
      <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
        <img 
          src={pet.image} 
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-semibold text-green-dark">{pet.name}</h3>
      <p className="text-green-medium">{pet.type}</p>
      <p className="text-green-light text-sm">{pet.age}</p>
    </div>
  );
}
