import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
} from "mdb-react-ui-kit";
// import './modal.css'

export default function App({ useCoins, showModal, closeModal  }) {
  const [staticModal, setStaticModal] = useState(false);


  return (
    <>

      <MDBModal
      className="modal-small my-modal"
        show={showModal}
        staticBackdrop
        tabIndex="-1"
        open={staticModal}
        setOpen={setStaticModal}
      >
        <MDBModalDialog centered >
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Wager Coin!</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={closeModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Would you like to wager one coin?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={closeModal}>
                Dont Use
              </MDBBtn>
              <MDBBtn onClick={useCoins}>Use Coin</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
          </MDBModalDialog>
      </MDBModal>
    </>
  );
}
