import Link from 'next/link';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Find a Ride', href: '/search' },
      { label: 'Offer a Ride', href: '/publish' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/#pricing' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Safety', href: '/safety' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <HiOutlineSparkles className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold gradient-text">goPair</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Connect with fellow travelers heading your way. Save money, reduce
              your carbon footprint, and make every journey an adventure.
            </p>
            <div className="flex gap-3">
              {[FiTwitter, FiGithub, FiLinkedin, FiMail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} goPair. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
