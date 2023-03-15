import React, { useState } from "react";
import "./ScratchCard.css";
import "./login.scss";
import image from "../images/fake.jpeg";

function FakePage() {
  const [isScratched, setIsScratched] = useState(false);

  const handleScratch = () => {
    setIsScratched(true);
  };

  return (
    <div className="scratch-card-container">
      <div
        className={`scratch-card ${isScratched ? "scratched" : ""}`}
        onClick={handleScratch}
      >
        <div className="scratch-card-text">
          {isScratched ? (
            <img src={image} alt="clue " width="300px"></img>
          ) : (
            "Tap to reveal Clue"
          )}
        </div>
      </div>
    </div>
  );
}

export default FakePage;
