import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ModalDeleteChannel = ({ channel, onChannelDefault, show, onHide }) => {
  const { t } = useTranslation()

  const handleDelete = async () => {
    if (!channel) return
    const activeElement = document.querySelector('li .btn-secondary').textContent.trim().slice(1)

    try {
      await axios.delete(`/api/v1/channels/${channel.id}`)
      const isDeletedActive = activeElement === channel.name
      if (isDeletedActive) {
        onChannelDefault()
      }
      onHide()
    }
    catch (err) {
      console.error('Ошибка при удалении канала:', err)
      onHide()
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="fade"
      id="modalDelete"
      centered
      aria-labelledby="modalToggleLabel"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modalToggleLabel">{t('chat.deleteChannelModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('chat.deleteChannelModal.confirmMessage')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onHide}>
            {t('chat.deleteChannelModal.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('chat.deleteChannelModal.confirm')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export { ModalDeleteChannel }
