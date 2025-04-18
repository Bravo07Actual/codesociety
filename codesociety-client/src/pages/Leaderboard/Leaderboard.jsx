import React from "react";

const Leaderboard = () => {
  const mockLeaderboard = [
    { id: 1, name: "Vishwanath", codeAura: 1850 },
    { id: 2, name: "Sai Teja", codeAura: 1720 },
    { id: 3, name: "Charan", codeAura: 1650 },
    { id: 4, name: "Priya", codeAura: 1600 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">🏆 Leaderboard</h1>
      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Rank</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">CodeAura</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((user, index) => (
              <tr key={user.id} className="border-t hover:bg-gray-100 transition">
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.codeAura}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
