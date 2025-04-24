import { BookOpen, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'Courses' },
    { href: '#', label: 'Resources' },
    { href: '#', label: 'About Us' },
    { href: '#', label: 'Contact' },
  ];

  const supportLinks = [
    { href: '#', label: 'Help Center' },
    { href: '#', label: 'FAQs' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Privacy Policy' },
  ];

  const socialLinks = [
    { href: '#', label: 'Twitter', icon: <Twitter size={20} /> },
    { href: '#', label: 'Facebook', icon: <Facebook size={20} /> },
    { href: '#', label: 'Instagram', icon: <Instagram size={20} /> },
    { href: '#', label: 'LinkedIn', icon: <Linkedin size={20} /> },
    { href: '#', label: 'YouTube', icon: <Youtube size={20} /> },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="ml-3 text-xl font-bold text-blue-400">EduSprint</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering learners worldwide with accessible, high-quality education and personalized learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-blue-400" />
                <span className="text-gray-400">support@edusprint.com</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-blue-400" />
                <span className="text-gray-400">123 Learning Avenue, ED 54321</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduSprint. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:scale-110"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;