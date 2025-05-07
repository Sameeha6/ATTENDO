import React from 'react'
import { Link } from 'react-router-dom';

export const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/6358/6358115.png"
        alt="Page Not Found"
        className="w-52 h-52 object-contain"
      />
      <h1 className="text-3xl font-bold text-gray-700 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 text-center max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved, deleted or not authorised for you.
      </p>
    </div>
  )
}