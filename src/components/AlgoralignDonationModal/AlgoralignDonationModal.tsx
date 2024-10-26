import React, { FC, ReactNode, useState, useEffect } from "react";
import "./algoralignDonationModal.css";
interface Props {
  setIsShowDonationModal: (value: boolean) => void;
  projectId: String;
  xAlgoralignKey: String;
}

// Define the possible step values
type Step =
  | "init-donation"
  | "display-donation-accounts"
  | "donation-successful"
  | "donation-account-expired"
  | "ive-sent-the-money"
  | "verify-phone"
  | "phone-token-sent";

// Define the structure of the response from various endpoints
interface CheckPaymentResponse {
  status: boolean;
  statusCode: number;
  amountReceived: number;
  message: string;
}

interface CreateVirtualAccountResponse {
  statusCode: number;
  status: string;
  message: string;
  projectName: string;
  data: {
    accountNumber: string;
    bankName: string;
    beneficiary: string;
  };
}

interface VerifyPhoneTokenResponse {
  status: boolean;
  statusCode: number;
  data: {
    id: string;
    phone: string;
    verificationCode: string;
    verificationCodeUsed: string;
    loginCode: string;
    loginCodeUsed: string;
    // Other fields can be added as needed
  };
  message: string;
}

interface GetPhoneTokenResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

interface SendPhoneTokenResponse {
  status: boolean;
  code: number;
  message: string;
  data: string;
}

// https://dev.api.project.algoralign.com/api/v1/donor/retrieve-project?projectId=30a3e6a5-f504-4050-8f76-7a5df655f00c

