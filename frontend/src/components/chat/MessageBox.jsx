import React,{ useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uniqueId } from 'lodash';
import filter from 'leo-profanity'
import {ToastContainer, toast} from 'react-toastify'
import sendMessage from './sendMessage';

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
                    <span className="text-muted">{totalMessages} {t('chat.messages')}</span>
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
                    <form noValidate="" onSubmit={handleSendMessage} className="py-1 border rounded-2">
                        <div className={`input-group ${(newMessage.trim().length <= 0) ? "has-validation" : ""}`}>
                            <input 
                                name="body" 
                                aria-label='Новое сообщение'
                                placeholder={t('chat.inputMess')}
                                className="border-0 p-0 ps-2 form-control"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                />
                            <button 
                                type="submit" 
                                className="btn btn-group-vertical" 
                                disabled={newMessage.trim().length <= 0} 
                            > 
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 16 16" width="20" height="20" 
                                    fill="currentColor" className="bi bi-arrow-right-square" 
                                    data-darkreader-inline-fill="" 
                                    >
                                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                                </svg>
                                <span className="visually-hidden">
                                    {t('chat.send')}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessagesBox;