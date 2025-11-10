import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
        <p className="text-gray-400 mb-8 text-sm">Last updated: July 5, 2025</p>

        <p className="mb-6 text-gray-300">
          At <span className="font-semibold text-white">DreamLaunch</span>, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li>Personal info like your name, email, and linked YouTube/Instagram IDs</li>
          <li>OAuth tokens for content publishing</li>
          <li>Anonymous usage data (browser type, actions, etc.)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Information</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
          <li>Upload content to your social accounts</li>
          <li>Notify you about launches or updates</li>
          <li>Improve performance and security</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Data Security</h2>
        <p className="text-gray-300 mb-6">
          We store all sensitive data securely and only use it for intended purposes. No data is shared with third parties except for platform integrations.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Third-Party APIs</h2>
        <p className="text-gray-300 mb-4">
          We use Google and Meta APIs. Their privacy terms apply when using OAuth:
        </p>
        <ul className="mb-6 space-y-2">
          <li>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline transition"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/policy.php"
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline transition"
              rel="noopener noreferrer"
            >
              Meta Privacy Policy
            </a>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Your Rights</h2>
        <p className="text-gray-300">
          You may revoke access or delete your data by contacting:{" "}
          <span className="text-white font-medium">support@dreamlaunch.com</span>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
