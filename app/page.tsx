'use client';

import { useState } from 'react';
import Image from 'next/image';
import Chat from './components/Chat';

export default function Home() {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  
  const handleChatSubmit = (event) => {
    event.preventDefault();
    if (position && company) {
      const combinedInput = `${position} at ${company}`; // Use backticks for template literals
      setInput(combinedInput);
      setChatStarted(true);
    } else {
      alert("Please enter both position and company before starting the chat.");
    }
  };
  

  return (
    <main className="App">
      {/* Logo and title */}
      <div className="logoTitleBox">
        <Image className="logo" src="/technology.png" alt="logo" width="220" height="160" />
        <h1 className="title">AI-InterviewTech</h1>
        <p>This is an interface to talk to the senior software engineer for interview preparation!</p>
      </div>
  
      {!chatStarted ? (
        <>
          {/* Position and Company Inputs */}
          <div className="inputsBox">
            <input className="position" placeholder="Enter position" onChange={(e) => setPosition(e.target.value)} value={position} />
            <input className="company" placeholder="Enter company" onChange={(e) => setCompany(e.target.value)} value={company} />
          </div>
  
          {/* Start Chat Button */}
          <div className="startChatBox">
            <button type="submit" onClick={handleChatSubmit}>Start Chat</button>
          </div>
        </>
      ) : (
        <Chat initialInput={input} />
      )}
    </main>
  );
  
}