"use client";

import { useRouter } from "next/router";
import PetForm from "../../../components/PetForm";
import { createPet } from "../../../utils/api";

export default function NewPet() {
    const router = useRouter();

    async function handleCreate(pet) {
        await createPet(pet);
        router.push("/pets");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Add New Pet</h1>
            <PetForm onSubmit={handleCreate} />
        </div>
    );
}