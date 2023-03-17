import React, { useState } from "react";
import { useEffect } from "react";
import "./login.scss";

export default function Congrats() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const getTeamData = async () => {
    setLoading(true);
    const res = fetch(`/api/team/${8}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const retData = await (await res).json();
    if ((await res).status === 200) {
      if(retData.current === 12)
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
        <h2>congrats! </h2>
      </div>
    )
  }

  return (
    <div style={{ color: "white" }} className="message-all">
      <h2>congrats!</h2>
    </div>
  );
}
