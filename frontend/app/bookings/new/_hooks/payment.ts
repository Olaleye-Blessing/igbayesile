import { useIGBInstance } from "@/hooks/use-igb-instance";
import { IBooking } from "@/interfaces/booking";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
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
      body: Omit<IBooking, "status" | "userId" | "totalCost" | "_id">,
    ) => {
      try {
        let res = await igbInstance().post<IResult>(
          `/rooms/${body.roomId}/bookings`,
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
