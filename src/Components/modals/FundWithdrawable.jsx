import { useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../assets/loaderWhite';
import { current } from '../../utils';
import { Wallet, ArrowLeftRight } from 'lucide-react';
import BidCredit from '../../assets/svg/bidCredit.svg';
import { currencyFormat } from '../../utils';
import PropTypes from 'prop-types';

PropTypes.checkPropTypes;

const TABS = {
  FUND: 'fund',
  REVERSE: 'reverse',
};

const FundWithdrawable = ({ data }) => {
  const [activeTab, setActiveTab] = useState(TABS.FUND);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const isReverse = activeTab === TABS.REVERSE;

  const sourceBalance = isReverse
    ? data.withdrawable_amount
    : data.available_balance;

  const endpoint = isReverse
    ? `${current}users/transactions/rev_withdraw_balance`
    : `${current}users/transactions/fund_withdraw_balance`;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.warn('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${endpoint}?amount=${amount}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resp = await response.json();

      if (!response.ok || !resp.success) {
        toast.error(resp.message || 'Operation failed');
        return;
      }

      toast.success(
        isReverse
          ? 'Withdrawable balance reversed successfully'
          : 'Withdrawable balance funded successfully'
      );

      setAmount('');
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab(TABS.FUND)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === TABS.FUND
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Fund Withdrawable
        </button>

        <button
          onClick={() => setActiveTab(TABS.REVERSE)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === TABS.REVERSE
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Reverse Balance
        </button>
      </div>

      {/* Info Panel */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          isReverse
            ? 'border-amber-200 bg-amber-50'
            : 'border-blue-200 bg-blue-50'
        }`}
      >
        {isReverse ? (
          <ArrowLeftRight size={20} className="mt-0.5 text-amber-600" />
        ) : (
          <Wallet size={20} className="mt-0.5 text-blue-600" />
        )}

        <div className="text-sm">
          <p className="font-medium text-gray-900">
            {isReverse
              ? 'Reverse Withdrawable Balance'
              : 'Fund Withdrawable Balance'}
          </p>
          <p className="text-gray-700">
            {isReverse
              ? 'Move funds back from your withdrawable balance.'
              : 'Move eligible funds into your withdrawable wallet.'}
          </p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount</label>

        <div className="relative">
          {isReverse ? (
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              ₦
            </span>
          ) : (
            <img
              src={BidCredit}
              alt="Bid Credit"
              className="absolute inset-y-0 left-3 my-auto h-4 w-4"
            />
          )}

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-lg border px-8 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <p className="text-xs text-gray-500">
          Available to transfer:{' '}
          <span className="font-medium">{currencyFormat(sourceBalance)}</span>
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isReverse
            ? 'bg-[#9f3247dc] hover:bg-[#9f3247]'
            : 'bg-[#9f3247] hover:bg-[#9f3247dc]'
        }`}
      >
        {loading ? (
          <Loader otherStyles="h-[20px] w-[20px] border-2" />
        ) : isReverse ? (
          'Reverse Balance'
        ) : (
          'Fund Withdrawable Balance'
        )}
      </button>

      {/* Footer Note */}
      <p className="text-center text-xs text-gray-500">
        Please confirm the amount before proceeding. This action cannot be
        undone.
      </p>
    </div>
  );
};

FundWithdrawable.propTypes = {
  data: PropTypes.shape({
    withdrawable_amount: PropTypes.number.isRequired,
    available_balance: PropTypes.number.isRequired,
  }).isRequired,
};

export default FundWithdrawable;
