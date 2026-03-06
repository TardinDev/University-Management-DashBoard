import { useState } from "react";
import { useList, useCreate, useDelete, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AITextHelper } from "@/components/ai-text-helper";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Trash2, ExternalLink, FolderOpen, Award, Briefcase, Star } from "lucide-react";
import type { Portfolio, PortfolioItem, UserIdentity } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  project: <FolderOpen className="h-5 w-5 text-blue-500" />,
  certificate: <Award className="h-5 w-5 text-green-500" />,
  experience: <Briefcase className="h-5 w-5 text-purple-500" />,
  skill: <Star className="h-5 w-5 text-orange-500" />,
};

const typeLabels: Record<string, string> = {
  project: "Projet",
  certificate: "Certificat",
  experience: "Experience",
  skill: "Competence",
};

export default function PortfolioPage() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState<string>("project");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");

  const { result, query } = useList<Portfolio>({
    resource: "portfolios",
    filters: identity?.id ? [{ field: "studentId", operator: "eq", value: identity.id }] : [],
    pagination: { pageSize: 10 },
  });

  const { mutate: createPortfolio } = useCreate();
  const portfolio = (result.data || [])[0];
  const items: PortfolioItem[] = portfolio?.items || [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PortfolioItem = {
      id: Date.now(),
      title,
      description,
      type: itemType as PortfolioItem["type"],
      date: date || undefined,
      url: url || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (portfolio) {
      // Update existing portfolio
      const updatedItems = [...items, newItem];
      createPortfolio(
        {
          resource: "portfolios",
          values: {
            ...portfolio,
            items: updatedItems,
          },
        },
        { onSuccess: () => { resetForm(); query.refetch(); } }
      );
    } else {
      createPortfolio(
        {
          resource: "portfolios",
          values: {
            studentId: identity?.id,
            title: `Portfolio de ${identity?.firstName} ${identity?.lastName}`,
            description: "Mon portfolio academique",
            items: [newItem],
          },
        },
        { onSuccess: () => { resetForm(); query.refetch(); } }
      );
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setItemType("project"); setDate(""); setUrl(""); setTags("");
    setShowForm(false);
  };

  const groupedItems = items.reduce<Record<string, PortfolioItem[]>>((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title mb-0">Mon Portfolio</h1>
          <p className="text-muted-foreground">{identity?.firstName} {identity?.lastName}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />Ajouter
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Nouvel element</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">Projet</SelectItem>
                      <SelectItem value="certificate">Certificat</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="skill">Competence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <AITextHelper value={description} onValueChange={setDescription} context="portfolio" rows={3} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Tags (separes par virgule)</Label>
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Python, ..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Votre portfolio est vide. Ajoutez vos projets, certificats et competences.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tout ({items.length})</TabsTrigger>
            {Object.entries(groupedItems).map(([type, typeItems]) => (
              <TabsTrigger key={type} value={type}>{typeLabels[type]} ({typeItems.length})</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => <PortfolioItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          {Object.entries(groupedItems).map(([type, typeItems]) => (
            <TabsContent key={type} value={type}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typeItems.map((item) => <PortfolioItemCard key={item.id} item={item} />)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </AnimatedPage>
  );
}

function PortfolioItemCard({ item }: { item: PortfolioItem }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{typeIcons[item.type]}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{item.title}</h3>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            {item.date && <p className="text-xs text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString("fr-FR")}</p>}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
