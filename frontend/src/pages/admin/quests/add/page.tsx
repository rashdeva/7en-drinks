import { useUserStore } from "~/db/userStore";
import { QuestForm } from "../components/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import { addQuest } from "~/db/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestFormData, questSchema } from "../components/zod";
import { useBack } from "~/hooks/useBack";
import { useNavigate } from "react-router-dom";

export const AdminAddQuestPage: React.FC = () => {
  useBack("/admin/tasks");
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/");
  }

  const mutation = useMutation({
    mutationFn: addQuest,
    onSuccess: () => {
      toast({
        title: "Квест успешно добавлен",
      });
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<QuestFormData> = (data) => {
    mutation.mutate(data);
  };

  const form = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
  });

  return (
    <main>
      <h1 className="text-4xl mb-4">Admin: Add Task</h1>
      <QuestForm
        form={form}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
      />
    </main>
  );
};
