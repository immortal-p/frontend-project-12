import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import logInImg from '../assets/logInImg.webp'
import axios from 'axios'

const LogInForm = () => {
    const navigate = useNavigate()
    const dispath = useDispatch()

    const handleSubmit = async (values, { setStatus }) => {
        setStatus("")

        try {
            const response = await axios.post("/api/v1/login", values )

            if (response.data.token) {
                const token = response.data.token
                dispath(setCredentials({ token: token, username: response.data.username }))
                navigate('/')
            } 
            else {
                setStatus('Error: The server did not return a token.')
            }
        } catch (err) {
            console.error('Login error:', err)
            if (err.response?.status === 401) {
                setStatus('Неверные имя пользователя или пароль')
            }
            else {
                setStatus('Ошибка соеденение')
            }
        }
    }

    return (
        <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
                <div className="col-12 col-md-8 col-xxl-6">
                    <div className="card shadow-sm">
                        <div className="card-body row p-5">
                            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                <img src={logInImg} className='rounded-circle' alt="Войти"/>
                            </div>
                            <Formik
                                initialValues={{ username: "", password: "" }}
                                onSubmit={handleSubmit}
                            >
                                {({ status }) => (
                                    <Form className="col-12 col-md-6 mt-3 mt-md-0">
                                        <h1 className="text-center-h4">Войти</h1>
                                        <div className="form-floating mb-3">
                                            <Field
                                                className={`form-control ${status ? 'is-invalid' : ''}`}
                                                type='text'
                                                name="username"
                                                placeholder='Ваш ник'
                                            />
                                            <label htmlFor="username">Ваш ник</label>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <Field
                                                className={`form-control ${status ? 'is-invalid' : ''}`}
                                                type="password"
                                                name="password"
                                                placeholder='Пароль'
                                            />
                                            <label htmlFor="password">Пароль</label>
                                            {status && (
                                                <div className="invalid-tooltip d-block">{status}</div>
                                            )}
                                        </div>
                                        <button type='submit' className='w-100 mb-3 btn btn-outline-primary'>Войти</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="card-footer p-4">
                            <div className='text-center'>
                                <span>Нет аккаунта?</span>
                                <a href="#">Регистрация</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogInForm