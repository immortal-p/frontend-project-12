export default {
    ru: {
        translation: {
            language: 'ru',
            nameChat: 'Hexlet Chat',
            auth: {
                login: {
                    title: 'Войти',
                    name: 'Ваш ник',
                    password: 'Пароль',
                    button: 'Войти',
                    noAccount: 'Нет аккаунта ?',
                    buttonSignUp: 'Регистрация'
                },
                register: {
                    title: 'Регистрация',
                    name: 'Имя пользователя',
                    password: 'Пароль',
                    confirmPassword: 'Подтвердите пароль',
                    button: 'Зарегистрироваться'
                },
                errors: {
                    usernameLength: 'От 3 до 20 символов',
                    passwordLength: 'Минимум 6 символов',
                    passwordsMustMatch: 'Пароли должны совпадать',
                    confirmPasswordRequired: 'Подтвердите пароль',
                    invalidCredentials: 'Неверные имя пользователя или пароль',
                    userExists: 'Такой пользователь уже существует',
                    connectionError: 'Ошибка соединения',
                    noToken: 'Сервер не вернул токен'
                }
            },

            chat: {
                title: 'Каналы',
                buttonExit: 'Выйти',
                messages: 'сообщений',
                inputMess: 'Введите сообщение...',
                errors: {
                    connectionError: 'Не удалось отправить сообщение. Проверьте соединение.',
                },
                addChannelModal: {
                    title: 'Добавить канал',
                    nameLabel: 'Название канала', 
                    confirm: 'Отправить',
                    cancel: 'Отменить'
                },
                editChannelModal: {
                    title: 'Переименовать канал',
                    confirm: 'Отправить',
                    cancel: 'Отменить'
                },
                deleteChannelModal: {
                    title: 'Удалить канал',
                    confirmMessage: 'Уверены',
                    confirm: 'Удалить',
                    cancel: 'Отменить'
                },
                toastify: {
                    connectionError: 'Не удалось загрузить данные',
                    createChannel: 'Канал создан',
                    deleteChannel: 'Канал удалён',
                    renameChannel: 'Канал переименован',
                }
                
            },

            errors: {
                nameLength: 'От 3 до 20 символов',
                existingNames: 'Дожно быть уникальным',
                required: 'Обязательное поле',
            }

        }
    }
};