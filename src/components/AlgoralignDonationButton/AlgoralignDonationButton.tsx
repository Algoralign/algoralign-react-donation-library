import React, { FC, ReactNode, useState } from "react";
import "./algoralignDonationButton.css";
import AlgoralignDonationModal from "../AlgoralignDonationModal";
interface Props {
  // children: ReactNode | ReactNode[];
  projectId: String;
  xAlgoralignKey: String;
}

const AlgoralignDonationButton: FC<Props> = ({ projectId, xAlgoralignKey }) => {
  const [isShowDonationmodal, setIsShowDonationModal] =
    useState<boolean>(false);
  const handleOpenDonationModal = () => {
    setIsShowDonationModal(true);
  };

  return (
    <>
      {isShowDonationmodal && (
        <AlgoralignDonationModal
          setIsShowDonationModal={setIsShowDonationModal}
          projectId={projectId}
          xAlgoralignKey={xAlgoralignKey}
        />
      )}
      <button onClick={handleOpenDonationModal} className="donation-button">
        Donate Now
      </button>
    </>
  );
};

export default AlgoralignDonationButton;
