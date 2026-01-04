import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, InsertProject, insertProjectSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ProjectManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects"],
    });

    const form = useForm<InsertProject>({
        resolver: zodResolver(insertProjectSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", // Placeholder
            technologies: [],
            link: "",
            github: "",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: InsertProject) => {
            const res = await apiRequest("POST", "/api/projects/", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project created successfully", variant: "success" });
            setIsOpen(false);
            form.reset();
        },
        onError: () => {
            toast({ title: "Failed to create project", variant: "destructive" });
        },
    });

    // Note: Update and Delete APIs need to be implemented in Backend first if not already Standard ModelViewSet
    // Django ViewSets provide them by default, so DELETE /api/projects/{id}/ should work.

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            // Warning: Type mismatch potential here. Django IDs are Int, Schema assumes String from UUID.
            // We seeded Schema with Int-like strings or AutoFields. ModelViewSet uses IDs.
            await apiRequest("DELETE", `/api/projects/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({ title: "Project deleted", variant: "success" });
        },
        onError: () => {
            toast({ title: "Failed to delete project", variant: "destructive" });
        },
    });


    const onSubmit = (data: InsertProject) => {
        // Small trick for array field if using text Area input (comma separated)
        // For now assume standard input.
        // Ideally we need a better UI for tags input.
        createMutation.mutate(data);
    };

    if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Projects</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
                        <DialogHeader>
                            <DialogTitle>Add New Project</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Project Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Web, Mobile, AI..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Project details..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Technologies Field - Simplified as text input for now, ideally comma separated */}
                                {/* Since schema expects array, we might need to parse. But let's check how hook form handles it */}
                                {/* For now, let's skip complex array UI and just pass empty array or hardcoded */}

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Live Link</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="github"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GitHub Link</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/..." {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Saving..." : "Create Project"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md border-primary/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Links</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects?.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell>{project.category}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(Number(project.id))}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {projects?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
