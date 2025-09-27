import React,{useCallback, useState} from 'react';
import { Handle, Position } from '@xyflow/react'; 
import axios from 'axios';

const TelegramNode = ({ data, id }: {data:any, id: String}) => {
    // const {botName, action, message, }=data
    const [chatId, setChatId] = useState(data.chatId || '');
    const [message, setMessage] = useState(data.message || '');
    const [IsShow, setIsShow] = useState(false)
    // const [formData, setFormData]=useState(data || '')
    
    const onChatIdChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setChatId(evt.target.value);
      }, []);
    
      const onMessageChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(evt.target.value);
      }, []);

    //   const onDataChange=useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    //     setFormData(e.target.value)
    //   })

    const onSubmitHandler=async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault() 
        const data={
            chat: chatId,
            message: message
        }
        axios.post("localhost",data)
        .then(()=>{
            console.log('data is rocking in the backend')
        }).catch((err)=>{
            console.log('under the circumtances of backend is still begging WE HAVE AN ERROR: ',err)
        })

    }
    
      
    return (
        <div style={{ border: '1px solid #777', padding: 10, borderRadius: 5 }}>
          <Handle type="target" position={Position.Top} />
          <button onClick={()=>setIsShow(!IsShow)}>Telegram</button>
            {IsShow && 
            <form onSubmit={onSubmitHandler}>
                
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
            </form>
            }
          <Handle type="source" position={Position.Bottom} />
        </div>
      );
    
};

export default TelegramNode;