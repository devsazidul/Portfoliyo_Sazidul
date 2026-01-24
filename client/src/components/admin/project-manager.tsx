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
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github, Smartphone, Figma, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ProjectManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data: projects, isLoading } = useQuery<Project[]>({
        queryKey: ["/api/projects/"],
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
            apk_file: "",
            figma_link: "",
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: InsertProject) => {
            if (editingProject) {
                const res = await apiRequest("PATCH", `/api/projects/${editingProject.id}/`, data);
                return res.json();
            } else {
                const res = await apiRequest("POST", "/api/projects/", data);
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects/"] });
            toast({ title: editingProject ? "Project updated successfully" : "Project created successfully", variant: "success" });
            setIsOpen(false);
            setEditingProject(null);
            form.reset({
                title: "",
                description: "",
                category: "",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
                technologies: [],
                link: "",
                github: "",
                apk_file: "",
                figma_link: "",
            });
        },
        onError: () => {
            toast({ title: editingProject ? "Failed to update project" : "Failed to create project", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/projects/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/projects/"] });
            toast({ title: "Project deleted", variant: "success" });
        },
        onError: () => {
            toast({ title: "Failed to delete project", variant: "destructive" });
        },
    });


    const onSubmit = (data: InsertProject) => {
        saveMutation.mutate(data);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        form.reset({
            title: project.title,
            description: project.description,
            category: project.category,
            image: project.image,
            technologies: project.technologies,
            link: project.link || "",
            github: project.github || "",
            apk_file: project.apk_file || "",
            figma_link: project.figma_link || "",
        });
        setIsOpen(true);
    };

    const handleAdd = () => {
        setEditingProject(null);
        form.reset({
            title: "",
            description: "",
            category: "",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
            technologies: [],
            link: "",
            github: "",
            apk_file: "",
            figma_link: "",
        });
        setIsOpen(true);
    };

    if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Projects</h2>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setEditingProject(null);
                    }
                }}>
                    <Button className="gap-2" onClick={handleAdd}>
                        <Plus className="w-4 h-4" /> Add Project
                    </Button>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
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

                                {/* Description Field */}
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

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Image (Upload)</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    field.onChange(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                    {field.value && field.value.startsWith('data:') && (
                                                        <img src={field.value} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
                                                    )}
                                                    {field.value && field.value.startsWith('http') && (
                                                        <img src={field.value} alt="Current" className="h-20 w-20 object-cover rounded-md border" />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Technologies Field - Simplified as text input for now, ideally comma separated */}
                                {/* Since schema expects array, we might need to parse. But let's check how hook form handles it */}
                                {/* For now, let's skip complex array UI and just pass empty array or hardcoded */}



                                {/* Conditional Fields based on Category */}
                                {form.watch("category")?.toLowerCase().includes("mobile") || form.watch("category")?.toLowerCase().includes("app") ? (
                                    <FormField
                                        control={form.control}
                                        name="apk_file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>APK File (Upload)</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="file"
                                                            accept=".apk"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        field.onChange(reader.result as string);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                {field.value && <p className="text-xs text-muted-foreground truncate">File selected</p>}
                                            </FormItem>
                                        )}
                                    />
                                ) : null}

                                <FormField
                                    control={form.control}
                                    name="figma_link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Figma Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://figma.com/..." {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                                    {saveMutation.isPending ? "Saving..." : (editingProject ? "Update Project" : "Create Project")}
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
                                        {project.apk_file && (
                                            <a href={project.apk_file} download={`${project.title.toLowerCase().replace(/\s+/g, '-')}.apk`} className="text-green-500 hover:text-green-600">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        )}
                                        {project.figma_link && (
                                            <a href={project.figma_link} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600">
                                                <Figma className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                            <Pencil className="w-4 h-4 text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(Number(project.id))}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
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
