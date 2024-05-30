import RatingStar from "@repo/ui/components/custom/rating-star";
import { Button } from "@repo/ui/components/ui/button";

export default function Page() {
  return (
    <main className="bg-red-900">
      <Button>Click me</Button>
      <RatingStar rating={3} />
    </main>
  );
}
