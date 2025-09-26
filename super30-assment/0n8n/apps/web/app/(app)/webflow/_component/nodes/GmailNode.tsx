import React, { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react'; 
import { Button } from '@/components/ui/button';
const GmailNode = ({ data, id }) => {
 const [recipient, setRecipient] = useState(data.recipient || '');
 const [subject, setSubject] = useState(data.subject || '');
 const [message, setMessage] = useState(data.message || ''); 
 const [isShow, setIsShow]= useState(false)


 const onRecipientChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(evt.target.value);
 }, []); 

 const onSubjectChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
     setSubject(evt.target.value);
 }, []); 

 const onMessageChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(evt.target.value);
 }, []); 


 const onSubmitHandler=async (e)=>{
    e.preventDefault() 
    const data={
        recipient: recipient,
        subject: subject,
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
        <Button onClick={()=>setIsShow(!isShow)}>Gmail</Button>
       {isShow &&
         <form onSubmit={onSubmitHandler}>
            
            <label htmlFor={`recipient-${id}`}>Recipient:</label>
            <input
                id={`recipient-${id}`}
                name="recipient"
                value={recipient}
                onChange={onRecipientChange}
                className="nodrag"
            />
            <label htmlFor={`subject-${id}`}>Subject:</label>
            <input
                id={`subject-${id}`}
                name="subject"
                value={subject}
                onChange={onSubjectChange}
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

export default GmailNode;