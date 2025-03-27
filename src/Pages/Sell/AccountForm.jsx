import { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { current } from "../../utils";

const AccountForm = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [acctNumber, setAcctNumber] = useState("");
  const [acctName, setAcctName] = useState("");
  const navigate = useNavigate();

  const fetchData = async ({ data = null, method = "GET", params = null } = {}) => {
    let endpoint = `${current}misc/banks`;

    if (method === "GET" && params) {
      endpoint = `${current}users/transactions/resolve?account_number=${encodeURIComponent(params.acctN)}&bank_code=${encodeURIComponent(params.bankCode)}`;
    } else if (method !== "GET") {
      endpoint = `${current}users/transactions/transfer_recipient`;
    }

    console.log("Fetching:", endpoint);

    try {
      const response = await fetch(endpoint, {
        method,
        body: data ? JSON.stringify(data) : null,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      console.log("Success:", result);
      return result.data;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  useEffect(() => {
    const newAcct = JSON.parse(sessionStorage.getItem('newAccount'))

    const loadBanks = async () => {
      const data = await fetchData();
      if (data) setBanks(data);
    };

    if (!newAcct) {
      const { acct_name, acct_no, bank_code } = JSON.parse(sessionStorage.getItem('_user'));
      setAcctName(acct_name);
      setAcctNumber(acct_no);
      setSelectedBank(bank_code);
      loadBanks();
      return
    } else {
      return
    }
  }, []);

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const resolveRecipient = async () => {
    if (!acctNumber || !selectedBank) {
      alert("Please enter account number and select a bank.");
      return;
    }

    const result = await fetchData({
      method: "GET",
      params: { acctN: acctNumber, bankCode: selectedBank },
    });

    if (result?.account_name) {
      setAcctName(result.account_name);
    } else {
      alert("Account name could not be resolved.");
    }
  };

  const goToNextPage = async () => {
    if (!acctNumber || !selectedBank) {
      alert("Please enter account number and select a bank.");
      return;
    }

    const result = await fetchData({
      method: "POST",
      data: { account_number: acctNumber, bank_code: selectedBank },
    });

    if (result) {
      !JSON.parse(sessionStorage.getItem("newAccount")) ? navigate('/dashboard') : navigate("/Verification");
    } else {
      alert("Account details not saved.");
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex justify-center items-center">
            <div className="bg-white p-10 mb-6 mt-4 rounded-lg w-full max-w-full">
              <h1 className="text-4xl font-bold text-maroon mb-6">
                Account Information
              </h1>
              <form>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <input
                      type="text"
                      id="accountNumber"
                      placeholder="Account Number"
                      value={acctNumber}
                      onChange={(e) => setAcctNumber(e.target.value)}
                      className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-red-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      value={acctName || ""}
                      readOnly
                      className={`${
                        acctName ? "block" : "hidden"
                      } w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-red-500`}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <select
                    id="bank"
                    value={selectedBank || ""}
                    onChange={handleBankChange}
                    className="py-3 px-4 border border-gray-300 rounded focus:outline-none focus:bg-white focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-96 md:w-[648px] lg:w-[648px]"
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank, index) => (
                      <option key={index} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-start gap-10">
                  <button
                    onClick={goToNextPage}
                    type="button"
                    className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon mb-40"
                  >
                    Next
                  </button>
                  <button
                    onClick={resolveRecipient}
                    type="button"
                    className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon mb-40"
                  >
                    Confirm Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
