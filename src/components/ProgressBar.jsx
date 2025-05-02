import React from 'react';

const ProgressBar = ({ currentStage }) => {
  const stages = ['Ideation', 'Planning', 'Launch', 'Funding'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex space-x-2 mt-1">
      {stages.map((stage, i) => (
        <button
          key={stage}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            i === currentIndex
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 text-gray-300'
          }`}
          disabled
        >
          {stage}
        </button>
      ))}
    </div>
  );
};

export default ProgressBar;
