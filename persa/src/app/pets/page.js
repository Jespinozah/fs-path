
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPets, deletePet } from "../../utils/api";

export default function PetsList() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        loadPets();
    }, []);

    async function loadPets() {
        const data = await fetchPets();
        setPets(data);
    }

    async function handleDelete(id) {
        await deletePet(id);
        loadPets(); // Refresh list
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pets</h1>
            <Link href="/pets/new" className="bg-blue-500 text-white px-4 py-2 rounded">Add Pet</Link>
            <ul className="mt-4">
                {pets.map((pet) => (
                    <li key={pet.id} className="border p-4 mb-2 flex justify-between">
                        <span>{pet.name} ({pet.type})</span>
                        <div>
                            <Link href={`/pets/edit/${pet.id}`} className="text-blue-500 mr-4">Edit</Link>
                            <button onClick={() => handleDelete(pet.id)} className="text-red-500">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}