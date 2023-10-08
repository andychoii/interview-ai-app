import { useState, useEffect } from 'react';
import { useChat } from 'ai/react'; 
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

const Chat = ({ initialInput }) => {
  const [submitType, setSubmitType] = useState<'text'|'image'>("text");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/openai',
  });

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

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
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
  }, [initialInput]);

  const userColors = {
    user: '#fff',
    assistant: '#fff',
  };

  const renderResponse = () => {
    if (submitType === 'text') {
      return (
        <div className="response">
          {messages.length > 0
            ? messages.map(m => (
                <div key={m.id} className="chat-line">
                  <span style={{color: userColors[m.role]}}>{m.role === 'user' ? 'User: ' : '⚡️Senior-SoftwareEngineer: '}</span>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ))
            : error}
        </div>
      );
    } else {
      return (
        <div className="response">
          {loading && <div className="loading-spinner"></div>}
          {imageUrl && <Image src={imageUrl} className="image-box" alt="Generated image" width="400" height="400" />}
        </div>
      );
    }
  };

  return (
    <>
      {renderResponse()}
      <form onSubmit={handleSubmit} className="mainForm">
        <input name="input-field" placeholder="Say anything" onChange={handleInputChange} value={input} />
        <button type="submit" className="mainButton" disabled={loading}>
          TEXT
        </button>
      </form>
    </>
  );
}

export default Chat;