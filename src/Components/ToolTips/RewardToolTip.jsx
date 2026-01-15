import BidPoint from '../../assets/svg/bidPoint.svg';
import BidCredit from '../../assets/svg/bidCredit.svg';
import PropTypes from 'prop-types';

const RewardToolTip = ({ position }) => {
  const BidCreditIcon = (
    <img src={BidCredit} alt="Bid Credit" className="w-4 h-4 inline" />
  );
  const BidPointIcon = (
    <img src={BidPoint} alt="Bid Point" className="w-3 h-4 inline" />
  );
  return (
    <span
      className={`absolute left-0 ${
        position === 'bottom' ? 'bottom-full' : 'top-full'
      } mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="border-b border-gray-400 font-bold">Reward Info</h3>
        <div className="flex flex-col gap-2">
          <div className="my-2 text-md font-semibold">
            Bid Points are earned through various activities on the platform,
            these points can be redeemed for Bid credits{' '}
            <img src={BidCredit} alt="Bid Credit" className="w-4 h-4 inline" />
            <br />
            Earn above {BidPointIcon} 1,000 Bid Points to redeem your points
            <br />
            <strong>Redemption Rate:</strong> {BidPointIcon} 1,000 Bid Points ={' '}
            {BidCreditIcon} 500 Bid Credits
          </div>
          <div>
            <strong>Refer User:</strong>{' '}
            <img src={BidPoint} alt="BidPoint" className="w-3 h-4 inline" /> 250
            Gained by referring new users to the platform, these points
            encourage community growth and engagement.
          </div>
          <div>
            <strong>Fund Wallet:</strong>{' '}
            <img src={BidPoint} alt="BidPoint" className="w-3 h-4 inline" /> 50
            Awarded for funding your wallet.
          </div>
          <div>
            <strong>List Product:</strong>{' '}
            <img src={BidPoint} alt="BidPoint" className="w-3 h-4 inline" /> 20
            Given for listing products on the platform.
          </div>
          <div>
            <strong>Win Auction:</strong>{' '}
            <img src={BidPoint} alt="BidPoint" className="w-3 h-4 inline" /> 50
            Awarded for Winning an Auction.
          </div>
          <div>
            <strong>Place Bid:</strong>{' '}
            <img src={BidPoint} alt="BidPoint" className="w-3 h-4 inline" /> 50
            Awarded for Placeing a bid in an ungoing auction.
          </div>
        </div>
      </div>
    </span>
  );
};

RewardToolTip.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
};

export default RewardToolTip;
