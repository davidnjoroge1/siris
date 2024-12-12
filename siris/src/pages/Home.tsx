import React from 'react';
//import { Link } from 'react-router-dom';
// majr update on homescreen to be undertaken

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Siris</h1>
      <p className="text-xl mb-8">Listen to music together with friends</p>
      <div className="space-y-4">
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg">
          Create Room
        </button>
        <div className="text-gray-400">or</div>
        <input
          type="text"
          placeholder="Enter room code"
          className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full max-w-xs"
        />
      </div>
    </div>
  );
}

export default Home;
