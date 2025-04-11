import { useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";

const TermsCondition = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "Introduction", number: "1" },
    { id: "about", label: "About Biddius", number: "2" },
    { id: "eligibility", label: "User Eligibility", number: "3" },
    { id: "auctions", label: "How Auctions Work", number: "4" },
    { id: "payments", label: "Payments & Escrow", number: "5" },
    { id: "fees", label: "Fees & Charges", number: "6" },
    { id: "responsibilities", label: "User Responsibilities", number: "7" },
    { id: "disputes", label: "Dispute Resolution", number: "8" },
    { id: "prohibited", label: "Prohibited Activities", number: "9" },
    { id: "ip", label: "Intellectual Property", number: "10" },
    { id: "liability", label: "Limitation of Liability", number: "11" },
    { id: "suspension", label: "Account Suspension", number: "12" },
    { id: "privacy", label: "Privacy", number: "13" },
    { id: "changes", label: "Changes to Terms", number: "14" },
    { id: "contact", label: "Contact Us", number: "15" }
  ];

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          
          <div className="bg-white rounded-lg p-6 md:p-10 mb-24 mt-4 z-50">
            <h1 className="text-2xl md:text-3xl font-bold text-[#9F3247] mb-2">
              Terms & Conditions of Use – Biddius{" "}
              <span className="text-[#7B2334] text-xl md:text-2xl font-normal italic">
                (A Part of Colauncha)
              </span>
            </h1>
            <p className="text-gray-600 mb-8">
              Effective Date: 11th April, 2024
            </p>


            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
              {sections.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-2 text-sm md:text-base rounded-t-lg ${
                    activeSection === tab.id
                      ? "bg-[#9F3247] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.number}. {tab.label}
                </button>
              ))}
            </div>

            <div className="prose max-w-none text-gray-700">
              {activeSection === "introduction" && (
                <Section title="1. Introduction">
                  <p className="mb-4">
                    Welcome to Biddius! These Terms and Conditions ("Terms") govern your access to and use of the Biddius platform (the "Platform"), including our website, mobile applications, and related services.
                  </p>
                  <p>
                    By using Biddius, you agree to these Terms in full. If you do not agree, please do not use Biddius.
                  </p>
                </Section>
              )}

              {activeSection === "about" && (
                <Section title="2. About Biddius">
                  <p>
                    Biddius is an online auction marketplace connecting Sellers who list items for auction with Buyers who bid for such items. Biddius provides a secure, transparent, and competitive bidding environment but does not own or sell any listed items.
                  </p>
                </Section>
              )}

              {activeSection === "eligibility" && (
                <Section title="3. User Eligibility">
                  <p className="mb-4">
                    To maintain the integrity of our platform, Biddius is only available to users who meet certain conditions:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>You must be at least 18 years old to register or use Biddius.</li>
                    <li>You must provide truthful, accurate, and current information when creating your account.</li>
                    <li>You bear full responsibility for maintaining the confidentiality of your login credentials.</li>
                  </ul>
                  <p>We reserve the right to verify your identity where necessary.</p>
                </Section>
              )}

              {activeSection === "auctions" && (
                <Section title="4. How Auctions Work">
                  <p className="mb-4">
                    The heart of Biddius lies in its auction system – a dynamic and exciting way for buyers and sellers to interact:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Sellers list items for auction, sometimes setting a reserve price (the minimum price they are willing to accept)</li>
                    <li>Buyers place binding bids during the auction's active window</li>
                    <li>When the auction closes, the highest bidder wins — provided any reserve price has been met</li>
                  </ul>
                  <p>Winning an auction means entering into a binding agreement.</p>
                </Section>
              )}

              {activeSection === "payments" && (
                <Section title="5. Payments & Escrow">
                  <p className="mb-4">
                    To protect both Buyers and Sellers, Biddius operates an escrow payment system:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Buyers fund payments into escrow immediately after winning</li>
                    <li>Funds are released only when:
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>The Seller has shipped/delivered the item</li>
                        <li>The Buyer confirms receipt within 3 days</li>
                      </ul>
                    </li>
                  </ul>
                  <p>Escrow ensures both parties are protected in transactions.</p>
                </Section>
              )}

              {activeSection === "fees" && (
                <Section title="6. Fees & Charges">
                  <p className="mb-4">
                    Operating Biddius comes with operational costs — for that reason, certain fees apply:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Listing fees for Sellers (if applicable)</li>
                    <li>Success fees (5% of sale price)</li>
                    <li>Transaction fees for Buyers</li>
                  </ul>
                  <p>All fees are transparently communicated during transactions.</p>
                </Section>
              )}

