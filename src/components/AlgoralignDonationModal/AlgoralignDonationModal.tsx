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
  // const [step, setStep] = useState<Step>("donation-successful");
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
          <svg
            className="donation-icon"
            width="166"
            height="23"
            viewBox="0 0 166 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.952 20.066V10.154H2.142L2.24 11.386C2.464 10.91 2.79533 10.5553 3.234 10.322C3.682 10.0793 4.17667 9.958 4.718 9.958C5.37133 9.958 5.936 10.112 6.412 10.42C6.888 10.7187 7.252 11.1387 7.504 11.68C7.76533 12.212 7.896 12.828 7.896 13.528C7.896 14.228 7.77 14.8533 7.518 15.404C7.27533 15.9547 6.916 16.3887 6.44 16.706C5.97333 17.0233 5.39933 17.182 4.718 17.182C4.16733 17.182 3.67733 17.07 3.248 16.846C2.81867 16.622 2.492 16.3 2.268 15.88V20.066H0.952ZM2.282 13.584C2.282 14.0413 2.366 14.4567 2.534 14.83C2.71133 15.194 2.95867 15.4787 3.276 15.684C3.60267 15.8893 3.99 15.992 4.438 15.992C4.886 15.992 5.26867 15.8893 5.586 15.684C5.90333 15.4693 6.146 15.18 6.314 14.816C6.49133 14.452 6.58 14.0413 6.58 13.584C6.58 13.108 6.49133 12.688 6.314 12.324C6.146 11.96 5.90333 11.6753 5.586 11.47C5.26867 11.2647 4.886 11.162 4.438 11.162C3.99 11.162 3.60267 11.2647 3.276 11.47C2.95867 11.6753 2.71133 11.96 2.534 12.324C2.366 12.688 2.282 13.108 2.282 13.584ZM8.89853 13.57C8.89853 12.87 9.05253 12.2493 9.36053 11.708C9.66853 11.1667 10.0885 10.742 10.6205 10.434C11.1619 10.126 11.7779 9.972 12.4685 9.972C13.1592 9.972 13.7705 10.126 14.3025 10.434C14.8345 10.742 15.2545 11.1667 15.5625 11.708C15.8705 12.2493 16.0245 12.87 16.0245 13.57C16.0245 14.27 15.8705 14.8907 15.5625 15.432C15.2545 15.9733 14.8345 16.398 14.3025 16.706C13.7705 17.014 13.1592 17.168 12.4685 17.168C11.7779 17.168 11.1619 17.014 10.6205 16.706C10.0885 16.398 9.66853 15.9733 9.36053 15.432C9.05253 14.8907 8.89853 14.27 8.89853 13.57ZM10.2285 13.57C10.2285 14.046 10.3219 14.466 10.5085 14.83C10.7045 15.194 10.9705 15.4787 11.3065 15.684C11.6425 15.8893 12.0299 15.992 12.4685 15.992C12.9072 15.992 13.2945 15.8893 13.6305 15.684C13.9665 15.4787 14.2279 15.194 14.4145 14.83C14.6105 14.466 14.7085 14.046 14.7085 13.57C14.7085 13.0847 14.6105 12.6647 14.4145 12.31C14.2279 11.946 13.9665 11.6613 13.6305 11.456C13.2945 11.2507 12.9072 11.148 12.4685 11.148C12.0299 11.148 11.6425 11.2507 11.3065 11.456C10.9705 11.6613 10.7045 11.946 10.5085 12.31C10.3219 12.6647 10.2285 13.0847 10.2285 13.57ZM18.6368 17L16.3968 10.154H17.7548L18.8888 13.71C18.9728 13.962 19.0475 14.2233 19.1128 14.494C19.1782 14.7553 19.2435 15.0353 19.3088 15.334C19.3462 15.1287 19.3882 14.9327 19.4348 14.746C19.4908 14.55 19.5468 14.368 19.6028 14.2C19.6588 14.0227 19.7102 13.8593 19.7568 13.71L20.9048 10.154H22.2488L23.3828 13.71C23.4202 13.794 23.4528 13.906 23.4808 14.046C23.5182 14.1767 23.5602 14.3167 23.6068 14.466C23.6535 14.6153 23.6955 14.7647 23.7328 14.914C23.7702 15.0633 23.8028 15.2033 23.8308 15.334C23.8682 15.1473 23.9055 14.97 23.9428 14.802C23.9895 14.6247 24.0362 14.452 24.0828 14.284C24.1388 14.1067 24.1995 13.9153 24.2648 13.71L25.4128 10.154H26.7848L24.4468 17H23.2008L22.0108 13.332C21.8988 12.9867 21.8055 12.6833 21.7308 12.422C21.6655 12.1513 21.6142 11.9227 21.5768 11.736C21.5395 11.904 21.4835 12.114 21.4088 12.366C21.3435 12.6087 21.2502 12.9353 21.1288 13.346L19.9388 17H18.6368ZM30.5525 17.168C29.8898 17.168 29.3018 17.0187 28.7885 16.72C28.2752 16.412 27.8738 15.992 27.5845 15.46C27.2952 14.9187 27.1505 14.2933 27.1505 13.584C27.1505 12.8653 27.2905 12.2353 27.5705 11.694C27.8598 11.1527 28.2518 10.728 28.7465 10.42C29.2505 10.112 29.8338 9.958 30.4965 9.958C31.1498 9.958 31.7145 10.098 32.1905 10.378C32.6758 10.658 33.0492 11.05 33.3105 11.554C33.5812 12.058 33.7165 12.6507 33.7165 13.332V13.822L27.8505 13.836L27.8785 12.954H32.4005C32.4005 12.3847 32.2278 11.9273 31.8825 11.582C31.5372 11.2367 31.0752 11.064 30.4965 11.064C30.0578 11.064 29.6798 11.162 29.3625 11.358C29.0545 11.5447 28.8165 11.8247 28.6485 12.198C28.4898 12.562 28.4105 13.0007 28.4105 13.514C28.4105 14.3353 28.5972 14.97 28.9705 15.418C29.3438 15.8567 29.8805 16.076 30.5805 16.076C31.0938 16.076 31.5138 15.9733 31.8405 15.768C32.1672 15.5627 32.3865 15.264 32.4985 14.872H33.7305C33.5625 15.6 33.2032 16.1647 32.6525 16.566C32.1018 16.9673 31.4018 17.168 30.5525 17.168ZM39.1064 10.098V11.302H38.5184C37.893 11.302 37.3984 11.484 37.0344 11.848C36.6797 12.2027 36.5024 12.7113 36.5024 13.374V17H35.1864V10.168H36.4184L36.5304 11.54H36.4044C36.4977 11.092 36.7217 10.728 37.0764 10.448C37.431 10.1587 37.8744 10.014 38.4064 10.014C38.5277 10.014 38.6397 10.0233 38.7424 10.042C38.8544 10.0513 38.9757 10.07 39.1064 10.098ZM43.0486 17.168C42.3859 17.168 41.7979 17.0187 41.2846 16.72C40.7712 16.412 40.3699 15.992 40.0806 15.46C39.7912 14.9187 39.6466 14.2933 39.6466 13.584C39.6466 12.8653 39.7866 12.2353 40.0666 11.694C40.3559 11.1527 40.7479 10.728 41.2426 10.42C41.7466 10.112 42.3299 9.958 42.9926 9.958C43.6459 9.958 44.2106 10.098 44.6866 10.378C45.1719 10.658 45.5452 11.05 45.8066 11.554C46.0772 12.058 46.2126 12.6507 46.2126 13.332V13.822L40.3466 13.836L40.3746 12.954H44.8966C44.8966 12.3847 44.7239 11.9273 44.3786 11.582C44.0332 11.2367 43.5712 11.064 42.9926 11.064C42.5539 11.064 42.1759 11.162 41.8586 11.358C41.5506 11.5447 41.3126 11.8247 41.1446 12.198C40.9859 12.562 40.9066 13.0007 40.9066 13.514C40.9066 14.3353 41.0932 14.97 41.4666 15.418C41.8399 15.8567 42.3766 16.076 43.0766 16.076C43.5899 16.076 44.0099 15.9733 44.3366 15.768C44.6632 15.5627 44.8826 15.264 44.9946 14.872H46.2266C46.0586 15.6 45.6992 16.1647 45.1486 16.566C44.5979 16.9673 43.8979 17.168 43.0486 17.168ZM50.4265 17.168C49.7638 17.168 49.1945 17.0187 48.7185 16.72C48.2425 16.412 47.8738 15.9873 47.6125 15.446C47.3605 14.9047 47.2345 14.2887 47.2345 13.598C47.2345 12.898 47.3651 12.2773 47.6265 11.736C47.8878 11.1853 48.2611 10.7513 48.7465 10.434C49.2318 10.1167 49.8105 9.958 50.4825 9.958C51.0145 9.958 51.4858 10.07 51.8965 10.294C52.3165 10.5087 52.6431 10.8307 52.8765 11.26V6.696H54.1785V17H53.0025L52.8905 15.754C52.6665 16.2113 52.3351 16.5613 51.8965 16.804C51.4671 17.0467 50.9771 17.168 50.4265 17.168ZM50.6925 15.978C51.1405 15.978 51.5231 15.8753 51.8405 15.67C52.1671 15.4647 52.4191 15.18 52.5965 14.816C52.7738 14.452 52.8625 14.032 52.8625 13.556C52.8625 13.08 52.7738 12.6647 52.5965 12.31C52.4191 11.946 52.1671 11.6613 51.8405 11.456C51.5231 11.2507 51.1405 11.148 50.6925 11.148C50.2445 11.148 49.8618 11.2553 49.5445 11.47C49.2271 11.6753 48.9845 11.96 48.8165 12.324C48.6485 12.6787 48.5645 13.0893 48.5645 13.556C48.5645 14.032 48.6485 14.452 48.8165 14.816C48.9845 15.18 49.2271 15.4647 49.5445 15.67C49.8618 15.8753 50.2445 15.978 50.6925 15.978ZM61.0951 17H59.9051V6.696H61.2211V11.33C61.4451 10.882 61.7765 10.5413 62.2151 10.308C62.6538 10.0747 63.1531 9.958 63.7131 9.958C64.3665 9.958 64.9265 10.1167 65.3931 10.434C65.8598 10.742 66.2191 11.1713 66.4711 11.722C66.7231 12.2727 66.8491 12.9027 66.8491 13.612C66.8491 14.2933 66.7185 14.9047 66.4571 15.446C66.1958 15.9873 65.8225 16.412 65.3371 16.72C64.8611 17.0187 64.2918 17.168 63.6291 17.168C63.0971 17.168 62.6118 17.0467 62.1731 16.804C61.7438 16.5613 61.4171 16.2113 61.1931 15.754L61.0951 17ZM61.2351 13.556C61.2351 14.032 61.3191 14.452 61.4871 14.816C61.6645 15.18 61.9118 15.4647 62.2291 15.67C62.5558 15.8753 62.9431 15.978 63.3911 15.978C63.8391 15.978 64.2218 15.8753 64.5391 15.67C64.8565 15.4647 65.0991 15.18 65.2671 14.816C65.4445 14.452 65.5331 14.032 65.5331 13.556C65.5331 13.0893 65.4445 12.6787 65.2671 12.324C65.0991 11.96 64.8565 11.6753 64.5391 11.47C64.2218 11.2553 63.8391 11.148 63.3911 11.148C62.9431 11.148 62.5558 11.2507 62.2291 11.456C61.9118 11.6613 61.6645 11.946 61.4871 12.31C61.3191 12.6647 61.2351 13.08 61.2351 13.556ZM68.6132 10.154L71.0212 16.818L70.2092 17.938L67.2272 10.154H68.6132ZM67.4092 20.066V18.988H68.2912C68.5059 18.988 68.7019 18.9647 68.8792 18.918C69.0566 18.8807 69.2199 18.792 69.3692 18.652C69.5186 18.5213 69.6446 18.3113 69.7472 18.022L72.6312 10.154H73.9892L70.7552 18.54C70.5219 19.128 70.2279 19.5527 69.8732 19.814C69.5186 20.0753 69.0799 20.206 68.5572 20.206C68.3426 20.206 68.1419 20.192 67.9552 20.164C67.7686 20.1453 67.5866 20.1127 67.4092 20.066Z"
              fill="#525252"
            />
            <path
              d="M98.7156 11.3835C98.7157 15.9851 94.9853 19.7155 90.3837 19.7155C85.7821 19.7155 82.0517 15.9851 82.0517 11.3835C82.0517 6.7819 85.7821 3.05159 90.3837 3.05156C94.9854 3.05158 98.7157 6.78188 98.7156 11.3835Z"
              fill="#2772F0"
            />
            <path
              d="M92.8338 13.7402C92.7673 13.734 92.7256 13.7268 92.6836 13.7268C90.3074 13.7283 87.9315 13.7307 85.5553 13.7299C85.459 13.7299 85.4038 13.7602 85.3558 13.8444C85.0837 14.3243 84.805 14.8007 84.5292 15.2783C84.508 15.3151 84.5392 15.3618 84.5816 15.3641C84.5985 15.365 84.6146 15.3657 84.6307 15.3657C86.7028 15.3669 88.7749 15.3652 90.847 15.3702C91.5478 15.3719 92.0641 15.0678 92.4167 14.4706C92.5367 14.2676 92.6551 14.0635 92.7736 13.8595C92.7911 13.8293 92.8053 13.7972 92.8338 13.7402Z"
              fill="white"
            />
            <path
              d="M85.8778 12.96C85.8777 12.9601 85.8778 12.9603 85.8779 12.9602C85.917 12.9655 85.9361 12.9703 85.955 12.9703C87.1623 12.9708 88.3696 12.9818 89.5767 12.9662C90.2242 12.9578 90.7036 12.6312 91.0309 12.0775C91.161 11.8574 91.2899 11.6368 91.4188 11.416C91.438 11.3831 91.4101 11.3406 91.3725 11.3347C91.3522 11.3315 91.3329 11.3292 91.3137 11.3294C89.8505 11.3295 88.3874 11.3315 86.924 11.3305C86.8316 11.3305 86.7843 11.3646 86.7389 11.4457C86.4727 11.9195 86.1989 12.389 85.9279 12.8599C85.9126 12.8865 85.9003 12.9148 85.8778 12.96C85.8778 12.96 85.8778 12.96 85.8778 12.96Z"
              fill="white"
            />
            <path
              d="M90.0523 8.94989L90.0521 8.94985C90.0022 8.94645 89.9679 8.94197 89.9335 8.94193C89.3862 8.9419 88.8389 8.94 88.2917 8.94598C88.2396 8.94646 88.1648 8.98296 88.1395 9.02591C87.8551 9.50713 87.5781 9.99272 87.2997 10.4773C87.278 10.5151 87.3099 10.5633 87.3533 10.5675C87.3697 10.5691 87.3854 10.5701 87.4012 10.5702C87.641 10.5711 87.8805 10.5725 88.1203 10.5702C88.7614 10.5642 89.2583 10.2918 89.6012 9.75056C89.7443 9.52462 89.8725 9.28944 90.0061 9.05782C90.0232 9.02839 90.0334 8.99485 90.0523 8.95013L90.0523 8.94989Z"
              fill="white"
            />
            <path
              d="M90.9509 5.73999C90.7766 5.42852 90.3312 5.4204 90.1455 5.72522L89.4329 6.89501C89.3441 7.04083 89.3421 7.2236 89.4275 7.37146L93.8559 15.0212C93.9397 15.166 94.0947 15.2548 94.262 15.254L95.4818 15.2481C95.8372 15.2463 96.0602 14.8638 95.8866 14.5536L90.9509 5.73999Z"
              fill="white"
            />
            <path
              d="M103.607 15.5H101.767L105.324 6.75271C105.585 6.13477 105.9 5.764 106.587 5.764C107.26 5.764 107.562 6.1073 107.823 6.73898L109.333 10.4466C109.567 11.0097 109.43 11.4079 108.935 11.4079H108.908V11.6001H108.935C109.43 11.6001 109.883 11.8336 110.061 12.273L111.421 15.5H109.581L108.606 12.8086C108.51 12.5476 108.125 12.3691 107.85 12.3691H104.843L103.607 15.5ZM106.573 8.01606L105.447 10.941H107.397C107.617 10.941 107.672 10.8311 107.589 10.6114L106.697 8.01606H106.573ZM112.485 15.5138V5.10486H114.092V15.5138H112.485ZM115.562 12.1082C115.562 9.80124 116.428 8.96358 118.611 8.96358C119.696 8.96358 120.328 9.16956 120.726 9.4854H120.794L121 9.03224L122.346 9.1009V15.7198C122.346 18.0817 121.289 19.0155 118.721 19.0155C118.034 19.0155 116.936 18.8369 115.947 18.4524L116.331 16.9145C117.279 17.4088 118.144 17.5873 118.748 17.5873C120.149 17.5873 120.739 17.3676 120.739 15.9395V15.8159C120.739 15.5275 121.028 15.2941 121.261 15.2941H121.55V15.1155H121.206L118.542 15.5C116.345 15.5 115.562 14.3191 115.562 12.1082ZM117.183 12.1631C117.183 13.6599 117.663 14.1406 118.982 14.1406L120.739 13.8247V10.7488C120.218 10.4329 119.586 10.3093 118.886 10.3093C117.663 10.3093 117.183 10.6801 117.183 12.1631ZM123.72 12.3005C123.72 9.76004 124.626 8.94985 127.359 8.94985C130.091 8.94985 130.902 9.77377 130.902 12.3005C130.902 14.8409 130.078 15.6511 127.345 15.6511C124.612 15.6511 123.72 14.8272 123.72 12.3005ZM125.285 12.3279C125.285 13.9209 125.876 14.2642 127.331 14.2642C128.869 14.2642 129.336 13.8797 129.336 12.3279C129.336 10.7213 128.828 10.3368 127.386 10.3368C125.835 10.3368 125.285 10.7762 125.285 12.3279ZM132.397 15.5138V12.2181C132.397 10.0896 133.757 9.00477 136.434 9.00477H136.888L136.654 10.4878H135.693C134.539 10.4878 134.004 10.9547 134.004 12.2043V15.5138H132.397ZM137.527 13.5226C137.527 12.2181 138.254 11.4628 139.779 11.4628H142.347V11.3255H142.058C141.893 11.3255 141.77 11.2019 141.77 11.0509V10.6938C141.77 10.3368 141.536 10.2544 141.152 10.2544L138.158 10.4466L138.282 9.36181C138.309 9.19702 138.405 9.11463 138.611 9.1009L141.523 8.88119C142.58 8.88119 143.39 9.59525 143.39 10.9135V15.5138H141.921L141.852 15.2803H141.77C141.317 15.4589 140.726 15.5824 140.012 15.5824C138.46 15.5824 137.527 15.0194 137.527 13.5226ZM141.797 14.1955V12.63H139.902C139.367 12.63 139.092 12.9596 139.092 13.605C139.092 14.223 139.367 14.4015 139.998 14.4015H141.591C141.756 14.4015 141.797 14.3603 141.797 14.1955ZM144.777 15.5138V5.10486H146.384V15.5138H144.777ZM148.445 9.1009H150.052V15.5H148.445V9.1009ZM148.266 6.64285C148.266 5.95625 148.5 5.77773 149.269 5.77773C150.038 5.77773 150.244 5.95625 150.244 6.67032C150.244 7.38439 150.038 7.6041 149.296 7.6041C148.541 7.6041 148.266 7.38439 148.266 6.64285ZM151.649 12.1082C151.649 9.80124 152.515 8.96358 154.698 8.96358C155.783 8.96358 156.415 9.16956 156.813 9.4854H156.881L157.087 9.03224L158.433 9.1009V15.7198C158.433 18.0817 157.376 19.0155 154.808 19.0155C154.121 19.0155 153.023 18.8369 152.034 18.4524L152.418 16.9145C153.366 17.4088 154.231 17.5873 154.835 17.5873C156.236 17.5873 156.826 17.3676 156.826 15.9395V15.8159C156.826 15.5275 157.115 15.2941 157.348 15.2941H157.637V15.1155H157.293L154.629 15.5C152.432 15.5 151.649 14.3191 151.649 12.1082ZM153.27 12.1631C153.27 13.6599 153.75 14.1406 155.069 14.1406L156.826 13.8247V10.7488C156.305 10.4329 155.673 10.3093 154.973 10.3093C153.75 10.3093 153.27 10.6801 153.27 12.1631ZM159.985 9.11463H161.317L161.592 9.51286H161.661C162.265 9.21076 163.048 8.97731 163.817 8.97731C165.245 8.97731 166 9.80124 166 11.0646V15.5138H164.407V11.7375C164.407 10.6664 164.105 10.3368 163.267 10.3368C162.292 10.3368 161.688 10.7899 161.592 10.8998V15.5138H159.985V9.11463Z"
              fill="black"
            />
          </svg>
          {/* <img
            src="https://svgshare.com/i/1C2z.svg"
            alt="Donation Icon"
            className="donation-icon"
          /> */}
        </a>
        <span className="line"></span>
      </div>
    );
  };

  useEffect(() => {
    if (step === "donation-successful") {
      setInterval(() => {
        window.location.href = "https://donor.algoralign.com/";
      }, 5000);
    }
  }, [step]);
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
    "https://api.project.algoralign.com/api/v1/project-funding";
  // "https://dev.api.project.algoralign.com/api/v1/project-funding";
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
          <p className="redirect-to-dashboard">
            <img src="https://s11.gifyu.com/images/SOdia.gif" />
            redirecting to donor dashboard
          </p>
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
