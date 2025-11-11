export default function Select({
    label,
    required = false,
    options = [],
    error,
    placeholder = "Select an option",
    ...props
}) {
    return (
        <div className="mb-6">
            {label && (
                <label className="block text-sm text-[#7F8C8D] mb-2 font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                {...props}
                className="w-full px-5 py-4 border-2 border-[#e0e0e0] rounded-xl text-[15px] 
                 text-[#333] bg-white transition-all duration-300
                 focus:border-[#FF5528] focus:shadow-[0_0_0_4px_rgba(255,85,40,0.1)] 
                 outline-none cursor-pointer"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}