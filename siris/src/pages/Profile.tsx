import React from 'react';

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 bg-gray-700 rounded-full"></div>
          <div>
            <h2 className="text-xl font-bold">Username</h2>
            <p className="text-gray-400">Joined: January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;