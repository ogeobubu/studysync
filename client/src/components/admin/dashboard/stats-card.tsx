import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  className?: string;
}

export function StatsCard({ title, value, className = "" }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}