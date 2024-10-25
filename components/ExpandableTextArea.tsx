"use cliet"
import { useRef } from 'react';

const ExpandableTextarea = ({prompt, setPrompt}:{prompt:string, setPrompt: (value: string) => void}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Resetter høyden for å justere
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Setter høyde basert på scrollHeight
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={prompt}
      onChange={handleChange}
      className="border rounded-md w-full p-2"
      placeholder="Skriv her..."
      style={{ overflow: 'hidden', minHeight: '50px' }}
    />
  );
};

export default ExpandableTextarea;