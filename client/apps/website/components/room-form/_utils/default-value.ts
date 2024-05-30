import { RoomFormData, TEditFormProps, TNewFormProps } from "./types";

type ValProps = TNewFormProps | TEditFormProps;

export const defaultValues = ({ type, room }: ValProps): RoomFormData => {
  const val: RoomFormData = {
    name: "",
    description: "",
    images: [],
    numberOfBeds: 0,
    price: 1,
    maxNumOfGuests: 1,
    numOfBathrooms: 1,
    amenities: [],
    country: "",
    state: "",
    city: "",
    location_description: "",
  };

  if (type === "edit") {
    const skipKeys: (keyof RoomFormData)[] = ["images"];

    Object.keys(val).forEach((key) => {
      if (skipKeys.includes(key as keyof RoomFormData)) return;

      if (key === "amenities") {
        let value = room.amenities.map((a) => a._id);
        val.amenities = value;
      } else {
        // @ts-ignore
        val[key] = room[key];
      }
    });
  }

  return val;
};