{activeSection === "responsibilities" && (
                <Section title="7. User Responsibilities">
                  <p className="mb-4">
                    At Biddius, we expect every user to engage with honesty, respect, and integrity.
                  </p>
                  <h3 className="font-medium text-[#7B2334] mb-2 mt-4">For Sellers:</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Accurate item descriptions</li>
                    <li>Prompt shipping/delivery</li>
                    <li>Professional communication</li>
                  </ul>
                  <h3 className="font-medium text-[#7B2334] mb-2">For Buyers:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Bid only with purchase intent</li>
                    <li>Prompt payment after winning</li>
                    <li>Timely inspection/confirmation</li>
                  </ul>
                </Section>
              )}

              {activeSection === "disputes" && (
                <Section title="8. Dispute Resolution">
                  <p className="mb-4">
                    While we hope every transaction runs smoothly, disagreements can happen:
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Parties should first attempt direct resolution</li>
                    <li>If unresolved, Biddius will mediate with evidence from both sides</li>
                    <li>Our final determination may include refunds or fund releases</li>
                  </ol>
                  <p>Our decisions in disputes are final and binding.</p>
                </Section>
              )}

              {activeSection === "prohibited" && (
                <Section title="9. Prohibited Activities">
                  <p className="mb-4">
                    To keep Biddius safe and trusted, these behaviors are prohibited:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Listing counterfeit/illegal items</li>
                    <li>Bid manipulation (shill bidding)</li>
                    <li>False/misleading descriptions</li>
                    <li>Bypassing escrow system</li>
                    <li>Fraudulent or harmful conduct</li>
                  </ul>
                  <p>Violations may result in immediate suspension.</p>
                </Section>
              )}

              {activeSection === "ip" && (
                <Section title="10. Intellectual Property">
                  <p className="mb-4">
                    All Biddius platform content belongs exclusively to us:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Logos and brand assets</li>
                    <li>Platform designs and software</li>
                    <li>Written materials and content</li>
                  </ul>
                  <p>Unauthorized use requires our prior written consent.</p>
                </Section>
              )}

              {activeSection === "liability" && (
                <Section title="11. Limitation of Liability">
                  <p className="mb-4">
                    Biddius acts solely as a facilitator of auctions:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>We don't own or inspect listed items</li>
                    <li>No guarantees about item quality/safety/legality</li>
                    <li>Not liable for:
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Description accuracy</li>
                        <li>User conduct</li>
                        <li>Indirect/consequential damages</li>
                      </ul>
                    </li>
                  </ul>
                </Section>
              )}

              {activeSection === "suspension" && (
                <Section title="12. Account Suspension">
                  <p className="mb-4">
                    Biddius reserves the right to suspend or terminate accounts for:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Terms violations</li>
                    <li>Prohibited conduct</li>
                    <li>Platform integrity threats</li>
                  </ul>
                  <p>Such action may occur without prior notice depending on severity.</p>
                </Section>
              )}

              {activeSection === "privacy" && (
                <Section title="13. Privacy">
                  <p className="mb-4">
                    Your privacy matters deeply to us. All personal data is governed by our Privacy Policy which outlines:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Data usage practices</li>
                    <li>Protection measures</li>
                    <li>Your rights regarding personal data</li>
                  </ul>
                  <p>We encourage all users to review our Privacy Policy.</p>
                </Section>
              )}

              {activeSection === "changes" && (
                <Section title="14. Changes to Terms">
                  <p className="mb-4">
                    Biddius may amend these Terms to reflect:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Operational changes</li>
                    <li>Legal/regulatory updates</li>
                    <li>Platform improvements</li>
                  </ul>
                  <p>Continued use after changes constitutes acceptance.</p>
                </Section>
              )}

              {activeSection === "contact" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">15. Contact Us</h2>
                  <p className="mb-4">
                    For questions about these Terms:
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> support@biddius.com
                  </p>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold text-[#9F3247] mb-4">{title}</h2>
    {children}
  </div>
);

export default TermsCondition;