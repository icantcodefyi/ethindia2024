import {
  Bitcoin,
  ArrowRight,
  ArrowRightLeft,
  Coins,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid grid-cols-10 gap-4 p-4 opacity-[0.05]">
        {Array.from({ length: 100 }).map((_, i) => (
          <Bitcoin key={i} size={24} className="text-primary rotate-12" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="space-y-8 text-center">
          {/* Logo Section */}
          <div
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3",
              "bg-card border-2 border-primary rounded-2xl",
              "shadow-[6px_6px_0_0_hsl(var(--primary))]",
              "hover:shadow-[8px_8px_0_0_hsl(var(--primary))]",
              "hover:translate-y-[-4px]",
              "transition-all duration-200",
              "mb-8"
            )}
          >
            <div className="relative">
              <Bitcoin size={48} className="text-primary" />
              <span className="absolute -top-1 -right-1 text-lg font-black">
                4
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-black text-3xl tracking-tight">
                Chill with BTC
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                vibes
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <h1 className="text-6xl sm:text-7xl font-black text-foreground max-w-3xl mx-auto leading-tight">
            Bitcoin Made Easy <br /> No Stress 😎
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Kick back and learn Bitcoin your way. Our chill drag-and-drop
            interface makes it super easy to understand how Bitcoin flows. No
            pressure, just good vibes.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center gap-4 pt-8">
            <Link href="/home">
              <Button
                className={cn(
                  "bg-primary text-primary-foreground border-2 border-primary rounded-xl",
                  "text-lg font-bold px-8 py-6",
                  "shadow-[6px_6px_0_0_hsl(var(--primary))]",
                  "hover:shadow-[8px_8px_0_0_hsl(var(--primary))]",
                  "hover:translate-y-[-4px]",
                  "transition-all duration-200",
                  "flex items-center gap-2"
                )}
              >
                Start Your Journey
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
            {[
              {
                title: "Learn by Doing",
                description:
                  "Get hands-on with Bitcoin - no textbooks, just interactive vibes",
                icon: Bitcoin,
              },
              {
                title: "Instant Feedback",
                description:
                  "Watch your moves come to life in real-time as you build",
                icon: ArrowRightLeft,
              },
              {
                title: "Zero Pressure",
                description:
                  "No coding needed - just flow with it and learn at your own pace",
                icon: Shield,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-card p-6 rounded-xl",
                  "border-2 border-primary",
                  "shadow-[4px_4px_0_0_hsl(var(--primary))]",
                  "hover:shadow-[6px_6px_0_0_hsl(var(--primary))]",
                  "hover:translate-y-[-2px]",
                  "transition-all duration-200"
                )}
              >
                <feature.icon size={24} className="mb-4 text-primary" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Built with BOB Section */}
          <div className="pt-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powered by BOB</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We&apos;ve teamed up with BOB Gateway to make Bitcoin to Layer 2
                bridging smooth as butter. Learn the cool stuff about intents
                and bridging while staying relaxed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* BOB Features */}
              <div
                className={cn(
                  "bg-card p-8 rounded-xl",
                  "border-2 border-primary",
                  "shadow-[4px_4px_0_0_hsl(var(--primary))]",
                  "hover:shadow-[6px_6px_0_0_hsl(var(--primary))]",
                  "hover:translate-y-[-2px]",
                  "transition-all duration-200"
                )}
              >
                <Coins size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-4">
                  BOB&apos;s Got Your Back
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Smooth Layer 2 bridging
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Build transactions visually
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Live transaction preview
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Easy verification tools
                  </li>
                </ul>
              </div>

              {/* Integration Preview */}
              <div
                className={cn(
                  "bg-card p-8 rounded-xl",
                  "border-2 border-primary",
                  "shadow-[4px_4px_0_0_hsl(var(--primary))]",
                  "hover:shadow-[6px_6px_0_0_hsl(var(--primary))]",
                  "hover:translate-y-[-2px]",
                  "transition-all duration-200",
                  "flex items-center justify-center"
                )}
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Bitcoin size={24} className="text-primary" />
                    <ArrowRight size={24} />
                    <span className="font-bold text-2xl">BOB</span>
                  </div>
                  <p className="text-muted-foreground">
                    Bridge like a pro with our laid-back, easy-to-use interface
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-muted-foreground font-medium">
        Built with good vibes ✌️ powered by BOB
      </div>
    </div>
  );
};

export default LandingPage;
