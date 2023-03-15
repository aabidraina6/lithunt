import React, { useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import "./login.scss";

function AdminDashboard() {
  const [data, setData] = useState([]);
  const [removeData, setRemoveData] = useState([]);

  const winnerLocation = 8; // todo : update this to actual location
  const imposterLocation = 69; //todo : set this to actual location

  const [error, setError] = useState(false);

  const getData = async () => {
    const res = fetch("/api/admin", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const retData = await (await res).json();
    setData(retData.logs.reverse());
    setRemoveData(retData.removeLogs.reverse());
    if ((await res).status === 200) {
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2> You are not authorized to access this page</h2>
      </div>
    );
  }

  const listItems = data.map((key, i) => {
    return (
      <div
        key={i}
        style={{
          color: key.valid
            ? key.location === winnerLocation
              ? "green"
              : key.location === imposterLocation
              ? "yellow"
              : "black"
            : "red",
        }}
      >
        {key.teamid + " "} has logged at location {" " + key.location} at time{" "}
        {key.time.split("T")[1].split("Z")[0].split(".")[0]}{" "}
      </div>
    );
  });

  const removeItems = removeData.map((key, i) => {
    return (
      <div key={i} style={{ color: !key.isImposter ? "black" : "red" }}>
        {key.teamid + " "} has removed {key.memberName} at location{" "}
        {" " + key.location} at time{" "}
        {key.time.split("T")[1].split("Z")[0].split(".")[0]}{" "}
      </div>
    );
  });

  return (
    <div>
      <MDBRow>
        <MDBCol className="text-center">
          <h2 style={{ color: "white" }}>Logging Data</h2>
          <MDBCard
            className="  my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "600px" }}
          >
            <MDBCardBody>
              <div
                style={{
                  height: "800px",
                  overflow: "auto",
                  overflowY: "scroll",
                }}
              >
                {listItems}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol className="text-center">
          <h2 style={{ color: "white" }}>Removing Data</h2>
          <MDBCard
            className="  my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "600px" }}
          >
            <MDBCardBody>
              <div
                style={{
                  height: "800px",
                  overflow: "auto",
                  overflowY: "scroll",
                }}
              >
                {removeItems}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
//admin page done

export default AdminDashboard;
