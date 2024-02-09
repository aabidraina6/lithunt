import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBRadio,
} from "mdb-react-ui-kit";

// todo : device issues

export default function KickPage() {
  const params = useParams();
  const navigate = useNavigate();

  const nameRef = useRef("");

  const [isValid, setIsValid] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState({});
  const [memberData, setMemberData] = useState([]);
  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(0);
  const [isImposter, setIsImposter] = useState(0);
  // 0 : not shown yet , 1 : already shown , -1 : dont show

  var names = [];

  const fetchData = async () => {
    setIsLoading(true);
    const res = fetch(`/api/vote/${params.location}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const retData = await (await res).json();
    if ((await res).status === 200) {
      setIsValid(true);
      if (retData.showVote === false) setIsValid(false);
      setMemberData(retData.teamMembers);
      setTeamData(retData);
      const index = retData.path.findIndex(
        (item) => item.location === parseInt(params.location)
      );

      // setName(retData.teamMembers[index].name.replace(" ", "%"));
      if (retData.path[index]) setShow(retData.path[index].voted);
    } else {
      setIsValid(false);
    }
    setIsLoading(false);
  };

  const removeMember = async () => {
    const res = fetch(`/api/remove/${teamData.teamid}/${selected}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if ((await res).status === 200) {
      // navigate(`/message/${params.location}`)
      const index = memberData.findIndex((item) => item._id === selected);
      // setName(index.name);
      if (memberData[index].isImposter) {
        setIsImposter(1);
      }

      navigate(
        `/remove/${
          params.location * 10 + (memberData[index].isImposter ? 1 : 0)
        }/${nameRef.current}`
      );
      // <Link to={<AmongUs/>}></Link>
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (isLoading)
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2> loading...</h2>
      </div>
    );
  if (!isValid)
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2>You are not authorized to access this page</h2>
      </div>
    );

  const listitems = memberData.map((key) => {
    names.push({ id: key._id, name: key.name.replace(" ", "%") });
    return (
      <MDBRadio
        style={{ fontWeight: "bold" }}
        key={key._id}
        name="flexRadioDefault"
        id={key._id}
        label={key.name}
        value={key._id}
        onChange={(e) => {
          setSelected(e.currentTarget.value);
          const index = names.findIndex(
            (item) => item.id === e.currentTarget.value
          );
          setName(names[index].name);
          nameRef.current = names[index].name.replace(" ", "%");
        }}
      />
    );
  });

  if (show === -1) {
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2> You are not authorized to access this page</h2>
      </div>
    );
  }
  if (show === 1) {
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2>you have already voted in this round</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <h2 style={{ color: "white" }} className="centered">
          Please Vote to Kick the Imposter
        </h2>
      </div>

      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="  my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "600px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column  mx-auto w-100">
                <div className="centered">
                  {listitems}
                  <br></br>
                  <MDBBtn
                    onClick={() => {
                      if (selected) {
                        removeMember();
                      }
                    }}
                    outline
                    className="mx-2 px-5"
                    color="black"
                    size="lg"
                  >
                    Vote
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
