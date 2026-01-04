import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, FileText, FolderGit2, User, Camera, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProjectManager from "@/components/admin/project-manager";
import DocumentManager from "@/components/admin/document-manager";

export default function AdminDashboard() {
    const { logout, user, refreshUser } = useAuth();
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState("projects");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target?.result as string;

            try {
                await apiRequest("PATCH", "/api/users/me/", {
                    profile: { image: base64String }
                });
                await refreshUser();
                toast({ title: "Profile picture updated", variant: "success" });
            } catch (error) {
                toast({ title: "Failed to update profile", variant: "destructive" });
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-72 bg-card border-r border-primary/10 flex flex-col fixed h-full z-20 overflow-y-auto">
                <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center gap-2 mb-6">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <span className="font-display font-bold text-xl tracking-tight">Portfolio Admin</span>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar className="w-24 h-24 border-2 border-primary/20 group-hover:border-primary transition-all">
                                <AvatarImage src={user?.profile?.image || ""} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                    {user?.username?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{user?.first_name || user?.username}</h3>
                            <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Button
                        variant={activeSection === "projects" ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => setActiveSection("projects")}
                    >
                        <FolderGit2 className="w-5 h-5" /> Projects
                    </Button>
                    <Button
                        variant={activeSection === "documents" ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => setActiveSection("documents")}
                    >
                        <FileText className="w-5 h-5" /> Documents
                    </Button>
                </nav>

                <div className="p-4 border-t border-primary/10">
                    <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive">
                        <LogOut className="w-5 h-5" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8">
                <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-500">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold font-display capitalize">{activeSection}</h1>
                    </div>

                    {activeSection === "projects" && <ProjectManager />}
                    {activeSection === "documents" && <DocumentManager />}
                </div>
            </main>
        </div>
    );
}
