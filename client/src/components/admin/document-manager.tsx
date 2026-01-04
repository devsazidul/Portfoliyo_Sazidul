import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, InsertDocument, insertDocumentSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, FileText, Download, UploadCloud } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function DocumentManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: documents, isLoading } = useQuery<Document[]>({
        queryKey: ["/api/documents"],
    });

    const form = useForm<InsertDocument>({
        resolver: zodResolver(insertDocumentSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "PDF",
            category: "General",
            fileUrl: "",
            size: "0 MB",
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Auto-detect Size
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        form.setValue("size", `${sizeInMB} MB`);

        // Auto-detect Type
        const extension = file.name.split('.').pop()?.toUpperCase() || "FILE";
        form.setValue("type", extension);

        // Auto-fill Title if empty
        if (!form.getValues("title")) {
            form.setValue("title", file.name);
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            form.setValue("fileUrl", base64String);
        };
        reader.readAsDataURL(file);
    };

    const createMutation = useMutation({
        mutationFn: async (data: InsertDocument) => {
            const res = await apiRequest("POST", "/api/documents/", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
            toast({ title: "Document uploaded successfully", variant: "success" });
            setIsOpen(false);
            form.reset();
        },
        onError: () => {
            toast({ title: "Failed to upload document", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/documents/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
            toast({ title: "Document deleted", variant: "success" });
        },
        onError: () => {
            toast({ title: "Failed to delete document", variant: "destructive" });
        },
    });


    const onSubmit = (data: InsertDocument) => {
        if (!data.fileUrl) {
            toast({ title: "Please select a file", variant: "destructive" });
            return;
        }
        createMutation.mutate(data);
    };

    if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Documents</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Document
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-primary/20">
                        <DialogHeader>
                            <DialogTitle>Upload New Document</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* File Upload Area */}
                                <div
                                    className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <UploadCloud className="w-10 h-10 text-primary mx-auto mb-2" />
                                    {form.watch("fileUrl") ? (
                                        <p className="text-sm font-medium text-green-500">File Selected: {form.watch("title")}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Click to upload file (Image, PDF, Doc, Excel)</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Document Title" {...field} />
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
                                                    <Input placeholder="General, Finance, HR..." {...field} />
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
                                                <Textarea placeholder="Document details..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type (Auto)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} readOnly className="bg-muted" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Size (Auto)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} readOnly className="bg-muted" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Uploading..." : "Save Document"}
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
                            <TableHead>Type</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents?.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    {doc.title}
                                </TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{doc.size}</TableCell>
                                <TableCell>{doc.category}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <a
                                            href={(doc as any).fileUrl}
                                            download={doc.title}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
                                        >
                                            <Download className="w-4 h-4 text-primary" />
                                        </a>
                                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(Number(doc.id))}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {documents?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
