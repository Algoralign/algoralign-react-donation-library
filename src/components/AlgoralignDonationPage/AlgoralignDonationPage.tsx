import React, { FC, ReactNode, useState, useEffect } from "react";
import "./algoralignDonationPage.css";
// import AlgoralignDonationButton from "../AlgoralignDonationButton";
import AlgoralignDonationModal from "../AlgoralignDonationModal";
import DisplayProjectDescription from "../DisplayProjectDescription";

interface Props {
  projectId: String;
  xAlgoralignKey: String;
}

interface ProjectResponse {
  status: boolean;
  statusCode: number;
  data: {
    project: {
      id: string;
      name: string;
      donationRecipent: string;
      donationCurrency: string;
      donorsPartOfOrg: string;
      requiresAnApi: string;
      fundingTarget: number;
      fundingEndsOnTargetReached: string;
      accessFundsBeforeReachingTarget: string;
      donorsCanVoteOnRefund: string;
      percentageOfVote: number;
      requireMultiSignforFlowOfFunds: string;
      nubanCreated: string;
      orgRegistered: string;
      donorSignatureValidforMultiSignforFlowOfFunds: string;
      projectCreateStatus: string;
      projectVisibilityStatus: string;
      typeOfAuthenticationRequired: string;
      projectStatus: string;
      projectStartDate: string;
      projectEndDate: string;
      donationUrl: string;
      description: string;
      imageUrl: string;
      createdAt: string;
      fiatSetting: {
        id: string;
        name: string;
        accountNumber: string;
        accountNumberVerified: boolean;
        servicePaid: boolean;
        createdAt: string;
        updatedAt: string;
        bank: {
          id: string;
          name: string;
          code: string;
        };
        currencySymbol: {
          id: string;
          name: string;
        };
      };
      projectType: {
        id: string;
        name: string;
      };
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
      company: {
        id: string;
        name: string;
        uploadedDocument: boolean;
        accountVerified: boolean;
      };
    };
    projectDuration: number;
    totalFundsRecieved: number;
    totalNumberOfDonations: number;
    fundAccessPhases: {
      initial: string;
      intermediate: string;
      full: string;
    };
  };
  message: string;
}

