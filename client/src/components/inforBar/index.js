import React from "react";

import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";

import "./index.css";

const InfoBar = () => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
    </div>
    <div className="rightInnerContainer">
      <a href="/">
        <img src={closeIcon} alt="close icon" />
      </a>
    </div>
  </div>
);

export default InfoBar;
