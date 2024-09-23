import React from 'react';
import { Box } from "@mui/material";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import google from "../../assets/google.svg";
import facebook from "../../assets/facebook.svg";
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebaseConfig';
import axios from 'axios';

const SocialLogin = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

    
      localStorage.setItem('googleToken', idToken);

      // Send token and email to the backend
    //   const response = await axios.post('http://localhost:5000/api/auth/social-login', {
    //     token: idToken,
    //     email: email,
    //   });

    //   console.log("Google User", response.data);
      navigate("/courses");
      window.location.reload(); 
    } catch (error) {
      console.log(error);
    }
    console.log("Signing in with Google");
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      localStorage.setItem('facebookToken', idToken);
      // Send token and email to the backend
    //   const response = await axios.post('http://localhost:5000/api/auth/social-login', {
    //     token: idToken,
    //     email: email,
    //   });

    //   console.log("Facebook User", response.data);
      navigate("/courses");
      window.location.reload(); 
    } catch (error) {
      console.log(error);
    }
    console.log("Signing in with Facebook");
  };

  const signButtons = [
    { name: "Google", img: google, onClick: handleGoogleSignIn },
    { name: "Facebook", img: facebook, onClick: handleFacebookSignIn },
  ];

  return (
    <Box display="flex" justifyContent="space-evenly" width="100%" px={2} mt={2}>
      {signButtons.map((item, index) => (
        <Box
          key={index}
          borderRadius="20px"
          border="1px solid"
          width="40%"
          height="2.3rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={item.onClick}
        >
          <img src={item.img} alt={item.name} height={5} style={{ height: "20px", marginRight: "5px" }} />
          {item.name}
        </Box>
      ))}
    </Box>
  );
};

export default SocialLogin;
