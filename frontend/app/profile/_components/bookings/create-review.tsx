import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { AxiosInstance } from "axios";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";

interface CreateReviewProps {
  roomId: string;
  igbInstance: () => AxiosInstance;
  bookingId: string;
  hotelId: string;
}

export default function CreateReview({
  igbInstance,
  hotelId,
  roomId,
  bookingId,
}: CreateReviewProps) {
  const [rating, setRating] = useState<string>();
  const [review, setReview] = useState("");
  const [type, setType] = useState("");

  const submitReview: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!review || !rating || !type)
      return toast.error("Fill all required fields", { id: "empty" });

    const toastId = new Date().toString();

    toast.loading("Processing...", { id: toastId });

    try {
      const url = `/${type}s/${type === "room" ? roomId : hotelId}/reviews`;

      const { data } = await igbInstance().post(url, {
        content: review,
        rating,
        type,
        booking: bookingId,
      });

      toast.success("Review submitted", { id: toastId });
      console.log("__🔥 DATA __", data);
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <form onSubmit={submitReview} className="">
      <div className="mb-4">
        <Label htmlFor="type">
          <span>Review for:</span>
          <span className="text-red-800">*</span>
        </Label>
        <Select value={type} onValueChange={(val) => setType(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent>
            {["hotel", "room"].map((ty) => (
              <SelectItem key={ty} value={ty} className="capitalize">
                {ty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="rating">
          <span>Rating</span>
          <span className="text-red-800">*</span>
        </Label>
        <Select value={rating} onValueChange={(val) => setRating(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a rating..." />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }).map((_, index) => {
              const val = index + 1;

              return (
                <SelectItem key={val} value={`${val}`}>
                  {val}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="relative">
        <Label htmlFor="review">
          <span>Review</span>
          <span className="text-red-800">*</span>
        </Label>
        <Textarea
          rows={5}
          cols={10}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          name="review"
          placeholder={`Write your ${type} review...`}
        />
        <Button
          type="submit"
          variant={"ghost"}
          size={"icon"}
          className="absolute right-2 bottom-2 h-6 w-6 p-[0.1rem]"
        >
          <SendHorizonal className="text-primary h-3 w-3" />
        </Button>
      </div>
    </form>
  );
}
