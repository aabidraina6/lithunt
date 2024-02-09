import React, { useState } from "react";
import { useEffect } from "react";
import "./login.scss";
import { useParams } from "react-router-dom";

export default function Congrats() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams()
  const location = params.location
  const loc = 12
  const getTeamData = async () => {
    setLoading(true);
    const res = fetch(`/api/team/${location}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const retData = await (await res).json();
    if ((await res).status === 200) {
      if(retData.current === 11)
      setShow(true)
      else
      setShow(false)
    }
    setLoading(false);
  };

  useEffect(() => {
    getTeamData();
  }, []);

  if(loading){
    return(
      <div style={{ color: "white" }} className="message-all">
        <h2>loading...</h2>
      </div>
    )
  }

  if(!show){
    return(
      <div style={{ color: "white" }} className="message-all">
        <h2>You are not authorized to view this Page</h2>
      </div>
    )
  }

  return (
    <div style={{ color: "white" }} className="message-all">
      <h2>Congrats! You have completed the Treasure Hunt. Please report to H105 with this screen.</h2>
    </div>
  );
}
