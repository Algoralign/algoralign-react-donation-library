# Algoralign React Donation Library

The **Algoralign React Donation Library** provides two main components designed to simplify integrating donation functionalities into your React application. This library enables users to initiate and manage donations directly within their application interface.

## Components

### 1. `AlgoralignDonationButton`

This component renders a button that, when clicked, opens a modal for users to input their donation amount and phone number. The donation flow is initiated seamlessly through the button click, validating user inputs and displaying appropriate feedback.

- **Parameters**:

  - `projectId` (`string`, **required**): A unique identifier for the project that will receive the donation.
  - `xAlgoralignKey` (`string`, **required**): The API key used for authenticating requests to the Algoralign backend.

- **Usage**:

  ```jsx
  import { AlgoralignDonationButton } from "algoralign-donation-library";

  function DonationComponent() {
    return (
      <AlgoralignDonationButton
        projectId="YOUR_PROJECT_ID"
        xAlgoralignKey="YOUR_X_ALGORALIGN_KEY"
      />
    );
  }
  ```
