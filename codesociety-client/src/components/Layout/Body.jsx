import React from "react";

const Body = ({ children }) => {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-6">
      {children}
    </main>
  );
};

export default Body;
