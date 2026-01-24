import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Search, Filter, FileCode, FileImage, FileSpreadsheet, File, AlertCircle } from "lucide-react";
import type { Document } from "@shared/schema";

const documentCategories = ["All", "Guide", "Template", "Reference", "Design", "Technical"];

const typeIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  DOC: File,
  CODE: FileCode,
  XLS: FileSpreadsheet,
  IMG: FileImage,
};

const typeColors: Record<string, string> = {
  PDF: "from-red-500 to-red-600",
  DOC: "from-blue-500 to-blue-600",
  CODE: "from-green-500 to-green-600",
  XLS: "from-emerald-500 to-emerald-600",
  IMG: "from-purple-500 to-purple-600",
};
// asdfa

interface DocumentCardProps {
  document: Document;
  index: number;
  isVisible: boolean;
}

function DocumentCard({ document, index, isVisible }: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = typeIcons[document.type] || FileText;
  const gradient = typeColors[document.type] || "from-gray-500 to-gray-600";

  return (
    <Card
      className={`group relative overflow-visible bg-card/50 backdrop-blur-sm border-primary/10 transition-all duration-500 ${isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
        }`}
      style={{
        animationDelay: `${index * 50}ms`,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-document-${document.id}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-300 ${isHovered ? "scale-110" : ""
              } overflow-hidden`}
          >
            {['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'IMG'].includes(document.type.toUpperCase()) ? (
              <img src={document.fileUrl} alt={document.title} className="w-full h-full object-cover" />
            ) : (
              <IconComponent className="w-7 h-7 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-semibold text-base truncate group-hover:text-primary transition-colors"
                data-testid={`text-document-title-${document.id}`}
              >
                {document.title}
              </h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0" data-testid={`badge-document-type-${document.id}`}>
                {document.type}
              </Badge>
            </div>

            <p
              className="text-sm text-muted-foreground line-clamp-2 mb-3"
              data-testid={`text-document-description-${document.id}`}
            >
              {document.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs" data-testid={`badge-document-category-${document.id}`}>
                  {document.category}
                </Badge>
                <span className="text-xs text-muted-foreground" data-testid={`text-document-size-${document.id}`}>
                  {document.size}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={document.fileUrl}
                  download={document.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid={`button-download-document-${document.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isHovered && (
        <div
          className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-xl opacity-20 blur-xl -z-10 transition-opacity duration-500`}
        />
      )}
    </Card>
  );
}

function DocumentSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-10 h-5 rounded-full" />
            </div>
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-2/3 h-4 mb-3" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-12 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DocumentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Pagination State

  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory, searchQuery]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const currentDocs = filteredDocuments.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const nextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));
  const prevPage = () => setCurrentPage(p => Math.max(0, p - 1));

  return (
    <section
      ref={sectionRef}
      id="documents"
      className="py-24 md:py-32 relative overflow-hidden"
      data-testid="section-documents"
    >
      <div className="absolute inset-0 gradient-bg-hero opacity-20" />

      {/* Centered Container for Title and Controls */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
              }`}
            data-testid="text-documents-title"
          >
            My <span className="gradient-text-vibrant">Documents</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isVisible ? "opacity-100 animate-fade-in-up animation-delay-100" : "opacity-0"
              }`}
          >
            Browse and download my collection of guides, templates, and resources
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${isVisible ? "opacity-100 animate-fade-in-up animation-delay-200" : "opacity-0"
            }`}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10 bg-card/50 backdrop-blur-sm border-primary/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-documents"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {documentCategories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? "default" : "ghost"}
                className={`rounded-full ${activeCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : ""
                  }`}
                onClick={() => setActiveCategory(category)}
                data-testid={`button-filter-doc-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <DocumentSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground">
                Failed to load documents. Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {filteredDocuments.length > 6 ? (
              <div className="w-full overflow-hidden">
                <div className="flex w-max animate-marquee gap-6 py-4 px-4 pr-6 hover:[animation-play-state:paused]">
                  {[...filteredDocuments, ...filteredDocuments].map((document, index) => (
                    <div key={`${document.id}-${index}`} className="w-[350px] flex-shrink-0">
                      <DocumentCard
                        document={document}
                        index={index}
                        isVisible={isVisible}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((document, index) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      index={index}
                      isVisible={isVisible}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No documents found matching your criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
