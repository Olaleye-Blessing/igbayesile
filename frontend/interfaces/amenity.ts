export interface IAmenity {
  _id: string;
  label: string;
  tooltip?: string;
  icon?: string;
  target: "hotel" | "room" | "both";
}
