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

    { id: "referral", label: "Referral Program", number: "12" },
    { id: "suspension", label: "Account Suspension", number: "13" },
    { id: "privacy", label: "Privacy", number: "14" },
    { id: "changes", label: "Changes to Terms", number: "15" },
    { id: "contact", label: "Contact Us", number: "16" },
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
                    Welcome to Biddius! These Terms and Conditions (“erms”
                    govern your access to and use of the Biddius platform (the
                    “latform”, including our website, mobile applications, and
                    related services.
                  </p>
                  <p>
                    By using Biddius, you agree to these Terms in full. If you
                    do not agree, please do not use Biddius.
                  </p>
                </Section>
              )}

              {activeSection === "about" && (
                <Section title="2. About Biddius">
                  <p>
                    Biddius is an online auction marketplace connecting Sellers
                    who list items for auction with Buyers who bid for such
                    items. Biddius provides a secure, transparent, and
                    competitive bidding environment but does not own or sell any
                    listed items.
                  </p>
                </Section>
              )}

              {activeSection === "eligibility" && (
                <Section title="3. User Eligibility">
                  <p className="mb-4">
                    To maintain the integrity of our platform, Biddius is only
                    available to users who meet certain conditions.
                    Specifically:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      You must be at least 18 years old to register or use
                      Biddius.
                    </li>
                    <li>
                      You must provide truthful, accurate, and current
                      information when creating your account.
                    </li>
                    <li>
                      You bear full responsibility for maintaining the
                      confidentiality of your login credentials. Any action
                      taken under your account is deemed to be authorized by
                      you.
                    </li>
                  </ul>
                  <p>
                    We reserve the right to verify your identity where
                    necessary, and we take fraudulent activities very seriously.
                  </p>
                </Section>
              )}

              {activeSection === "auctions" && (
                <Section title="4. How Auctions Work">
                  <p className="mb-4">
                    The heart of Biddius lies in its auction system –a dynamic
                    and exciting way for buyers and sellers to interact.
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      Sellers list items for auction, sometimes setting a
                      reserve price (the minimum price they are willing to
                      accept), and sometimes allowing the item to sell at any
                      bid.
                    </li>
                    <li>
                      Buyers place bids during the auction’ active window. Each
                      bid represents a binding commitment to purchase the item
                      at that price if the auction ends in your favour.
                    </li>
                    <li>
                      When the auction closes, the highest bidder wins —provided
                      any reserve price has been met.
                    </li>
                  </ul>
                  <p>
                    Winning an auction means entering into a binding agreement.
                    Backing out of a winning bid without valid reason is a
                    breach of these Terms.
                  </p>
                </Section>
              )}

              {activeSection === "payments" && (
                <Section title="5. Payments & Escrow">
                  <p className="mb-4">
                    To protect both Buyers and Sellers, Biddius operates an
                    escrow payment system. Here’ how it works in practice:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      Once a Buyer wins an auction, they are required to fund
                      the payment immediately into an escrow account managed by
                      Biddius.
                    </li>
                    <li>
                      This payment remains securely held and is only released
                      when certain conditions are met:
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>The Seller has shipped/delivered the item</li>
                        <li>
                          The Buyer has confirmed satisfactory receipt of the
                          item within the specified confirmation window.
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p>
                    Where the Buyer fails to confirm receipt within [3] days of
                    delivery, Biddius may, at its discretion, release the
                    payment to the Seller unless a dispute is raised.
                    <br />
                    <br />
                    Escrow ensures that no party is left vulnerable —Sellers
                    know they will be paid, and Buyers know their money is
                    protected until they receive what they paid for.
                  </p>
                </Section>
              )}

              {activeSection === "fees" && (
                <Section title="6. Fees & Charges">
                  <p className="mb-4">
                    Operating Biddius comes with operational costs —for that
                    reason, certain fees apply. These may include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Listing fees for Sellers (if applicable)</li>
                    <li>
                      Success fees [5%] deducted from the Seller’ earnings once
                      a sale is completed
                    </li>
                    <li>
                      Transaction fees charged to Buyers to support the
                      platform's operation and escrow system
                    </li>
                  </ul>
                  <p>
                    All fees are transparently communicated during the
                    transaction process so that you know exactly what you’e
                    paying and why.
                  </p>
                </Section>
              )}

              {activeSection === "responsibilities" && (
                <Section title="7. User Responsibilities">
                  <p className="mb-4">
                    At Biddius, we expect every user to engage with honesty,
                    respect, and integrity.
                  </p>
                  <h3 className="font-medium text-[#7B2334] mb-2 mt-4">
                    For Sellers, this means:
                  </h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                      Providing accurate and complete descriptions of your items
                    </li>
                    <li>Shipping or delivering sold items promptly</li>
                    <li>Responding professionally to Buyer inquiries</li>
                  </ul>
                  <h3 className="font-medium text-[#7B2334] mb-2">
                    For Buyers, this means:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Placing bids only when you intend to complete the purchase
                    </li>
                    <li>Payment prompt upon winning an auction</li>
                    <li>
                      Inspecting your purchase and confirming receipt or raising
                      disputes within the allocated time
                    </li>
                  </ul>
                  <p>
                    Failing to uphold these responsibilities may result in
                    penalties, suspension, or termination of your account.
                  </p>
                </Section>
              )}

              {activeSection === "disputes" && (
                <Section title="8. Dispute Resolution">
                  <p className="mb-4">
                    While we hope every transaction runs smoothly, disagreements
                    can happen.
                    <br />
                    If a Buyer and Seller encounter a problem, both parties are
                    encouraged to first communicate directly to resolve the
                    issue.
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>
                      Where resolution fails, Biddius provides a dispute
                      resolution service. Both parties will be required to
                      provide evidence (such as photographs, delivery records,
                      or communications). After reviewing all facts, Biddius
                      will make a final determination —which could include a
                      refund, partial refund, or release of funds to the Seller
                    </li>
                    <li>
                      If unresolved, Biddius will mediate with evidence from
                      both sides
                    </li>
                  </ol>
                  <p>Our decisions in disputes are final and binding.</p>
                </Section>
              )}

              {activeSection === "prohibited" && (
                <Section title="9. Prohibited Activities">
                  <p className="mb-4">
                    To keep Biddius a safe and trusted environment, certain
                    behaviours are strictly prohibited. These include but are
                    not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Listing counterfeit/illegal items</li>
                    <li>
                      Manipulating bids (either by oneself or through third
                      parties)
                    </li>
                    <li>Providing false or misleading item descriptions</li>
                    <li>Attempting to bypass our escrow system</li>
                    <li>Engaging in fraudulent, abusive, or harmful conduct</li>
                  </ul>
                  <p>
                    Violations may result in immediate suspension or permanent
                    removal from the platform.
                  </p>
                </Section>
              )}

              {activeSection === "ip" && (
                <Section title="10. Intellectual Property">
                  <p className="mb-4">
                    All content on the Biddius platform —including but not
                    limited to our logo, brand assets, designs, software, and
                    written materials —belong exclusively to Biddius. Users are
                    not permitted to copy, reproduce, distribute, or use any
                    part of our intellectual property without our prior written
                    consent.
                  </p>
                  {/* <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Logos and brand assets</li>
                    <li>Platform designs and software</li>
                    <li>Written materials and content</li>
                  </ul>
                  <p>Unauthorized use requires our prior written consent.</p> */}
                </Section>
              )}

              {activeSection === "liability" && (
                <Section title="11. Limitation of Liability">
                  <p className="mb-4">
                    Biddius acts solely as a facilitator of auctions. We do not
                    own or inspect any item listed for sale, and we make no
                    guarantees regarding the quality, safety, or legality of
                    such items.
                  </p>
                  <p>Accordingly, Biddius is not liable for:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>The accuracy of item descriptions</li>
                    <li>
                      Any indirect, consequential, or incidental damages arising
                      from your use of the platform
                      <li>The performance or conduct of Buyers or Sellers</li>
                    </li>
                  </ul>
                </Section>
              )}

              {activeSection === "referral" && (
                <Section title="12. Referral Program">
                  <h3 className="font-medium text-[#7B2334] mb-2">
                    Who can Refer?
                  </h3>
                  <p className="mb-4">Any active Biddius user</p>

                  <h3 className="font-medium text-[#7B2334] mb-2">
                    How to Refer?
                  </h3>
                  <p className="mb-4">
                    Share your unique link or code. New users must use it at
                    signup.
                  </p>

                  <h3 className="font-medium text-[#7B2334] mb-2">
                    Commission Structure:
                  </h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Biddius charges a 5% transaction fee on each sale</li>
                    <li>Referrer earns 1% of the sale price</li>
                    <li>Biddius retains 4% of the sale price</li>
                    <li>The seller (Referee) receives 95% of the sale price</li>
                  </ul>

                  <h3 className="font-medium text-[#7B2334] mb-2">
                    Modifications
                  </h3>
                  <p>
                    Biddius may modify or end this program at any time;
                    continued use means acceptance of updates.
                  </p>
                </Section>
              )}

              {activeSection === "suspension" && (
                <Section title="13. Account Suspension">
                  <p className="mb-4">
                    Biddius reserves the right to suspend or permanently
                    terminate any user account that violates these Terms,
                    engages in prohibited conduct, or behaves in a way that
                    threatens the integrity of the platform.
                  </p>
                  <br />
                  <P>
                    Such action may be taken with or without prior notice,
                    depending on the severity of the violation
                  </P>
                </Section>
              )}

              {activeSection === "privacy" && (
                <Section title="14. Privacy">
                  <p className="mb-4">
                    Your privacy matters deeply to us. All personal data
                    collected on Biddius is governed by our Privacy Policy,
                    which outlines:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>What data we collect</li>
                    <li>How we use it</li>
                    <li>How we protect it</li>
                    <li>Your rights regarding your data</li>
                  </ul>
                  <p>We encourage all users to review our Privacy Policy.</p>
                </Section>
              )}

              {activeSection === "changes" && (
                <Section title="15. Changes to Terms">
                  <p className="mb-4">
                    Biddius may amend or update these Terms periodically to
                    reflect operational, legal, or regulatory changes. All
                    updates will be posted on our platform, and your continued
                    use after changes take effect constitutes acceptance of
                    those changes.
                  </p>
                </Section>
              )}

              {activeSection === "contact" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-[#9F3247] mb-4">
                    15. Contact Us
                  </h2>
                  <p className="mb-4">
                    If you have any questions, concerns, or complaints about
                    these Terms or about using Biddius, please contact us at:
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
