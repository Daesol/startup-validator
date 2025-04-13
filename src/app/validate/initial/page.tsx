"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BusinessIdeaEntryPage() {
  const router = useRouter();
  const [businessIdea, setBusinessIdea] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim()) return;
    
    setSubmitting(true);
    
    // Redirect to the initial scoring page with the business idea
    const encodedIdea = encodeURIComponent(businessIdea);
    router.push(`/validate/initial-score?idea=${encodedIdea}`);
  };
  
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
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Submit Your Business Idea</h1>
        <p className="text-muted-foreground mb-8">
          Describe your business concept in detail. We'll run it through our AI validator
          before creating a comprehensive validation report.
        </p>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Describe Your Business Idea</CardTitle>
            <CardDescription>
              The more details you provide, the better analysis we can give you.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your business idea, target audience, and the problem you're solving..."
                  rows={8}
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  className="w-full p-4 font-mono text-sm"
                />
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Tips for a strong business idea description:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Clearly identify the problem you're solving</li>
                    <li>Specify who your target audience is</li>
                    <li>Explain how your solution works</li>
                    <li>Mention any unique advantages or approaches</li>
                  </ul>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!businessIdea.trim() || submitting}
              className="flex items-center gap-2"
            >
              Continue to Validation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
} 