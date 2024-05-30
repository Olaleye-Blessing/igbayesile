"use client";

import Loading from "@website/app/loading";
import { useIGBInstance } from "@website/hooks/use-igb-instance";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface MainProps {
  hotel: string;
}

interface IAccept {
  loading: boolean;
  error: string;
}

export default function Main({ hotel }: MainProps) {
  const token = useSearchParams().get("token") || "";
  const { igbInstance } = useIGBInstance();
  const [accept, setAccept] = useState<IAccept>({
    loading: false,
    error: "",
  });

  const acceptInvite = async () => {
    try {
      setAccept({
        loading: true,
        error: "",
      });

      await igbInstance().patch(`/hotels/${hotel}/invitation/${token}`);

      setAccept({
        loading: false,
        error: "",
      });
      // TODO: Redirect to dashboard
    } catch (error) {
      setAccept({
        loading: false,
        error: handleIgbayesileAPIError(error),
      });
    }
  };

  useEffect(() => {
    if (!token || accept.loading) return;

    acceptInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="text-center">
      <h1 className="my-4">Hotel Invitation</h1>

      {token ? (
        <div className="flex flex-col items-center justify-center text-center">
          {accept.loading ? (
            <Loading />
          ) : accept.error ? (
            <p className="error">{accept.error}</p>
          ) : (
            <p className="text-green-700">You can now manage the hotel!</p>
          )}
        </div>
      ) : (
        <p>No token provided. Check the invitation link again!</p>
      )}
    </main>
  );
}
