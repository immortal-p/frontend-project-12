export default {
  translation: {
    language: 'en',
    nameChat: 'Neko Chat',
    lngRu: 'Ru',
    lngEn: 'En',
    auth: {
      login: {
        title: 'Login',
        name: 'Your nickname',
        password: 'Password',
        button: 'Login',
        noAccount: `Don't have account?`,
        buttonSignUp: 'Sign Up',
      },
      register: {
        title: 'Registration',
        name: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm password',
        button: 'Registration',
        account: 'Remembered',
        buttonSignIn: 'Sign In'
      },
      errors: {
        usernameLength: 'From 3 to 20 characters',
        passwordLength: 'At least 6 characters',
        passwordsMustMatch: 'Passwords must match',
        confirmPasswordRequired: 'Confirm your password',
        invalidCredentials: 'Incorrect username or password',
        userExists: 'This user already exists',
        connectionError: 'Connection error',
        noToken: 'The server did not return the token.',
      },
    },

    chat: {
      title: 'Channels',
      buttonExit: 'Exit',
      messages_one: '{{count}} message',
      messages_other: '{{count}} messages',
      newMessage: 'New message',
      inputMess: 'Enter message...',
      loading: 'Loading data',
      selectChannel: 'Select channel',
      channelManagement: 'Channel management',
      delete: 'Delete',
      rename: 'Rename',
      channelNameLabel: 'Channel name',
      nameLabel: 'Channel name',
      errors: {
        connectionError: 'Failed to send message. Check your connection.',
        unknownError: 'unknown error',
        errorLoadingData: 'error loading data',
      },
      addChannelModal: {
        title: 'Add channel',
        confirm: 'Send',
        cancel: 'Cancel',
        placeholderMessage: 'Channel name',
      },
      editChannelModal: {
        title: 'Rename channel',
        confirm: 'Send',
        cancel: 'Cancel',
        placeholderMessage: 'New channel name',
      },
      deleteChannelModal: {
        title: 'Delete channel',
        confirmMessage: 'We are sure ?',
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      toastify: {
        loadingDataError: 'Failed to load data',
        connectionError: 'Connection error',
        createChannel: 'Channel created',
        deleteChannel: 'Channel deleted',
        renameChannel: 'Channel renamed',
      },
    },

    errors: {
      nameLength: 'From 3 to 20 characters',
      existingNames: 'Must be unique',
      required: 'Required field',
    },
  },
}
