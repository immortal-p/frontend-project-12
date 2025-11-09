import { Formik, Form, Field, ErrorMessage } from 'formik'
import { chanelValidationSchema } from '../validation.js'
import { Modal, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useRef, useEffect } from 'react'
import axios from 'axios'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import filter from 'leo-profanity'

export const ModalChannel = ({ channel = null, onSubmit, show, onHide }) => {
  const isEdit = Boolean(channel)
  const formikRef = useRef(null)
  const inputRef = useRef(null)
  const { t } = useTranslation()

  const channels = useSelector(state => state.chat.channels.items)
  const existingNames = channels.map(ch => ch.name)
  const validationSchema = chanelValidationSchema(t, existingNames)

  const handleSubmit = async (values, { resetForm }) => {
      const cleanName = filter.clean(values.channelName)
      const channelBody = { ...(isEdit && { id: uniqueId() }), name: cleanName }
      const url = isEdit
        ? `/api/v1/channels/${channel.id}`
        : `/api/v1/channels`
      const method = isEdit ? 'patch' : 'post'
      try {
          const response = await axios[method](url, channelBody)
          const resultChanel = response.data
          onSubmit?.(resultChanel)
      }
      catch (err) {
          console.error(`Ошибка при ${isEdit ? 'редактировании' : 'создании'} канала:`, err)
      }
      finally {
          resetForm()
          onHide()
      }
    }

  useEffect(() => {
      if (!show) {
          formikRef.current?.resetForm()
      }
  }, [show])

  const hanleModalEntered = () => {
      inputRef.current?.focus()
      inputRef.current?.select()
  }

return (
    <Modal
        show={show}
        onHide={onHide}
        onEntered={hanleModalEntered}
        centered
        id={`modal-${isEdit ? 'edit': 'add'}`}
    >
        <Modal.Header closeButton>
            <Modal.Title>
                {isEdit
                    ? t('chat.editChannelModal.title')
                    : t('chat.addChannelModal.title')
                }
            </Modal.Title>
        </Modal.Header>

          <Modal.Body>
              <Formik
                  validateOnBlur={false}
                  validateOnChange={false}
                  innerRef={formikRef}
                  initialValues={{ channelName: channel?.name || '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
              >
                  {({ errors, submitCount, resetForm }) => (
                      <Form>
                          <FormGroup className="mb-2">
                              <Field name="channelName">
                                  {({ field }) => (
                                      <FormControl
                                          {...field}
                                          id="channelName"
                                          ref={inputRef}
                                          aria-label={t('chat.nameLabel')}
                                          type="text"
                                          isInvalid={!!(errors.channelName && submitCount > 0)}
                                          placeholder={
                                              isEdit
                                                ? t('chat.editChannelModal.placeholderMessage')
                                                : t('chat.addChannelModal.placeholderMessage')
                                          }
                                      ></FormControl>
                                  )}
                              </Field>

                              <FormLabel htmlFor="channelName" visuallyHidden>
                                  {t('chat.nameLabel')}
                              </FormLabel>

                              <ErrorMessage name="channelName">
                                  {msg => submitCount > 0 && (
                                      <div className="invalid-feedback d-block">{msg}</div>
                                  )}
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
                                {isEdit
                                  ? t('chat.editChannelModal.cancel')
                                  : t('chat.addChannelModal.cancel')}
                              </Button>

                              <Button type="submit" variant="primary">
                                  {isEdit
                                    ? t('chat.editChannelModal.confirm')
                                    : t('chat.addChannelModal.confirm')}
                              </Button>
                          </div>
                      </Form>
                  )}
              </Formik>
          </Modal.Body>
      </Modal>
  )
}