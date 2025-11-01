import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import avatar from '../assets/avatar.jpg'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const LogInForm = () => {
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const dispath = useDispatch()
    const { t } = useTranslation()

    const handleSubmit = async (values, { setStatus }) => {
        setStatus("")

        try {
            const response = await axios.post("/api/v1/login", values )

            if (response.data.token) {
                const { token, username } = response.data
                dispath(setCredentials({ token, username }))
                navigate('/')
            } 
            else {
                setStatus('Error: The server did not return a token.')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setStatus('Неверные имя пользователя или пароль')
            }
            else {
                setStatus('Ошибка соединение')
            }
        }
    }

    const handleSignUp = () => {
        navigate("/signup")
    }

    useEffect(() => {
        inputRef.current?.focus()
    })

    return (
        <div className="h-100" id="chat">
            <div className="d-flex flex-column h-100">
                <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        <a className="navbar-brand" href="/">{t('nameChat')}</a>
                    </div>
                </nav>
                <div className="container-fluid h-100">
                    <div className="row justify-content-center align-content-center h-100">
                        <div className="col-12 col-md-8 col-xxl-6">
                            <div className="card shadow-sm">
                                <div className="card-body row p-5">
                                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                        <img src={avatar} className='rounded-circle' alt="Войти"/>
                                    </div>
                                    <Formik
                                        initialValues={{ username: "", password: "" }}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ status }) => (
                                            <Form className="col-12 col-md-6 mt-3 mt-md-0">
                                                <h1 className="text-center mb-4">{t('auth.login.title')}</h1>
                                                <div className="form-floating mb-3">
                                                    <Field
                                                        className={`form-control ${status ? 'is-invalid' : ''}`}
                                                        type='text'
                                                        name="username"
                                                        placeholder={t('auth.login.name')}
                                                        innerRef={inputRef}
                                                        autoComplete="username"
                                                    />
                                                    <label htmlFor="username">{t('auth.login.name')}</label>
                                                </div>
                                                <div className="form-floating mb-4">
                                                    <Field
                                                        className={`form-control ${status ? 'is-invalid' : ''}`}
                                                        type="password"
                                                        name="password"
                                                        placeholder={t('auth.login.passwor')}
                                                        autoComplete="password"
                                                    />
                                                    <label htmlFor="password">{t('auth.login.password')}</label>
                                                    {status && (
                                                        <div className="invalid-tooltip d-block">{status}</div>
                                                    )}
                                                </div>
                                                <button type='submit' className='w-100 mb-3 btn btn-outline-primary'>{t('auth.login.button')}</button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                                <div className="card-footer p-4">
                                    <div className='text-center'>
                                        <span>{t('auth.login.noAccount')}</span>
                                        <a href="" onClick={handleSignUp}>{t('auth.login.buttonSignUp')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogInForm