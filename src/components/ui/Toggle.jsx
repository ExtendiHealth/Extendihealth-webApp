import React from 'react';

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      {label && <p className="font-medium text-gray-900">{label}</p>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-cyan-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default Toggle;
