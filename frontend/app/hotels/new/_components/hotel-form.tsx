import { API_BASE_URL } from "@/constants/backend";
import { IHotel } from "@/interfaces/hotel";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormField } from "@/components/custom/form-field";
import { rhfErrMsg } from "@/utils/rhf-error-msg";
import CountriesStates from "@/components/custom/countries-states";
import { TextAreaField } from "@/components/custom/TextAreaField";
import ImagesPreview from "./images-preview";
import Amenities from "./amenities";
import { Button } from "@/components/ui/button";
import useSearchParameters from "@/hooks/use-search-parameters";
import { useIGBInstance } from "@/hooks/use-igb-instance";

export interface HotelFormData
  extends Omit<
    IHotel,
    "images" | "manager" | "_id" | "avgRoomPrice" | "totalRooms" | "amenities"
  > {
  images: File[];
  amenities: string[];
}

interface HotelFormProps {}

export default function HotelForm({}: HotelFormProps) {
  const { igbInstance } = useIGBInstance();
  const searchParams = useSearchParameters();
  // TODO: Fix this: form.formState.isSubmitting is true always
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      country: "",
      state: "",
      city: "",
      description: "",
      location_description: "",
      amenities: [],
      images: [],
    },
  });

  const createHotel = async (
    data: HotelFormData,
    e: BaseSyntheticEvent<object, any, any>,
  ) => {
    if (isSubmitting) return;

    const hotelData = new FormData(e.target);
    hotelData.set("country", data.country);
    hotelData.set("state", data.state);

    data.amenities.forEach((amenity) => hotelData.append("amenities", amenity));

    const toastId = "create-new-hotel";

    try {
      toast.loading("Creating your hotel", { id: toastId });

      const res = await igbInstance().post<{ data: { hotel: IHotel } }>(
        `${API_BASE_URL}/hotels`,
        hotelData,
        {
          withCredentials: true,
        },
      );

      toast.success("Hotel created successfully", { id: toastId });
      setIsSubmitting(false);

      searchParams.updateParams({ hotel: res.data.data.hotel._id }, "push");
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    form.register("country", { required: true });
    form.register("state", { required: true });

    return () => {
      form.unregister("country");
      form.unregister("state");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images = form.watch("images");

  return (
    <form
      className="grid grid-cols-1 gap-2"
      onSubmit={form.handleSubmit(
        (data, e) => createHotel(data, e!),
        () => {
          toast.error("Fill all required fields", {
            id: "new-hotel-required-fields",
          });
        },
      )}
    >
      <FormField
        input={{ ...form.register("name", { required: true }) }}
        required
        errMsg={rhfErrMsg<HotelFormData>("name", form)}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <CountriesStates
          stateContClassName="w-full max-w-none flex flex-col space-y-1"
          countryContClassName="w-full max-w-none flex flex-col space-y-1"
          countryRequired
          stateRequired
          handleSetLocation={(type, value) => {
            form.setValue(type, value);
            form.clearErrors(type);
          }}
          countryErrMsg={rhfErrMsg<HotelFormData>("country", form)}
          stateErrMsg={rhfErrMsg<HotelFormData>("state", form)}
        />
        <FormField
          input={{ ...form.register("city", { required: true }) }}
          required
          errMsg={rhfErrMsg<HotelFormData>("city", form)}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <TextAreaField
          textarea={{ ...form.register("description", { required: true }) }}
          required
          errMsg={rhfErrMsg<HotelFormData>("description", form)}
        />
        <TextAreaField
          textarea={{
            ...form.register("location_description", { required: true }),
          }}
          required
          label="Location Description"
          errMsg={rhfErrMsg<HotelFormData>("location_description", form)}
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
          errMsg={rhfErrMsg<HotelFormData>("images", form)}
        />
        {images && <ImagesPreview form={form} images={images} />}
      </div>
      <Amenities form={form} target="hotel" info="(Minimum of 3 amenities)" />
      <Button type="submit" className="mt-4" isLoading={isSubmitting}>
        Create
      </Button>
    </form>
  );
}
