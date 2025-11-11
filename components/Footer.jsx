'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Footer() {
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('');

    const handleNewsletter = (e) => {
        e.preventDefault();
        if (!email) return;

        // Simulate subscription
        setNewsletterStatus('Subscribed! 🎉');
        setEmail('');
        setTimeout(() => setNewsletterStatus(''), 3000);
    };

    return (
        <footer className="relative bg-gradient-to-br from-[#4a4a4a] to-[#363636] text-white 
                     py-12 shadow-[0_5px_25px_rgba(0,0,0,0.2)] overflow-hidden">

            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] 
                    bg-gradient-to-r from-[#FF5733] via-[#FFC300] to-[#FF5733]"></div>

            <div className="wrapper">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Column 1: Quick Links */}
                    <div className="min-w-[200px]">
                        <h3 className="text-xl font-semibold mb-5 pb-2 inline-block relative
                         after:content-[''] after:absolute after:bottom-0 after:left-0 
                         after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="footer-link">About Us</Link>
                            </li>
                            <li>
                                <Link href="/campaigns" className="footer-link">Campaigns</Link>
                            </li>
                            <li>
                                <Link href="/services" className="footer-link">Our Services</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="footer-link">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/reports" className="footer-link">Reports</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Legal + Social Media */}
                    <div className="min-w-[200px]">
                        <h3 className="text-xl font-semibold mb-5 pb-2 inline-block relative
                         after:content-[''] after:absolute after:bottom-0 after:left-0 
                         after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                            Legal
                        </h3>
                        <ul className="space-y-3 mb-8">
                            <li>
                                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="footer-link">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="/volunteer" className="footer-link">Become Volunteer</Link>
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-xl font-semibold mb-5 pb-2 inline-block relative
                           after:content-[''] after:absolute after:bottom-0 after:left-0 
                           after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                                Follow Us
                            </h3>
                            <div className="flex gap-3">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full 
                            bg-white/10 text-white hover:bg-[#FF5733] hover:-translate-y-1 
                            transition-all duration-300"
                                    aria-label="Facebook">
                                    <i className="fab fa-facebook-f text-lg"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full 
                            bg-white/10 text-white hover:bg-[#FF5733] hover:-translate-y-1 
                            transition-all duration-300"
                                    aria-label="Instagram">
                                    <i className="fab fa-instagram text-lg"></i>
                                </a>
                                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full 
                            bg-white/10 text-white hover:bg-[#FF5733] hover:-translate-y-1 
                            transition-all duration-300"
                                    aria-label="Telegram">
                                    <i className="fab fa-telegram-plane text-lg"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full 
                            bg-white/10 text-white hover:bg-[#FF5733] hover:-translate-y-1 
                            transition-all duration-300"
                                    aria-label="Twitter">
                                    <i className="fab fa-twitter text-lg"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Newsletter */}
                    <div className="min-w-[200px]">
                        <h3 className="text-xl font-semibold mb-5 pb-2 inline-block relative
                         after:content-[''] after:absolute after:bottom-0 after:left-0 
                         after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                            Newsletter
                        </h3>
                        <p className="text-[#ddd] text-sm mb-4 leading-relaxed">
                            Get updates on new campaigns and our impact.
                        </p>
                        <form onSubmit={handleNewsletter} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 
                         text-white placeholder:text-gray-400 outline-none
                         focus:bg-white/20 focus:border-[#FF5733] transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF5733] to-[#FF8C33] 
                         text-white font-semibold hover:-translate-y-0.5 
                         hover:shadow-[0_4px_15px_rgba(255,87,51,0.4)] transition-all duration-300">
                                Subscribe
                            </button>
                            {newsletterStatus && (
                                <p className="text-sm text-green-400 text-center">{newsletterStatus}</p>
                            )}
                        </form>

                        {/* Payment Methods */}
                        <div className="mt-6">
                            <p className="text-xs text-[#ddd] mb-3">We Accept:</p>
                            <div className="flex gap-2 items-center flex-wrap">
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-semibold">
                                    Razorpay
                                </div>
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-semibold">
                                    Stripe
                                </div>
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-semibold">
                                    UPI
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: CTA Buttons */}
                    <div className="min-w-[200px] flex flex-col gap-4">
                        <h3 className="text-xl font-semibold mb-2 pb-2 inline-block relative
                         after:content-[''] after:absolute after:bottom-0 after:left-0 
                         after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                            Get Started
                        </h3>

                        <Link href="/donate"
                            className="px-6 py-3 rounded-full text-center font-semibold
                           bg-gradient-to-br from-[#FF5733] to-[#FF8C33] text-white
                           shadow-[0_4px_15px_rgba(255,87,51,0.3)]
                           hover:bg-gradient-to-br hover:from-[#FF8C33] hover:to-[#FF5733]
                           hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(255,87,51,0.4)]
                           transition-all duration-300">
                            Donate Now
                        </Link>

                        {session ? (
                            <>
                                {session.user.role === 'admin' && (
                                    <Link href="/admin"
                                        className="px-6 py-3 rounded-full text-center font-semibold
                                 bg-white/10 text-white border border-white/20
                                 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/"
                                    className="px-6 py-3 rounded-full text-center font-semibold
                               bg-white/10 text-white border border-white/20
                               hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                                    My Dashboard
                                </Link>
                            </>
                        ) : (
                            <Link href="/auth/login"
                                className="px-6 py-3 rounded-full text-center font-semibold
                             bg-white/10 text-white border border-white/20
                             hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                                Log in/Sign up
                            </Link>
                        )}
                    </div>

                    {/* Column 5: Contact Information */}
                    <div className="min-w-[250px]">
                        <h3 className="text-xl font-semibold mb-5 pb-2 inline-block relative
                         after:content-[''] after:absolute after:bottom-0 after:left-0 
                         after:w-1/2 after:h-[2px] after:bg-[#FF5733]">
                            Contact Info
                        </h3>
                        <p className="text-lg font-semibold mb-3 text-[#FF5733]">FundHope Pvt. Ltd.</p>
                        <p className="text-[#ddd] mb-1 text-sm leading-relaxed">
                            12th Floor, BKC Tower,
                        </p>
                        <p className="text-[#ddd] mb-1 text-sm leading-relaxed">
                            Bandra Kurla Complex,
                        </p>
                        <p className="text-[#ddd] mb-4 text-sm leading-relaxed">
                            Mumbai, Maharashtra – 400051
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#ddd] text-sm">
                                <i className="fas fa-phone-alt text-[#FF5733]"></i>
                                <span>+91 22 1234 5678</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#ddd] text-sm">
                                <i className="fas fa-envelope text-[#FF5733]"></i>
                                <span>info@fundhope.com</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Copyright + Links */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#ddd]">
                            &copy; {new Date().getFullYear()} FundHope. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="text-[#ddd] hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-[#ddd] hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/contact" className="text-[#ddd] hover:text-white transition-colors">
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}