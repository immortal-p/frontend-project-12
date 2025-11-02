import { Formik, Form, Field, ErrorMessage } from "formik";
import { chanelValidationSchema } from "../validation.js";
import * as bootstrap from "bootstrap";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export const ModalEditChannel = ({ channel, onChannelEdited }) => {
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
            resetForm();

            const modalEl = document.getElementById("exampleModalEdit");
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
            modal.hide()
            
            onChannelEdited?.(editedChannel);
            document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
        } catch (err) {
            console.error("Ошибка при редактировании канала:", err);
        }
    };

    useEffect(() => {
        const modalEl = document.getElementById("exampleModalEdit");
        if (!modalEl) return;

        const handleShown = () => {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
        modalEl.addEventListener("shown.bs.modal", handleShown);

        return () => modalEl.removeEventListener("shown.bs.modal", handleShown);
    }, []);

    return (
      <div
        className="modal fade"
        id="exampleModalEdit"
        aria-hidden="true"
        aria-labelledby="exampleModalEditLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t('chat.editChannelModal.title')}</h5>
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
                initialValues={{ channelName: channel?.name || ""}}
                validationSchema={channel ? validationSchema : null}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, submitCount, resetForm }) => (
                  <Form>
                    <Field name="channelName">
                      {({ field }) => (
                        <input
                          {...field}
                          ref={inputRef}
                          type="text"
                          className={`mb-2 form-control ${
                            errors.channelName && submitCount > 0 ? "is-invalid" : ""
                          }`}
                          placeholder="Новое имя канала"
                          value={channel ? field.value : ""}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="channelName">
                      {(msg) =>
                        submitCount > 0 && <div className="invalid-feedback d-block">{msg}</div>
                      }
                    </ErrorMessage>

                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="me-2 btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => resetForm()}
                      >
                        {t('chat.editChannelModal.cancel')}
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {t('chat.editChannelModal.confirm')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
};

