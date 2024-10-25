import { useEffect, useState } from "react";

interface AlertMessageProps {
  message: string;
  duration?: number; 
  onClose?: () => void; 
}

export const AlertMessage = ({ message, duration = 5000, onClose }: AlertMessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="bg-red-500 text-white p-4 rounded mt-4 flex justify-between items-center">
      <p>{message}</p>
      {onClose && (
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="bg-transparent hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Lukk
        </button>
      )}
    </div>
  );
};