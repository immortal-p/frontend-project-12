import * as Yup from "yup";

export const chanelValidationSchema = (t, existingNames = []) => {
  return Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .min(3, t('errors.nameLength'))
      .max(20, t('errors.nameLength'))
      .notOneOf(existingNames, t('errors.existingNames'))
      .required(t('errors.required')),
  });
};
