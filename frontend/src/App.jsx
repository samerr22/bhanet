import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Chat from "./pages/chat";




export default function App() {
  return (
    <BrowserRouter>
     
      <Routes>
       
        
        <Route path="/" element={<Chat/>} />

       

       
         
        
       
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
