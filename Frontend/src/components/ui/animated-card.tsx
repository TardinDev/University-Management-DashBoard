import { motion } from "motion/react";
import { cardVariants, hoverScale } from "@/lib/animations";
import { Card } from "@/components/ui/card";
import type { ReactNode, ComponentProps } from "react";

type AnimatedCardProps = ComponentProps<typeof Card> & {
  children: ReactNode;
  hover?: boolean;
};

export function AnimatedCard({ children, hover = false, className, ...props }: AnimatedCardProps) {
  return (
    <motion.div variants={cardVariants} {...(hover ? hoverScale : {})}>
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
