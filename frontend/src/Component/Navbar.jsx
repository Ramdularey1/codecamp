import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="text-white flex justify-between items-center bg-black h-[60px]">
        <div className="mx-[40px]">logo</div>
        <div className="mx-[40px] flex items-center justify-between w-full md:w-[600px]">
          <div className="hidden md:flex items-center justify-around w-full">
            
            <Link to = "/problem">Problem</Link>
            <h1>Dark&White</h1>
            <h1>Account</h1>
          </div>
          <div className="md:hidden absolute right-0 mx-[40px]">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="focus:outline-none"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-black text-white flex flex-col items-center p-4 absolute right-0 w-[350px] rounded-b-md"
        >
          <h1 className="py-2" onClick={toggleMenu}>Problem</h1>
          <h1 className="py-2" onClick={toggleMenu}>Dark&White</h1>
          <h1 className="py-2" onClick={toggleMenu}>Account</h1>
        </div>
      )}
    </>
  );
};

export default Navbar;
