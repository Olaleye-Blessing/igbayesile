import { sleep } from "./sleep";

interface MockRTKQuery<D> {
  delay?: number;
  options:
    | {
        status: "ok";
        data: D;
      }
    | { status: "error"; data?: never };
}

export const mockRTKQuery = async <D>({
  delay = 2000,
  options,
}: MockRTKQuery<D>) => {
  try {
    await sleep(delay);

    if (options.status === "error") throw "Error";

    return options.data;
  } catch (error) {
    throw new Error("Mock error mesg");
  }
};
