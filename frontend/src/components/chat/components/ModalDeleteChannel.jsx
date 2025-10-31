import axios from "axios"
import * as bootstrap from "bootstrap"
import { useTranslation } from "react-i18next"

const ModalDeleteChannel = ({ channel, onChannelDefault}) => {
    const { t } = useTranslation()
    const deleteChannel = async () => {
        if (!channel) return
        const activeElement = document.querySelector("li .btn-secondary").textContent.trim().slice(1)
        
        try {
            await axios.delete(`/api/v1/channels/${channel.id}`)

            const modalEl = document.getElementById("exampleModalDelete")
            const modal = bootstrap.Modal.getInstance(modalEl)
            modal.hide()

            const isDeletedActive = activeElement === channel.name
            if (isDeletedActive) {
                onChannelDefault()
            }
            document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove())
        } catch (err) {
            console.error("Ошибка при удалении канала:", err)
        }
    }
    return (
        <div 
            className="modal fade" 
            id="exampleModalDelete"
            aria-hidden="true"
            aria-labelledby="exampleModalToggleLabel"
            tab-index="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title h4">{t('chat.deleteChannelModal.title')}</div>
                        <button type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close"></button>
                    </div>
                    <div className="modal-body">
                        <p className="lead">{t('chat.deleteChannelModal.confirmMessage')}</p>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="me-2 btn btn-secondary" data-bs-dismiss="modal">{t('chat.deleteChannelModal.cancel')}</button>
                            <button type="button" className="btn btn-danger" onClick={deleteChannel}>{t('chat.deleteChannelModal.confirm')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ModalDeleteChannel }