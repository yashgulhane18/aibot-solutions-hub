import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="border-border/50 bg-secondary/20 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
      <CardHeader className="space-y-4">
        <div className="text-6xl">{icon}</div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
