import React, { useState } from "react";
import { Transition } from "react-transition-group";
import CustomColors from "../../constants/colors";

function Accordion({ Header, Body, alreadyVisible }) {
  const [isVisible, setIsVisible] = useState(alreadyVisible);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* <button onClick={handleButtonClick}>Toggle Div</button> */}
      <Transition in={isVisible} timeout={200}>
        {(state) => (
          <div
            // onClick={handleButtonClick}
            style={{
              transition: "all 200ms ease-in-out",
              //   opacity: state === "entered" ? 1 : 0,
              //   border: "1px solid black",
              height: state === "entered" ? "50vh" : "60px",
              minHeight: state === "entered" ? "50vh" : "60px",
              overflowY: state === "entered" ? "scroll" : "hidden",
              width: "90%",
              margin: "10px 0",
              cursor: "pointer",
              borderRadius: "20px",
              backgroundColor: CustomColors.lightBlue,
            }}
          >
            <Header state={state} onClick={handleButtonClick} />
            {Body}
          </div>
        )}
      </Transition>
    </>
  );
}

export default Accordion;
