import React,{ useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uniqueId } from 'lodash';
import filter from 'leo-profanity'
import {toast} from 'react-toastify'
import sendMessage from './sendMessage';
import { BsArrowRightSquare } from 'react-icons/bs';
import { Form, Button } from 'react-bootstrap'

const MessagesBox = ({ currentChannelId, t }) => { 
    const { items: messages } = useSelector((state) => state.chat.messages);
    const currentChannel = useSelector((state) => 
        state.chat.channels.items.find((ch) => ch.id === currentChannelId)
    );
    
    const { username } = useSelector((state) => state.auth)
    const [newMessage, setNewMessage] = useState("")
    const [errorMsg, setErrorMSg] = useState("")
    const messageEndRef = useRef(null);
    const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);
    const totalMessages = currentMessages.length;

    useEffect(() => {
        if(messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!currentChannel) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <p className="text-muted">{t('chat.selectChannel') || 'Выберите канал'}</p>
            </div>
        );
    }

    const handleSendMessage = async (e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const body = formData.get("body").trim()
            if(!body || !currentChannelId) return
    
            const cleanBody = filter.clean(body)
            const msg = { id: uniqueId(), body: cleanBody, channelId: currentChannelId, username }
    
            try {
                await sendMessage(msg)
            } catch (err) {
                console.error(err)
                toast.error(t('chat.toastify.connectionError'))
                setErrorMSg(t('chat.errors.connectionError'))
                setTimeout(() => setErrorMSg(""), 5000)
            }
    
            setNewMessage("")
            e.target.reset()
        }
    

    return (
        <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
                
                <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                        <b>{`# ${currentChannel.name}`}</b>
                    </p>
                    <span className="text-muted">
                        {t('chat.messages', { count: totalMessages })}
                    </span>
                </div>
                
                <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                    {currentMessages.map((message) => (
                        <div key={message.id} className="text-break mb-2 text-container">
                            <div><b>{message.username}</b>: {message.body}</div>
                            <i className="bi bi-check2-all text-success"></i>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
                
                <div className="mt-auto px-5 py-3">
                    {errorMsg && ( 
                        <div className="alert alert-danger alert-dismissible fade show text-center py-2 mb-2" role="alert">{errorMsg}</div>)
                    }
                    <Form noValidate onSubmit={handleSendMessage} className="py-1 border rounded-2">
                        <Form.Group className={"input-group"}>
                            <Form.Control 
                                name="body"
                                ref={messageEndRef}
                                aria-label={t('chat.newMessage')}
                                placeholder={t('chat.inputMess')}
                                className="border-0 p-0 ps-2"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button
                                style={{ border: 'none'}}
                                type="submit" 
                                variant='group-vertical'
                                className="btn" 
                                disabled={newMessage.trim().length <= 0} 
                            >
                                <BsArrowRightSquare size={20} />
                                <span className="visually-hidden">{t('chat.send')}</span>
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default MessagesBox;