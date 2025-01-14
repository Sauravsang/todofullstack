import React from "react";
import Header from "../components/Header";
import HomeSection from "../components/HomeSection";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";





const Home = () => {
    const location = useLocation();
  return (
    <>
      <Header />
       <HomeSection />
       <Footer/>
    
    </>
  );
};

export default Home;
