"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PetForm from "../../../../components/PetForm";
import { fetchPet, updatePet } from "../../../../utils/api";

export default function EditPet() {
    const { id } = useParams(); // Get ID from dynamic route
    const router = useRouter();
    const [pet, setPet] = useState(null);

    useEffect(() => {
        console.log("Router ID:", id); // Debugging step
        if (id) {
            fetchPet(id)
                .then((data) => {
                    console.log("Fetched pet data:", data);
                    setPet(data);
                })
                .catch((error) => console.error("Error fetching pet:", error));
        }
    }, [id]);

    async function handleUpdate(updatedPet) {
        await updatePet(id, updatedPet);
        router.push("/pets");
    }

    if (!pet) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Pet</h1>
            <PetForm onSubmit={handleUpdate} initialData={pet} />
        </div>
    );
}
