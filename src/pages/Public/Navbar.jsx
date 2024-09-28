import React, { useEffect } from "react";
import "../../assets/css/auth.css";
import InstaW from '../../assets/images/insta-white.svg'
import InstaB from '../../assets/images/insta-black.svg'
import { useLocation } from "react-router-dom";

export default function Navbar({ darkMode }) {

  return (
    <div className="navbar flex items-center justify-center">
      <div className="nav-logo w-[205px] h-[58px]">
        <img src={darkMode ? InstaW : InstaB} className="w-full h-full" />
      </div>
    </div>
  );
}