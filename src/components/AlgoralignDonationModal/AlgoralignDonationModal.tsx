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
  | "ive-sent-the-money";
// | "verify-phone"
// | "phone-token-sent";

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

const AlgoralignDonationModal: FC<Props> = ({
  projectId,
  setIsShowDonationModal,
  xAlgoralignKey,
}) => {
  const countryPhoneCodes = [
    { country: "NGN", code: "+234", sampleNumber: "08172345678" },
    { country: "AFG", code: "+93", sampleNumber: "0701234567" },
    { country: "ALB", code: "+355", sampleNumber: "0681234567" },
    { country: "DZA", code: "+213", sampleNumber: "0551234567" },
    { country: "ASM", code: "+1-684", sampleNumber: "6847331234" },
    { country: "AND", code: "+376", sampleNumber: "312345" },
    { country: "AGO", code: "+244", sampleNumber: "923123456" },
    { country: "ATG", code: "+1-268", sampleNumber: "2684621234" },
    { country: "ARG", code: "+54", sampleNumber: "01112345678" },
    { country: "ARM", code: "+374", sampleNumber: "077123456" },
    { country: "AUS", code: "+61", sampleNumber: "0412345678" },
    { country: "AUT", code: "+43", sampleNumber: "06641234567" },
    { country: "AZE", code: "+994", sampleNumber: "0511234567" },
    { country: "BHS", code: "+1-242", sampleNumber: "2423591234" },
    { country: "BHR", code: "+973", sampleNumber: "36001234" },
    { country: "BGD", code: "+880", sampleNumber: "01812345678" },
    { country: "BRB", code: "+1-246", sampleNumber: "2462501234" },
    { country: "BLR", code: "+375", sampleNumber: "0291234567" },
    { country: "BEL", code: "+32", sampleNumber: "0471123456" },
    { country: "BLZ", code: "+501", sampleNumber: "6101234" },
    { country: "BEN", code: "+229", sampleNumber: "97123456" },
    { country: "BTN", code: "+975", sampleNumber: "77123456" },
    { country: "BOL", code: "+591", sampleNumber: "71234567" },
    { country: "BIH", code: "+387", sampleNumber: "061123456" },
    { country: "BWA", code: "+267", sampleNumber: "71345678" },
    { country: "BRA", code: "+55", sampleNumber: "011912345678" },
    { country: "BRN", code: "+673", sampleNumber: "7123456" },
    { country: "BGR", code: "+359", sampleNumber: "0871234567" },
    { country: "BFA", code: "+226", sampleNumber: "70123456" },
    { country: "BDI", code: "+257", sampleNumber: "79561234" },
    { country: "KHM", code: "+855", sampleNumber: "081234567" },
    { country: "CMR", code: "+237", sampleNumber: "671234567" },
    { country: "CAN", code: "+1", sampleNumber: "2045551234" },
    { country: "CPV", code: "+238", sampleNumber: "9912345" },
    { country: "CAF", code: "+236", sampleNumber: "70012345" },
    { country: "TCD", code: "+235", sampleNumber: "63012345" },
    { country: "CHL", code: "+56", sampleNumber: "0912345678" },
    { country: "CHN", code: "+86", sampleNumber: "13112345678" },
    { country: "COL", code: "+57", sampleNumber: "3011234567" },
    { country: "COM", code: "+269", sampleNumber: "3212345" },
    { country: "COG", code: "+242", sampleNumber: "061234567" },
    { country: "COD", code: "+243", sampleNumber: "0812345678" },
    { country: "CRI", code: "+506", sampleNumber: "83123456" },
    { country: "HRV", code: "+385", sampleNumber: "0912345678" },
    { country: "CUB", code: "+53", sampleNumber: "052123456" },
    { country: "CYP", code: "+357", sampleNumber: "96123456" },
    { country: "CZE", code: "+420", sampleNumber: "601234567" },
    { country: "DNK", code: "+45", sampleNumber: "20123456" },
    { country: "DJI", code: "+253", sampleNumber: "77831012" },
    { country: "DMA", code: "+1-767", sampleNumber: "7672751234" },
    { country: "DOM", code: "+1-809", sampleNumber: "8092345678" },
    { country: "ECU", code: "+593", sampleNumber: "0991234567" },
    { country: "EGY", code: "+20", sampleNumber: "01012345678" },
    { country: "SLV", code: "+503", sampleNumber: "70123456" },
    { country: "GNQ", code: "+240", sampleNumber: "222123456" },
    { country: "ERI", code: "+291", sampleNumber: "071123456" },
    { country: "EST", code: "+372", sampleNumber: "51234567" },
    { country: "ETH", code: "+251", sampleNumber: "911234567" },
    { country: "FJI", code: "+679", sampleNumber: "7012345" },
    { country: "FIN", code: "+358", sampleNumber: "0412345678" },
    { country: "FRA", code: "+33", sampleNumber: "0612345678" },
    { country: "GAB", code: "+241", sampleNumber: "071234567" },
    { country: "GMB", code: "+220", sampleNumber: "3012345" },
    { country: "GEO", code: "+995", sampleNumber: "555123456" },
    { country: "DEU", code: "+49", sampleNumber: "015112345678" },
    { country: "GHA", code: "+233", sampleNumber: "0241234567" },
    { country: "GRC", code: "+30", sampleNumber: "6912345678" },
    { country: "GRD", code: "+1-473", sampleNumber: "4734031234" },
    { country: "GTM", code: "+502", sampleNumber: "51234567" },
    { country: "GIN", code: "+224", sampleNumber: "621234567" },
    { country: "GNB", code: "+245", sampleNumber: "955123456" },
    { country: "GUY", code: "+592", sampleNumber: "6212345" },
    { country: "HTI", code: "+509", sampleNumber: "34123456" },
    { country: "HND", code: "+504", sampleNumber: "91234567" },
    { country: "HUN", code: "+36", sampleNumber: "0612345678" },
    { country: "ISL", code: "+354", sampleNumber: "6112345" },
    { country: "IND", code: "+91", sampleNumber: "09812345678" },
    { country: "IDN", code: "+62", sampleNumber: "0812345678" },
    { country: "IRN", code: "+98", sampleNumber: "09121234567" },
    { country: "IRQ", code: "+964", sampleNumber: "07901234567" },
    { country: "IRL", code: "+353", sampleNumber: "0851234567" },
    { country: "ISR", code: "+972", sampleNumber: "0501234567" },
    { country: "ITA", code: "+39", sampleNumber: "3123456789" },
    { country: "JAM", code: "+1-876", sampleNumber: "8762101234" },
    { country: "JPN", code: "+81", sampleNumber: "09012345678" },
    { country: "JOR", code: "+962", sampleNumber: "0791234567" },
    { country: "KAZ", code: "+7", sampleNumber: "7012345678" },
    { country: "KEN", code: "+254", sampleNumber: "0712345678" },
    { country: "KIR", code: "+686", sampleNumber: "28123456" },
    { country: "PRK", code: "+850", sampleNumber: "191234567" },
    { country: "KOR", code: "+82", sampleNumber: "01012345678" },
    { country: "KWT", code: "+965", sampleNumber: "50001234" },
    { country: "KGZ", code: "+996", sampleNumber: "0551234567" },
    { country: "LAO", code: "+856", sampleNumber: "020123456" },
    { country: "LVA", code: "+371", sampleNumber: "22123456" },
    { country: "LBN", code: "+961", sampleNumber: "032123456" },
    { country: "LSO", code: "+266", sampleNumber: "62912345" },
    { country: "LIT", code: "+370", sampleNumber: "61234567" },
    { country: "LUX", code: "+352", sampleNumber: "62123456" },
    { country: "MAC", code: "+853", sampleNumber: "63123456" },
    { country: "MDG", code: "+261", sampleNumber: "0321234567" },
    { country: "MWI", code: "+265", sampleNumber: "0881234567" },
    { country: "MYS", code: "+60", sampleNumber: "0123456789" },
    { country: "MDV", code: "+960", sampleNumber: "79123456" },
    { country: "MLI", code: "+223", sampleNumber: "66234567" },
    { country: "MLT", code: "+356", sampleNumber: "79412345" },
    { country: "MRT", code: "+222", sampleNumber: "22123456" },
    { country: "MUS", code: "+230", sampleNumber: "52512345" },
    { country: "MEX", code: "+52", sampleNumber: "5512345678" },
    { country: "FSM", code: "+691", sampleNumber: "3201234" },
    { country: "MDA", code: "+373", sampleNumber: "079123456" },
    { country: "MNG", code: "+976", sampleNumber: "88123456" },
    { country: "MNE", code: "+382", sampleNumber: "067123456" },
    { country: "MAR", code: "+212", sampleNumber: "0612345678" },
    { country: "MOZ", code: "+258", sampleNumber: "841234567" },
    { country: "NAM", code: "+264", sampleNumber: "0811234567" },
    { country: "NRU", code: "+674", sampleNumber: "1234567" },
    { country: "NPL", code: "+977", sampleNumber: "9812345678" },
    { country: "NLD", code: "+31", sampleNumber: "0612345678" },
    { country: "NZL", code: "+64", sampleNumber: "0212345678" },
    { country: "NIC", code: "+505", sampleNumber: "81123456" },
    { country: "NER", code: "+227", sampleNumber: "90123456" },
    { country: "NGA", code: "+234", sampleNumber: "08172345678" },
    { country: "NOR", code: "+47", sampleNumber: "99123456" },
    { country: "OMN", code: "+968", sampleNumber: "92123456" },
    { country: "PAK", code: "+92", sampleNumber: "0301234567" },
    { country: "PLW", code: "+680", sampleNumber: "7771234" },
    { country: "PSE", code: "+970", sampleNumber: "0591234567" },
    { country: "PAN", code: "+507", sampleNumber: "61234567" },
    { country: "PNG", code: "+675", sampleNumber: "71234567" },
    { country: "PRY", code: "+595", sampleNumber: "098123456" },
    { country: "PER", code: "+51", sampleNumber: "991234567" },
    { country: "PHL", code: "+63", sampleNumber: "09171234567" },
    { country: "POL", code: "+48", sampleNumber: "501234567" },
    { country: "PRT", code: "+351", sampleNumber: "912345678" },
    { country: "QAT", code: "+974", sampleNumber: "30001234" },
    { country: "ROU", code: "+40", sampleNumber: "0721123456" },
    { country: "RUS", code: "+7", sampleNumber: "9111234567" },
    { country: "RWA", code: "+250", sampleNumber: "0781234567" },
    { country: "WSM", code: "+685", sampleNumber: "12345" },
    { country: "SMR", code: "+378", sampleNumber: "0541234567" },
    { country: "STP", code: "+239", sampleNumber: "9912345" },
    { country: "SAU", code: "+966", sampleNumber: "500012345" },
    { country: "SEN", code: "+221", sampleNumber: "773456789" },
    { country: "SRB", code: "+381", sampleNumber: "0641234567" },
    { country: "SYC", code: "+248", sampleNumber: "2512345" },
    { country: "SLE", code: "+232", sampleNumber: "076123456" },
    { country: "SGP", code: "+65", sampleNumber: "91234567" },
    { country: "SVK", code: "+421", sampleNumber: "0901234567" },
    { country: "SVN", code: "+386", sampleNumber: "031123456" },
    { country: "SLB", code: "+677", sampleNumber: "12345" },
    { country: "SOM", code: "+252", sampleNumber: "061234567" },
    { country: "ZAF", code: "+27", sampleNumber: "0612345678" },
    { country: "ESP", code: "+34", sampleNumber: "612345678" },
    { country: "LKA", code: "+94", sampleNumber: "0712345678" },
    { country: "SDN", code: "+249", sampleNumber: "0912345678" },
    { country: "SUR", code: "+597", sampleNumber: "7212345" },
    { country: "SWE", code: "+46", sampleNumber: "0701234567" },
    { country: "CHE", code: "+41", sampleNumber: "0761234567" },
    { country: "SYR", code: "+963", sampleNumber: "0931234567" },
    { country: "TJK", code: "+992", sampleNumber: "910123456" },
    { country: "TZA", code: "+255", sampleNumber: "0712345678" },
    { country: "THA", code: "+66", sampleNumber: "0812345678" },
    { country: "TLS", code: "+670", sampleNumber: "733123456" },
    { country: "TGO", code: "+228", sampleNumber: "90123456" },
    { country: "TON", code: "+676", sampleNumber: "123456" },
    { country: "TTO", code: "+1-868", sampleNumber: "8686231234" },
    { country: "TUN", code: "+216", sampleNumber: "20123456" },
    { country: "TUR", code: "+90", sampleNumber: "5301234567" },
    { country: "TKM", code: "+993", sampleNumber: "123456789" },
    { country: "TUV", code: "+688", sampleNumber: "12345" },
    { country: "UGA", code: "+256", sampleNumber: "0701234567" },
    { country: "UKR", code: "+380", sampleNumber: "0671234567" },
    { country: "ARE", code: "+971", sampleNumber: "0501234567" },
    { country: "GBR", code: "+44", sampleNumber: "07123456789" },
    { country: "USA", code: "+1", sampleNumber: "2025550123" },
    { country: "URY", code: "+598", sampleNumber: "098123456" },
    { country: "UZB", code: "+998", sampleNumber: "90-123-4567" },
    { country: "VUT", code: "+678", sampleNumber: "12345" },
    { country: "VEN", code: "+58", sampleNumber: "0412123456" },
    { country: "VNM", code: "+84", sampleNumber: "0912345678" },
    { country: "YEM", code: "+967", sampleNumber: "733123456" },
    { country: "ZMB", code: "+260", sampleNumber: "0971234567" },
    { country: "ZWE", code: "+263", sampleNumber: "0712345678" },
    { country: "MWI", code: "+265", sampleNumber: "987654321" },
    { country: "MYS", code: "+60", sampleNumber: "456123789" },
    { country: "MDV", code: "+960", sampleNumber: "789321654" },
    { country: "MLI", code: "+223", sampleNumber: "321789654" },
    { country: "MLT", code: "+356", sampleNumber: "654789321" },
    { country: "MHL", code: "+692", sampleNumber: "159753486" },
    { country: "MRT", code: "+222", sampleNumber: "753951468" },
    { country: "MUS", code: "+230", sampleNumber: "864213579" },
    { country: "MEX", code: "+52", sampleNumber: "214365870" },
    { country: "FSM", code: "+691", sampleNumber: "987213465" },
    { country: "MDA", code: "+373", sampleNumber: "435672189" },
    { country: "MCO", code: "+377", sampleNumber: "876234519" },
    { country: "MNG", code: "+976", sampleNumber: "621987534" },
    { country: "MNE", code: "+382", sampleNumber: "354987210" },
    { country: "MAR", code: "+212", sampleNumber: "798054321" },
    { country: "MOZ", code: "+258", sampleNumber: "452316789" },
    { country: "MMR", code: "+95", sampleNumber: "963258741" },
    { country: "NAM", code: "+264", sampleNumber: "125487936" },
    { country: "NRU", code: "+674", sampleNumber: "368752190" },
    { country: "NPL", code: "+977", sampleNumber: "740298156" },
    { country: "NLD", code: "+31", sampleNumber: "193572846" },
    { country: "NCL", code: "+687", sampleNumber: "572983410" },
    { country: "NZL", code: "+64", sampleNumber: "830619472" },
    { country: "NIC", code: "+505", sampleNumber: "481327695" },
    { country: "NER", code: "+227", sampleNumber: "239748651" },
    { country: "NIU", code: "+683", sampleNumber: "761259348" },
    { country: "MKD", code: "+389", sampleNumber: "924753861" },
    { country: "NOR", code: "+47", sampleNumber: "567132490" },
    { country: "OMN", code: "+968", sampleNumber: "490586273" },
    { country: "PAK", code: "+92", sampleNumber: "382157946" },
    { country: "PLW", code: "+680", sampleNumber: "547193628" },
    { country: "PSE", code: "+970", sampleNumber: "320459187" },
    { country: "PAN", code: "+507", sampleNumber: "679283410" },
    { country: "PNG", code: "+675", sampleNumber: "129675483" },
    { country: "PRY", code: "+595", sampleNumber: "748219635" },
    { country: "PER", code: "+51", sampleNumber: "695317842" },
    { country: "PHL", code: "+63", sampleNumber: "802369574" },
    { country: "POL", code: "+48", sampleNumber: "567830219" },
    { country: "PRT", code: "+351", sampleNumber: "248193756" },
    { country: "QAT", code: "+974", sampleNumber: "314562879" },
    { country: "ROU", code: "+40", sampleNumber: "753490182" },
    { country: "RUS", code: "+7", sampleNumber: "286437159" },
    { country: "RWA", code: "+250", sampleNumber: "497213685" },
    { country: "KNA", code: "+1-869", sampleNumber: "168923754" },
    { country: "LCA", code: "+1-758", sampleNumber: "537896241" },
    { country: "VCT", code: "+1-784", sampleNumber: "312567894" },
    { country: "WSM", code: "+685", sampleNumber: "458129736" },
    { country: "SMR", code: "+378", sampleNumber: "632174589" },
    { country: "STP", code: "+239", sampleNumber: "814276395" },
    { country: "SAU", code: "+966", sampleNumber: "293167548" },
    { country: "SEN", code: "+221", sampleNumber: "795381642" },
    { country: "SRB", code: "+381", sampleNumber: "348162790" },
    { country: "SYC", code: "+248", sampleNumber: "572841369" },
    { country: "SLE", code: "+232", sampleNumber: "619374852" },
    { country: "SGP", code: "+65", sampleNumber: "789512436" },
    { country: "SVK", code: "+421", sampleNumber: "123874569" },
    { country: "SVN", code: "+386", sampleNumber: "856279314" },
    { country: "SLB", code: "+677", sampleNumber: "912354678" },
    { country: "SOM", code: "+252", sampleNumber: "374825196" },
    { country: "ZAF", code: "+27", sampleNumber: "582693147" },
    { country: "SSD", code: "+211", sampleNumber: "941376258" },
    { country: "ESP", code: "+34", sampleNumber: "817645329" },
    { country: "LKA", code: "+94", sampleNumber: "509836172" },
    { country: "SDN", code: "+249", sampleNumber: "263478915" },
    { country: "SUR", code: "+597", sampleNumber: "587316294" },
    { country: "SWZ", code: "+268", sampleNumber: "194283756" },
    { country: "SWE", code: "+46", sampleNumber: "683124759" },
    { country: "CHE", code: "+41", sampleNumber: "719845362" },
    { country: "SYR", code: "+963", sampleNumber: "206385197" },
    { country: "TWN", code: "+886", sampleNumber: "478152396" },
    { country: "TJK", code: "+992", sampleNumber: "849721365" },
    { country: "TZA", code: "+255", sampleNumber: "530124986" },
    { country: "THA", code: "+66", sampleNumber: "210493876" },
    { country: "TLS", code: "+670", sampleNumber: "756983241" },
    { country: "TGO", code: "+228", sampleNumber: "938416752" },
    { country: "TON", code: "+676", sampleNumber: "614329587" },
    { country: "TTO", code: "+1-868", sampleNumber: "512943876" },
    { country: "TUN", code: "+216", sampleNumber: "763284915" },
    { country: "TUR", code: "+90", sampleNumber: "291538476" },
    { country: "TKM", code: "+993", sampleNumber: "734196258" },
    { country: "TUV", code: "+688", sampleNumber: "587142369" },
    { country: "UGA", code: "+256", sampleNumber: "139528476" },
    { country: "UKR", code: "+380", sampleNumber: "724193865" },
    { country: "ARE", code: "+971", sampleNumber: "416273589" },
    { country: "GBR", code: "+44", sampleNumber: "985637124" },
    { country: "USA", code: "+1", sampleNumber: "789345216" },
    { country: "URY", code: "+598", sampleNumber: "627491385" },
    { country: "UZB", code: "+998", sampleNumber: "351824796" },
    { country: "VUT", code: "+678", sampleNumber: "285731964" },
    { country: "VAT", code: "+379", sampleNumber: "813259476" },
    { country: "VEN", code: "+58", sampleNumber: "239465178" },
    { country: "VNM", code: "+84", sampleNumber: "769231548" },
    { country: "YEM", code: "+967", sampleNumber: "541798236" },
    { country: "ZMB", code: "+260", sampleNumber: "492716538" },
    { country: "ZWE", code: "+263", sampleNumber: "783492615" },
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

  const donationModalFooter = () => {
    return (
      <div className="donation-modal-footer">
        <span className="line"></span>
        <a href="https://algoralign.com/" target="_blank">
          {" "}
          <img
            src="https://svgshare.com/i/1C2z.svg"
            alt="Donation Icon"
            className="donation-icon"
          />
        </a>
        <span className="line"></span>
      </div>
    );
  };
  useEffect(() => {
    if (!error) {
      return; // Exit early if there's no error
    }

    const timeoutId = setTimeout(() => {
      setError(null); // Reset error after 5 seconds
    }, 5000);

    return () => clearTimeout(timeoutId); // Cleanup on unmount or error change
  }, [error]);

  const baseApiUrl =
    // "https://api.project.algoralign.com/api/v1/project-funding";
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
      // setTimeout(() => setError(null), 5000);
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

  const handleSelectCountryCode = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setSelectedCountry(value);
    setIsShowOtpInput(false);
    setOtp("");
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

    // when users click "enter" button the form submits, this is to check if the otp input is visisble then only call verifyOtp() function
    if (IsShowOtpInput) {
      verifyOtp();
      return;
    }

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
      // setTimeout(() => {
      //   setError(null);
      // }, 5000);
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setIsLoading(false);
      setError("Invalid phone number format.");
      // setTimeout(() => {
      //   setError(null);
      // }, 5000);
      return;
    }

    if (donationAmount === null || donationAmount <= 0) {
      setIsLoading(false);
      setError("Donation amount is required and must be greater than 0.");
      // setTimeout(() => {
      //   setError(null);
      // }, 5000);
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
        // setTimeout(() => setError(null), 5000);
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
      phone: selectedCountry + phoneNumber,
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
        // setTimeout(() => setError(null), 2000);
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

    // setTimeout(() => {
    //   setIsCopied(false);
    // }, 2000);
  }

  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds
  useEffect(() => {
    // Check if the current step allows the timer to run
    if (step !== "display-donation-accounts") {
      return; // Exit if the step is not valid
    }

    // Exit if there's no time left
    if (timeLeft <= 0) {
      setStep("donation-account-expired"); // Call the function when the time hits 0
      return;
    }

    // Create an interval to update the time left every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          setStep("donation-account-expired"); // Call the function when the time hits 0
          return 0; // Stop the timer
        }
        return prevTimeLeft - 1; // Decrement the time left
      });
    }, 1000);

    // Clear the interval when the component is unmounted or step/timeLeft changes
    return () => clearInterval(intervalId);
  }, [step, timeLeft]); // Added 'step' as a dependency

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
                onChange={handleSelectCountryCode}
              >
                {countryPhoneCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.country.slice(0, 2)} ({country.code})
                  </option>
                ))}
              </select>
              <input
                className="donation-modal-phone-input"
                type="text"
                placeholder={
                  countryPhoneCodes.find(
                    (item) => item.code === selectedCountry
                  )!.sampleNumber
                }
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
                  <a
                    href="https://algoralign.com/donation-liability-waiver"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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

          {donationModalFooter()}
        </form>
      )}

      {step === "display-donation-accounts" && donationAmount && (
        <div className="display-donation-accounts donation-modal-inner">
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
                <span>
                  {virtualAccount.data.bankName} (
                  {virtualAccount.data.beneficiary})
                </span>
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
              <p>
                <span>
                  NGN {new Intl.NumberFormat().format(donationAmount)}
                </span>
              </p>

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

          {donationModalFooter()}
        </div>
      )}

      {step === "donation-successful" && (
        <div className="donation-successful donation-modal-inner ">
          <div>
            <svg
              width="100"
              height="100"
              viewBox="0 0 161 161"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_3084_830)">
                <path
                  d="M161 80.5C161 36.0411 124.959 0 80.5 0C36.0411 0 0 36.0411 0 80.5C0 124.959 36.0411 161 80.5 161C124.959 161 161 124.959 161 80.5Z"
                  fill="#DBEAFE"
                />
                <path
                  d="M119.879 80.5C119.879 58.7517 102.248 41.1212 80.4999 41.1212C58.7516 41.1212 41.1211 58.7517 41.1211 80.5C41.1211 102.248 58.7516 119.879 80.4999 119.879C102.248 119.879 119.879 102.248 119.879 80.5Z"
                  fill="#BFDBFE"
                />
                <path
                  d="M75.6108 92.697L63.4243 80.8039L66.4709 77.8299L75.6108 86.7504L95.2263 67.606L98.2728 70.5793L75.6108 92.697Z"
                  fill="#3B82F6"
                />
              </g>
              <defs>
                <clipPath id="clip0_3084_830">
                  <rect width="161" height="161" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <h3 className="">Thank You for Your Donation!</h3>
            <p>Your support means a lot to us.</p>
          </div>
          <a
            href="https://donor.algoralign.com/"
            target="_blank"
            className="donation-modal-submit-btn"
          >
            Explore Your Donations ✨
          </a>
          {/* {donationModalFooter()} */}
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
            <svg
              className="donation-account-expired-svg"
              width="80"
              height="80"
              viewBox="0 0 151 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_3084_800)">
                <path
                  d="M151 75.5C151 33.8025 117.198 0 75.5 0C33.8025 0 0 33.8025 0 75.5C0 117.198 33.8025 151 75.5 151C117.198 151 151 117.198 151 75.5Z"
                  fill="#FEDBDC"
                />
                <path
                  d="M112.433 75.5C112.433 55.1025 95.8973 38.5671 75.4998 38.5671C55.1023 38.5671 38.5669 55.1025 38.5669 75.5C38.5669 95.8975 55.1023 112.433 75.4998 112.433C95.8973 112.433 112.433 95.8975 112.433 75.5Z"
                  fill="#FEBFC0"
                />
                <path
                  d="M74.029 79.9123H76.9706V82.8539H74.029V79.9123ZM74.029 68.1461H76.9706V76.9708H74.029V68.1461ZM75.4998 60.7922C67.366 60.7922 60.792 67.4107 60.792 75.5C60.792 79.4005 62.3415 83.1415 65.0998 85.9C66.4653 87.2656 68.0871 88.3494 69.8716 89.088C71.6555 89.8274 73.5682 90.2078 75.4998 90.2078C79.4003 90.2078 83.1413 88.6579 85.8998 85.9C88.6577 83.1415 90.2076 79.4005 90.2076 75.5C90.2076 73.5684 89.8271 71.6557 89.0878 69.8718C88.3492 68.0873 87.2654 66.4655 85.8998 65.1C84.5343 63.7343 82.9125 62.6509 81.128 61.9118C79.3441 61.1726 77.4314 60.7922 75.4998 60.7922ZM75.4998 87.2662C72.3791 87.2662 69.3866 86.0269 67.1798 83.82C64.9732 81.6132 63.7336 78.6207 63.7336 75.5C63.7336 72.3793 64.9732 69.3868 67.1798 67.18C69.3866 64.9734 72.3791 63.7338 75.4998 63.7338C78.6205 63.7338 81.613 64.9734 83.8198 67.18C86.0266 69.3868 87.266 72.3793 87.266 75.5C87.266 78.6207 86.0266 81.6132 83.8198 83.82C81.613 86.0269 78.6205 87.2662 75.4998 87.2662Z"
                  fill="#F63B3E"
                />
              </g>
              <defs>
                <clipPath id="clip0_3084_800">
                  <rect width="151" height="151" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <h3 className=""> Transaction Timeout!</h3>
            <p>
              Your payment session has expired. Please initiate a new session by
              clicking the button below.
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
          {donationModalFooter()}
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
            <div className="ive-sent-the-money-loader">
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
          {donationModalFooter()}
        </div>
      )}
    </div>
  );
};

export default AlgoralignDonationModal;
