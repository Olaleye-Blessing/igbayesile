"use client";

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
  }, []);

  return (
    <main className="global-bg min-h-[calc(100vh-4rem)]">
      <div className="layout">
        <header>
          <h1 className="text-center mb-4">Confirmation page</h1>
        </header>
        <div className="flex items-center justify-center text-center">
          {verification.loading ? (
            // TODO: Replace with general loading
            <p className="text-primary">Loading</p>
          ) : (
            <>
              {verification.status === "success" ? (
                <p className="text-green-500">{verification.message}</p>
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
