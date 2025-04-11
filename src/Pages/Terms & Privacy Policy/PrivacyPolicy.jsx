import { useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          {" "}
          <Breadcrumbs />
          <div className="bg-white rounded-lg p-6 md:p-10 mb-24 mt-4 z-50">
          <h1 className="text-2xl md:text-3xl font-bold text-[#9F3247] mb-2">
  Privacy Policy – Biddius{" "}
  <span className="text-[#7B2334] text-xl md:text-2xl font-normal italic">
    (A Part of Colauncha)
  </span>
</h1>
            <p className="text-gray-600 mb-12">
              Effective Date: 11th April, 2025
            </p>

            
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
              {[
                { id: "introduction", label: "Introduction" },
                { id: "collection", label: "Data Collection" },
                { id: "use", label: "Data Use" },
                { id: "protection", label: "Data Protection" },
                { id: "sharing", label: "Data Sharing" }, 
                { id: "cookies", label: "Cookies" }, 
                { id: "rights", label: "Your Rights" },
                { id: "changes", label: "Policy Changes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-2 text-sm md:text-base rounded-t-lg ${
                    activeSection === tab.id
                      ? "bg-[#9F3247] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Policy Content */}
            <div className="prose max-w-none text-gray-700">
              {activeSection === "introduction" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Introduction
                  </h2>
                  <p className="mb-4">
                    At Biddius, we are committed to safeguarding your privacy
                    and personal information. This Privacy Policy outlines the
                    types of personal information we collect, how it is used,
                    and the measures we take to protect it.
                  </p>

                  <p className="mb-4">
                    By using Biddius, you consent to the collection and use of
                    your information as described in this policy.
                  </p>
                </div>
              )}

              {activeSection === "collection" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Information We Collect
                  </h2>
                  <p className="mb-4">
                    We collect personal data you provide when registering for an
                    account, placing bids, listing items, or engaging with our
                    platform. This includes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong >
                        Account Information:
                      </strong>
                      Name, email address, phone number, shipping address
                    </li>
                    <li>
                      <strong>
                      Transaction Information:
                      </strong>
                      Payment details, billing information, auction history
                    </li>
                    <li>
                      <strong>Device Information:</strong>IP address, browser type, and usage data from your interactions with the platform
                      transactions and platform activities.
                    </li>
                    
                  </ul>
                </div>
              )}

              {activeSection === "use" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="mb-4">
                  Your data is used for:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong >
                        Account Creation & Management:
                      </strong>
                      To create, maintain, and manage your Biddius account.
                    </li>
                    <li>
                      <strong>
                        Transaction & Payments:
                      </strong>
                      To process payments, facilitate auctions, and manage
                      escrow transactions.
                    </li>
                    <li>
                      <strong>Communication:</strong>To
                      send you updates, reminders, and notices related to your
                      transactions and platform activities.
                    </li>
                    <li>
                      <strong>
                        Improvement & Personalization:
                      </strong>
                      To enhance the platform and provide tailored
                      recommendations.
                    </li>
                    <li>
                      <strong>Legal & Compliance:</strong>
                      To comply with applicable laws, regulations, and our Terms
                      and Conditions.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "protection" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    How We Protect Your Information
                  </h2>
                  <p className="mb-4">
                    We implement industry-standard security measures, including
                    encryption and secure data storage, to protect your personal
                    information. However, no method of electronic storage or
                    transmission is 100% secure, and we cannot guarantee
                    absolute security.
                  </p>
                </div>
              )}

              {activeSection === "sharing" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Sharing Your Information
                  </h2>
                  <p className="mb-4">
                    We do not share your personal information with third
                    parties, except in the following cases:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong>With Your Consent:</strong> If you opt to share
                      information with third parties (e.g., to facilitate
                      delivery).
                    </li>
                    <li>
                      <strong>Service Providers:</strong>We may share your data
                      with trusted service providers who assist us in running
                      the platform (e.g., payment processors, hosting services).
                    </li>
                    <li>
                      <strong>Legal Compliance:</strong>If required by law,
                      regulation, or legal process (e.g., court orders,
                      subpoenas).
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "cookies" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Cookies and Tracking
                  </h2>
                  <p className="mb-4">
                    Biddius uses cookies and similar tracking technologies to
                    improve user experience. You can control cookie settings
                    through your browser preferences. By using the platform, you
                    consent to the use of cookies.
                  </p>
                </div>
              )}

              {activeSection === "rights" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Your Data Rights
                  </h2>
                  <p className="mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      <strong>Access:</strong> Request copies of your personal
                      information.
                    </li>
                    <li>
                      <strong>Rectification:</strong> Correct inaccurate data.
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request the deletion of your
                      data (subject to legal obligations).
                    </li>
                    <li>
                      <strong>Opt-Out:</strong> Manage communication preferences
                      or unsubscribe from marketing materials.
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at
                    support@biddius.com.
                  </p>
                </div>
              )}

              {activeSection === "changes" && (
                <div>
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    Changes to This Privacy Policy
                  </h2>
                  <p className="mb-4">
                    We may update this Privacy Policy from time to time. Any
                    changes will be posted on this page with the updated date.
                  </p>

                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#9F3247] mb-3">
                  Contact Us
                </h3>
                <p className="mb-2">
                  If you have any questions about this Privacy Policy or wish to
                  exercise your rights, please contact us at:
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> support@biddius.com
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
