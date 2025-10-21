import { Formik, Form, Field } from 'formik'

const LogInForm = () => {
    return (
        <div className="container">
            <Formik
                initialValues={{ nickName: "", password: "" }}
                onSubmit={(values, { setSubmitting }) => {
                    console.log('form is validated!', values)
                    values.nickName = ''
                    values.password = ''
                    setSubmitting(false)
                }}
                >
                {({ values, handleChange }) => (
                    <Form>
                        <h1>Вход</h1>
                        <div className="form-group">
                            <label htmlFor='nickName'>NickName</label>
                            <Field 
                                type="text"
                                name="nickName"
                                className="form-control"
                                onChange={handleChange}
                                value={values.nickName}
                                placeholder="Введите ник"
                            />
                        </div>
                        <div className="form-gorup">
                            <label htmlFor='password'>password</label>
                            <Field 
                                type="password"
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                                value={values.password}
                                placeholder="Пароль"
                            />
                        </div>

                        <button type='submit'>Войти</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LogInForm