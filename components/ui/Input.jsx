export default function Input({
    label,
    required = false,
    error,
    ...props
}) {
    return (
        <div className="mb-6">
            {label && (
                <label className="block text-sm text-[#7F8C8D] mb-2 font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                {...props}
                className="w-full px-5 py-4 border-2 border-[#e0e0e0] rounded-xl text-[15px] 
                 text-[#333] bg-[#ECF0F133] transition-all duration-300
                 focus:border-[#FF5528] focus:shadow-[0_0_0_4px_rgba(255,85,40,0.1)] 
                 focus:bg-white outline-none placeholder:text-[#bdc3c7]"
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}