import * as Yup from "yup";

export const chanelValidationSchema = (existingNames = []) => {
  return Yup.object().shape({
    channelName: Yup.string()
      .trim()
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов")
      .notOneOf(existingNames, "Должно быть уникальным")
      .required("Обязательное поле"),
  });
};
