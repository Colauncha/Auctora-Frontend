import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../Components/Button';
import Search from '../../Components/Search';
import { email as EmailIcon } from '../../Constants';
import NewsLetterModal from '../../Components/modals/NewsLetterModal';
import { ctaContext } from '../../Store/ContextStore';

const Cta = () => {
  const offCta = ctaContext((state) => state.turnOff);
  const onCta = ctaContext((state) => state.turnOn);
  const [useCta, setUseCta] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const path = location.pathname;

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    console.log('Modal opened');
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (path.includes('/dashboard')) {
      offCta();
      setUseCta(false);
    } else {
      onCta();
      setUseCta(true);
    }
  }, [path, offCta, onCta]);

  if (!useCta) return null;

  return (
    <section className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] rounded-md h-[200px] lg:h-[177px] px-[24px] md:px-[64px] flex items-center justify-center">
      {isModalOpen && (
        <NewsLetterModal
          isOpen={isModalOpen}
          parentEmail={email}
          onClose={closeModal}
        />
      )}

      <div className="flex flex-col gap-8 lg:gap-12 lg:flex-row justify-between items-center text-center lg:text-left">
        {/* Heading */}
        <h2 className="text-[14px] lg:text-[40px] font-bold text-white">
          STAY UP TO DATE ABOUT OUR LATEST AUCTIONS
        </h2>

        {/* Email input + CTA */}
        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <Search
            img={EmailIcon}
            placeholder="Enter your email address"
            className="w-full h-[48px] lg:w-[350px] rounded-[25px]"
            setParent={setEmail}
          />
          <Button
            label="Subscribe to Newsletter"
            className="shadow-lg hover:bg-[#7B2334]"
            onClick={openModal}
          />
        </div>
      </div>
    </section>
  );
};

export default Cta;
