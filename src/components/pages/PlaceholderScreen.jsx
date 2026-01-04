import React from 'react';
import { Header } from '../layout';

const PlaceholderScreen = ({ title, onBack }) => (
  <div className="min-h-screen bg-gray-50">
    <Header title={title} onBack={onBack} />
    <div className="p-6 text-center text-gray-500">
      <p>Screen content for {title}</p>
    </div>
  </div>
);

export default PlaceholderScreen;
