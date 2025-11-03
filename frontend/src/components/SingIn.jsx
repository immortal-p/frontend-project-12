import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import avatar from '../assets/avatar.jpg'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Card, Navbar, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap'

const LogInForm = () => {
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  
  const handleSubmit = async (values, { setStatus }) => {
    setStatus("")

    try {
      const response = await axios.post("/api/v1/login", values)

      if (response.data.token) {
        const { token, username } = response.data
        dispatch(setCredentials({ token, username }))
        navigate('/')
      } else {
        setStatus(t('auth.errors.noToken'))
      }
    } catch (err) {
      console.error('Login error:', err)

      if (err.response?.status === 401) {
        setStatus(t('auth.errors.invalidCredentials'))
      } else {
        setStatus(t('auth.errors.connectionError'))
      }
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    navigate("/signup")
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <Container>
            <Navbar.Brand href="/">{t('nameChat')}</Navbar.Brand>
          </Container>
        </Navbar>

        <Container fluid className="h-100">
          <Row className="justify-content-center align-content-center h-100">
            <Col xs={12} md={8} xxl={6}>
              <Card className="shadow-sm">
                <Card.Body className="row p-5">
                  <Col xs={12} md={6} className="d-flex align-items-center justify-content-center mb-4 mb-md-0">
                    <img src={avatar} className="rounded-circle" alt="Войти" />
                  </Col>

                  <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={handleSubmit}
                  >
                    {({ status }) => (
                      <Form className="col-12 col-md-6 mt-3 mt-md-0">
                        <h1 className="text-center mb-4">{t('auth.login.title')}</h1>

                        <FormGroup className="form-floating mb-3">
                            <Field name="username">
                              {({ field }) => (
                                  <FormControl
                                  {...field}
                                  required
                                  type="text"
                                  ref={inputRef}
                                  placeholder={t('auth.login.name')}
                                  isInvalid={!!status}
                                  autoComplete="username"
                                  id="username"
                                  />
                              )}
                            </Field>
                            <FormLabel htmlFor="username">{t('auth.login.name')}</FormLabel>
                        </FormGroup>

                        <FormGroup className="form-floating mb-3">
                            <Field name="password">
                              {({ field }) => (
                                  <FormControl
                                  {...field}
                                  required
                                  type="password"
                                  placeholder={t('auth.login.password')}
                                  isInvalid={!!status}
                                  autoComplete="current-password"
                                  id="password"
                                  />
                              )}
                            </Field>
                            <FormLabel htmlFor="password">{t('auth.login.password')}</FormLabel>
                              {status && (
                                <div className="invalid-tooltip d-block">{status}</div>
                              )}
                        </FormGroup>

                        <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                          {t('auth.login.button')}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>

                <Card.Footer className="p-4 text-center">
                  <span>{t('auth.login.noAccount')} </span>
                  <a href="" onClick={handleSignUp}>
                    {t('auth.login.buttonSignUp')}
                  </a>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>

      </div>
    </div>
  )
}

export default LogInForm
