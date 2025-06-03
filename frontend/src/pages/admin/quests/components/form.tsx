import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import { QuestFormData } from "./zod";
import { useTranslation } from "react-i18next";

interface AddQuestFormProps {
  formData?: QuestFormData; // Optional prop for editing
  isPending?: boolean;
  isEditing?: boolean;
  form: UseFormReturn<QuestFormData>;
  onSubmit: (data: QuestFormData) => void; // Submission handler
}

export const QuestForm: React.FC<AddQuestFormProps> = ({
  onSubmit,
  isPending,
  isEditing,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название квеста на русском</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Подпишись на Notcoin"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название квеста на английском</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Subscribe to Notcoin"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание квест на русском</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Подпишись на канал и следи за новостями"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание квест на английском</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Subscribe to channel and keep following"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип квеста</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="channel">Join Channel</SelectItem>
                  <SelectItem value="link">Partner Link</SelectItem>
                  <SelectItem value="inviteFriend">Invite Friend</SelectItem>
                  <SelectItem disabled value="notifyFriend">
                    Notify Friend
                  </SelectItem>
                  <SelectItem disabled value="drinkWater">
                    Drink Water
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Куда будет вести квест?</FormLabel>
              <FormControl>
                <Input placeholder="Например https://t.me/notcoin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Количество {t("points")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Например 1000 ${t("points")}`}
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md bg-white p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Квест выключен?</FormLabel>
                <FormDescription>
                  Если выключен, то будет показываться, но нельзя выполнять
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md bg-white p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Квест скрыт?</FormLabel>
                <FormDescription>
                  Если ставите скрыт, так же установите disabled
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? "Добавляем..."
            : isEditing
              ? "Обновить квест"
              : "Добавить квест"}
        </Button>
      </form>
    </Form>
  );
};
