import { Card, CardContent } from "@/components/ui/card";

interface CampaignProps {
  children: React.ReactNode;
}

export function EmptyCampaignCard({ children }: CampaignProps) {
  return (
    <div className="grid grid-cols-1 gap-5">
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex h-32 items-center justify-center">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
