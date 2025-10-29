import { Formik, Form, Field, ErrorMessage } from "formik"
import { chanelValidationSchema } from "./validation.js"
import * as bootstrap from "bootstrap"
import { useSelector } from "react-redux"
import { useRef, useEffect } from "react"
import axios from "axios"
import { uniqueId } from "lodash"

export const ModalAddChannel = ({ onChannelCreated }) => {
    const formikRef = useRef(null)
    const inputRef = useRef(null)

    const channels = useSelector((state) => state.chat.channels)
    const existingNames = channels.map((ch) => ch.name)
    const validationSchema = chanelValidationSchema(existingNames)

    const handleSubmit = async (values, { resetForm }) => {
      const newChannel = { id: uniqueId(), name: values.channelName }

      try {
        const response = await axios.post("/api/v1/channels", newChannel)
        const createdChannel = response.data
        resetForm()
      
        const modalEl = document.getElementById("exampleModalToggle")
        const modal = bootstrap.Modal.getInstance(modalEl)
        document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove())
        modal.hide()
      
        onChannelCreated?.(createdChannel)
      } 
      catch (err) {
          console.error("Ошибка при создании канала:", err)
      }
  }

    useEffect(() => {
        const modalEl = document.getElementById("exampleModalToggle")
        if (!modalEl) return

        const handleShown = () => inputRef.current?.focus()
        const handleHidden = () => formikRef.current?.resetForm()

        modalEl.addEventListener("shown.bs.modal", handleShown)
        modalEl.addEventListener("hidden.bs.modal", handleHidden)

        return () => {
          modalEl.removeEventListener("shown.bs.modal", handleShown)
          modalEl.removeEventListener("hidden.bs.modal", handleHidden)
        }
    }, [])

    return (
        <div
          className="modal fade"
          id="exampleModalToggle"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel"
          tabIndex="-1"
        >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Добавить канал</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <Formik
                validateOnBlur={false}
                validateOnChange={false}
                innerRef={formikRef}
                initialValues={{ channelName: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, submitCount, resetForm }) => (
                  <Form>
                    <Field name="channelName">
                      {({ field }) => (
                        <input
                          {...field}
                          ref={inputRef}
                          type="text"
                          className={`mb-2 form-control ${ (errors.channelName && submitCount > 0) && "is-invalid"}`}
                          placeholder="Название канала"
                        />
                      )}
                    </Field>
                    <ErrorMessage name="channelName">
                      {msg => submitCount > 0 && <div className="invalid-feedback d-block">{msg}</div>}
                    </ErrorMessage>

                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="me-2 btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => resetForm()}
                      >
                        Отменить
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Отправить
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
    </div>
    )
}
