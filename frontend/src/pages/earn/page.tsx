import { useTranslation } from "react-i18next";
import { useBack } from "~/hooks/useBack";
import { Link, Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const EarnPage: React.FC = () => {
  useBack("/");

  const { t } = useTranslation();

  return (
    <>
      <main className="flex-1 flex flex-col pb-4 space-y-4">
        <header className="flex items-center justify-between relative z-10">
          <h1 className="text-4xl font-semibold">{t("games")}</h1>
        </header>
        <Tabs
          defaultValue="drink"
          value={location.pathname.split("/")[2] || ""}
          className=" relative z-10"
        >
          <TabsList className="w-full">
            <TabsTrigger value="" className="flex-1" asChild>
              <Link to="/earn">{t("combo")}</Link>
            </TabsTrigger>
            <TabsTrigger value="bubble" className="flex-1" asChild>
              <Link to="/earn/bubble">{t("bubble")}</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <section className="relative z-[1]">
          <Outlet />
        </section>
      </main>
    </>
  );
};
