import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
        <p className="text-gray-400 mb-8 text-sm">Last updated: July 5, 2025</p>

        <p className="mb-6 text-gray-300">
          Welcome to <span className="font-semibold text-white">DreamLaunch</span>. These Terms govern your access and use of our platform.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-300 mb-6">
          By using this platform, you agree to these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li>Provide accurate information during registration.</li>
          <li>Only upload content that you own or are authorized to post.</li>
          <li>No misuse or abuse of our platform APIs or systems.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Account Usage</h2>
        <p className="text-gray-300 mb-6">
          Your account is personal. You grant DreamLaunch permission to upload content to your connected platforms only when authorized.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-300 mb-6">
          We own the platform code. You own your content.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Termination</h2>
        <p className="text-gray-300 mb-6">
          We reserve the right to disable accounts for violations or misuse.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Updates</h2>
        <p className="text-gray-300">
          We may change these terms in the future. We’ll notify you of any major updates.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
