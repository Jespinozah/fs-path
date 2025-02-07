import { useState } from "react";

export default function PetForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        type: initialData.type || "",
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded">
            <div className="mb-4">
                <label className="block">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block">Type</label>
                <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        </form>
    );
}