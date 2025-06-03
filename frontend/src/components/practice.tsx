import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Practice: FC<any> = ({ children }) => {
  const { t } = useTranslation("practices");

  return <>{t(children)}</>;
};
