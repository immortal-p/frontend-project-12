import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import avatar_1 from '../assets/avatar_1.jpg';
import axios from 'axios';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Card,
  Navbar,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
} from 'react-bootstrap';

const SignUpForm = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('auth.errors.usernameLength'))
      .max(20, t('auth.errors.usernameLength'))
      .required(t('errors.required')),
    password: Yup.string().min(6, t('auth.errors.passwordLength')).required(t('errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.errors.passwordsMustMatch'))
      .required(t('auth.errors.confirmPasswordRequired')),
  });

  const handleSubmit = async (values, { setStatus }) => {
    setStatus('');
    const { username, password } = values;
    try {
      const response = await axios.post('/api/v1/signup', { username, password });
      if (response.data.token) {
        const { token, username } = response.data;
        dispath(setCredentials({ token, username }));
        navigate('/');
      } else {
        setStatus(t('auth.errors.noToken'));
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 409) {
        setStatus(t('auth.errors.userExists'));
      } else {
        setStatus(t('auth.errors.connectionError'));
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <Container>
            <Navbar.Brand href="/">{t('nameChat')}</Navbar.Brand>
          </Container>
        </Navbar>

        <Container fluid className="h-100">
          <div className="row justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <Card className="shadow-sm">
                <Card.Body className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                  <div>
                    <img src={avatar_1} className="rounded-circle" alt="Войти" />
                  </div>

                  <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    validateOnBlur
                    validateOnChange
                    onSubmit={handleSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setTouched,
                      submitForm,
                      status,
                      isSubmitting,
                    }) => (
                      <Form
                        className="col-12 col-md-6 mt-3 mt-md-0"
                        onSubmit={(e) => {
                          e.preventDefault();

                          if (!values.username) {
                            setTouched({ username: true });
                            return;
                          }
                          if (!values.password) {
                            setTouched({ password: true });
                            return;
                          }
                          if (!values.confirmPassword) {
                            setTouched({ confirmPassword: true });
                            return;
                          }

                          submitForm();
                        }}
                      >
                        <h1 className="text-center mb-4">{t('auth.register.title')}</h1>

                        <FormGroup className="form-floating mb-3">
                          <Field name="username">
                            {({ field }) => (
                              <FormControl
                                {...field}
                                autoComplete="username"
                                required
                                type="text"
                                ref={inputRef}
                                isInvalid={touched.username && errors.username}
                                placeholder={t('register.name')}
                                id="username"
                              />
                            )}
                          </Field>
                          <FormLabel htmlFor="username">{t('auth.register.name')}</FormLabel>
                          <ErrorMessage
                            name="username"
                            component="div"
                            placement="right"
                            className="invalid-tooltip"
                          />
                        </FormGroup>

                        <FormGroup className="form-floating mb-3">
                          <Field name="password">
                            {({ field }) => (
                              <FormControl
                                {...field}
                                autoComplete="password"
                                required
                                type="password"
                                isInvalid={touched.password && errors.password}
                                placeholder={t('register.password')}
                                id="password"
                              />
                            )}
                          </Field>
                          <FormLabel htmlFor="password">{t('auth.register.password')}</FormLabel>
                          <ErrorMessage
                            name="password"
                            component="div"
                            placement="right"
                            className="invalid-tooltip"
                          />
                        </FormGroup>

                        <FormGroup className="form-floating mb-4">
                          <Field name="confirmPassword">
                            {({ field }) => (
                              <FormControl
                                {...field}
                                autoComplete="confirmPassword"
                                required
                                type="password"
                                isInvalid={touched.confirmPassword && errors.confirmPassword}
                                placeholder={t('register.confirmPassword')}
                                id="confirmPassword"
                              />
                            )}
                          </Field>
                          <FormLabel htmlFor="confirmPassword">
                            {t('auth.register.confirmPassword')}
                          </FormLabel>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            placement="right"
                            className="invalid-tooltip"
                          />
                        </FormGroup>

                        {status && (
                          <div className="alert alert-danger text-center py-2">{status}</div>
                        )}
                        <button
                          type="submit"
                          className="w-100 mb-3 btn btn-outline-primary"
                          disabled={isSubmitting}
                        >
                          {t('auth.register.button')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SignUpForm;
