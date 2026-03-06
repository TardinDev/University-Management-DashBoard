import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Sparkles,
  Loader2,
  Check,
  X,
  Languages,
  GraduationCap,
} from "lucide-react";
import { useAIAssist, type AIAction } from "@/hooks/use-ai-assist";
import { cn } from "@/lib/utils";

interface ActionItem {
  action: AIAction;
  label: string;
  icon: React.ReactNode;
}

const allActions: Record<string, ActionItem[]> = {
  email: [
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { action: "generate_email", label: "Générer email", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "translate_en", label: "Traduire EN", icon: <Languages className="h-3.5 w-3.5" /> },
    { action: "expand", label: "Développer", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
  announcement: [
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "generate_announcement", label: "Générer annonce", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { action: "simplify", label: "Simplifier", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
  assignment: [
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "generate_description", label: "Générer description", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { action: "expand", label: "Développer", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
  forum: [
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { action: "simplify", label: "Simplifier", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "generate_forum", label: "Générer message", icon: <Wand2 className="h-3.5 w-3.5" /> },
  ],
  quiz: [
    { action: "generate_quiz", label: "Générer question", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "improve", label: "Améliorer énoncé", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "simplify", label: "Simplifier", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
  "admin-response": [
    { action: "generate_response", label: "Générer réponse", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
  ],
  "admin-request": [
    { action: "generate_request", label: "Générer demande", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
  ],
  portfolio: [
    { action: "generate_portfolio", label: "Générer description", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "expand", label: "Développer", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
  message: [
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "formal", label: "Ton formel", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { action: "simplify", label: "Simplifier", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { action: "translate_en", label: "Traduire EN", icon: <Languages className="h-3.5 w-3.5" /> },
  ],
  resource: [
    { action: "generate_description", label: "Générer description", icon: <Wand2 className="h-3.5 w-3.5" /> },
    { action: "improve", label: "Améliorer", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ],
};

interface AITextHelperProps {
  value: string;
  onValueChange: (value: string) => void;
  context: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;
}

export function AITextHelper({
  value,
  onValueChange,
  context,
  placeholder,
  rows = 3,
  disabled,
  className,
  id,
  required,
}: AITextHelperProps) {
  const [open, setOpen] = useState(false);
  const { result, isLoading, error, generate, reset } = useAIAssist();

  const actions = allActions[context] || allActions.message;

  const handleAction = async (action: AIAction) => {
    await generate(action, value, context);
  };

  const handleApply = () => {
    if (result) {
      onValueChange(result);
      reset();
      setOpen(false);
    }
  };

  const handleInsert = () => {
    if (result) {
      onValueChange(value ? `${value}\n\n${result}` : result);
      reset();
      setOpen(false);
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <div className="group relative">
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn("pr-10", className)}
        required={required}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-1.5 top-1.5 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
              open && "opacity-100"
            )}
            disabled={disabled}
            title="Assistant IA"
          >
            <Wand2 className="h-4 w-4 text-violet-500" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-80 p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Assistant IA
            </div>

            {!result && !isLoading && !error && (
              <div className="flex flex-wrap gap-1.5">
                {actions.map((item) => (
                  <Button
                    key={item.action}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => handleAction(item.action)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération en cours...
              </div>
            )}

            {error && (
              <div className="space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={reset}
                >
                  Réessayer
                </Button>
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <div className="max-h-48 overflow-y-auto rounded-md bg-muted/50 p-2.5 text-sm whitespace-pre-wrap">
                  {result}
                </div>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={handleApply}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Appliquer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={handleInsert}
                  >
                    Insérer
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-7 w-7"
                    onClick={handleClose}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
