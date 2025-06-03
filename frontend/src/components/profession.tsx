import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Profession: FC<any> = ({ children }) => {
  const { t } = useTranslation("professions");

  return <>{t(children)}</>;
};
