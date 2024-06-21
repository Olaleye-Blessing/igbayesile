"use client";

import { useIGBQuery } from "@website/hooks/use-igb-query";
import Section from "./section";
import useAuthStore from "@website/stores/auth";
import { FormField } from "@ui/components/custom/form-field";
import { IUser } from "@ui/interfaces/user";
import { IRoom } from "@ui/interfaces/room";
import { IBookInfo } from "../_hooks/book-info";
import { Button } from "@ui/components/ui/button";
import { FormEventHandler } from "react";
import toast from "react-hot-toast";
import { usePayment } from "../_hooks/payment";
import { dateWithoutTimezone } from "@website/utils/date-without-timezone";

interface ConfrimProps {
  bookInfo: IBookInfo;
}

export default function Confirm({ bookInfo }: ConfrimProps) {
  const localUser = useAuthStore();
  const user = useIGBQuery<{ user: IUser }>({
    url: `/users/me?fields=email,name`,
    options: {
      queryKey: ["users", "me"],
      enabled: Boolean(localUser),
    },
  });

  const roomInfo = useIGBQuery<{ room: IRoom }>({
    url: `/rooms/${bookInfo.roomId}`,
    options: {
      queryKey: ["rooms", { roomId: bookInfo.roomId }],
      enabled: Boolean(bookInfo.roomId),
    },
  });

  const payment = usePayment();

  // let totalCost = room.price * totalDays;
  let totalCost: string | number = "";
  if (roomInfo.isFetching) {
    totalCost = "Calculating....";
  } else if (roomInfo.data?.room) {
    totalCost = roomInfo.data.room.price * bookInfo.totalDays;
  } else {
    totalCost = "Error calculating total cost";
  }

  const handlePayment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (roomInfo.isFetching)
      return toast.error("Loading room info", {
        id: "loading-room",
      });

    if (roomInfo.error)
      return toast.error(roomInfo.error.message, {
        id: "invalid-room",
      });

    if (!roomInfo.data)
      return toast.error("Unknown error! Try again later", {
        id: "unknown-room-error",
      });

    if (!bookInfo.checkIn || !bookInfo.checkOut)
      return toast.error("Provide check in and check out dates", {
        id: "invalid-stay-dates",
      });

    if (typeof bookInfo.totalDays !== "number")
      return toast.error("Invalid check out or check in date.", {
        id: "invalid-stay-date",
      });

    if (bookInfo.totalDays === 0)
      return toast.error("You need to stay for a mimimum of 1 day", {
        id: "invalid-stay-days",
      });

    const toastId = "initializing paymnet";

    toast.loading("Initializing payment", { id: toastId });

    const body = {
      room: roomInfo.data.room._id,
      guests: bookInfo.guests,
      checkIn: dateWithoutTimezone(new Date(bookInfo.checkIn)),
      checkOut: dateWithoutTimezone(new Date(bookInfo.checkOut)),
    };

    try {
      const result = await payment.initializePayment.mutateAsync(body);

      const paymentPage = `${result.authorization_url}`;

      window.location.href = paymentPage;
    } catch (error) {
      // toast.error(error)
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Section title="Confrim Your Details">
      <form onSubmit={handlePayment}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <FormField
            input={{
              className: "",
              value: user.data?.user ? user.data.user.name : "Loading...",
              readOnly: true,
            }}
            label="Name"
          />
          <FormField
            className=""
            input={{
              value: user.data?.user ? user.data.user.email : "Loading...",
              readOnly: true,
            }}
            label="Email"
          />
        </div>
        <FormField
          input={{
            value: totalCost,
            readOnly: true,
            className: typeof totalCost === "number" ? "" : "!bg-red-500",
          }}
          label="Total Cost"
        />
        <Button type="submit" className="block w-full">
          Make Payment
        </Button>
      </form>
    </Section>
  );
}
