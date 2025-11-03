import { Formik, Form, Field, ErrorMessage } from "formik"
import { chanelValidationSchema } from "../validation.js"
import { Modal, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { useRef, useEffect } from "react"
import axios from "axios"
import { uniqueId } from "lodash"
import { useTranslation } from "react-i18next"
import filter from 'leo-profanity'

export const ModalAddChannel = ({ onChannelCreated, show, onHide }) => {
    const formikRef = useRef(null)
    const inputRef = useRef(null)
    const { t } = useTranslation()

    const channels = useSelector(state => state.chat.channels.items)
    const existingNames = channels.map((ch) => ch.name)
    const validationSchema = chanelValidationSchema(t, existingNames)

    const handleSubmit = async (values, { resetForm }) => {
      const cleanValues = filter.clean(values.channelName)
      const newChannel = { id: uniqueId(), name: cleanValues }

      try {
        const response = await axios.post("/api/v1/channels", newChannel)
        const createdChannel = response.data
        resetForm()
        onHide()
      
        onChannelCreated?.(createdChannel)
      } 
      catch (err) {
          console.error("Ошибка при создании канала:", err)
      }
  }

    useEffect(() => {
      if(show) {
        inputRef.current?.focus()
      }
      if(!show) {
        formikRef.current?.resetForm()
      }
    }, [show])

    return (
        <Modal
          show={show}
          onHide={onHide}
          centered
          id="modalAdd"
          aria-labelledby="modalToggleLabel"
        >
            <Modal.Header closeButton>
              <Modal.Title id="modalToggleLabel">
                {t('chat.addChannelModal.title')}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
                    <FormGroup className="mb-2">
                      <Field name="channelName">
                        {({ field }) => (
                          <FormControl
                            {...field}
                            className="mb-2"
                            ref={inputRef}
                            isInvalid={!!(errors.channelName && submitCount > 0)}
                            placeholder={t("chat.addChannelModal.placeholderMessage")}
                          />
                        )}
                      </Field>
                      <FormLabel htmlFor="channelName" visuallyHidden>
                        {t('chat.nameLabel')}
                      </FormLabel>
                      <ErrorMessage name="channelName">
                        {msg => submitCount > 0 && <div className="invalid-feedback d-block">{msg}</div>}
                      </ErrorMessage>
                    </FormGroup>

                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => {
                          resetForm()
                          onHide()
                        }}
                      >
                        {t('chat.addChannelModal.cancel')}
                      </Button>
                      <Button type="submit" variant="primary">
                        {t('chat.addChannelModal.confirm')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
      </Modal>
    )
}
