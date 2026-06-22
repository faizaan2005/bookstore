import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Book<span className="text-primary-400">Verse</span></span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">Your premier destination for books across all genres. Discover, read, and grow.</p>
          <div className="flex gap-3 mt-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
              <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
        {[
          { title: 'Browse', links: [['Fiction', '/books?category=Fiction'], ['Non-Fiction', '/books?category=Non-Fiction'], ['Technology', '/books?category=Technology'], ['Self-Help', '/books?category=Self-Help']] },
          { title: 'Account', links: [['Sign In', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Wishlist', '/wishlist']] },
          { title: 'Company', links: [['About Us', '/'], ['Contact', '/'], ['Privacy Policy', '/'], ['Terms of Service', '/']] },
        ].map(section => (
          <div key={section.title}>
            <h4 className="font-semibold text-white mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">© 2024 BookVerse. All rights reserved. Built with React & Spring Boot.</p>
        <p className="text-xs text-gray-500">Crafted with ❤️ for book lovers</p>
      </div>
    </div>
  </footer>
);

export default Footer;
