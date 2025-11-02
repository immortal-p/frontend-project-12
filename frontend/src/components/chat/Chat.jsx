import React, { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchChannels, addMessage, addChannel, deleteChannel, renameChannel } from "../../slices/chatSlice" 
import { connectSocket } from "../../socket.js"
import "./chat.css"
import { Button } from "react-bootstrap"
import { ModalAddChannel } from "./components/ModalAddChannel.jsx"
import { ModalDeleteChannel } from "./components/ModalDeleteChannel.jsx"
import { ModalEditChannel } from "./components/ModalEditChannel.jsx"
import { useTranslation } from "react-i18next"
import { ToastContainer, toast} from "react-toastify"
import MessagesBox from "./MessageBox.jsx"

const Chat = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const { items: channels, status: channelsStatus, error: channelsError } = useSelector((state) => state.chat.channels)
    const { token } = useSelector((state) => state.auth)
    
    const [currentChannelId, setCurrentChannelId] = useState(null) 
    const [channelToDelete, setChannelToDelete] = useState(null)
    const [channelToUpdate, setChannelToUpdate] = useState(null)

    const channelEndRef = useRef(null)
    const socketRef = useRef(null)

    useEffect(() => {
        const loadData = async () => {
            if (!token) return
            if (channelsStatus === 'idle') {
                try { 
                    await dispatch(fetchChannels()).unwrap()
                }
                catch (err) {
                    console.error(err)
                }
            }
        }
        loadData()
    }, [token, dispatch, channelsStatus]) 

    useEffect(() => {
        if (channelsStatus === 'succeeded' && currentChannelId === null && channels.length > 0) {
            const generalChannel = channels.find(ch => ch.name === 'general');
            setCurrentChannelId(generalChannel?.id ?? channels[0].id);
        }
    }, [channels, currentChannelId, channelsStatus]);

    useEffect(() => {
        const socket = connectSocket()
        socketRef.current = socket

        socket.on("newMessage", (msg) => msg?.id && dispatch(addMessage(msg)))
        
        socket.on("newChannel", (channel) => {
            dispatch(addChannel(channel))
            setCurrentChannelId(channel.id); 
            toast.success(t('chat.toastify.createChannel'), { draggable: true })
        })
        
        socket.on("removeChannel", (channelId) => {
            dispatch(deleteChannel(channelId))
            if(currentChannelId === channelId.id) {
                setCurrentChannelId(channels.length > 0 ? channels[0].id : null);
            }
            toast.success(t('chat.toastify.deleteChannel'), { draggable: true })
        })
        
        socket.on("renameChannel", (channel) => {
            dispatch(renameChannel(channel))
            toast.success(t('chat.toastify.renameChannel'), { draggable: true })
        })

        return () => {
            socket.off("newMessage")
            socket.off("newChannel")
            socket.off("removeChannel")
            socket.off("renameChannel")
        }

    }, [dispatch, currentChannelId, channels, t])

    useEffect(() => {
      if(channelEndRef.current) {
        channelEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, [channels])

    const isLoading = channelsStatus === 'loading'; 
    const isError = channelsStatus === 'failed';

    const shouldRenderChat = channelsStatus === 'succeeded' && channels.length > 0;

    if (isLoading || !shouldRenderChat) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('chat.loading')}...</span>
                </div>
            </div>
        )
    }

    if (isError) {
        const errorMessage = typeof channelsError === 'object' && channelsError?.message
            ? channelsError.message
            : channelsError || t('chat.unknownError');

        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-danger p-5">
                    <strong>{t('chat.errorLoadingData')}</strong>: {errorMessage}
                </div>
            </div>
        )
    }
    
    const handleChannelClick = (channelId) => {
        setCurrentChannelId(channelId)
    }
    
    const builderChannel = (channel) => {
        return (
            <li key={channel.id} className="nav-item w-100">
                {(!channel.removable) ? (
                    <Button
                        role="button" 
                        className={`w-100 rounded-0 text-start btn ${
                            channel.id === currentChannelId ? 'btn-secondary' : ''
                        }`}
                        onClick={() => handleChannelClick(channel.id)}
                        >
                        <span className="me-1" aria-hidden="true">#</span>{channel.name}
                    </Button>
                )
                :
                (
                    <div role="group" className="d-flex dropdown btn-group">
                        <button 
                            type="button" 
                            className={`w-100 rounded-0 text-start btn 
                            ${channel.id === currentChannelId ? 'btn-secondary' : ''}`}
                            onClick={() => handleChannelClick(channel.id)}
                            aria-label={`Канал ${channel.name}`}
                            >
                            <span className="me-1" aria-hidden="true">#</span>{channel.name}
                        </button>
                        <button 
                            type="button" 
                            className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn 
                            ${channel.id === currentChannelId ? 'btn-secondary' : ''}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            aria-label={`Управление каналом`}
                            >
                            <span className="visually-hidden" aria-label={t('chat.channelManagement')}>Управление каналом</span>
                        </button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#" data-bs-target="#exampleModalDelete" data-bs-toggle="modal" onClick={() => setChannelToDelete(channel)}>{t('chat.delete')}</a>
                            <a className="dropdown-item" href="#" data-bs-target="#exampleModalEdit" data-bs-toggle="modal" onClick={() => setChannelToUpdate(channel)}>{t('chat.rename')}</a>
                        </div>
                    </div>
                )}
            </li>
        )
    }

    const handleLogout = () => {
        navigate("/signin")
        localStorage.clear()
    }
    return (
        <>
            <ModalAddChannel onChannelCreated={(newChannel) => setCurrentChannelId(newChannel.id)} />
            <ModalDeleteChannel 
                channel={channelToDelete} 
                onChannelDefault={() => {
                    setCurrentChannelId(channels.length > 0 ? channels[0].id : null)
                }} 
            />
            <ModalEditChannel channel={channelToUpdate} onChannelEdited={(updatedChannel) => setChannelToUpdate(updatedChannel)} />
            
            <div className="d-flex flex-column h-100">
                <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        <a className="navbar-brand" href="/">{t('nameChat')}</a>
                        <button type="button" className="btn btn-primary" onClick={handleLogout}>{t('chat.buttonExit')}</button>
                    </div>
                </nav>
                <div className="container h-100 my-4 overflow-hidden rounded shadow">
                    <div className="row h-100 bg-white flex-md-row">

                        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                                <b>{t('chat.title')}</b>
                                <button className="p-0 text-primary btn btn-group-vertical" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="bi bi-plus-square" data-darkreader-inline-fill="">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                    </svg>
                                    <span className="visually-hidden">+</span>
                                </button>
                            </div>
                            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                                {channels.map(channel => builderChannel(channel))}
                                <div ref={channelEndRef} />
                            </ul>
                        </div>

                        <MessagesBox currentChannelId={currentChannelId} t={t} /> 

                    </div>
                </div>

            </div>
            <ToastContainer draggable />
        </>
    )
}


export default Chat