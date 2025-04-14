import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface BusinessIdeaSectionProps {
  userInput: string
  aiInterpretation: string
}

export default function BusinessIdeaSection({
  userInput,
  aiInterpretation
}: BusinessIdeaSectionProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Process the user input to ensure it's valid
  const cleanedUserInput = typeof userInput === 'string' 
    ? userInput 
    : userInput 
      ? String(userInput) // Attempt to convert non-string inputs to string
      : 'No business idea provided';
  
  // Debug info for inspecting the actual input
  console.log('Raw business idea input:', {
    type: typeof userInput,
    length: cleanedUserInput.length,
    content: cleanedUserInput, // Log the full raw input
    firstChars: cleanedUserInput.slice(0, 50),
  });
  
  return (
    <Card className="p-6 border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Business Idea Input & Interpretation</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">What You Entered</h3>
          <div 
            className={`bg-muted/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap relative overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[2000px]' : 'max-h-[200px]'}`}
          >
            {cleanedUserInput || (
              <span className="text-muted-foreground italic">No business idea provided</span>
            )}
            
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none"></div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs flex items-center mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <> 
                <ChevronUp className="mr-1 h-3 w-3" /> 
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" /> 
                Show Full Text
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">AI Interpretation</h3>
          <div className="bg-primary/10 p-4 rounded-md text-sm">
            {aiInterpretation || (
              <span className="text-muted-foreground italic">No AI interpretation available</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">This is what we analyzed below.</p>
        </div>
      </div>
    </Card>
  )
} 