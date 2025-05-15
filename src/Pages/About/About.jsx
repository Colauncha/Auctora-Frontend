
import { FaShieldAlt, FaUsers, FaLightbulb, FaSearch, FaGavel, FaTruck } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import TeamCard from "../../Components/TeamCard"; 
import Uthman from "../../assets/images/uthman.jpg"
import david from "../../assets/images/david.jpg"
import iyanu from "../../assets/images/iyanu.jpg"
import ify from "../../assets/images/ify.jpg"
import theo from "../../assets/images/theo.jpg"
import mrsola from '../../assets/images/MrSola.jpg';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Sola Akano',
      role: 'CEO',
      image: mrsola,
      linkedin: 'www.linkedin.com/in/akano-oluwasola',
    },

    {
      name: 'Akintola Oluwaseun',
      role: 'Product Manager',
      image: theo,
      linkedin:
        'https://www.linkedin.com/in/oluwaseunakintola?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
    {
      name: 'Iyanu Ajimobi',
      role: 'Backend Developer / Technical Lead',
      image: iyanu,
      linkedin:
        'https://www.linkedin.com/in/i-yan-u?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
    {
      name: 'Adebari Uthman Titilope',
      role: 'Frontend Developer',
      image: Uthman,
      linkedin: 'www.linkedin.com/in/adebari-uthman-titilope-57160a227',
    },
    {
      name: 'Ifunanya Ugwoke',
      role: 'Frontend Developer',
      image: ify,
      linkedin: 'https://www.linkedin.com/in/ifunanya-chidimma-2702911b1',
    },
    {
      name: 'David Adesope',
      role: 'Product Designer',
      image: david,
      linkedin:
        'https://www.linkedin.com/in/david-adesope-237210223?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    },
  ];

  const signUp = () => navigate('/sign-up');

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Breadcrumbs />

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-8 mt-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#9F3247] mb-4">
              About <span className="text-[#7B2334]">Biddius</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your gateway to thrilling online auctions. Whether you&apos;re
              hunting rare collectibles, one-of-a-kind experiences, or everyday
              bargains, we bring buyers and sellers together in a fun,
              transparent bidding environment.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              To make auctions accessible, exciting, and trustworthy for
              everyone.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <MissionCard
                icon={<FaShieldAlt className="text-2xl" />}
                title="Transparency"
                description="Real-time bidding, no hidden fees"
              />
              <MissionCard
                icon={<FaUsers className="text-2xl" />}
                title="Community"
                description="Connecting passionate buyers and sellers"
              />
              <MissionCard
                icon={<FaLightbulb className="text-2xl" />}
                title="Innovation"
                description="Continuously improving our platform for a seamless experience"
              />
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#9F3247] mb-6">
              Our Story
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Biddius was founded in 2024 when our CEO Sola Akano noticed a
                  gap in the online auction market. Frustrated by opaque bidding
                  processes and lack of buyer protection, we set out to create a
                  platform that prioritizes fairness and excitement in equal
                  measure.
                </p>
                <p className="text-gray-700">
                  What started as a small team of four passionate individuals
                  has grown into a thriving marketplace trusted by thousands of
                  bidders nationwide.
                </p>
              </div>
              <div className="bg-[#F9F9F9] rounded-lg p-6 border border-[#EEE]">
  <h3 className="font-semibold text-lg text-[#7B2334] mb-3">Milestones & Achievements</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <AchievementItem 
      number="25,000+" 
      text="registered bidders" 
    />
    <AchievementItem 
      number="10,000+" 
      text="items sold" 
    />
    <AchievementItem 
      number="5" 
      text="strategic partnerships" 
    />
  </div>
</div>




               
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-sm p-20 md:p-8 ">
            <h2 className="text-2xl font-bold text-[#9F3247] mb-8 text-center">
              Meet the Team
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-24">
              {teamMembers.map((member) => (
  <TeamCard
    key={member.name}
    name={member.name}
    role={member.role}
    image={member.image}
    linkedin={member.linkedin} // Add this line
  />
))}
            </div>
       

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#9F3247] mb-6">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <StepCard
                icon={<FaSearch className="text-2xl" />}
                step="1"
                title="Browse"
                description="Search or filter by category"
              />
              <StepCard
                icon={<FaGavel className="text-2xl" />}
                step="2"
                title="Bid"
                description="Our system auto-bids up to your limit"
              />
              <StepCard
                icon={<FaTruck className="text-2xl" />}
                step="3"
                title="Win"
                description="Pay securely and await delivery"
              />
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#9F3247] mb-6">
              Why Choose Biddius?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<div className="text-[#9F3247]">UI</div>}
                title="User-First Design"
                description="Mobile-friendly, intuitive bidding flow"
              />
              <FeatureCard
                icon={<FaShieldAlt className="text-[#9F3247]" />}
                title="Safe & Secure"
                description="SSL-encrypted payments and verified sellers"
              />
              <FeatureCard
                icon={<MdSupportAgent className="text-[#9F3247]" />}
                title="24/7 Support"
                description="Real people, real help—day or night"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] rounded-lg shadow-lg p-8 mb-40 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join the Excitement
            </h2>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Ready to start bidding? Sign up now and place your first bid in
              under a minute.
            </p>
            <button
              onClick={signUp}
              className="bg-white text-[#9F3247] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const MissionCard = ({ icon, title, description }) => (
  <div className="bg-[#F9F9F9] rounded-lg p-6 text-center border border-[#EEE]">
    <div className="text-[#9F3247] mb-3 flex justify-center">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const StepCard = ({ icon, step, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-[#9F3247] text-white rounded-full w-8 h-8 flex items-center justify-center mt-1">
      {step}
    </div>
    <div>
      <div className="text-[#9F3247] mb-1">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="text-[#9F3247] text-xl mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);


const AchievementItem = ({ number, text }) => (
  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
    <p className="text-4xl md:text-5xl font-bold text-[#9F3247] mb-2">
      {number}
    </p>
    <p className="text-sm md:text-base text-gray-600">
      {text}
    </p>
  </div>
);

export default About;