import Link from 'next/link';

export default function ActionButton({
    href,
    text,
    icon = 'arrow',
    variant = 'primary',
    onClick,
    className = ''
}) {
    const baseClasses = `group relative bg-white px-5 py-3.5 rounded-full border font-bold 
  text-[14px] tracking-wider flex items-center gap-2.5 transition-all duration-200 whitespace-nowrap`;

    const variantClasses = {
        primary: 'text-[#343434] border-[#FF5528] hover:bg-[#343434] hover:text-white hover:border-[#343434]',
        secondary: 'text-white bg-[#FF5528] border-[#FF5528] hover:bg-[#343434] hover:border-[#343434]',
    };

    const iconSvgs = {
        arrow: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        ),
        heart: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    };

    const buttonContent = (
        <>
            {text}
            <span className="flex items-center justify-center w-[35px] h-[35px] rounded-full 
      bg-[#FF5528] text-white group-hover:bg-white group-hover:text-[#FF5528] 
      transition-all duration-200 flex-shrink-0">
                {iconSvgs[icon]}
            </span>
        </>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            >
                {buttonContent}
            </button>
        );
    }

    return (
        <Link
            href={href}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {buttonContent}
        </Link>
    );
}