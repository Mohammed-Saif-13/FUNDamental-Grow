export default function FormSection({ title, children }) {
    return (
        <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            {title && (
                <div className="flex items-center text-lg font-semibold text-[#FF5528] mb-5">
                    <span className="w-2 h-2 bg-[#FF5528] rounded-full mr-3 animate-pulse"></span>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
}