'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { X, Mail, Phone } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import DonateButton from './ui/DonateButton';
import VolunteerButton from './ui/VolunteerButton';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Campaigns', href: '/campaigns' },
        { name: 'Reports', href: '/reports' },
        { name: 'Contact', href: '/contact' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Main Navbar */}
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="wrapper">
                    <nav className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#FF5528] rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-[#343434]">FundHope</span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <ul className="hidden lg:flex items-center gap-10 mb-0">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="relative text-[#343434] font-bold text-[16px] hover:text-[#FF5E33] 
                    transition-colors whitespace-nowrap
                    after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] 
                    after:bg-[#FF5528] after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            {!session && (
                                <li>
                                    <Link
                                        href="/auth/signup"
                                        className="relative text-[#343434] font-bold text-[16px] hover:text-[#FF5E33] 
                    transition-colors whitespace-nowrap
                    after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] 
                    after:bg-[#FF5528] after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                        Sign-up
                                    </Link>
                                </li>
                            )}
                        </ul>

                        {/* Right Section - Desktop */}
                        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                            <DonateButton />
                            <VolunteerButton />

                            {session && (
                                <button
                                    onClick={() => signOut()}
                                    className="text-[#343434] hover:text-[#FF5528] font-bold text-[14px] ml-2"
                                >
                                    Logout
                                </button>
                            )}
                        </div>

                        {/* Hamburger Button - Mobile */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden text-[#343434] text-2xl"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Off-canvas Menu - Mobile */}
            <div
                className={`fixed top-0 left-0 w-[300px] h-full bg-[#333] z-[1000] overflow-y-auto 
        transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Off-canvas Logo */}
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF5528] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">FundHope</span>
                    </div>
                    <button onClick={toggleMenu} className="text-white text-2xl">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <ul className="mt-2">
                    {navLinks.map((link, index) => (
                        <li
                            key={link.name}
                            className={`border-b border-white/10 ${index === 0 ? 'border-t' : ''}`}
                        >
                            <Link
                                href={link.href}
                                onClick={toggleMenu}
                                className="flex justify-between items-center text-white font-bold px-8 py-4 
                hover:bg-white/10 transition-colors"
                            >
                                {link.name}
                                <div className="flex items-center justify-center w-8 h-8 bg-[#FF5528] text-white">
                                    &gt;
                                </div>
                            </Link>
                        </li>
                    ))}
                    {!session && (
                        <li className="border-b border-white/10">
                            <Link
                                href="/auth/signup"
                                onClick={toggleMenu}
                                className="flex justify-between items-center text-white font-bold px-8 py-4 
                hover:bg-white/10 transition-colors"
                            >
                                Sign-up
                                <div className="flex items-center justify-center w-8 h-8 bg-[#FF5528] text-white">
                                    &gt;
                                </div>
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="flex flex-col gap-5 p-4 mt-4">
                    <a href="mailto:needhelp@fundhope.com" className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#FF5528] rounded-full">
                            <Mail className="w-4 h-4" />
                        </div>
                        needhelp@fundhope.com
                    </a>
                    <a href="tel:6668880000" className="flex items-center gap-3 text-white text-sm">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#FF5528] rounded-full">
                            <Phone className="w-4 h-4" />
                        </div>
                        666 888 0000
                    </a>
                </div>

                <div className="flex gap-6 px-4 mt-5">
                    <a href="#" className="text-white hover:text-[#FF5528] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </a>
                    <a href="#" className="text-white hover:text-[#FF5528] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </a>
                    <a href="#" className="text-white hover:text-[#FF5528] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9a5.5 5.5 0 015.5 5.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z" />
                        </svg>
                    </a>
                    <a href="#" className="text-white hover:text-[#FF5528] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-6v4h3l-4 6z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={toggleMenu}
                    className="fixed inset-0 bg-black/70 z-[999]"
                ></div>
            )}
        </>
    );
}