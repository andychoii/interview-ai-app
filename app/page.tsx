// Indicates that the code is for the client side
'use client';

// Importing necessary dependencies and components
import { useState } from 'react'; // useState hook from React for state management
import Image from 'next/image'; // Image component from Next.js for optimized image rendering
import Chat from './components/Chat'; // Chat component to start the chat functionality

// Main component for the home page
export default function Home() {

  // State variables to store the position, company, input for chat, and chat start status
  const [position, setPosition] = useState(""); // For storing the position entered by the user
  const [company, setCompany] = useState(""); // For storing the company name entered by the user
  const [input, setInput] = useState(""); // For storing the combined input for the chat
  const [chatStarted, setChatStarted] = useState(false); // To keep track if the chat has started or not
  
  // Handler function for the chat form submission
  const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Preventing default form submission behavior
    // Check if both position and company are entered by user
    if (position && company) {
      // Combining the position and company for chat input
      const combinedInput = `${position} at ${company}`;
      setInput(combinedInput); // Setting the combined input for the chat
      setChatStarted(true); // Indicate that chat has started
    } else {
      // If either position or company is missing, alert the user
      alert("Please enter both position and company before starting the chat.");
    }
  };
  

  return (
    // Root element with class "App"
    <main className="App">
      {/* Section for logo and title */}
      <div className="logoTitleBox">
        {/* Using the Next.js Image component to efficiently load and display an image with specified dimension */}
        <Image className="logo" src="/technology.png" alt="logo" width="220" height="160" />
        {/* Displaying the title of the app */}
        <h1 className="title">InterviewGPT</h1>
        {/* A brief description about the app's purpose */}
        <p>This is an interface to talk to the senior software engineer for interview preparation!</p>
      </div>
      
      {/* Using conditional rendering based on the state of chatStarted */}
      {!chatStarted ? (
        // If chat hasn't started, this block will be rendered
        <form onSubmit={handleChatSubmit} className="mainForm">
          {/* Input fields for capturing user's desired position and company */}
          <div className="inputsBox">
            {/* Input for entering the desired position with a change event handler */}
            <input className="position" placeholder="Enter position" onChange={(e) => setPosition(e.target.value)} value={position} />
            {/* Input for entering the desired company with a change event handler */}
            <input className="company" placeholder="Enter company" onChange={(e) => setCompany(e.target.value)} value={company} />
          </div>
  
          {/* Button that user clicks to start the chat */}
          <div className="startChatBox">
            <button type="submit">Start Chat</button>
          </div>
        </form>
      ) : (
        // If chat has been started, the Chat component is rendered
        <Chat initialInput={input} />
      )}
    </main>
  );
  
}