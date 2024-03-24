import { API_BASE_URL } from "@/constants/backend";
import { IRoom } from "@/interfaces/room";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import axios from "axios";
import { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormField } from "@/components/custom/form-field";
import { rhfErrMsg } from "@/utils/rhf-error-msg";
import { TextAreaField } from "@/components/custom/TextAreaField";
import ImagesPreview from "./images-preview";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Amenities from "./amenities";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export interface RoomFormData extends Omit<IRoom, "images" | "_id" | "hotel"> {
  images: File[];
}

interface RoomFormProps {
  hotelId: string;
}

export default function RoomForm({ hotelId }: RoomFormProps) {
  const router = useRouter();
  // TODO: Fix this: form.formState.isSubmitting is true always
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RoomFormData>({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      numberOfBeds: 0,
      price: 1,
      maxNumOfGuests: 1,
      numOfBathrooms: 1,
      amenities: [],
    },
  });

  const createRoom = async (
    _data: RoomFormData,
    e: BaseSyntheticEvent<object, any, any>,
  ) => {
    if (isSubmitting) return;

    const roomData = new FormData(e.target);
    roomData.set("hotel", hotelId);
    _data.amenities.forEach((amenity) => roomData.append("amenities", amenity));

    const toastId = "create-new-room";

    try {
      toast.loading("Creating your room", { id: toastId });

      await axios.post<{ data: { room: IRoom } }>(
        `${API_BASE_URL}/rooms`,
        roomData,
        {
          withCredentials: true,
        },
      );

      toast.success("Room created successfully", { id: toastId });
      setIsSubmitting(false);
      // TODO: Redirect to hotels page
      router.push("/");
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
      setIsSubmitting(false);
    }
  };

  const images = form.watch("images");

  return (
    <div>
      <form
        className="grid grid-cols-1 gap-2"
        onSubmit={form.handleSubmit(
          (data, e) => createRoom(data, e!),
          () => {
            toast.error("Fill all required fields", {
              id: "new-room-required-fields",
            });
          },
        )}
      >
        <FormField
          input={{ ...form.register("name", { required: true }) }}
          required
          errMsg={rhfErrMsg<RoomFormData>("name", form)}
        />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <FormField
            input={{
              ...form.register("numberOfBeds", {
                validate: (numOfbeds: number) => {
                  return numOfbeds > 0 || "Beds must be more than 1";
                },
              }),
              type: "number",
            }}
            label="Number of beds"
            required
            errMsg={rhfErrMsg<RoomFormData>("numberOfBeds", form)}
          />
          <FormField
            input={{
              ...form.register("price", {
                validate: (price: number) => {
                  return price > 0 || "No room is free of charge";
                },
              }),
              type: "number",
            }}
            label="Price in US Dollars"
            required
            errMsg={rhfErrMsg<RoomFormData>("price", form)}
          />
          <FormField
            input={{
              ...form.register("maxNumOfGuests", {
                validate: (maxNumOfGuests: number) => {
                  return maxNumOfGuests > 0 || "Must allow at least 1 guest";
                },
              }),
              type: "number",
            }}
            label="Maximum number of guests"
            required
            errMsg={rhfErrMsg<RoomFormData>("maxNumOfGuests", form)}
          />
          <FormField
            input={{
              ...form.register("numOfBathrooms", {
                validate: (bathrooms: number) => {
                  return bathrooms > 0 || "Must have at least 1 bathroom";
                },
              }),
              type: "number",
            }}
            label="Number of bathrooms"
            required
            errMsg={rhfErrMsg<RoomFormData>("numOfBathrooms", form)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <TextAreaField
            textarea={{ ...form.register("description", { required: true }) }}
            required
            errMsg={rhfErrMsg<RoomFormData>("description", form)}
          />
          <TextAreaField
            textarea={{
              ...form.register("location_description", { required: true }),
            }}
            required
            label="Location Description"
            errMsg={rhfErrMsg<RoomFormData>("location_description", form)}
          />
        </div>
        <div>
          <FormField
            input={{
              ...form.register("images", {
                validate: (files: File[]) => {
                  return files.length >= 3 || "Provide at least 3 pictures";
                },
              }),
              type: "file",
              multiple: true,
              accept: "image/*",
            }}
            required
            errMsg={rhfErrMsg<RoomFormData>("images", form)}
          />
          {images && <ImagesPreview form={form} images={images} />}
        </div>
        <Amenities form={form} />
        <Alert className="bg-red-100 bg-opacity-20 text-red-600">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Note!</AlertTitle>
          <AlertDescription>
            Room&lsquo;s location(
            <span className="font-bold">city, state, and country</span>) will be
            derived from hotel&lsquo;s location.
          </AlertDescription>
        </Alert>

        <Button type="submit" className="mt-4" isLoading={isSubmitting}>
          Create
        </Button>
      </form>
      {/* TODO: Redirect to my hotels page */}
      <Link
        href="/"
        className={buttonVariants({
          variant: "destructive",
          className: "w-full max-w-40 mt-6 ml-auto !block text-center mb-4",
        })}
      >
        Skip
      </Link>
    </div>
  );
}
