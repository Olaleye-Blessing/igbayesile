"use client";

import Loading from "@/app/loading";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import { IBooking } from "@/interfaces/booking";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type TVerification =
  | { loading: true }
  | { loading: false; status: "success"; message: string }
  | { loading: false; status: "error"; error: string };

export default function Page() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const roomId = searchParams.get("roomid");
  const { igbInstance } = useIGBInstance();

  const [verification, setVerification] = useState<TVerification>({
    loading: true,
  });

  useEffect(function verifyPayment() {
    (async () => {
      try {
        setVerification({ loading: true });
        const {
          data: { data },
        } = await igbInstance().post<{
          data: { booking: IBooking; status: string };
        }>(`/rooms/${roomId}/bookings/verify-payment`, {
          reference,
        });
        setVerification({
          loading: false,
          status: "success",
          message: data.status,
        });
        data;
      } catch (error) {
        let message = handleIgbayesileAPIError(error);
        setVerification({ loading: false, status: "error", error: message });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(
    verification.loading === false &&
      verification.status === "success" &&
      verification.message,
  );

  return (
    <main className="global-bg min-h-[calc(100vh-4rem)]">
      <div className="layout">
        <header>
          <h1 className="text-center mb-4 pt-4">Booking Confirmation</h1>
        </header>
        <div className="flex items-center justify-center text-center">
          {verification.loading ? (
            <Loading />
          ) : (
            <>
              {verification.status === "success" ? (
                <p
                  className={
                    verification.message.includes("received")
                      ? "text-green-500"
                      : "error"
                  }
                >
                  {verification.message}
                </p>
              ) : (
                <p className="error">{verification.error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
