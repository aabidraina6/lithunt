import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//todo : handle 409

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import "./login.scss";

import image from "../images/logo.png";
import image2 from "../images/amongus.png";

function LoginPage() {
  const [teamid, setTeamid] = useState("");
  const [teamData, setTeamData] = useState({});
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [warning, setWarning] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [Loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const location = parseInt(params.location);

  const Login = async () => {
    setLoading(true);
    const res = fetch(`/api/login/${location}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamid,
        password,
      }),
    });

    const retData = await (await res).json();
    setTeamData(retData);
    // const current =

    if ((await res).status === 202) {
      // if(retData.path[retData.current - 1])
      navigate("/congrats"); //todo : make the page better
    }
    if ((await res).status === 200) {
      setInvalidCredentials(false);
      setWarning(false);
      setNotFound(false);
      setBlocked(false);
      if (
        retData.current % 3 === 0 &&
        retData.path[retData.current - 1].voted === 0 &&
        retData.showVote === true
      )
        navigate(`/vote/${location}`);
      else navigate(`/message/${location}`);
    } else if ((await res).status === 211) {
      // fake wala
      navigate(`/fakemessage`);
    } else if ((await res).status === 401) {
      setWarning(false);
      setNotFound(false);
      setBlocked(false);
      setInvalidCredentials(true);
    } else if ((await res).status === 404) {
      setWarning(false);
      setInvalidCredentials(false);
      setBlocked(false);
      setNotFound(true);
    } else if ((await res).status === 405) {
      setWarning(false);
      setInvalidCredentials(false);
      setNotFound(false);
      setBlocked(true);
    } else if ((await res).status === 203) {
      navigate("/admin");
    } else {
      setInvalidCredentials(false);
      setNotFound(false);
      setBlocked(false);
      setWarning(true);
    }
    setLoading(false);
  };
  // todo: fix invalid location
  return (
    <div>
      <div className="container">
        {/* <div className="centered">
          <h2 style={{ color: "white" }} className="centered">
            LitClub TresureHunt
          </h2>
        </div> */}
        <div>
          <MDBRow>
            <MDBCol style={{ marginTop: "10px" }}>
              <img src={image} alt="thunt" height="150px" width="150px"></img>
            </MDBCol>
            <MDBCol>
              <img src={image2} alt="thunt" height="180px" width="150px"></img>
            </MDBCol>
          </MDBRow>
        </div>
      </div>

      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="  my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "600px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                <p className="text-dark-50 mb-5">
                  Please enter your TeamID and password!
                </p>
                {invalidCredentials ? (
                  <p style={{ color: "red" }}>Invalid Credentials</p>
                ) : (
                  <></>
                )}
                {warning ? (
                  <p style={{ color: "red" }}>
                    Wrong Location. You have {3 - teamData.countOfFails} tries
                    left
                  </p>
                ) : (
                  <></>
                )}
                {notFound ? <p>Page not found</p> : <></>}
                {blocked ? <p>you have been blocked</p> : <></>}
                <MDBInput
                  style={{ color: "black" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-dark"
                  label="Team ID"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  value={teamid}
                  onChange={(e) => setTeamid(e.target.value)}
                />
                <MDBInput
                  style={{ color: "black" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-dark"
                  label="Password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <MDBBtn
                  onClick={() => {
                    // navigate(`/${next}/${3}`);
                    Login();
                  }}
                  outline
                  className="mx-2 px-5"
                  color="black"
                  size="lg"
                >
                  {Loading ? (
                    <MDBSpinner size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </MDBSpinner>
                  ) : (
                    "login"
                  )}
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default LoginPage;
