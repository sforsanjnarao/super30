import React,{useCallback, useState} from 'react';
import { Handle, Position } from '@xyflow/react';

const TelegramNode = ({ data, id }) => {
    // const {botName, action, message, }=data
    const [chatId, setChatId] = useState(data.chatId || '');
    const [message, setMessage] = useState(data.message || '');

    const onChatIdChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setChatId(evt.target.value);
        // You'll need a way to update the global nodes state here
      }, []);
    
      const onMessageChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(evt.target.value);
        // You'll need a way to update the global nodes state here
      }, []);
    

    return (
        <div style={{ border: '1px solid #777', padding: 10, borderRadius: 5 }}>
          <Handle type="target" position={Position.Top} />
          <div>
            <strong>Telegram</strong>
          </div>
          <label htmlFor={`chatId-${id}`}>Chat ID:</label>
          <input
            id={`chatId-${id}`}
            name="chatId"
            value={chatId}
            onChange={onChatIdChange}
            className="nodrag"
          />
          <label htmlFor={`message-${id}`}>Message:</label>
          <textarea
            id={`message-${id}`}
            name="message"
            value={message}
            onChange={onMessageChange}
            rows={3}
            className="nodrag"
          />
          <Handle type="source" position={Position.Bottom} />
        </div>
      );
    
};

export default TelegramNode;