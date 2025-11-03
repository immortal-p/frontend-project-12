import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchChannels,
  addMessage,
  addChannel,
  deleteChannel,
  renameChannel,
} from '../../slices/chatSlice'
import { connectSocket } from '../../socket.js'
import './chat.css'
import { Container, Button, Nav, ButtonGroup, Dropdown, Navbar } from 'react-bootstrap'
import { BsPlusSquare } from 'react-icons/bs'
import { ModalAddChannel } from './components/ModalAddChannel.jsx'
import { ModalDeleteChannel } from './components/ModalDeleteChannel.jsx'
import { ModalEditChannel } from './components/ModalEditChannel.jsx'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import MessagesBox from './MessageBox.jsx'

const Chat = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    items: channels,
    status: channelsStatus,
    error: channelsError,
  } = useSelector(state => state.chat.channels)
  const { token } = useSelector(state => state.auth)

  const [currentChannelId, setCurrentChannelId] = useState(null)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToUpdate, setChannelToUpdate] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const channelEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        navigate('/signin')
      }
      if (channelsStatus === 'idle') {
        try {
          await dispatch(fetchChannels()).unwrap()
        } catch (err) {
          console.err(err)
          toast.error(t('chat.toastify.connectionError'))
        }
      }
    }
    loadData()
  }, [token, navigate, dispatch, channelsStatus, t])

  useEffect(() => {
    if (currentChannelId === null && channels.length > 0) {
      const generalChannel = channels.find(ch => ch.name === 'general')
      setCurrentChannelId(generalChannel?.id ?? channels[0].id)
    }
  }, [channels, currentChannelId])

  useEffect(() => {
    const socket = connectSocket()
    socketRef.current = socket

    socket.on('newMessage', msg => msg?.id && dispatch(addMessage(msg)))

    socket.on('newChannel', channel => {
      dispatch(addChannel(channel))
      if (currentChannelId === channel.id) {
        setCurrentChannelId(channel.id)
      }
      toast.success(t('chat.toastify.createChannel'), { draggable: true })
    })

    socket.on('removeChannel', channelId => {
      dispatch(deleteChannel(channelId))
      if (currentChannelId === channelId.id) {
        setCurrentChannelId(channels.length > 0 ? channels[0].id : null)
      }
      toast.success(t('chat.toastify.deleteChannel'), { draggable: true })
    })

    socket.on('renameChannel', channel => {
      dispatch(renameChannel(channel))
      toast.success(t('chat.toastify.renameChannel'), { draggable: true })
    })

    return () => {
      socket.off('newMessage')
      socket.off('newChannel')
      socket.off('removeChannel')
      socket.off('renameChannel')
    }
  }, [dispatch, currentChannelId, channels, t])

  useEffect(() => {
    if (channelEndRef.current) {
      channelEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [channels])

  const isError = channelsStatus === 'failed'
  const shouldRenderChat = channelsStatus === 'succeeded' && channels.length > 0

  if (!shouldRenderChat) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('chat.loading')}...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    const errorMessage =
      typeof channelsError === 'object' && channelsError?.message
        ? channelsError.message
        : channelsError || t('chat.unknownError')

    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-danger p-5">
          <strong>{t('chat.errorLoadingData')}</strong>: {errorMessage}
        </div>
      </div>
    )
  }

  const handleChannelClick = channelId => {
    setCurrentChannelId(channelId)
  }

  const builderChannel = channel => {
    return (
      <Nav.Item key={channel.id} className="w-100" as="li">
        {!channel.removable ? (
          <Button
            style={{ border: 'none' }}
            variant={channel.id === currentChannelId ? 'secondary' : 'light'}
            type="button"
            className={'w-100 rounded-0 text-start text-truncate'}
            onClick={() => handleChannelClick(channel.id)}
          >
            <span className="me-1" aria-hidden="true">
              #
            </span>
            {channel.name}
          </Button>
        ) : (
          <Dropdown className="d-flex btn-group" as={ButtonGroup}>
            <Button
              style={{ border: 'none' }}
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className={'w-100 rounded-0 text-start text-truncate'}
              onClick={() => handleChannelClick(channel.id)}
              aria-label={`Канал ${channel.name}`}
            >
              <span className="me-1" aria-hidden="true">
                #
              </span>
              {channel.name}
            </Button>
            <Dropdown.Toggle
              style={{ border: 'none' }}
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              className={'flex-grow-0 dropdown-toggle-split'}
            >
              <span className="visually-hidden">{t('chat.channelManagement')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setChannelToDelete(channel)}>
                {t('chat.delete')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setChannelToUpdate(channel)}>
                {t('chat.rename')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Nav.Item>
    )
  }

  const handleLogout = () => {
    navigate('/signin')
    localStorage.clear()
  }
  return (
    <>
      <ModalAddChannel
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onChannelCreated={newChannel => setCurrentChannelId(newChannel.id)}
      />
      <ModalDeleteChannel
        show={!!channelToDelete}
        onHide={() => setChannelToDelete(null)}
        channel={channelToDelete}
        onChannelDefault={() => {
          setCurrentChannelId(channels.length > 0 ? channels[0].id : null)
        }}
      />
      <ModalEditChannel
        show={!!channelToUpdate}
        onHide={() => setChannelToUpdate(null)}
        channel={channelToUpdate}
        onChannelEdited={updatedChannel => setChannelToUpdate(updatedChannel)}
      />

      <div className="d-flex flex-column h-100">
        <Navbar bg="white" extand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to={'/'} className="navbar-brand">
              {t('nameChat')}
            </Navbar.Brand>
            <Button onClick={handleLogout}>{t('chat.buttonExit')}</Button>
          </Container>
        </Navbar>
        <Container className="h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>{t('chat.title')}</b>
                <Button
                  variant="group-vertical"
                  className="p-0 text-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <BsPlusSquare size={20} />
                  <span className="visually-hidden">+</span>
                </Button>
              </div>
              <Nav
                className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
                as="ul"
              >
                {channels.map(channel => builderChannel(channel))}
                <div ref={channelEndRef} />
              </Nav>
            </div>
            <MessagesBox currentChannelId={currentChannelId} t={t} />
          </div>
        </Container>
      </div>
      <ToastContainer draggable />
    </>
  )
}

export default Chat
