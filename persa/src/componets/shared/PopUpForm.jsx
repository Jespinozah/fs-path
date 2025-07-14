import React from "react";

export default function PopUpForm({
    fields = [],
    formData,
    onChange,
    onSubmit,
    onCancel,
    submitLabel = "Submit",
    loading = false,
    header,
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="w-3/4 rounded-lg bg-white p-6 shadow-lg md:w-1/3">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">{header}</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    {fields.map(field => (
                        <div className="mb-4" key={field.name}>
                            <label className="block text-gray-700">{field.label}</label>
                            {field.type === "select" ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="w-full rounded border p-2"
                                    required={field.required}
                                >
                                    <option value="">{field.placeholder || "Select"}</option>
                                    {field.options &&
                                        field.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                </select>
                            ) : field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="w-full rounded border p-2"
                                    placeholder={field.placeholder}
                                    required={field.required}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={onChange}
                                    className="w-full rounded border p-2"
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-700"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-white"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}