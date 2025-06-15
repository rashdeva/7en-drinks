import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useQuestStore } from "~/db/questStore";
import { useUserStore } from "~/db/userStore";
import { useBack } from "~/hooks/useBack";

export function AdminQuestsPage() {
  useBack("/");
  const quests = useQuestStore((state) => state.quests);
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  // const { data: todayCombo } = useQuery({
  //   queryKey: ["admin", "combo"],
  //   queryFn: todayCombination,
  // });

  if (!user || user.role !== "admin") {
    navigate("/");
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl">Admin: Tasks</h1>
          <Button asChild>
            <Link to={"/admin/tasks/add"}>Add Task</Link>
          </Button>
        </header>

        <div>
          {quests.length > 0 ? (
            <div className="space-y-3">
              {quests.map((quest) => (
                <Card key={quest._id}>
                  <Link
                    to={`/admin/tasks/${quest._id}`}
                    className="flex items-center py-3"
                  >
                    <CardContent className="flex py-0 w-full items-start gap-2">
                      <div className="w-full">
                        <Badge
                          variant={
                            quest.hidden || quest.disabled
                              ? "destructive"
                              : "default"
                          }
                        >
                          {quest.type}
                        </Badge>
                        <h3 className="text-lg mr-auto pr-2 mt-1">
                          {quest.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {quest.description}
                        </p>
                      </div>

                      <strong className="whitespace-nowrap">
                        {quest.tokens} {t("points")}
                      </strong>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p>No quests available</p>
          )}
        </div>
      </section>
    </div>
  );
}
