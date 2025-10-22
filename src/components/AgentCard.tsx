import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  starterPrice: number;
}

const AgentCard = ({ id, name, shortDescription, image, starterPrice }: AgentCardProps) => {
  return (
    <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 animate-fade-in">
      <CardHeader>
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {image}
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Starting from</p>
          <p className="text-3xl font-bold text-primary">₹{starterPrice}<span className="text-sm text-muted-foreground">/mo</span></p>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/agent/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 group">
            View Pricing
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
