import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Category: FC<any> = ({ children }) => {
  const { t } = useTranslation("categories");

  return <>#{t(children)}</>;
};
