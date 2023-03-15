import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ScratchCard.css";
import "./login.scss";

function MessagePage() {
  const navigate = useNavigate();
  const { location } = useParams();
  const [isScratched, setIsScratched] = useState(false);
  const [clue, setClue] = useState("");
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleScratch = () => {
    setIsScratched(true);
  };

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
      const index = retData.path.findIndex(
        (item) => item.location === parseInt(location)
      );
      if (retData.path[index].voted === 0 && retData.showVote === true) {
        navigate(`/vote/${location}`);
      }
    }
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = fetch(`/api/clue/${location}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const retData = await (await res).json();
    // if(retData.voted === 0)
    // navigate(`/vote/${location}`) clues are for everyone not for a single team
    if ((await res).status === 200) {
      setClue(retData.text);
      setShow(true);
    } else {
      setShow(false);
    }
    setLoading(false);
  }; 
  useEffect(() => {
    fetchData();
    getTeamData();
    // eslint-disable-next-line
  }, []);
  

  if (loading) {
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2>loading...</h2>
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ color: "white" }} className="message-all">
        <h2>you are not authorized to view this page</h2>
      </div>
    );
  }

  return (
    <div className="scratch-card-container">
      <div
        className={`scratch-card ${isScratched ? "scratched" : ""}`}
        onClick={handleScratch}
      >
        <div className="scratch-card-text">
          {isScratched ? clue : "Tap to reveal Clue"}
        </div>
      </div>
    </div>
  );
}

export default MessagePage;
