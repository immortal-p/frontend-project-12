import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchChannels,
} from '../../slices/chatSlice'
import './utils/chat.scss'
import '../utils/theme.scss'
import { Container, Button, Nav, ButtonGroup, Dropdown, Navbar } from 'react-bootstrap'
import { BsPlusSquare } from 'react-icons/bs'
import { ModalDeleteChannel } from './components/ModalDeleteChannel.jsx'
import { ModalChannel } from './components/ModalChannel.jsx'
import LanguageSwitcher from '../LanguageSwitcher.jsx'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import MessagesBox from './components/MessageBox.jsx'
import { GiBoomerangSun } from "react-icons/gi";
import { GiMoonClaws } from "react-icons/gi";
import { useTheme } from '../utils/useTheme.js'

const Chat = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme() 

  const {
    items: channels,
    status: channelsStatus,
    error: channelsError,
  } = useSelector(state => state.chat.channels)
  const { token } = useSelector(state => state.auth)

  const [currentChannelId, setCurrentChannelId] = useState(null)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToUpdate, setChannelToUpdate] = useState(null)
  const [channelToAdd, setChannelToAdd] = useState(false)

  const channelEndRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        navigate('/signin')
      }
      if (channelsStatus === 'idle') {
        try {
          await dispatch(fetchChannels()).unwrap()
        }
        catch (err) {
          console.error(err)
          toast.error(t('chat.toastify.connectionError'))
        }
      }
    }
    loadData()
  }, [token, navigate, dispatch, t])

  useEffect(() => {
    if (currentChannelId === null && channels.length > 0) {
      const generalChannel = channels.find(ch => ch.name === 'general')
      setCurrentChannelId(generalChannel?.id ?? channels[0].id)
    }
  }, [channels, currentChannelId])

  useEffect(() => {
    const exists = channels.some(ch => ch.id === currentChannelId)
    if (!exists) {
      setCurrentChannelId(channels.length > 0 ? channels[0].id : null)
    }
  }, [channels, currentChannelId])

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
          <span className="visually-hidden">
            {t('chat.loading')}
            ...
          </span>
        </div>
      </div>
    )
  }

  if (isError) {
    const errorMessage = typeof channelsError === 'object' && channelsError?.message
      ? channelsError.message
      : channelsError || t('chat.unknownError')

    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-danger p-5">
          <strong>{t('chat.errorLoadingData')}</strong>
          :
          {errorMessage}
        </div>
      </div>
    )
  }

  const handleChannelClick = (channelId) => {
    setCurrentChannelId(channelId)
  }

  const builderChannel = (channel) => {
    return (
      <Nav.Item key={channel.id} className="w-100" as="li">
        {!channel.removable
          ? (
              <Button
                style={{ border: 'none' }}
                variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                type="button"
                className="w-100 rounded-0 text-start text-truncate text-second-cl"
                onClick={() => handleChannelClick(channel.id)}
              >
                <span className="me-1" aria-hidden="true">
                  #
                </span>
                {channel.name}
              </Button>
            )
          : (
              <Dropdown className="d-flex btn-group channel-dropdown" as={ButtonGroup}>
                <Button
                  style={{ border: 'none' }}
                  variant={channel.id === currentChannelId
                    ? 'secondary'
                    : 'light'}
                  className="w-100 rounded-0 text-start text-truncate text-second-cl text-light2"
                  onClick={() => handleChannelClick(channel.id)}
                  aria-label={`Канал ${channel.name}`}
                >
                  <span className="me-1" aria-hidden="true">
                    #
                  </span>
                  {channel.name}
                </Button>
                <Dropdown.Toggle
                  style={{ borderRadius: 0, border: 0}}
                  variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  className="dropdown-toggle-split"
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
      <ModalChannel
        show={!!channelToAdd}
        onHide={() => setChannelToAdd(null)}
        onSubmit={newChannel => setCurrentChannelId(newChannel.id)}
      />

      <ModalChannel
        show={!!channelToUpdate}
        onHide={() => setChannelToUpdate(null)}
        channel={channelToUpdate}
        onSubmit={updatedChannel => setChannelToUpdate(updatedChannel)}
      />

      <ModalDeleteChannel
        show={!!channelToDelete}
        onHide={() => setChannelToDelete(null)}
        channel={channelToDelete}
        onChannelDefault={() => {
          setCurrentChannelId(channels.length > 0 ? channels[0].id : null)
        }}
      />

      <div className="d-flex flex-column h-100 bg-fon">
        <Navbar bg="white" extand="lg" className="shadow-sm navbar glass-card bg-card">
          <Container>
            <Navbar.Brand as={Link} to="/" className="text-first-cl">
              {t('nameChat')}
            </Navbar.Brand>

            <Container className="d-flex justify-content-end">
              <Container className="d-flex justify-content-end container-chat">
                <LanguageSwitcher />
                <Button className="m-1 p-1 icon-parent" onClick={toggleTheme}>
                  {theme === 'dark'
                  ? <GiMoonClaws className='icon-elem icon' />
                  : <GiBoomerangSun className='icon' />
                  }
                </Button>
              </Container>
              <Button className='m-1 exitBtn' onClick={handleLogout}>{t('chat.buttonExit')}</Button>
            </Container>

          </Container>
        </Navbar>
        <Container className="h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 flex-md-row glass-card bg-card">
            <div className={`col-4 col-md-2 border-end px-0 flex-column h-100 d-flex`}>
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b className="text-second-cl">{t('chat.title')}</b>
                <Button
                  variant="group-vertical"
                  className="p-0 text-primary"
                  onClick={() => setChannelToAdd(true)}
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
