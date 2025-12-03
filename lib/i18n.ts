import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ar from "../locals/ar.json";
import En from "../locals/en.json";

const resources = {
  "ar": { translation: Ar },
  "en": { translation: En },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem("language");
  const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "ar";
  const lng = savedLanguage ?? deviceLanguage;

  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;