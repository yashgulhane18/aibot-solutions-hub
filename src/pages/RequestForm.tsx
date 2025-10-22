import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Headphones, MessageCircle, FileText, ArrowLeft, ArrowRight, Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface FormData {
  companyName: string;
  agentName: string;
  serviceType: string;
  email: string;
  countryCode: string;
  phone: string;
  description: string;
}
const serviceTypes = [{
  id: "buy",
  label: "Buy",
  description: "Purchase products/services",
  icon: ShoppingCart,
  color: "from-indigo-500 to-indigo-600"
}, {
  id: "support",
  label: "Support",
  description: "Technical assistance",
  icon: Headphones,
  color: "from-emerald-500 to-emerald-600"
}, {
  id: "inquiries",
  label: "Inquiries",
  description: "General questions",
  icon: MessageCircle,
  color: "from-amber-500 to-amber-600"
}, {
  id: "request",
  label: "Request",
  description: "Custom quotes/special requests",
  icon: FileText,
  color: "from-purple-500 to-purple-600"
}];
const RequestForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    agentName: "",
    serviceType: "",
    email: "",
    countryCode: "+1",
    phone: "",
    description: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const totalSteps = 6;
  const progress = (currentStep + 1) / totalSteps * 100;
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    switch (step) {
      case 0:
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }
        break;
      case 1:
        if (!formData.agentName.trim()) {
          newErrors.agentName = "AI Agent name is required";
        }
        break;
      case 2:
        if (!formData.serviceType) {
          newErrors.serviceType = "Please select a service type";
        }
        break;
      case 3:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;
      case 4:
        const cleanedPhone = formData.phone.replace(/\D/g, "");
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (cleanedPhone.length !== 10) {
          newErrors.phone = "Phone number must be exactly 10 digits";
        }
        break;
      case 5:
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 20) {
          newErrors.description = "Please provide more details (at least 20 characters)";
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        setDirection("forward");
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        handleSubmit();
      }
    } else {
      // Trigger shake animation
      const element = document.querySelector(".form-content");
      element?.classList.add("animate-shake");
      setTimeout(() => element?.classList.remove("animate-shake"), 500);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        formData: {
          name: formData.companyName,
          aiAgentName: formData.agentName,
          optionBase: formData.serviceType,
          email: formData.email,
          phone: `${formData.countryCode}-${formData.phone}`,
          description: formData.description
        },
        metadata: {
          submittedAt: new Date().toISOString(),
          source: "web_form",
          formVersion: "1.0",
          userAgent: navigator.userAgent,
          ipAddress: "client-side" // Note: Real IP needs server-side detection
        }
      };

      const response = await fetch("https://n8n.aibotclip.app/webhook/Contact_Us_Aibotclip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Form submitted successfully!", {
          description: "Your AI Agent request has been received."
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed", {
        description: "Please try again or contact support."
      });
    }
  };
  const handleReset = () => {
    setFormData({
      companyName: "",
      agentName: "",
      serviceType: "",
      email: "",
      countryCode: "+1",
      phone: "",
      description: ""
    });
    setCurrentStep(0);
    setIsSubmitted(false);
    setShowJson(false);
    setErrors({});
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    toast.success("Copied to clipboard!");
  };
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
    }
    return value;
  };
  if (isSubmitted) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6 animate-bounce">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Success! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              Your AI Agent request has been submitted
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Form Data</h2>
              <div className="flex gap-2">
                <Button onClick={() => setShowJson(!showJson)} variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  {showJson ? "Hide" : "Show"} JSON
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            {showJson ? <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre> : <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{formData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Agent Name</p>
                  
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium capitalize">{formData.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{formData.countryCode} {formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{formData.description}</p>
                </div>
              </div>}

            <Button onClick={handleReset} className="w-full mt-6 gap-2" size="lg">
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-12">
        <div className="w-full max-w-2xl">
          {/* Question Counter */}
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-sm font-medium text-muted-foreground">
              Question {currentStep + 1} → {totalSteps}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ~{Math.ceil((totalSteps - currentStep) * 0.5)} min left
            </p>
          </div>

          {/* Form Content */}
          <div className={cn("form-content transition-all duration-400 ease-in-out", direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left")} key={currentStep}>
            {/* Step 0: Company Name */}
            {currentStep === 0 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">What's your Business/ Company/ Your Name?</h1>
                <Input type="text" value={formData.companyName} onChange={e => setFormData({
              ...formData,
              companyName: e.target.value
            })} placeholder="Enter company name" className={cn("h-14 text-lg transition-all duration-300", "focus:scale-105 focus:shadow-lg", errors.companyName && "border-destructive animate-shake")} autoFocus />
                {errors.companyName && <p className="text-destructive text-sm animate-fade-in">
                    {errors.companyName}
                  </p>}
              </div>}

            {/* Step 1: AI Agent Name */}
            {currentStep === 1 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">AI Agent Name</h1>
                <Input type="text" value={formData.agentName} onChange={e => setFormData({
              ...formData,
              agentName: e.target.value
            })} placeholder="e.g., CustomerBot, SalesAssistant, SupportGenie" className={cn("h-14 text-lg transition-all duration-300", "focus:scale-105 focus:shadow-lg", errors.agentName && "border-destructive animate-shake")} autoFocus />
                {errors.agentName && <p className="text-destructive text-sm animate-fade-in">
                    {errors.agentName}
                  </p>}
              </div>}

            {/* Step 2: Service Type */}
            {currentStep === 2 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  What type of service do you need?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceTypes.map((service, index) => {
                const Icon = service.icon;
                const isSelected = formData.serviceType === service.id;
                return <button key={service.id} onClick={() => setFormData({
                  ...formData,
                  serviceType: service.id
                })} className={cn("relative p-6 rounded-xl border-2 text-left transition-all duration-300", "hover:scale-102 hover:shadow-xl", "animate-fade-in", isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50")} style={{
                  animationDelay: `${index * 50}ms`
                }}>
                        <div className={cn("inline-flex p-3 rounded-lg mb-4 bg-gradient-to-br", service.color, "transition-transform duration-300 hover:scale-110 hover:rotate-6")}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        {isSelected && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>}
                      </button>;
              })}
                </div>
                {errors.serviceType && <p className="text-destructive text-sm animate-fade-in">
                    {errors.serviceType}
                  </p>}
              </div>}

            {/* Step 3: Email */}
            {currentStep === 3 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  What's your email address?
                </h1>
                <div className="relative">
                  <Input type="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} placeholder="you@company.com" className={cn("h-14 text-lg transition-all duration-300", "focus:scale-105 focus:shadow-lg", errors.email && "border-destructive animate-shake")} autoFocus />
                  {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in">
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>}
                </div>
                {errors.email && <p className="text-destructive text-sm animate-fade-in">
                    {errors.email}
                  </p>}
              </div>}

            {/* Step 4: Phone */}
            {currentStep === 4 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  What's your phone number?
                </h1>
                <div className="flex gap-3">
                  <Select value={formData.countryCode} onValueChange={value => setFormData({
                ...formData,
                countryCode: value
              })}>
                    <SelectTrigger className="h-14 w-[140px] text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+86">🇨🇳 +86</SelectItem>
                      <SelectItem value="+81">🇯🇵 +81</SelectItem>
                      <SelectItem value="+49">🇩🇪 +49</SelectItem>
                      <SelectItem value="+33">🇫🇷 +33</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      <SelectItem value="+55">🇧🇷 +55</SelectItem>
                      <SelectItem value="+52">🇲🇽 +52</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="tel" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: formatPhone(e.target.value)
              })} placeholder="(555) 123-4567" className={cn("h-14 text-lg transition-all duration-300 flex-1", "focus:scale-105 focus:shadow-lg", errors.phone && "border-destructive animate-shake")} autoFocus />
                </div>
                {errors.phone && <p className="text-destructive text-sm animate-fade-in">
                    {errors.phone}
                  </p>}
              </div>}

            {/* Step 5: Description */}
            {currentStep === 5 && <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Tell us about your requirements
                </h1>
                <div>
                  <Textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} placeholder="Please describe what you want your AI agent to do and specify your requirements in detail..." className={cn("min-h-[200px] text-lg transition-all duration-300", "focus:scale-105 focus:shadow-lg", errors.description && "border-destructive animate-shake")} autoFocus />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && <p className="text-destructive text-sm animate-fade-in">
                        {errors.description}
                      </p>}
                    <p className={cn("text-sm ml-auto transition-colors duration-300", formData.description.length < 20 ? "text-muted-foreground" : formData.description.length < 100 ? "text-amber-500" : "text-emerald-500")}>
                      {formData.description.length} characters
                    </p>
                  </div>
                </div>
              </div>}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12 animate-fade-in">
            {currentStep > 0 && <Button onClick={handlePrevious} variant="outline" size="lg" className="gap-2 transition-all duration-200 hover:scale-105">
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>}
            <Button onClick={handleNext} size="lg" className="flex-1 gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg">
              {currentStep === totalSteps - 1 ? "Submit" : "Next"}
              {currentStep < totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default RequestForm;