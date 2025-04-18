import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormField } from "@ui/components/custom/form-field";
import { rhfErrMsg } from "@website/utils/rhf-error-msg";
import { TextAreaField } from "@ui/components/custom/TextAreaField";
import { Button, buttonVariants } from "@ui/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import { Terminal } from "lucide-react";
import ImagesPreview from "@website/app/hotels/new/_components/images-preview";
import Amenities from "@website/app/hotels/new/_components/amenities";
import { RoomFormData, TEditFormProps, TNewFormProps } from "./_utils/types";
import { defaultValues } from "./_utils/default-value";
import { useRoomForm } from "./hook";
import ErrorAction from "./error-action";
import { Label } from "@ui/components/ui/label";
import ReactSelect from "@ui/components/custom/select/react-select";
import { roomTypes } from "@ui/utils/room-types";

const roomTypesOptions = roomTypes.map((type) => ({
  label: type,
  value: type,
}));

type RoomFormProps = (TNewFormProps | TEditFormProps) & {
  hotelId: string;
  showRedirect?: boolean;
};

export default function RoomForm({
  type = "new",
  hotelId,
  showRedirect = true,
  room,
}: RoomFormProps) {
  const { createOrEditRoom } = useRoomForm();
  const [openErrorModal, setOpenErrorModal] = useState(false);
  // TODO: Fix this: form.formState.isSubmitting is true always
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RoomFormData>({
    defaultValues:
      type === "edit"
        ? defaultValues({ type: "edit", room: room! })
        : defaultValues({ type: "new" }),
  });

  const toggleErrorModal = (open: boolean) => {
    setOpenErrorModal(open);
  };

  const createRoom = async (
    _data: RoomFormData,
    e: BaseSyntheticEvent<object, any, any>,
  ) => {
    if (isSubmitting) return;

    const roomData = new FormData(e.target);
    roomData.set("hotel", hotelId);
    roomData.set("type", form.getValues("type"));
    _data.amenities.forEach((amenity) => roomData.append("amenities", amenity));

    const toastId =
      type === "edit" ? `edit-room-${room!._id}` : `create-new-room-${hotelId}`;

    try {
      toast.loading(`${type === "new" ? "Creating" : "Editing"} your room`, {
        id: toastId,
      });

      await createOrEditRoom.mutateAsync({
        data: roomData,
        hotelId,
        type,
        roomId: type === "edit" ? room!._id : "",
      });

      toast.success(
        `Room ${type === "new" ? "created" : "edited"} successfully`,
        { id: toastId },
      );

      if (type === "new") form.reset();
    } catch (error) {
      let message = handleIgbayesileAPIError(error);
      toast.error(message, { id: toastId });

      if (/This room has existing paid bookings/i.test(message)) {
        setOpenErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = form.watch("images");
  const roomTypeError = rhfErrMsg<RoomFormData>("type", form);

  return (
    <>
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <FormField
              input={{ ...form.register("name", { required: true }) }}
              required
              errMsg={rhfErrMsg<RoomFormData>("name", form) as any}
            />
            <div className="mb-3 flex flex-col w-full">
              <Label required={true} className="mb-[0.3rem]">
                Type
              </Label>
              <ReactSelect
                options={roomTypesOptions}
                onChange={(type: any) => form.setValue("type", type.value)}
              />
              {roomTypeError && (
                <p className="text-red-600 text-sm text-left">
                  {roomTypeError}
                </p>
              )}
            </div>
          </div>
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
              errMsg={rhfErrMsg<RoomFormData>("numberOfBeds", form) as any}
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
              errMsg={rhfErrMsg<RoomFormData>("price", form) as any}
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
              errMsg={rhfErrMsg<RoomFormData>("maxNumOfGuests", form) as any}
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
              errMsg={rhfErrMsg<RoomFormData>("numOfBathrooms", form) as any}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TextAreaField
              textarea={{ ...form.register("description", { required: true }) }}
              required
              errMsg={rhfErrMsg<RoomFormData>("description", form) as any}
            />
            <TextAreaField
              textarea={{
                ...form.register("location_description"),
              }}
              label="Location Description"
            />
          </div>
          {type === "new" && (
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
                errMsg={rhfErrMsg<RoomFormData>("images", form) as any}
              />
              {images && <ImagesPreview form={form} images={images} />}
            </div>
          )}
          <Amenities
            form={form}
            target="room"
            defaultChecks={form.getValues("amenities")}
            info="(Minimum of 3 amenities)"
          />
          {type === "new" && (
            <Alert className="bg-red-100 bg-opacity-20 text-red-600">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Note!</AlertTitle>
              <AlertDescription>
                Room&lsquo;s location(
                <span className="font-bold">city, state, and country</span>)
                will be derived from hotel&lsquo;s location.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className={`mt-4 ${type === "edit" ? "sticky bottom-0 left-0 right-0" : ""}`}
            isLoading={isSubmitting}
          >
            {type === "edit" ? "Edit" : "Create"}
          </Button>
        </form>
        {/* TODO: Redirect to my hotels page */}
        {showRedirect && (
          <Link
            href="/profile/?tab=hotels"
            className={buttonVariants({
              variant: "destructive",
              className: "w-full max-w-40 mt-6 ml-auto !block text-center mb-4",
            })}
          >
            Skip
          </Link>
        )}
      </div>
      <ErrorAction open={openErrorModal} toggleErrorModal={toggleErrorModal} />
    </>
  );
}
