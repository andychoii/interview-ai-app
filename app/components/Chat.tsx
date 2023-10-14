// Importing necessary hooks and components from React and other libraries
import { useState, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react'; 
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// Defining TypeScript interface for Chat component properties
interface ChatProps {
  initialInput: string;
}

// Defining the Chat functional component that takes initialInput as a prop
const Chat: React.FC<ChatProps>  = ({ initialInput }) => {
  // State variables initialization for controlling the chat UI and behavior
  const [submitType, setSubmitType] = useState<'text'|'image'>("text");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Using a custom hook useChat which probably provides messaging functionalities
  const { append, messages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/openai',
  });

  // Function to fetch an image from the DALL-E API based on the chat input
   const getImageData = async () => {
    try {
      const response = await fetch('/api/dall-e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      });
      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);
      setError("");
    } catch (e) {
      setError(`An error occurred calling the API: ${e}`);
    }
    setLoading(false);
  }; 

  /*const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
      handleChatSubmit(event);
    } else {
      // Mock an event
      handleChatSubmit({
        preventDefault: () => {}
      } as any);
    }
  };
  

  useEffect(() => {
    if (initialInput) {
      handleInputChange({ target: { value: initialInput } });
      handleSubmit();
    }
  }, [initialInput, handleInputChange, handleSubmit]); */

  // Using the useCallback hook to create a memoized function to update the input value
  const updateInputValue = useCallback((value: string) => {
    handleInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
}, [handleInputChange]);

  
  // useEffect hook to append the initialInput to the chat if provided
  useEffect(() => {
    if (initialInput) {
      append({
        content: initialInput,
        role: 'user'
      });
    }
  },[ initialInput]);

  /*const userColors = {
    user: '#fff',
    assistant: '#fff',
  }; */

  // Updated object for user colors
  const userColors = {
    user: '#fff',
    assistant: '#fff',
    function: '#fff',
    system: '#fff',
};


  // This function is used to display chat messages or show the generated image based on the submit type
  const renderResponse = () => {
    // Check if the submit type is 'text' which means the response to render should be text-based chat messages.
    if (submitType === 'text') {
      return (
        // Container for the response
        <div className="response">
          {messages.length > 0
          // If there are messages, loop through each message and display them
            ? messages.map(m => (
                <div key={m.id} className="chat-line">
                  {/* Display the role of the sender (user or Senior-SoftwareEngineer). The role's text color is determined by the userColors object based on the role */}
                  <span style={{color: userColors[m.role]}}>{m.role === 'user' ? '👨‍💻Student: ' : '🧑‍🏫Tech-Interviewer: '}</span>
                  {/* Convert markdown content of the message to displayable HTML */}
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ))
              // If there are no messages, display the error message.
            : error}
        </div>
      );
    } else {
      // If the submit type isn't 'text', then display an image-based response
      return (
        <div className="response">
          {/* Show a loading spinner while the image is being fetched/processed */}
          {loading && <div className="loading-spinner"></div>}
          {/* If there's an image URL available, display the image */}
          {imageUrl && <Image src={imageUrl} className="image-box" alt="Generated image" width="400" height="400" />}
        </div>
      );
    }
  };

  // JSX code block for rendering the chat interface
  return (
    // Fragment shorthand (<></>) is used to group multiple JSX elements without adding an extra noe to the DOM
    <>
      {renderResponse()}
      <form onSubmit={handleChatSubmit} className="mainForm">
        <div className="form-and-button-container">
          <input name="input-field" placeholder="Say anything" onChange={handleInputChange} value={input} />
          <button type="submit" className="mainButton" disabled={loading}>
            ➤
          </button>
        </div>
      </form>
    </>
  );
}

// Exporting the Chat component to be used elsewhere
export default Chat;