const AlgoralignDonationPage: FC<Props> = ({ projectId, xAlgoralignKey }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state
  const [data, setData] = useState<ProjectResponse | null>(null); // State to hold the fetched data
  const [error, setError] = useState<string | null>(null);

  const [isShowDonationModal, setIsShowDonationModal] =
    useState<boolean>(false);

  const getBaseUrl = (): string => {
    if (typeof window !== "undefined") {
      const { protocol, host } = window.location;
      return `${protocol}//${host}`;
    }
    return ""; // Return empty string if window is not defined
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://dev.api.project.algoralign.com/api/v1/project-funding/retrieve-project?projectId=${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-algoralign-key": xAlgoralignKey as string,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: ProjectResponse = await response.json(); // Type the result
        setData(result); // Set the fetched data to state
        setIsLoading(false); // Stop loading after data is fetched
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Handle any errors
        } else {
          setError("An unknown error occurred."); // Handle non-Error exceptions
        }
        setIsLoading(false); // Stop loading if there's an error
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts
  }, [projectId]); // Include projectId in the dependency array

  // Assuming ProjectResponse is already defined with the appropriate structure
  const displayDonationButton = () => {
    // Check if data is null or undefined
    if (!data || !data.data || !data.data.project) {
      return null; // Or return a loading/error state
    }

    if (data?.data?.project.projectStatus === "running") {
      return (
        <>
          <div className="project-status-container">
            <span className="funds-raised">
              &#8358;{data.data.totalFundsRecieved || 0}
            </span>{" "}
            <span>
              raised of{" "}
              <span className="funds-target">
                &#8358;{data.data.project.fundingTarget}
              </span>{" "}
              target
            </span>
          </div>

          {/* Donation percentage indicator */}
          <div className="donation-percentage-container">
            <div
              className="donation-percentage"
              style={{
                width: `${
                  (data.data.totalFundsRecieved /
                    data.data.project.fundingTarget) *
                  100
                }%`,
                maxWidth: "100%",
              }}
            >
              {Math.round(
                (data.data.totalFundsRecieved /
                  data.data.project.fundingTarget) *
                  100
              )}
              %
            </div>
          </div>

          <div className="project-ended-notification">
            <svg
              stroke="currentColor"
              className="error-icon"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            {/* Replace with your SVG icon here */}
            <h3 className="text-md font-medium">THIS PROJECT HAS ENDED</h3>
            <p className="text-sm">
              You currently can't donate as this project has ended.
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="project-status-container">
            <span className="funds-raised">
              &#8358;
              {new Intl.NumberFormat().format(data.data.totalFundsRecieved) ||
                0}
            </span>{" "}
            <span>
              raised of{" "}
              <span className="funds-target">
                &#8358;
                {new Intl.NumberFormat().format(
                  data.data.project.fundingTarget
                )}
              </span>{" "}
              target
            </span>
          </div>

          {/* Donation percentage indicator */}
          <div className="donation-percentage-container">
            <div
              className="donation-percentage"
              style={{
                width: `${
                  (data.data.totalFundsRecieved /
                    data.data.project.fundingTarget) *
                  100
                }%`,
                maxWidth: "100%",
              }}
            >
              {Math.round(
                (data.data.totalFundsRecieved /
                  data.data.project.fundingTarget) *
                  100
              )}
              %
            </div>
          </div>

          <button
            onClick={() => setIsShowDonationModal(true)}
            className="donation-button"
          >
            Donate Now
          </button>
        </>
      );
    }
  };

  if (isLoading) {
    return (
      <section className="donation-page-loader ">
        <img src="https://s11.gifyu.com/images/SOdia.gif" />
      </section>
    );
  }
  return (
    <>
      <section className="donation-page">
        {isShowDonationModal && (
          <AlgoralignDonationModal
            setIsShowDonationModal={setIsShowDonationModal}
            projectId={projectId}
            xAlgoralignKey={xAlgoralignKey}
          />
        )}

        {/* <Algor */}
        <div className="donation-page-container">
          <div className="donation-page-content">
            <div className="donation-page-section-1">
              <img
                src={data?.data.project.imageUrl || "/Section.png"}
                alt=""
                className="project-image"
              />
              <button className="user-button">
                <span>
                  {data?.data.project.user.firstName[0] +
                    data!.data.project.user.lastName[0]}
                </span>
              </button>
              <span className="organizer-text">
                @
                {data?.data.project.user.firstName +
                  " " +
                  data?.data.project.user.lastName}{" "}
                is organizing this fundraiser
              </span>
              <h2 className="project-title">{data?.data.project.name}</h2>
              <div className="donation-init-mobile">
                {displayDonationButton()}
                {/* <DonationInit
      isLoggedIn={isLoggedIn}
      isLoading={isLoading}
      data={data}
      setIsShowDonationModal={setIsShowDonationModal}
    /> */}
              </div>
              <div>
                <DisplayProjectDescription
                  description={data!.data.project.description}
                />
              </div>
            </div>

            <div className="project-transparency-index-container">
              <h2 className="project-transparency-index-title">
                Project Transparency Index
              </h2>
              <p className="project-transparency-index-description">
                Before you donate, heres what you need to know
              </p>

              <div className="basic-details-container">
                <div className="basic-details-card">
                  <div className="card-header">
                    <h3 className="card-title">Basic Details</h3>
                  </div>
                  <div className="card-content">
                    <p className="card-content-item">
                      <span className="item-title">Recipient</span>
                      <span>{data?.data.project.donationRecipent}</span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Status</span>
                      <span>
                        {data?.data.project.projectStatus !== "running" ? (
                          <span className="status-label ended">Ended</span>
                        ) : (
                          <span className="status-label running">Running</span>
                        )}
                      </span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Visibility</span>
                      <span>Public</span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Start Date</span>
                      <span>
                        {new Date(
                          data!.data.project.projectStartDate
                        ).toDateString()}
                      </span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">End Date</span>
                      <span>
                        {new Date(
                          data!.data.project.projectEndDate
                        ).toDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="fiat-setting-card">
                  <div className="card-header">
                    <h3 className="card-title">Fiat Setting</h3>
                  </div>
                  <div className="card-content">
                    <p className="card-content-item">
                      <span className="item-title">Currency Type</span>
                      <span>
                        {data?.data.project.fiatSetting.currencySymbol.name}
                      </span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Account Name</span>
                      <span>{data?.data.project.fiatSetting.name}</span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Account Number</span>
                      <span>
                        {data?.data.project.fiatSetting.accountNumber}
                      </span>
                    </p>
                    <p className="card-content-item">
                      <span className="item-title">Bank</span>
                      <span>{data?.data.project.fiatSetting.bank.name}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="preferences">
                {/* Preferences Section */}
                <div className="preferences-card">
                  <div className="preferences-header">
                    <h3 className="preferences-title">Preferences</h3>
                  </div>

                  {/* Access Funds Before Reaching Target */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className="preferences-section-icon">
                        {" "}
                        <svg
                          width="31"
                          height="31"
                          viewBox="0 0 31 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="29"
                            height="29"
                            rx="14.5"
                            stroke="#D4D4D8"
                            strokeWidth="2"
                          />
                          <path
                            d="M11.25 22C10.9062 22 10.6121 21.8696 10.3675 21.6087C10.1229 21.3478 10.0004 21.0338 10 20.6667V14C10 13.6333 10.1225 13.3196 10.3675 13.0587C10.6125 12.7978 10.9067 12.6671 11.25 12.6667H11.875V11.3333C11.875 10.4111 12.1798 9.62511 12.7894 8.97533C13.399 8.32556 14.1358 8.00044 15 8C15.8642 7.99956 16.6012 8.32467 17.2112 8.97533C17.8212 9.626 18.1258 10.412 18.125 11.3333V12.6667H18.75C19.0937 12.6667 19.3881 12.7973 19.6331 13.0587C19.8781 13.32 20.0004 13.6338 20 14V20.6667C20 21.0333 19.8777 21.3473 19.6331 21.6087C19.3885 21.87 19.0942 22.0004 18.75 22H11.25ZM15 18.6667C15.3437 18.6667 15.6381 18.5362 15.8831 18.2753C16.1281 18.0144 16.2504 17.7004 16.25 17.3333C16.2496 16.9662 16.1273 16.6524 15.8831 16.392C15.639 16.1316 15.3446 16.0009 15 16C14.6554 15.9991 14.3612 16.1298 14.1175 16.392C13.8737 16.6542 13.7512 16.968 13.75 17.3333C13.7487 17.6987 13.8712 18.0127 14.1175 18.2753C14.3637 18.538 14.6579 18.6684 15 18.6667ZM13.125 12.6667H16.875V11.3333C16.875 10.7778 16.6927 10.3056 16.3281 9.91667C15.9635 9.52778 15.5208 9.33333 15 9.33333C14.4792 9.33333 14.0365 9.52778 13.6719 9.91667C13.3073 10.3056 13.125 10.7778 13.125 11.3333V12.6667Z"
                            fill="#D4D4D8"
                          />
                        </svg>
                      </p>
                      <div className="preferences-section-content">
                        <span className="preferences-section-title">
                          Access Funds Before Reaching Target?
                        </span>
                        <span className="preferences-section-text">
                          {data?.data.project
                            .accessFundsBeforeReachingTarget === "yes"
                            ? "Yes, funds can be accessed by project creator even before target is reached."
                            : "No, funds can't be accessed by project creator even before target is reached."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fundraise Stops Once Funding Target Is Hit */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className="preferences-section-icon">
                        {" "}
                        <svg
                          width="31"
                          height="31"
                          viewBox="0 0 31 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_2398_1640)">
                            <path
                              d="M16 7C11.0299 7 7 11.0299 7 16C7 20.9701 11.0299 25 16 25C20.9701 25 25 20.9701 25 16C25 11.0299 20.9701 7 16 7ZM20.717 21.7958L10.2042 11.283C10.5257 10.8873 10.8873 10.5257 11.283 10.2042L21.7958 20.717C21.4743 21.1107 21.1127 21.4743 20.717 21.7958Z"
                              fill="#D4D4D8"
                            />
                          </g>
                          <rect
                            x="1"
                            y="1"
                            width="29"
                            height="29"
                            rx="14.5"
                            stroke="#D4D4D8"
                            strokeWidth="2"
                          />
                          <defs>
                            <clipPath id="clip0_2398_1640">
                              <rect
                                x="2"
                                y="2"
                                width="27"
                                height="27"
                                rx="13.5"
                                fill="white"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </p>
                      <div className="preferences-section-content">
                        <span className="preferences-section-title">
                          Fundraise stops once funding target is hit?
                        </span>
                        <span className="preferences-section-text">
                          {data?.data.project.fundingEndsOnTargetReached ===
                          "yes"
                            ? "Yes, fundraise is stopped once project target is reached."
                            : "No, fundraise is not stopped once project target is reached."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Percentage Votes Required to Conclude Proposals */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className="preferences-section-icon">
                        <svg
                          width="29"
                          height="29"
                          viewBox="0 0 29 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="28"
                            height="28"
                            rx="14"
                            stroke="#D0D0D0"
                          />
                          <path
                            d="M14 14.9167C16.025 14.9167 17.6666 13.2751 17.6666 11.25C17.6666 9.22497 16.025 7.58334 14 7.58334C11.9749 7.58334 10.3333 9.22497 10.3333 11.25C10.3333 13.2751 11.9749 14.9167 14 14.9167Z"
                            fill="#D0D0D0"
                          />
                          <path
                            d="M18.5833 14C20.1021 14 21.3333 12.7688 21.3333 11.25C21.3333 9.73122 20.1021 8.5 18.5833 8.5C17.0645 8.5 15.8333 9.73122 15.8333 11.25C15.8333 12.7688 17.0645 14 18.5833 14Z"
                            fill="#D0D0D0"
                          />
                          <path
                            d="M9.41669 14C10.9355 14 12.1667 12.7688 12.1667 11.25C12.1667 9.73122 10.9355 8.5 9.41669 8.5C7.8979 8.5 6.66669 9.73122 6.66669 11.25C6.66669 12.7688 7.8979 14 9.41669 14Z"
                            fill="#D0D0D0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.1049 19.5H21.2371C21.7798 19.5 22.195 19.0325 22.0639 18.5063C21.7257 17.1588 20.8274 14.9167 18.5834 14.9167C17.7712 14.9167 17.135 15.21 16.6382 15.65C18.0205 16.5456 18.7355 18.1158 19.1049 19.5ZM11.3619 15.65C10.8294 15.1686 10.1344 14.9067 9.41669 14.9167C7.17269 14.9167 6.27436 17.1588 5.93611 18.5063C5.80503 19.0325 6.22028 19.5 6.76294 19.5H8.89603C9.26544 18.1158 9.97953 16.5456 11.3619 15.65Z"
                            fill="#D0D0D0"
                          />
                          <path
                            d="M14 15.8333C17.3999 15.8333 18.2772 18.8593 18.5045 20.4222C18.5778 20.9236 18.1727 21.3333 17.6667 21.3333H10.3333C9.82732 21.3333 9.42307 20.9236 9.49548 20.4222C9.72282 18.8593 10.6001 15.8333 14 15.8333Z"
                            fill="#D0D0D0"
                          />
                        </svg>
                      </p>
                      <div className="preferences-section-content">
                        <span className="preferences-section-title">
                          Percentage Votes required to conclude proposals
                        </span>
                        <span className="preferences-section-text">
                          {data?.data.project.percentageOfVote}% vote criteria
                          need to be met before proposals are concluded.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fund Access Phases Section */}
                <div className="preferences-card">
                  <div className="preferences-header">
                    <h3 className="preferences-title">Fund Access Phases</h3>
                  </div>

                  {/* Initial Access */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className={`access-phase access-phase-active`}>10%</p>
                      <div className="access-phase-content">
                        <p className="access-phase-title">
                          <span className="preferences-section-title">
                            Initial Access
                          </span>
                          {/* <span className="access-phase-tag">Active</span> */}
                        </p>
                        <p className="access-phase-text">
                          10% of funds can be withdrawn.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Intermediate Access */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className={`access-phase access-phase-inactive`}>
                        40%
                      </p>
                      <div className="access-phase-content">
                        <p className="access-phase-title">
                          <span className="preferences-section-title">
                            Intermediate Access
                          </span>
                        </p>
                        <p className="access-phase-text">
                          40% of funds can be withdrawn.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Access */}
                  <div className="preferences-description">
                    <div className="preferences-section">
                      <p className={`access-phase access-phase-inactive`}>
                        100%
                      </p>
                      <div className="access-phase-content">
                        <p className="access-phase-title">
                          <span className="preferences-section-title">
                            Full Access
                          </span>
                        </p>
                        <p className="access-phase-text">
                          100% of funds can be withdrawn.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* SHARE */}
              {data?.data.project.projectStatus === "running" && (
                <div className="preferences-container">
                  <div className="preferences-button-container">
                    <button
                      onClick={() => setIsShowDonationModal(true)}
                      className="preferences-donate-button"
                    >
                      Donate Now
                    </button>
                  </div>

                  <div className="preferences-share-container">
                    <div className="preferences-share-flex">
                      <span className="preferences-share-text">Share:</span>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${getBaseUrl()}/donate/${
                          data.data.project.id
                        }`}
                        target="_blank"
                        className="preferences-share-icon"
                        rel="noreferrer"
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
                          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                        </svg>
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${getBaseUrl()}/donate/${
                          data.data.project.id
                        }`}
                        target="_blank"
                        className="preferences-share-icon"
                        rel="noreferrer"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 320 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                        </svg>
                      </a>
                      <a
                        href={`http://www.linkedin.com/shareArticle?mini=true&url=${getBaseUrl()}/donate/${
                          data.data.project.id
                        }`}
                        target="_blank"
                        className="preferences-share-icon"
                        rel="noreferrer"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 448 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.3-32.3-32-32.3zM151.3 480H85.7V288h65.6v192zm-32.8-219.2c-21.4 0-34.6-14.2-34.6-32.1 0-18.3 13.5-32.1 34.5-32.1 21.3 0 34.6 13.8 34.6 32.1 0 17.8-13.3 32.1-34.6 32.1zM416 480h-65.6V358.1c0-29.6-10.5-49.7-36.8-49.7-19.9 0-31.6 13.4-36.8 26.4-1.9 4.6-2.4 11.1-2.4 17.6V480h-65.6V288h65.6v27.8c8.7-13.4 24.5-32.4 59.6-32.4 43.5 0 76.7 28.4 76.7 89.3V480z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {/*  */}
              <div className="protect-summary-container">
                <div className="protect-summary-header">
                  <h3 className="protect-summary-title">
                    {/* <FaShield /> */}
                    In Summary, here&apos;s how Algoralign Protects you
                  </h3>
                </div>
                <ul className="protect-summary-list">
                  <li className="protect-summary-list-item">
                    Your donations are protected in accordance with the settings
                    above. We can&apos;t change it, project creator can&apos;t
                    change it, only way to change it is via a proposal which you
                    can sponsor and will always have the opportunity and right
                    to vote on.
                  </li>
                  <li className="protect-summary-list-item">
                    We may be able to process a refund for you at anytime,
                    should you not be happy with the usage of funds. How? Every
                    time a disbursement request is submitted by project creator,
                    they will be required to share proof of execution on
                    previous tranche. Disbursement will be frozen for 24 hours
                    giving you ample time to review proof and decide if it
                    aligns with promises made around use of funds.
                  </li>
                  <li className="protect-summary-list-item">
                    You may be able to change certain aspects of the project
                    settings by sponsoring a proposal for vote by fellow donors.
                    Please check if the project team allows that.
                  </li>
                </ul>
              </div>

              {/*  */}
            </div>
          </div>{" "}
          <div className="donation-page-sidebar">
            <div className="donation-sidebar-inner">
              {/* <FabricCanvas projectId={projectId} /> */}
              {/* <button
              onClick={() => setIsShowDonationModal(true)}
              className="donation-button"
            >
              Donate Now
            </button> */}
              {displayDonationButton()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AlgoralignDonationPage;
