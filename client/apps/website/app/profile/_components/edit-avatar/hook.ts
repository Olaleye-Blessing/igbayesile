import { useIGBInstance } from "@website/hooks/use-igb-instance";
import { IUser } from "@ui/interfaces/user";
import useAuthStore from "@website/stores/auth";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import { ChangeEvent, useRef } from "react";
import toast from "react-hot-toast";

interface IAvatarRes {
  data: { user: IUser };
}

type TUpdateAvatar =
  | { type: "upload"; form: FormData }
  | { type: "delete"; form?: never };

export const useAvatar = () => {
  const currentOperationRef = useRef<"upload" | "delete">();
  const updateUser = useAuthStore((store) => store.updateUser);

  const { igbInstance } = useIGBInstance();

  const updateAvatar = async ({ type, form }: TUpdateAvatar) => {
    if (currentOperationRef.current === type)
      return toast.error(`Wait for previous ${type}.`, {
        id: "avatar-too-many",
      });

    currentOperationRef.current = type;

    const toastId = `${type}-avatar`;

    toast.loading(`${type === "upload" ? "Uploading" : "Deleting"} avatar`, {
      id: toastId,
    });

    try {
      const response = await igbInstance()[
        type === "upload" ? "patch" : "delete"
      ]<IAvatarRes>(`/auth/me/avatar`, form);

      toast.success(
        `Avatar ${type === "upload" ? "uploaded" : "deleted"} successfully`,
        { id: toastId },
      );
      updateUser(response.data.data.user);
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    } finally {
      currentOperationRef.current = undefined;
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (!file) return toast.error("Please select a picture");

    const oneMb = 1024 * 1024;

    if (file.size >= oneMb)
      return toast.error("Avatar must be less than 1 MB", {
        id: "avatar-too-large",
      });

    const supportedTypes = ["jpg", "jpeg", "png"];

    if (!supportedTypes.some((type) => file.type.endsWith(type)))
      return toast.error(
        `Image type not supported. Only ${supportedTypes.join(", ")} are supported!`,
        {
          id: "avatar-unsupported-type",
        },
      );

    const form = new FormData();

    form.set("avatar", file);

    await updateAvatar({ type: "upload", form });
  };

  return { updateAvatar, handleUpload };
};
