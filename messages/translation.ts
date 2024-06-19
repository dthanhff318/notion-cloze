import en from "./en.json";
import vi from "./vi.json";
type IndexedObject<T = any> = {
  [key: string]: T;
};
type ConvertedToObjectType<T> = {
  [P in keyof T]: T[P] extends string ? string : ConvertedToObjectType<T[P]>;
};

type TranslationJsonType = typeof import("./en.json");

export const translations: ConvertedToObjectType<TranslationJsonType> =
  {} as any;

const convertLanguageJsonToObject = (
  json: any,
  objToConvertTo: IndexedObject = translations,
  current?: string
) => {
  Object.keys(json).forEach((key) => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof json[key] === "object") {
      objToConvertTo[key] = {};
      convertLanguageJsonToObject(
        json[key],
        objToConvertTo[key],
        currentLookupKey
      );
    } else {
      objToConvertTo[key] = currentLookupKey;
    }
  });
};

convertLanguageJsonToObject(en);
convertLanguageJsonToObject(vi);
