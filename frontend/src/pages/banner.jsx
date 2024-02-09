import React, { useState, useEffect } from "react";
import './banner.css'


function MessageComponent({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  // useEffect to schedule the disappearance of the message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []); // This effect runs only once after the component mounts

  return (
    <div>
      {isVisible && (
        <div className="message-banner">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default function Banner({ used }) {
  return (
    <div>
      <MessageComponent
        message={`You have ${used ? "lost " : "not lost "} the coin you wagered in the last round!`}
      />
    </div>
  );
}
