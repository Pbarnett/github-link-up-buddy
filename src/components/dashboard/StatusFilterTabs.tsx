
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  value: string;
  onValueChange: (s: string) => void;
  statusCounts: Record<string, number>;
};

export default function StatusFilterTabs({ value, onValueChange, statusCounts }: Props) {
  return (
    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted/40">
      <TabsTrigger value="all" className="text-xs">
        All ({statusCounts.all})
      </TabsTrigger>
      <TabsTrigger value="pending_booking" className="text-xs">
        Pending ({statusCounts.pending_booking})
      </TabsTrigger>
      <TabsTrigger value="processing" className="text-xs">
        Processing ({statusCounts.processing})
      </TabsTrigger>
      <TabsTrigger value="done" className="text-xs">
        Done ({statusCounts.done})
      </TabsTrigger>
      <TabsTrigger value="failed" className="text-xs">
        Failed ({statusCounts.failed})
      </TabsTrigger>
      <TabsTrigger value="pending_payment" className="text-xs">
        Payment ({statusCounts.pending_payment})
      </TabsTrigger>
    </TabsList>
  );
}
