import { useIGBInstance } from "@website/hooks/use-igb-instance";
import { IBooking } from "@ui/interfaces/booking";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import { useMutation } from "@tanstack/react-query";

// interface IPaymentSuccess {
//   access_code: string;
//   authorization_url: string;
//   reference: string;
// }

interface IResult {
  status: string;
  data: {
    booking: IBooking;
    authorization_url: string;
  };
}

export const usePayment = () => {
  const { igbInstance } = useIGBInstance();

  const initializePayment = useMutation({
    mutationFn: async (
      body: Pick<IBooking, "room" | "guests" | "checkIn" | "checkOut">,
    ) => {
      try {
        let res = await igbInstance().post<IResult>(
          `/rooms/${body.room}/bookings`,
          { ...body },
        );

        return res.data.data;
      } catch (error) {
        throw new Error(handleIgbayesileAPIError(error));
      }
    },
  });

  return { initializePayment };
};
