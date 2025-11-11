export default function Button({
    children,
    variant = 'primary',
    loading = false,
    ...props
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-[#FF5528] to-[#FF8C66] text-white shadow-[0_5px_15px_rgba(255,87,51,0.3)] hover:shadow-[0_8px_25px_rgba(255,87,51,0.4)]',
        secondary: 'bg-white border-2 border-[#e0e0e0] text-[#7F8C8D] hover:border-[#FF5528] hover:text-[#FF5528]',
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 
                relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
                hover:-translate-y-0.5 ${variants[variant]}`}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
}