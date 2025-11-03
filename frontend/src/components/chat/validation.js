import * as Yup from 'yup';
import filter from 'leo-profanity';

export const chanelValidationSchema = (t, existingNames = []) => {
  return Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .min(3, t('errors.nameLength'))
      .max(20, t('errors.nameLength'))
      .notOneOf(existingNames, t('errors.existingNames'))
      .transform(value => filter.clean(value))
      .required(t('errors.required')),
  });
};
