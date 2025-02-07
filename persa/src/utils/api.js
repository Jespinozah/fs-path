const API_URL = "http://localhost:8080/api/pets"; // Adjust for your backend

export async function fetchPets() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function fetchPet(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
}

export async function createPet(pet) {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pet),
    });
}

export async function updatePet(id, pet) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pet),
    });
}

export async function deletePet(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}