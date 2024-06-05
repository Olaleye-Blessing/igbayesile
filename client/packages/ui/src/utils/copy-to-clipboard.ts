import toast from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  } catch (err: any) {
    toast.error("Failed to copy: ", err.message);
  }
};
