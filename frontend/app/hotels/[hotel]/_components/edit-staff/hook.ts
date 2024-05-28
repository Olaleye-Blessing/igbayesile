import { hotelsKeys } from "@/app/hotels/utils/query-key-factory";
import { useLoginAgain } from "@/components/login-again/use-login-again";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import { IFullHotel } from "@/interfaces/hotel";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export const useStaff = () => {
  const queryClient = useQueryClient();
  const { reLogin } = useLoginAgain();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openStaffModal, setOpenStaffModal] = useState(false);

  const { igbInstance } = useIGBInstance();

  const removeStaff = useMutation({
    mutationFn: async (hotel: IFullHotel) => {
      const toastId = "remove-staff";

      toast.loading("Removing staff", { id: toastId });

      try {
        await igbInstance().delete(`/hotels/${hotel._id}/staff`);

        toast.success("Staff removed succesfully!", { id: toastId });
      } catch (error) {
        toast.error(handleIgbayesileAPIError(error), { id: toastId });
      }
    },
    onSuccess: async (_, oldHotel) => {
      let updatedHotel = {
        ...oldHotel,
      };

      delete updatedHotel.staff;

      queryClient.setQueryData(hotelsKeys.hotel(oldHotel._id), {
        hotel: updatedHotel,
      });
    },
  });

  const changeStaff = useMutation({
    mutationFn: async (data: { hotel: IFullHotel; staff: string }) => {
      const toastId = "change-staff";

      toast.loading("Changing staff", { id: toastId });

      try {
        const res = await igbInstance().patch<{ data: { message: string } }>(
          `/hotels/${data.hotel._id}/staff`,
          { staff: data.staff },
        );

        toast.success(res.data.data.message, { id: toastId, duration: 6_000 });
      } catch (error) {
        toast.error(handleIgbayesileAPIError(error), { id: toastId });
      }
    },
  });

  const isLoginModalOpen = () => {
    if (reLogin()) {
      setOpenLoginModal(true);

      return true;
    }

    return false;
  };

  const handleChangeStaff = async (staff: string, hotel: IFullHotel) => {
    if (hotel.staff?._id === staff)
      return toast.error("Select a new staff", { id: "new-staff-error" });

    if (isLoginModalOpen()) return false;

    await changeStaff.mutateAsync({ hotel, staff });
  };

  return {
    removeStaff,
    changeStaff,
    handleChangeStaff,
    openLoginModal,
    openStaffModal,
    setOpenStaffModal,
    isLoginModalOpen,
    setOpenLoginModal,
  };
};
