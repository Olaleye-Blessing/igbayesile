import ReactSelect from "@ui/components/custom/select/react-select";
import { Label } from "@ui/components/ui/label";
import { useIGBQuery } from "@website/hooks/use-igb-query";
import { IUser } from "@ui/interfaces/user";
import { IPaginatedResult } from "@ui/types/paginate";
import { useDebouncedCallback } from "@react-hookz/web";
import { useState } from "react";

type ISearchResult = IPaginatedResult<IUser>;

type IOption = {
  label: string;
  value: string;
};

interface StaffProps {
  handleChangeStaff: (staff: IOption | null) => void;
  name?: string;
}

export default function Staff({
  handleChangeStaff,
  name = "staff",
}: StaffProps) {
  const [search, setSearch] = useState("");

  let url = `/staffs`;
  if (search) url += `?name=${search}`;

  const { data, isFetching } = useIGBQuery<ISearchResult>({
    url,
    options: {
      queryKey: ["staff", { url }],
    },
  });

  const staffs = data?.results.map((st) => ({ label: st.name, value: st._id }));

  const handleSearchStaffs = useDebouncedCallback(
    (name: string) => {
      setSearch(encodeURIComponent(name.trim()));
    },
    [],
    1000,
  );

  return (
    <div className="mb-3">
      <Label htmlFor={name}>Staff</Label>
      <ReactSelect
        id={name}
        name={name}
        isLoading={isFetching}
        options={staffs}
        onInputChange={(name) => handleSearchStaffs(name)}
        onChange={(val) => handleChangeStaff(val as IOption | null)}
      />
    </div>
  );
}
