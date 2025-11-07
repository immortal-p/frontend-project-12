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
          buttonSignUp: 'Регистрация',
        },
        register: {
          title: 'Регистрация',
          name: 'Имя пользователя',
          password: 'Пароль',
          confirmPassword: 'Подтвердите пароль',
          button: 'Зарегистрироваться',
        },
        errors: {
          usernameLength: 'От 3 до 20 символов',
          passwordLength: 'Не менее 6 символов',
          passwordsMustMatch: 'Пароли должны совпадать',
          confirmPasswordRequired: 'Подтвердите пароль',
          invalidCredentials: 'Неверные имя пользователя или пароль',
          userExists: 'Такой пользователь уже существует',
          connectionError: 'Ошибка соединения',
          noToken: 'Сервер не вернул токен',
        },
      },

      chat: {
        title: 'Каналы',
        buttonExit: 'Выйти',
        messages_one: '{{count}} сообщение',
        messages_few: '{{count}} сообщения',
        messages_many: '{{count}} сообщений',
        newMessage: 'Новое сообщение',
        inputMess: 'Введите сообщение...',
        loading: 'Загрузка данных',
        selectChannel: 'Выберите канал',
        channelManagement: 'Управление каналом',
        delete: 'Удалить',
        rename: 'Переименовать',
        channelNameLabel: 'Название канала',
        nameLabel: 'Имя канала',
        errors: {
          connectionError: 'Не удалось отправить сообщение. Проверьте соединение.',
          unknownError: 'неизвестная ошибка',
          errorLoadingData: 'ошибка при загрузке данных',
        },
        addChannelModal: {
          title: 'Добавить канал',
          confirm: 'Отправить',
          cancel: 'Отменить',
          placeholderMessage: 'Название канала',
        },
        editChannelModal: {
          title: 'Переименовать канал',
          confirm: 'Отправить',
          cancel: 'Отменить',
          placeholderMessage: 'Новое имя канала',
        },
        deleteChannelModal: {
          title: 'Удалить канал',
          confirmMessage: 'Уверены ?',
          confirm: 'Удалить',
          cancel: 'Отменить',
        },
        toastify: {
          loadingDataError: 'Не удалось загрузить данные',
          connectionError: 'Ошибка соеденение',
          createChannel: 'Канал создан',
          deleteChannel: 'Канал удалён',
          renameChannel: 'Канал переименован',
        },
      },

      errors: {
        nameLength: 'От 3 до 20 символов',
        existingNames: 'Дожно быть уникальным',
        required: 'Обязательное поле',
      },
    },
  },
}
