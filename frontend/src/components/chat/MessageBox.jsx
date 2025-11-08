import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { uniqueId } from 'lodash'
import filter from 'leo-profanity'
import { toast } from 'react-toastify'
import sendMessage from './sendMessage'
import { BsArrowRightSquare } from 'react-icons/bs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import { Form, Button } from 'react-bootstrap'
import { fetchMessages } from '../../slices/chatSlice'

const MessagesBox = ({ currentChannelId, t }) => {
  const dispath = useDispatch()
  const { items: messages } = useSelector(state => state.chat.messages)
  const currentChannel = useSelector(state =>
    state.chat.channels.items.find(ch => ch.id === currentChannelId),
  )

  const { username } = useSelector(state => state.auth)
  const [newMessage, setNewMessage] = useState('')
  const [localMessages, setLocalMessages] = useState([])
  const messageEndRef = useRef(null)
  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId).concat(localMessages).sort((a, b) => a.timestamp - b.timestamp)
  const totalMessages = currentMessages.length

  useEffect(() => {
    if (currentChannelId) {
      dispath(fetchMessages(currentChannelId))
    }
  }, [currentChannelId, dispath])

  useEffect(() => {
    if (!currentMessages.length) return

    const lastMessage = currentMessages.at(-1)

    if (lastMessage.username === username && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [currentMessages, username])

  if (!currentChannel) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <p className="text-muted">{t('chat.selectChannel')}</p>
      </div>
    )
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const body = formData.get('body').trim()
    if (!body || !currentChannelId) return

    const cleanBody = filter.clean(body)
    const msg = { id: uniqueId(), body: cleanBody, channelId: currentChannelId, username, timestamp: Date.now() }
    try {
      await sendMessage(msg)
    }
    catch (err) {
      console.error(err)
      setLocalMessages(prev => [...prev, msg])
      toast.error(t('chat.toastify.connectionError'))
    }

    setNewMessage('')
    e.target.reset()
  }

  const builderMessage = (message, status = 200) => (
    <div key={message.id} className="text-brak mb-2 text-container">
      <div>
        <b>{message.username}</b>
        :
        {message.body}
      </div>
      {status === 200
        ? <IoCheckmarkDoneOutline size={20} className="doneCheck" />
        : <IoCheckmarkOutline size={20} className="noneCheck" />}
    </div>
  )

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${currentChannel.name}`}</b>
          </p>
          <span className="text-muted">{t('chat.messages', { count: totalMessages })}</span>
        </div>

        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {currentMessages.map(message => (
            localMessages.includes(message)
              ? builderMessage(message, 400)
              : builderMessage(message)
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="mt-auto px-5 py-3">
          <Form noValidate onSubmit={handleSendMessage} className="py-1 border rounded-2">
            <Form.Group className="input-group">
              <Form.Control
                name="body"
                placeholder={t('chat.inputMess')}
                className="border-0 p-0 ps-2"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <Button
                style={{ border: 'none' }}
                type="submit"
                variant="group-vertical"
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
  )
}

export default MessagesBox
