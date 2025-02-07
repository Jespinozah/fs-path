"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PetForm from "../../../components/PetForm";
import { fetchPet, updatePet } from "../../../../utils/api";

export default function EditPet() {
    const router = useRouter();
    const { id } = router.query;
    const [pet, setPet] = useState(null);

    useEffect(() => {
        if (id) {
            fetchPet(id).then(setPet);
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