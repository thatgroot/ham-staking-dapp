import { toast } from "react-toastify";
import type { TypeOptions, ToastPosition } from "react-toastify";
export function notify({
  content,
  type = "success",
  position = "bottom-left",
}: {
  content: string;
  type?: TypeOptions;
  position?: ToastPosition;
}) {
  toast(content, {
    type,
    position,
  });
}
