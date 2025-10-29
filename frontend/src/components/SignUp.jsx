import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slices/authSlice'
import { addUser } from '../slices/usersSlice'
import avatar_1 from '../assets/avatar_1.jpg'
import axios from 'axios'
import * as Yup from "yup"

const SignUpForm = () => {
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const dispath = useDispatch()

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "От 3 до 20 симоволов")
            .max(20, "От 3 lj 20 символов")
            .required("Обязательное поле"),
        password: Yup.string()
            .min(6, "Минимум 6 символов")
            .required("Обязательное поле"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Пароль должны совпадать")
            .required("Подвердите пароль")
            
    })

    const handleSubmit = async (values, { setStatus }) => {
        setStatus("")
        const { username, password } = values
        try {
            const response = await axios.post("/api/v1/signup", { username, password })
            if (response.data.token) {
                const { token, username } = response.data
                dispath(setCredentials({ token, username }))
                dispath(addUser({ token, username }))
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
            if(err.response?.status === 409) {
                setStatus('Такой пользователь уже сущестует')
            }
            else {
                setStatus('Ошибка соединение')
            }
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    })

    return (
        <div className="h-100" id="chat">
            <div className="d-flex flex-column h-100">
                <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                    <div className="container">
                        <a className="navbar-brand" href="/">Hexlet Chat</a>
                    </div>
                </nav>
                <div className="container-fluid h-100">
                    <div className="row justify-content-center align-content-center h-100">
                        <div className="col-12 col-md-8 col-xxl-6">
                            <div className="card shadow-sm">
                                <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                                    <div>
                                        <img src={avatar_1} className='rounded-circle' alt="Войти"/>
                                    </div>
                                        <Formik
                                            initialValues={{ username: "", password: "", confirmPassword: ""}}
                                            validationSchema={validationSchema}
                                            validateOnBlur
                                            validateOnChange
                                            onSubmit={handleSubmit}
                                        >
                                            {({ values, errors, touched, setTouched, submitForm, status, isSubmitting }) => (
                                                <Form 
                                                    className="col-12 col-md-6 mt-3 mt-md-0"
                                                    onSubmit={(e) => {
                                                        e.preventDefault()

                                                            if (!values.username) {
                                                                setTouched({ username: true })
                                                                return
                                                            }
                                                            if (!values.password) {
                                                                setTouched({ password: true })
                                                                return
                                                            }
                                                            if (!values.confirmPassword) {
                                                                setTouched({ confirmPassword: true })
                                                                return
                                                            }

                                                        submitForm()
                                                        }
                                                    }>
                                                    <h1 className="text-center mb-4">Регистрация</h1>

                                                    <div className="form-floating mb-3">
                                                        <Field
                                                            className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                                                            type='text'
                                                            name="username"
                                                            placeholder='От 3 до 20 символов'
                                                            innerRef={inputRef}
                                                            autoComplete="username"
                                                        />
                                                        <label className='form-label' htmlFor="username">Ваш ник</label>
                                                        <ErrorMessage name="username" component="div" placement="right" className="invalid-tooltip" />
                                                    </div>

                                                    <div className="form-floating mb-3">
                                                        <Field
                                                            className={`form-control ${ touched.password && errors.password ? 'is-invalid' : ''}`}
                                                            type="password"
                                                            name="password"
                                                            placeholder='Не менее 6 символов'
                                                            autoComplete="new-password"
                                                        />
                                                        <label className='form-label' htmlFor="password">Пароль</label>
                                                        <ErrorMessage name="password" component="div" placement="right" className="invalid-tooltip" />
                                                    </div>

                                                    <div className="form-floating mb-3">
                                                        <Field
                                                            className={`form-control ${ touched.confirmPassword && errors.confirmPassword ? 'is-invalid': ''}`}
                                                            type="password"
                                                            name="confirmPassword"
                                                            placeholder="Пароли должны совпадать"
                                                            autoComplete="new-password"
                                                        ></Field>
                                                        <label className='form-label' htmlFor="confirmPassword">Подтвердите пароль</label>
                                                        <ErrorMessage name="confirmPassword" component="div" placement="right" className="invalid-tooltip" />
                                                    </div>
                                                    
                                                    {status && (
                                                        <div className="alert alert-danger text-center py-2">{status}</div>
                                                    )}
                                                    <button type='submit' className='w-100 mb-3 btn btn-outline-primary' disabled={isSubmitting}>Зарегистрироваться</button>
                                                </Form>
                                            )}
                                        </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpForm