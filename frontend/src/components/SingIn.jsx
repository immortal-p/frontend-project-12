import { useEffect, useRef } from 'react'
import { Formik, Form, Field } from 'formik'
import avatar from '../assets/NazunaNanakusa.png'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
} from 'react-bootstrap'
import './utils/style.css'
import { useAuth } from '../slices/useAuth.js'
import { GiBoomerangSun } from "react-icons/gi";
import { GiMoonClaws } from "react-icons/gi";
import LanguageSwitcher from './LanguageSwitcher.jsx'
import checkTheme from './utils/checkTheme.js'
import { useTheme } from './utils/useTheme.js'

const LogInForm = () => {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { t } = useTranslation()
  const { extended: signin, status: authStatus } = useAuth()
  const values = { username: '', password: '' }
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (values) => {
    const { username, password } = values
    const url = '/api/v1/login'
    signin(url, username, password)
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    navigate('/signup')
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="h-100">
      <div className={`d-flex flex-column h-100 ${checkTheme(theme, "dark-theme-bg")}`}>
        <Navbar className={`shadow-sm navbar ${checkTheme(theme, "glass-card bg-card")}`}>
          <Container>
            <Navbar.Brand className={`${checkTheme(theme, "text-first-cl text-light")}`} href="/">{t('nameChat')}</Navbar.Brand>
            <Container className="d-flex justify-content-end">
              <LanguageSwitcher />
              <Button className="m-1 p-1 icon-parent" onClick={toggleTheme}>
                {theme === 'dark'
                ? <GiMoonClaws className='icon-elem icon' />
                : <GiBoomerangSun className='icon' />
                }
              </Button>
            </Container>
          </Container>
        </Navbar>

        <Container fluid className="h-100">
          <Row className="justify-content-center align-content-center h-100">
            <Col xs={12} md={8} xxl={6}>
              <Card className={`${checkTheme(theme, "glass-card bg-card", "navbar-light bg-light")}`}>
                <Card.Body className="row p-5">
                  <Col
                    xs={12}
                    md={6}
                    className="d-flex align-items-center justify-content-center mb-4 mb-md-0"
                  >
                    <img src={avatar} alt="Войти" />
                  </Col>

                  <Formik initialValues={values} onSubmit={handleSubmit}>
                    {({ status }) => (
                      <Form className="col-12 col-md-6 mt-3 mt-md-0">
                        <h1 className={`text-center mb-4 ${checkTheme(theme, "text-first-cl text-light", "")}`}>{t('auth.login.title')}</h1>

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
                          <FormLabel className={`${checkTheme(theme, 'text-first-cl text-light')}`} htmlFor="username">{t('auth.login.name')}</FormLabel>
                        </FormGroup>

                        <FormGroup className="form-floating mb-3">
                          <Field name="password">
                            {({ field }) => (
                              <FormControl
                                {...field}
                                required
                                type="password"
                                placeholder={t('auth.login.password')}
                                isInvalid={!!authStatus}
                                autoComplete="current-password"
                                id="password"
                              />
                            )}
                          </Field>
                          <FormLabel className={`${checkTheme(theme, 'text-first-cl text-light')}`} htmlFor="password">{t('auth.login.password')}</FormLabel>
                          {authStatus && <div className="invalid-tooltip d-block">{authStatus}</div>}
                        </FormGroup>

                        <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                          {t('auth.login.button')}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>

                <Card.Footer className="p-4 text-center">
                  <span className={`${checkTheme(theme, "text-second-cl text-light2")}`}>
                    {t('auth.login.noAccount')}
                  </span>
                  <a href="" className="m-2" onClick={handleSignUp}>
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
