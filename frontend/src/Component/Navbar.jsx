import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import userImage from "../../public/user.png"

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const menuRef = useRef(null);
  const logoutRef = useRef(null);
  const buttonRef = useRef(null);

  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAccount = () =>{
    setIsLogoutVisible(prev => !prev);
  }

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      logoutRef.current &&
      !logoutRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setIsLogoutVisible(false);
    }
  };

  useEffect(() => {
    if (isOpen || isLogoutVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLogoutVisible]);

  const handleClick = () => {
    navigate('/signup');
  };

  const handleLogoutToggle = () => {
    setIsLogoutVisible(prev => !prev);
  
    const logOut = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/users/logout",
          {}, 
          {
            withCredentials: true 
          }
        );
        if (response.status >= 200 && response.status < 300) {
          console.log("User logged out successfully");
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/'); 
        }
      } catch (error) {
        console.log(error);
      }
    };
    logOut();
  };
  

  const loginUser = localStorage.getItem('user');
  const user = JSON.parse(loginUser)
  console.log(user)


const handleLogin = () =>{
  navigate('/signup', { state: { from: 'login' } });
      return;
}

  return (
    <>
      <div className="text-white flex justify-between items-center bg-black h-[60px]">
        <div className="mx-[40px]">
          <Link to={"/"}>logo</Link>
        </div>
        <div className="mx-[40px] flex items-center justify-between w-full md:w-[600px]">
          <div className="hidden relative md:flex items-center justify-around w-full">
            <Link to="/problem">Problem</Link>
            
            <Link to = "/compilar">Compilar</Link>
            <button onClick={handleAccount}>Account</button>
            
            <div ref={logoutRef} className={`z-[999] absolute text-white bg-[#1d1c1c] top-12 right-[0px] ${isLogoutVisible ? 'block' : 'hidden'}`}>
              <div className="w-[250px] flex justify-center items-center flex-col p-4">
                

                  <div>
                    <img className="w-[100px] h-[100px] rounded-md" src={userImage} alt="userImage not found" />
                  </div>
                  <h1>{user && user.data.username}</h1>


                  
                  {
                    user?<h1 className="cursor-pointer" onClick={handleLogoutToggle}>logout</h1>:<h1
                    className="cursor-pointer"
                    onClick = {handleLogin} >login</h1>
                  }
                
              </div>
            </div>

          </div>
          <div className="md:hidden absolute right-0 mx-[40px]">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden bg-black text-white flex flex-col items-center p-4 absolute right-0 w-[350px] rounded-b-md"
        >
          <Link to="/problem" className="py-2" onClick={toggleMenu}>Problem</Link>
          <div className="py-2" onClick={toggleMenu}>Dark&White</div>
          <div className="py-2" onClick={() => { toggleMenu(); handleClick(); }}>Account</div>
        </div>
      )}
    </>
  );
};

export default Navbar;
