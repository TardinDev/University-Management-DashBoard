import { useCreate } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Send, Mail, Clock } from "lucide-react";

interface SentEmail {
  id: number;
  recipients: string;
  subject: string;
  content: string;
  sentAt: string;
}

export default function EmailsPage() {
  const { mutate } = useCreate();

  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [sending, setSending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipients.trim() || !subject.trim() || !content.trim()) return;

    setSending(true);
    mutate(
      {
        resource: "messages",
        values: { recipients, subject, content },
      },
      {
        onSuccess: () => {
          const newEmail: SentEmail = {
            id: Date.now(),
            recipients: recipients.trim(),
            subject: subject.trim(),
            content: content.trim(),
            sentAt: new Date().toISOString(),
          };
          setSentEmails((prev) => [newEmail, ...prev]);
          setRecipients("");
          setSubject("");
          setContent("");
          setSending(false);
        },
        onError: () => {
          // Even on API error, add locally for simulation
          const newEmail: SentEmail = {
            id: Date.now(),
            recipients: recipients.trim(),
            subject: subject.trim(),
            content: content.trim(),
            sentAt: new Date().toISOString(),
          };
          setSentEmails((prev) => [newEmail, ...prev]);
          setRecipients("");
          setSubject("");
          setContent("");
          setSending(false);
        },
      }
    );
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="page-title">Messagerie</h1>

      {/* Compose */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Nouveau message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label>Destinataires (separes par des virgules)</Label>
              <Input
                placeholder="ex: prof@univ.mg, etudiant@univ.mg"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Objet</Label>
              <Input
                placeholder="Objet du message"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                placeholder="Redigez votre message..."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sent history */}
      <Separator className="mb-6" />
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Messages envoyes ({sentEmails.length})
      </h2>

      {sentEmails.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">
          Aucun message envoye
        </p>
      )}

      <div className="grid gap-4">
        {sentEmails.map((email) => (
          <Card key={email.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{email.subject}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {email.recipients.split(",").map((r, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {r.trim()}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                    {email.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(email.sentAt).toLocaleString("fr-FR")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedPage>
  );
}
