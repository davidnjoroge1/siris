import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MusicalNoteIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-white">Siris</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-300 hover:text-white">
              <UserCircleIcon className="h-8 w-8" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;