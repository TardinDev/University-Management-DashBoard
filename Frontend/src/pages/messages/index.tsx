import { useState } from "react";
import { useList, useCreate, useUpdate, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Send, Plus, Mail, MailOpen, ArrowLeft, Inbox, SendHorizontal } from "lucide-react";
import type { Message, UserIdentity } from "@/types";

type ViewMode = "inbox" | "sent" | "compose" | "detail";

export default function MessagesPage() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const [view, setView] = useState<ViewMode>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");

  const { result: inboxResult, query: inboxQuery } = useList<Message>({
    resource: "messages",
    filters: identity?.id ? [{ field: "receiverId", operator: "eq", value: identity.id }] : [],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });

  const { result: sentResult } = useList<Message>({
    resource: "messages",
    filters: identity?.id ? [{ field: "senderId", operator: "eq", value: identity.id }] : [],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });

  const { mutate: createMessage } = useCreate();
  const { mutate: updateMessage } = useUpdate();

  const inbox = inboxResult.data || [];
  const sent = sentResult.data || [];
  const unreadCount = inbox.filter((m) => !m.read).length;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeRecipient.trim() || !composeSubject.trim() || !composeContent.trim()) return;
    createMessage(
      {
        resource: "messages",
        values: {
          receiverId: composeRecipient,
          receiverName: composeRecipient,
          subject: composeSubject,
          content: composeContent,
        },
      },
      {
        onSuccess: () => {
          setComposeRecipient("");
          setComposeSubject("");
          setComposeContent("");
          setView("sent");
          inboxQuery.refetch();
        },
      }
    );
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setView("detail");
    if (!msg.read && msg.receiverId === identity?.id) {
      updateMessage({ resource: "messages", id: msg.id, values: { read: true } });
    }
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="page-title">Messagerie</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          <Button className="w-full" onClick={() => setView("compose")}>
            <Plus className="h-4 w-4 mr-2" />Nouveau message
          </Button>
          <Button
            variant={view === "inbox" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setView("inbox")}
          >
            <Inbox className="h-4 w-4 mr-2" />
            Boite de reception
            {unreadCount > 0 && <Badge className="ml-auto" variant="destructive">{unreadCount}</Badge>}
          </Button>
          <Button
            variant={view === "sent" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setView("sent")}
          >
            <SendHorizontal className="h-4 w-4 mr-2" />Envoyes
          </Button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {view === "compose" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Nouveau message</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Destinataire</Label>
                    <Input
                      value={composeRecipient}
                      onChange={(e) => setComposeRecipient(e.target.value)}
                      placeholder="Nom ou email du destinataire"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sujet</Label>
                    <Input
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Sujet du message"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={composeContent}
                      onChange={(e) => setComposeContent(e.target.value)}
                      placeholder="Ecrivez votre message..."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setView("inbox")}>Annuler</Button>
                    <Button type="submit"><Send className="h-4 w-4 mr-2" />Envoyer</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {view === "inbox" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Boite de reception ({inbox.length})</CardTitle></CardHeader>
              <CardContent>
                {inbox.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Aucun message</p>
                ) : (
                  <div className="space-y-1">
                    {inbox.map((msg) => (
                      <MessageRow key={msg.id} message={msg} onClick={() => openMessage(msg)} showSender />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {view === "sent" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Messages envoyes ({sent.length})</CardTitle></CardHeader>
              <CardContent>
                {sent.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Aucun message envoye</p>
                ) : (
                  <div className="space-y-1">
                    {sent.map((msg) => (
                      <MessageRow key={msg.id} message={msg} onClick={() => openMessage(msg)} showSender={false} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {view === "detail" && selectedMessage && (
            <Card>
              <CardHeader>
                <Button variant="ghost" size="sm" className="w-fit mb-2" onClick={() => setView("inbox")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />Retour
                </Button>
                <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedMessage.senderName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedMessage.senderName}</p>
                    <p className="text-xs text-muted-foreground">
                      A: {selectedMessage.receiverName} — {new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <Separator className="mb-4" />
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}

function MessageRow({ message, onClick, showSender }: { message: Message; onClick: () => void; showSender: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${!message.read && showSender ? "bg-primary/5 font-medium" : ""}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {message.read || !showSender ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm truncate">{showSender ? message.senderName : `A: ${message.receiverName}`}</p>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {new Date(message.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
      </div>
    </div>
  );
}