const AlgoralignDonationModal: FC<Props> = ({
  projectId,
  setIsShowDonationModal,
  xAlgoralignKey,
}) => {
  const countryPhoneCodes = [
    { country: "NG", code: "+234" },
    { country: "AF", code: "+93" },
    { country: "AL", code: "+355" },
    { country: "DZ", code: "+213" },
    { country: "AS", code: "+1-684" },
    { country: "AD", code: "+376" },
    { country: "AO", code: "+244" },
    { country: "AG", code: "+1-268" },
    { country: "AR", code: "+54" },
    { country: "AM", code: "+374" },
    { country: "AU", code: "+61" },
    { country: "AT", code: "+43" },
    { country: "AZ", code: "+994" },
    { country: "BS", code: "+1-242" },
    { country: "BH", code: "+973" },
    { country: "BD", code: "+880" },
    { country: "BB", code: "+1-246" },
    { country: "BY", code: "+375" },
    { country: "BE", code: "+32" },
    { country: "BZ", code: "+501" },
    { country: "BJ", code: "+229" },
    { country: "BT", code: "+975" },
    { country: "BO", code: "+591" },
    { country: "BA", code: "+387" },
    { country: "BW", code: "+267" },
    { country: "BR", code: "+55" },
    { country: "BN", code: "+673" },
    { country: "BG", code: "+359" },
    { country: "BF", code: "+226" },
    { country: "BI", code: "+257" },
    { country: "KH", code: "+855" },
    { country: "CM", code: "+237" },
    { country: "CA", code: "+1" },
    { country: "CV", code: "+238" },
    { country: "CF", code: "+236" },
    { country: "TD", code: "+235" },
    { country: "CL", code: "+56" },
    { country: "CN", code: "+86" },
    { country: "CO", code: "+57" },
    { country: "KM", code: "+269" },
    { country: "CG", code: "+242" },
    { country: "CD", code: "+243" },
    { country: "CR", code: "+506" },
    { country: "HR", code: "+385" },
    { country: "CU", code: "+53" },
    { country: "CY", code: "+357" },
    { country: "CZ", code: "+420" },
    { country: "DK", code: "+45" },
    { country: "DJ", code: "+253" },
    { country: "DM", code: "+1-767" },
    { country: "DO", code: "+1-809, +1-829, +1-849" },
    { country: "EC", code: "+593" },
    { country: "EG", code: "+20" },
    { country: "SV", code: "+503" },
    { country: "GQ", code: "+240" },
    { country: "ER", code: "+291" },
    { country: "EE", code: "+372" },
    { country: "ET", code: "+251" },
    { country: "FJ", code: "+679" },
    { country: "FI", code: "+358" },
    { country: "FR", code: "+33" },
    { country: "GA", code: "+241" },
    { country: "GM", code: "+220" },
    { country: "GE", code: "+995" },
    { country: "DE", code: "+49" },
    { country: "GH", code: "+233" },
    { country: "GR", code: "+30" },
    { country: "GD", code: "+1-473" },
    { country: "GT", code: "+502" },
    { country: "GN", code: "+224" },
    { country: "GW", code: "+245" },
    { country: "GY", code: "+592" },
    { country: "HT", code: "+509" },
    { country: "HN", code: "+504" },
    { country: "HU", code: "+36" },
    { country: "IS", code: "+354" },
    { country: "IN", code: "+91" },
    { country: "ID", code: "+62" },
    { country: "IR", code: "+98" },
    { country: "IQ", code: "+964" },
    { country: "IE", code: "+353" },
    { country: "IL", code: "+972" },
    { country: "IT", code: "+39" },
    { country: "JM", code: "+1-876" },
    { country: "JP", code: "+81" },
    { country: "JO", code: "+962" },
    { country: "KZ", code: "+7" },
    { country: "KE", code: "+254" },
    { country: "KI", code: "+686" },
    { country: "KP", code: "+850" },
    { country: "KR", code: "+82" },
    { country: "KW", code: "+965" },
    { country: "KG", code: "+996" },
    { country: "LA", code: "+856" },
    { country: "LV", code: "+371" },
    { country: "LB", code: "+961" },
    { country: "LS", code: "+266" },
    { country: "LR", code: "+231" },
    { country: "LY", code: "+218" },
    { country: "LI", code: "+423" },
    { country: "LT", code: "+370" },
    { country: "LU", code: "+352" },
    { country: "MG", code: "+261" },
    { country: "MW", code: "+265" },
    { country: "MY", code: "+60" },
    { country: "MV", code: "+960" },
    { country: "ML", code: "+223" },
    { country: "MT", code: "+356" },
    { country: "MH", code: "+692" },
    { country: "MR", code: "+222" },
    { country: "MU", code: "+230" },
    { country: "MX", code: "+52" },
    { country: "FM", code: "+691" },
    { country: "MD", code: "+373" },
    { country: "MC", code: "+377" },
    { country: "MN", code: "+976" },
    { country: "ME", code: "+382" },
    { country: "MA", code: "+212" },
    { country: "MZ", code: "+258" },
    { country: "MM", code: "+95" },
    { country: "NA", code: "+264" },
    { country: "NR", code: "+674" },
    { country: "NP", code: "+977" },
    { country: "NL", code: "+31" },
    { country: "NC", code: "+687" },
    { country: "NZ", code: "+64" },
    { country: "NI", code: "+505" },
    { country: "NE", code: "+227" },

    { country: "NU", code: "+683" },
    { country: "MK", code: "+389" },
    { country: "NO", code: "+47" },
    { country: "OM", code: "+968" },
    { country: "PK", code: "+92" },
    { country: "PW", code: "+680" },
    { country: "PS", code: "+970" },
    { country: "PA", code: "+507" },
    { country: "PG", code: "+675" },
    { country: "PY", code: "+595" },
    { country: "PE", code: "+51" },
    { country: "PH", code: "+63" },
    { country: "PL", code: "+48" },
    { country: "PT", code: "+351" },
    { country: "QA", code: "+974" },
    { country: "RO", code: "+40" },
    { country: "RU", code: "+7" },
    { country: "RW", code: "+250" },
    { country: "KN", code: "+1-869" },
    { country: "LC", code: "+1-758" },
    { country: "VC", code: "+1-784" },
    { country: "WS", code: "+685" },
    { country: "SM", code: "+378" },
    { country: "ST", code: "+239" },
    { country: "SA", code: "+966" },
    { country: "SN", code: "+221" },
    { country: "RS", code: "+381" },
    { country: "SC", code: "+248" },
    { country: "SL", code: "+232" },
    { country: "SG", code: "+65" },
    { country: "SK", code: "+421" },
    { country: "SI", code: "+386" },
    { country: "SB", code: "+677" },
    { country: "SO", code: "+252" },
    { country: "ZA", code: "+27" },
    { country: "SS", code: "+211" },
    { country: "ES", code: "+34" },
    { country: "LK", code: "+94" },
    { country: "SD", code: "+249" },
    { country: "SR", code: "+597" },
    { country: "SZ", code: "+268" },
    { country: "SE", code: "+46" },
    { country: "CH", code: "+41" },
    { country: "SY", code: "+963" },
    { country: "TW", code: "+886" },
    { country: "TJ", code: "+992" },
    { country: "TZ", code: "+255" },
    { country: "TH", code: "+66" },
    { country: "TL", code: "+670" },
    { country: "TG", code: "+228" },
    { country: "TO", code: "+676" },
    { country: "TT", code: "+1-868" },
    { country: "TN", code: "+216" },
    { country: "TR", code: "+90" },
    { country: "TM", code: "+993" },
    { country: "TV", code: "+688" },
    { country: "UG", code: "+256" },
    { country: "UA", code: "+380" },
    { country: "AE", code: "+971" },
    { country: "GB", code: "+44" },
    { country: "US", code: "+1" },
    { country: "UY", code: "+598" },
    { country: "UZ", code: "+998" },
    { country: "VU", code: "+678" },
    { country: "VA", code: "+379" },
    { country: "VE", code: "+58" },
    { country: "VN", code: "+84" },
    { country: "YE", code: "+967" },
    { country: "ZM", code: "+260" },
    { country: "ZW", code: "+263" },
  ];

  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [virtualAccount, setVirtualAccount] = useState<any | null>(null);
  const [step, setStep] = useState<Step>("init-donation");
  const [error, setError] = useState<string | null>(null);
  const [IsShowOtpInput, setIsShowOtpInput] = useState<boolean>(false);
  const [isLiabilitywaiverChecked, setIsLiabilitywaiverChecked] =
    useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryPhoneCodes[0].code
  );
  const baseApiUrl =
    "https://dev.api.project.algoralign.com/api/v1/project-funding";
  const checkPaymentStatus = async () => {
    const payload = {
      accountNumber: virtualAccount?.data.accountNumber,
    };

    try {
      const response = await fetch(
        `${baseApiUrl}/donor/check-payment-received`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-algoralign-key": xAlgoralignKey as string,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.statusCode === 200) {
        setStep("donation-successful");
        setVirtualAccount(null);
      }
    } catch (error) {
      setError("Error while creating virtual account:");
      setTimeout(() => setError(null), 5000);
    }
  };

  const createVirtualAccount = async () => {
    const payload = {
      projectId,
      phone: selectedCountry + phoneNumber,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        // "https://dev.api.project.algoralign.com/api/v1/project-funding/create-virtual-account",
        `${baseApiUrl}/create-virtual-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-algoralign-key": xAlgoralignKey as string,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStep("display-donation-accounts");
        setVirtualAccount(data);
        setIsLoading(false);
      } else {
        alert("Failed to create virtual account. Status:");
        console.error(
          "Failed to create virtual account. Status:",
          response.status
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error while creating virtual account:", error);
    }
  };

  useEffect(() => {
    if (!virtualAccount) {
      return;
    }
    checkPaymentStatus();

    const interval = setInterval(checkPaymentStatus, 10000);
    return () => clearInterval(interval);
  }, [virtualAccount]);

  const spinner = () => {
    return (
      <svg
        className="spinner-svg"
        aria-hidden="true"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  };

  const handleClose = () => {
    setIsShowDonationModal(false);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    const numericValue = value.replace(/,/g, "");
    const parsedValue = numericValue ? parseFloat(numericValue) : null;

    if (parsedValue === null || (!isNaN(parsedValue) && parsedValue >= 0)) {
      const formattedValue =
        parsedValue !== null ? parsedValue.toLocaleString() : "";
      event.target.value = formattedValue;
      setDonationAmount(parsedValue);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsShowOtpInput(false);
    setOtp("");

    const phoneRegex = /^\+?\d* ?\d* ?\d*$/;
    if (phoneRegex.test(value) || value === "") {
      setPhoneNumber(value);
    }
  };

  const validateDonationAmountAndPhoneNumber = (e: React.FormEvent) => {
    e.preventDefault();

    if (IsShowOtpInput) {
      setIsShowOtpInput(false);
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const phoneRegex = /^\+?\d[\d ]*$/;

    if (!phoneNumber.trim()) {
      setIsLoading(false);
      setError("Phone number is required.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setIsLoading(false);
      setError("Invalid phone number format.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    if (donationAmount === null || donationAmount <= 0) {
      setIsLoading(false);
      setError("Donation amount is required and must be greater than 0.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    sendOtp();
  };

  const sendOtp = async () => {
    const payload = {
      phone: selectedCountry + phoneNumber,
      action: "signup",
    };

    try {
      const response = await fetch(
        // "https://dev.api.project.algoralign.com/api/v1/project-funding/donor/get-phone-token",
        `${baseApiUrl}/donor/get-phone-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-algoralign-key": xAlgoralignKey as string,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsShowOtpInput(true);
      } else {
        setError(data.message[0]);
        setTimeout(() => setError(null), 5000);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error while creating virtual account:", error);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    const payload = {
      phone: "+23407080961583",
      action: "signup",
      code: otp,
    };

    if (otp.length < 4) {
      setError("Check Otp and try again");
      setIsLoading(false);
      return;
    }
    if (!isLiabilitywaiverChecked) {
      setError("Kindly agree to the Liability Waiver");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        // "https://dev.api.project.algoralign.com/api/v1/project-funding/donor/verify-phone-token",
        `${baseApiUrl}/donor/verify-phone-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-algoralign-key": xAlgoralignKey as string,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.statusCode !== 200) {
        setError("Check otp and try again");
        setTimeout(() => setError(null), 2000);
        setIsLoading(false);
        return;
      }

      createVirtualAccount();
    } catch (error) {
      setIsLoading(false);
      setError("Please check OTP and try again");
    }
  };

  function copyToClipboard() {
    navigator.clipboard.writeText(virtualAccount?.data.accountNumber);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Exit if there's no time left
    if (timeLeft <= 0) {
      setStep("donation-account-expired"); // Call the function when the time hits 0
      return;
    }

    // Create an interval to update the time left every second
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear the interval when the component is unmounted or the timeLeft changes
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Format the time left in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="donation-modal">
      {step === "init-donation" && (
        <form
          onSubmit={validateDonationAmountAndPhoneNumber}
          className="donation-modal-inner init-donation"
        >
          <div className="donation-modal-header">
            <h3>Donate</h3>
            <svg
              onClick={handleClose}
              className="close-donation-modal"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </div>
          <div>
            <h4>Donation Amount</h4>
            <input
              className="donation-modal-donation-amount-input"
              type="text"
              placeholder="10,000"
              value={
                donationAmount !== null
                  ? donationAmount.toLocaleString("en-US")
                  : ""
              }
              onChange={handleAmountChange}
            />
          </div>
          <div>
            <h4>Phone Number</h4>
            <section className="init-donation-otp">
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
              >
                {countryPhoneCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.country.slice(0, 3)} ({country.code})
                  </option>
                ))}
              </select>
              <input
                className="donation-modal-phone-input"
                type="text"
                placeholder="0908 993 9393"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              <button type="submit">{isLoading ? spinner() : "Get Otp"}</button>
            </section>
          </div>
          {!IsShowOtpInput && (
            <>
              <button type="submit" className="send-donation-otp">
                {isLoading ? spinner() : "Next"}
              </button>
            </>
          )}
          {IsShowOtpInput && (
            <>
              <div>
                <h4>Enter Otp</h4>
                <input
                  className="donation-modal-donation-amount-input"
                  type="text"
                  placeholder="349193"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div
                className="liability-waiver-section"
                onClick={() =>
                  setIsLiabilitywaiverChecked(!isLiabilitywaiverChecked)
                }
              >
                <input
                  type="checkbox"
                  checked={isLiabilitywaiverChecked}
                  className="liability-waiver-checkbox"
                />
                <div className="liability-waiver-text">
                  By continuing, you agree with Algoralign&apos;s{" "}
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Liability Waiver
                  </a>
                  .
                </div>
              </div>
            </>
          )}

          {error && <p className="donation-error">{error}</p>}

          {IsShowOtpInput && (
            <button
              onClick={() => verifyOtp()} // Assuming verifyOtp is defined elsewhere
              type="button"
              className="donation-modal-submit-btn"
            >
              {isLoading ? spinner() : "Next"}
            </button>
          )}
        </form>
      )}

      {step === "display-donation-accounts" && donationAmount && (
        <form
          onSubmit={validateDonationAmountAndPhoneNumber}
          className="display-donation-accounts donation-modal-inner"
        >
          <div className="donation-modal-header">
            <svg
              onClick={handleClose}
              className="close-donation-modal"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </div>
          <div>
            <h3>
              Transfer NGN {new Intl.NumberFormat().format(donationAmount)} to
              the account details below
            </h3>
            <div className="donation-account-details">
              <h5>Bank Name</h5>
              <p>
                <span>{virtualAccount.data.bankName}</span>
              </p>
              <h5>Account Number</h5>
              <p>
                <span>{virtualAccount.data.accountNumber}</span>
                {isCopied ? (
                  <span className="copied">Copied!</span>
                ) : (
                  <svg
                    onClick={() => copyToClipboard()}
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"></path>
                  </svg>
                )}
              </p>
              <h5>Amount</h5>
              <p>NGN {new Intl.NumberFormat().format(donationAmount)}</p>

              <div className="donation-warning-text">
                This account is for this transaction only and expires in
              </div>
              {/* <CountdownTimer onTimeEnd={() => setStep("donation-account-expired")} /> */}
              <div className="donation-countdown-timer">
                <span className="">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep("ive-sent-the-money")}
              className="ive-sent-the-money-btn"
            >
              I&apos;ve sent the money.
            </button>
          </div>
        </form>
      )}

      {step === "donation-successful" && (
        <div className="donation-successful donation-modal-inner ">
          <div className="donation-modal-header">
            {/* <h3>Transfer Funds</h3> */}
            <svg
              onClick={handleClose}
              className="close-donation-modal"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </div>
          <div>
            <div className="donation-successful-check">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
              </svg>
            </div>
            <h3 className="">Payment Successful</h3>
            <p>
              {" "}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur
              deleniti beatae magnam blanditiis expedita amet at.
            </p>
          </div>
        </div>
      )}

      {step === "donation-account-expired" && (
        <div className="donation-account-expired donation-modal-inner ">
          <div className="donation-modal-header">
            {/* <h3>Transfer Funds</h3> */}
            <svg
              onClick={handleClose}
              className="close-donation-modal"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </div>
          <div>
            <div className="donation-account-expired-svg">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"></path>
                <path d="M11 6h2v5h-2zm0 6h2v2h-2z"></path>
              </svg>
            </div>
            <h3 className=""> Transaction Timeout!</h3>
            <p>
              {" "}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur
              deleniti beatae magnam blanditiis expedita amet at.
            </p>
            <button
              onClick={() => createVirtualAccount()}
              className="retry-donation-btn"
            >
              {isLoading ? spinner() : " Retry"}
            </button>
            <button
              onClick={() => setStep("ive-sent-the-money")}
              className="ive-sent-the-money-btn"
            >
              I&apos;ve sent the money.
            </button>
          </div>
        </div>
      )}

      {step === "ive-sent-the-money" && (
        <div className="ive-sent-the-money donation-modal-inner ">
          <div className="donation-modal-header">
            {/* <h3>Transfer Funds</h3> */}
            <svg
              onClick={handleClose}
              className="close-donation-modal"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
            </svg>
          </div>
          <div>
            <div className="">
              <img src="https://s11.gifyu.com/images/SOdia.gif" />
            </div>
            <h3 className="">
              We&apos;ll complete this transaction automatically once we confirm
              your transfer.
            </h3>
            <p>
              {" "}
              If you have any issues with this transfer, please contact us via
              support@algoralign.com
            </p>

            <button
              onClick={() => setStep("display-donation-accounts")}
              className="back-to-display-donation-accounts-button"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
              </svg>{" "}
              Account Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgoralignDonationModal;
