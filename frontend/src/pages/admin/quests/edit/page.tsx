import { useUserStore } from "~/db/userStore";
import { QuestForm } from "../components/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import { updateQuest } from "~/db/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestFormData, questSchema } from "../components/zod";
import { useQuestStore } from "~/db/questStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useBack } from "~/hooks/useBack";
import { QuestDto } from "~/modules/quests/models";

export const AdminEditQuestPage: React.FC = () => {
  useBack("/admin/tasks");
  const { questId } = useParams();
  const user = useUserStore((state) => state.user);
  const [quest, patchQuest] = useQuestStore((state) => [
    state.getQuest(questId!),
    state.patchQuest,
  ]);

  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/");
  }

  const mutation = useMutation({
    mutationFn: updateQuest,
    onSuccess: () => {
      toast({
        title: "Квест успешно обновлен",
      });
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<QuestFormData> = async (formData) => {
    const result = (await mutation.mutateAsync({
      id: questId!,
      formData,
    })) as QuestDto;

    if (result) {
      patchQuest(questId!, {
        ...result,
      });
    }
  };

  const form = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
  });

  useEffect(() => {
    form.reset(quest as unknown as QuestFormData);
  }, [quest]);

  return (
    <main>
      <h1 className="text-4xl mb-4">Admin: Edit Task</h1>
      <QuestForm
        form={form}
        formData={quest as unknown as QuestFormData}
        onSubmit={handleSubmit}
        isEditing={true}
        isPending={mutation.isPending}
      />
    </main>
  );
};
