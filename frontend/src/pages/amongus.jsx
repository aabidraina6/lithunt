import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { useParams, useNavigate } from "react-router-dom";

//fixed

function AmongUs() {
  const { location, member } = useParams();
  const navigate = useNavigate();
  var mem = member;
  var names = [];
  if (location % 10) {
    mem = mem.concat("%was%an%imposter!");
  } else {
    mem = mem.concat("%was%not%an%imposter");
  }
  for (let i = 0; i < mem.length; i++) {
    names.push(mem[i]);
  }

  // const paramSplit = param.split('#')
  const listnames = names.map((key, i) => {
    return key === "%" ? (
      <span key={i} className="w">
        {" "}
      </span>
    ) : (
      <span key={i}>{key}</span>
    );
  });

  return (
    <div>
      <center>
        <MDBBtn
          onClick={() => {
            navigate(`/message/${(location - (location % 10)) / 10}`);
          }}
          style={{ marginTop: "20px" }}
          color="secondary"
        >
          Get Clue
        </MDBBtn>
      </center>
      <div className="sky">
        {[...Array(60)].map((_, index) => (
          <div className="star" key={index}></div>
        ))}
      </div>
      <h1 style={{ color: location % 10 ? "red" : "white" }}>{listnames}</h1>
      <div className="boi">
        <div className="rightleg"></div>
        <div className="leftleg"></div>
        <div className="backpack"></div>
        <div className="belly"></div>
        <div className="eye"></div>
        <div className="leftleg"></div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="inset" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodColor="black" result="outside-color" />
          <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" />
          <feComposite
            in="outside-color"
            operator="in"
            result="outside-stroke"
          />
          <feFlood floodColor="#0c9fc4" result="inside-color" />
          <feComposite in2="SourceAlpha" operator="in" result="inside-stroke" />
          <feMerge>
            <feMergeNode in="outside-stroke" />
            <feMergeNode in="inside-stroke" />
          </feMerge>
        </filter>
      </svg>
    </div>
  );
}

export default AmongUs;
