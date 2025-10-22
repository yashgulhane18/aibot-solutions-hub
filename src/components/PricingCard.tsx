import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingCardProps {
  tier: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const PricingCard = ({ tier, price, features, popular }: PricingCardProps) => {
  return (
    <Card className={`relative ${popular ? 'border-primary shadow-[var(--shadow-elevated)] scale-105' : 'border-border'} transition-all duration-300 hover:scale-105 animate-fade-in-up`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{tier}</CardTitle>
        <CardDescription>
          <span className="text-4xl font-bold text-foreground">₹{price}</span>
          <span className="text-muted-foreground">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link to="/request" className="w-full">
          <Button
            className={`w-full ${popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80'}`}
          >
            {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
