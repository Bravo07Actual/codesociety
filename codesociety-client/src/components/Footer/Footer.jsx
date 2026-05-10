import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 shadow-inner fixed bottom-0 w-full">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-800">CodeSociety</span>. Built with ❤️ by V.</p>
        {/* Optional links */}
        {/* <p className="mt-1">
          <a href="https://github.com/yourhandle" className="text-blue-500 hover:underline">GitHub</a> • 
          <a href="mailto:you@example.com" className="text-blue-500 hover:underline ml-1">Contact</a>
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;
