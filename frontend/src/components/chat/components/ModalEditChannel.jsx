import { Formik, Form, Field, ErrorMessage } from "formik";
import { chanelValidationSchema } from "../validation.js";
import { Modal, FormGroup, FormControl, FormLabel, Button} from 'react-bootstrap'
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export const ModalEditChannel = ({ channel, onChannelEdited, show, onHide }) => {
    const formikRef = useRef(null);
    const inputRef = useRef(null);
    const { t } = useTranslation()

    const channels = useSelector((state) => state.chat.channels.items);
    const existingNames = channels
      .map((ch) => ch.name)
      .filter((name) => name !== channel?.name);
    const validationSchema = chanelValidationSchema(t, existingNames);

    const handleSubmit = async (values, { resetForm }) => {
        const updatedChannel = { name: values.channelName };

        try {
            const response = await axios.patch(`/api/v1/channels/${channel.id}`, updatedChannel);
            const editedChannel = response.data;
            onChannelEdited?.(editedChannel);
        } catch (err) {
            console.error("Ошибка при редактировании канала:", err);
        } finally {
          resetForm()
          onHide()
        }
    };

    useEffect(() => {
      if(!show) {
        formikRef.current?.resetForm()
      }
    }, [show]);

    const hanleModalEntered = () => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }

    return (
      <Modal
        centered
        className="fade"
        show={show}
        onHide={onHide}
        onEntered={hanleModalEntered}
        id="modalEdit"
        aria-labelleby="modalToggleLabel"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modalToggleLabel">
            {t('chat.editChannelModal.title')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              innerRef={formikRef}
              initialValues={{ channelName: channel?.name || ""}}
              validationSchema={channel ? validationSchema : null}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, submitCount, resetForm }) => (
                <Form>

                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="channelName" visuallyHidden>
                      {t("chat.channelNameLabel")}
                    </FormLabel>
                    <Field name="channelName">
                      {({ field }) => (
                        <FormControl
                          {...field}
                          ref={inputRef}
                          type="text"
                          isInvalid={!!(errors.channelName && submitCount > 0)}
                          placeholder={t('chat.editChannelModal.placeholderMessage')}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="channelName">
                      {(msg) =>
                        submitCount > 0 && <div className="invalid-feedback d-block">{msg}</div>
                      }
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
                      {t('chat.editChannelModal.cancel')}
                    </Button>
                    <Button type="submit" variant="primary">
                      {t('chat.editChannelModal.confirm')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
        </Modal.Body>
      </Modal>
    );
};

