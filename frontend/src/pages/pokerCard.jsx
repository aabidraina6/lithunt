import React, { useState } from "react";
import "./pokerCard.scss";

const Card = ({clue , isScratched , handleScratch}) => {
 
  const dummy =
    "This is the clue for this is is ssafafadfadfadsffadfdfdfsdfsdfsdfsdfsdfsdfsdfsafdafadfasdsfasdfadsfadsfasdfasdfasdfafaraereThis is the clue for this is is ssafafaraereThis is the clue for this is is ssafafaraereThis is the clue for this is is ssafafaraereThis is the clue for this is is ssafafaraereThis is the clue for this is is ssafafaraereThis is the clue for this is is ssafafaraerememeaadsaf";

  return (
    <div
      style={{ maxWidth: "600px" }}
      onClick={handleScratch}
      className={`my-card spade ${!isScratched ? "checked" : ""}`}
    >
     {!isScratched && <div className="back-card"></div>}
     {isScratched && <div className="front-card">
        <div className="num-box top suit">A</div>
        <div className="num-box bottom suit">A</div>
        <div className="main-card"><div
        style={{
          textWrap: "wrap",
          minWidth: "300px",
          whiteSpace: "pre-wrap",
        }}
        >{clue}</div></div>
      </div>}
    </div>
  );
};



export default Card;
