"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InitialConceptScore } from "@/components/initial-concept-score";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// Create a separate component that uses useSearchParams
function InitialScoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idea = searchParams.get("idea");
  const [businessIdea, setBusinessIdea] = useState(idea || "");
  
  // If no idea was provided, redirect back to the validation form
  useEffect(() => {
    if (!idea) {
      router.push("/validate");
    }
  }, [idea, router]);
  
  const handleImprovedIdeaSubmit = (improvedIdea: string) => {
    // Navigate to the form with the improved idea
    const encodedIdea = encodeURIComponent(improvedIdea);
    router.push(`/validate/form?idea=${encodedIdea}`);
  };
  
  const handleProceedWithOriginal = () => {
    // Navigate to the form with the original idea
    const encodedIdea = encodeURIComponent(businessIdea);
    router.push(`/validate/form?idea=${encodedIdea}`);
  };
  
  if (!businessIdea) {
    return (
      <Container className="py-8">
        <Card className="flex items-center justify-center p-8 text-center">
          <div>
            <p className="mb-4">No business idea found. Please go back and try again.</p>
            <Button asChild>
              <Link href="/validate">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Validation
              </Link>
            </Button>
          </div>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/validate">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Validation
          </Link>
        </Button>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold mb-4">Idea Quality Check</h1>
        <p className="text-muted-foreground mb-8">
          Before generating a complete validation report, we'll analyze the quality of your business idea.
        </p>
        
        <InitialConceptScore 
          businessIdea={businessIdea}
          onImprovedIdeaSubmit={handleImprovedIdeaSubmit}
          onProceedWithOriginal={handleProceedWithOriginal}
        />
      </div>
    </Container>
  );
}

// Main page component with Suspense boundary
export default function InitialScorePage() {
  return (
    <Suspense fallback={
      <Container className="py-8">
        <Card className="flex items-center justify-center p-8 text-center">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p>Loading...</p>
          </div>
        </Card>
      </Container>
    }>
      <InitialScoreContent />
    </Suspense>
  );
} 