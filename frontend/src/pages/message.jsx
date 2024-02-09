import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  UNSAFE_useScrollRestoration,
} from "react-router-dom";
import "./ScratchCard.css";

// import "./login.scss";
import "./theme.css";
import Coins from "./coins";
import MyModal from "./modal";
import Banner from "./banner";
import Card from "./pokerCard";
import { MDBContainer, MDBRow } from "mdb-react-ui-kit";

function MessagePage() {
  const dummy =
    "These examples have been automatically selectedThese examples have been automatically selectedThese examples have been automatically selected and may contain sensitive content that does not reflect the opinions or policies of Collins, or its parent company HarperCollins.We welcome feedback: report an example sentence to the Collins team.";

  const navigate = useNavigate();
  const { location } = useParams();
  const [isScratched1, setIsScratched1] = useState(false);
  const [isScratched2, setIsScratched2] = useState(false);
  const [right, setRight] = useState(1);
  const [teamData, setTeamData] = useState({});
  const [clue1, setClue1] = useState("");
  const [clue2, setClue2] = useState("");
  const [show, setShow] = useState(true); // whether show Page or Not
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(null);
  const [used, setUsed] = useState(false);
  const [coins, setCoins] = useState();

  const handleScratch = async () => {
    if (!isScratched2) {
      setIsScratched1(true);
      const res = await fetch(`/api/setScratch/1/${location}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      if(!isScratched1)
      openModal();
    }
  };

  const handleScratch2 = async () => {
    if (!isScratched1) {
      setIsScratched2(true);
      const res = await fetch(`/api/setScratch/2/${location}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const msg = await res.json();
    } else {
      if(!isScratched2)
      openModal();
    }
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
    setTeamData(retData);
    if ((await res).status === 200) {
      const index = retData.path.findIndex(
        (item) => item.location === parseInt(location)
      );
      if (retData.path[index].voted === 0 && retData.showVote === true) {
        navigate(`/vote/${location}`);
      }
      setIsScratched1(retData.path[retData.current].sc1);
      setIsScratched2(retData.path[retData.current].sc2);
      setFlag(retData.path[retData.current].flag);
      setUsed(retData.path[retData.current - 1].decrement);
      setCoins(retData.coins);
      if(flag === null) setLoading(true)
      await fetchData(retData.path[retData.current].flag);
    }
    setLoading(false);
  };

  const fetchData = async (flag1) => {
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
    // todo : second time login at same location
    // if(retData.voted === 0)
    // navigate(`/vote/${location}`) clues are for everyone not for a single team
    if ((await res).status === 200) {
      if (flag1) {
        // right in clue 1
        setClue1(retData.right);
        setClue2(retData.wrong);
        setRight(1);
      } else {
        setClue1(retData.wrong);
        setClue2(retData.right);
        setRight(2);
        // right in clue 2
      }
      setShow(true);
    } else {
      setShow(false);
    }
    setLoading(false);
  };
  useEffect(() => {
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

  const setCoin = async () => {
    //todo ! only right should lead to location
    var index = 1;
    if (isScratched1) {
      index = 2;
    }
    const res = await fetch(`/api/setCoin/${teamData.teamid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
    } else {
      const msg = res.text;
    }
  };

  const useCoins = async () => {
    if (isScratched1) {
      setIsScratched2(true);
      const res = await fetch(`/api/setScratch/2/${location}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const msg = res.json();

      if (right == 1) {
        await setCoin();
      }
    } else {
      setIsScratched1(true);
      const res = await fetch(`/api/setScratch/1/${location}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const msg = res.json();
      if (right == 2) {
        await setCoin();
      }
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const fg = Math.random() >= 0.5


  return (
    <div className="">
      <MyModal
        style={{ display: "flex", justifyContent: "center" }}
        showModal={showModal}
        closeModal={closeModal}
        useCoins={useCoins}
      />
      <Coins value={coins} />
      <div
        className="my-banner"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Banner used={used} />
      </div>
      <div className="cardstack">
        
       { <MDBContainer style={{width  : '100vw'}}>
          <MDBRow style={{marginBottom : '10px'}}>
            <Card
              clue={clue2}
              isScratched={isScratched2}
              handleScratch={handleScratch2}
            />
          </MDBRow>
          <MDBRow>
            <Card
              clue={clue1}
              isScratched={isScratched1}
              handleScratch={handleScratch}
            />
          </MDBRow>
        </MDBContainer>}
      
        
      </div>
      <div className=""></div>
    </div>
  );
}

export default MessagePage;
