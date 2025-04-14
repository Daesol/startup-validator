"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VCAgentAnalysisRecord } from "@/lib/supabase/types"

// More professional, muted color palette
const AGENT_COLORS = {
  'problem': '#4F6C92',      // Navy blue - more professional
  'market': '#5E8B7E',       // Teal - business/growth
  'competitive': '#88659A',  // Purple - competitive edge
  'uvp': '#C27C7C',          // Rust - stands out but professional
  'business_model': '#2A6587', // Deep blue - business focus
  'validation': '#7B8F6C',   // Olive - validation/confirmation
  'legal': '#8D6E63',        // Brown - legal/official
  'metrics': '#607D8B'       // Slate - data/analytics
};

// Icons for different agent types (using more professional symbols)
const AGENT_ICONS = {
  'problem': '🔍',
  'market': '📊',
  'competitive': '🏆',
  'uvp': '⭐',
  'business_model': '💼',
  'validation': '✓',
  'legal': '⚖️',
  'metrics': '📈'
};

interface AgentAnalysesSectionProps {
  agents: VCAgentAnalysisRecord[]
}

export function AgentAnalysesSection({ agents }: AgentAnalysesSectionProps) {
  // Sort agents to ensure consistent order
  const sortedAgents = [...agents].sort((a, b) => {
    const order = ['problem', 'market', 'competitive', 'uvp', 'business_model', 'validation', 'legal', 'metrics'];
    return order.indexOf(a.agent_type) - order.indexOf(b.agent_type);
  });
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold">Specialist Agent Analyses</CardTitle>
        <CardDescription>
          Each aspect of your business was analyzed by a specialized AI agent with unique expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={sortedAgents[0]?.agent_type || 'problem'} className="w-full">
          <TabsList className="h-auto px-4 py-3 bg-muted/30 border-b flex flex-wrap justify-center gap-2">
            {sortedAgents.map(agent => (
              <TabsTrigger 
                key={agent.id}
                value={agent.agent_type}
                className="flex flex-col items-center gap-1 py-2 px-3 min-w-[80px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                style={{ 
                  borderBottom: `2px solid ${AGENT_COLORS[agent.agent_type as keyof typeof AGENT_COLORS] || '#888'}`
                }}
              >
                <span className="text-lg">{AGENT_ICONS[agent.agent_type as keyof typeof AGENT_ICONS]}</span>
                <span className="font-medium capitalize text-xs text-center">{formatAgentType(agent.agent_type)}</span>
                <Badge variant="outline" className="mt-1 text-xs bg-muted/50 px-1.5 py-0">
                  {agent.score}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="w-full">
            {sortedAgents.map(agent => (
              <TabsContent key={agent.id} value={agent.agent_type} className="mt-0">
                <AgentContent agent={agent} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Component to show the content for each agent
function AgentContent({ agent }: { agent: VCAgentAnalysisRecord }) {
  // Get color for this agent type
  const agentColor = AGENT_COLORS[agent.agent_type as keyof typeof AGENT_COLORS] || '#718096';
  
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="overflow-hidden border rounded-lg">
        <div className="bg-muted/20 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: agentColor }}
              >
                {AGENT_ICONS[agent.agent_type as keyof typeof AGENT_ICONS]}
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize" style={{ color: agentColor }}>
                  {formatAgentType(agent.agent_type)} <span className="text-foreground">({agent.score}/10)</span>
                </h3>
              </div>
            </div>
            <div className="hidden md:block">
              <ScoreIndicator score={agent.score} color={agentColor} />
            </div>
          </div>
        </div>
        <div className="py-4 px-6">
          <div className="md:hidden mb-4">
            <ScoreIndicator score={agent.score} color={agentColor} />
          </div>
          <p className="text-muted-foreground text-sm mb-4">{agent.reasoning}</p>
          <AgentTypeSpecificContent agent={agent} />
        </div>
      </div>
    </div>
  )
}

// Score visualization component
function ScoreIndicator({ score, color }: { score: number, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: `${score * 10}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      <span className="text-sm font-medium">{score}/10</span>
    </div>
  );
}

// Specialized content display based on agent type
function AgentTypeSpecificContent({ agent }: { agent: VCAgentAnalysisRecord }) {
  const agentColor = AGENT_COLORS[agent.agent_type as keyof typeof AGENT_COLORS] || '#718096';

  // Problem agent specific UI
  if (agent.agent_type === 'problem') {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden border border-muted">
          <CardHeader className="py-3 bg-muted/10">
            <CardTitle className="text-md">Improved Problem Statement</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p>{agent.analysis.improved_problem_statement}</p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Key Factors</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Severity Index</span>
                  <span className="text-sm font-medium bg-muted px-2 py-1 rounded-md">
                    {agent.analysis.severity_index}/10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(agent.analysis.severity_index / 10) * 100}%`,
                      backgroundColor: agentColor
                    }}
                  ></div>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Problem Framing</h4>
                  <Badge className="text-xs px-2 py-1" style={{ backgroundColor: agentColor }}>
                    {agent.analysis.problem_framing === 'global' ? 'Global Impact' : 'Niche Focus'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Root Causes</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-2">
                {Array.isArray(agent.analysis.root_causes) && agent.analysis.root_causes.map((cause, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agentColor }}></div>
                    <span className="text-sm">{cause}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Market agent specific UI
  if (agent.agent_type === 'market') {
    // Calculate percentages for visualization
    const tamValue = agent.analysis.tam || 0;
    const samValue = agent.analysis.sam || 0;
    const somValue = agent.analysis.som || 0;
    
    const samPercent = tamValue > 0 ? Math.round((samValue / tamValue) * 100) : 0;
    const somPercent = samValue > 0 ? Math.round((somValue / samValue) * 100) : 0;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Market Size Analysis</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <ul className="space-y-3">
                <li className="flex justify-between items-center py-1 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: agentColor }}></div>
                    <span className="text-sm font-medium">Total Addressable Market</span>
                  </div>
                  <span className="text-sm font-bold">${formatLargeNumber(agent.analysis.tam)}</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: agentColor, opacity: 0.8 }}></div>
                    <span className="text-sm font-medium">Serviceable Available Market</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">${formatLargeNumber(agent.analysis.sam)}</span>
                    <span className="text-xs text-muted-foreground block">{samPercent}% of TAM</span>
                  </div>
                </li>
                <li className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: agentColor, opacity: 0.6 }}></div>
                    <span className="text-sm font-medium">Serviceable Obtainable Market</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">${formatLargeNumber(agent.analysis.som)}</span>
                    <span className="text-xs text-muted-foreground block">{somPercent}% of SAM</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Market Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Growth Rate</h4>
                  <div className="bg-muted/20 p-2 rounded text-sm">
                    {agent.analysis.growth_rate}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Market Demand</h4>
                  <div className="bg-muted/20 p-2 rounded text-sm">
                    {agent.analysis.market_demand}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-muted">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Why Now?</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="p-3 border rounded-md bg-muted/10">
              <p className="text-sm">{agent.analysis.why_now}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Competitive agent specific UI
  if (agent.agent_type === 'competitive') {
    return (
      <div className="space-y-4">
        <Card className="border border-muted">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Differentiation</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="p-3 border rounded-md bg-muted/10">
              <p className="text-sm">{agent.analysis.differentiation}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium">Moat Classification:</span>
              <Badge 
                className="px-2 py-1"
                style={{ 
                  backgroundColor: 
                    agent.analysis.moat_classification === 'defensible' ? '#059669' :
                    agent.analysis.moat_classification === 'weak' ? '#D97706' : '#DC2626',
                  color: 'white'
                }}
              >
                {agent.analysis.moat_classification === 'defensible' ? 'Defensible' : 
                 agent.analysis.moat_classification === 'weak' ? 'Weak' : 'None'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-muted">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Competitive Landscape</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-3">
            <div className="divide-y">
              {Array.isArray(agent.analysis.competitors) && agent.analysis.competitors.map((competitor, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{competitor.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{competitor.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(competitor.strengths) && competitor.strengths.map((strength: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-muted-foreground mb-1">Weaknesses</h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(competitor.weaknesses) && competitor.weaknesses.map((weakness: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs text-destructive">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // UVP agent specific UI
  if (agent.agent_type === 'uvp') {
    return (
      <div className="space-y-4">
        <Card className="border border-muted">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Unique Value Proposition</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="p-4 border rounded-md bg-muted/10 text-center">
              <p className="text-lg font-medium" style={{ color: agentColor }}>"{agent.analysis.one_liner}"</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Appeal Analysis</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="divide-y">
                <div className="py-3">
                  <h4 className="text-sm font-medium mb-1">Emotional Appeal</h4>
                  <p className="text-sm">{agent.analysis.emotional_appeal}</p>
                </div>
                <div className="py-3">
                  <h4 className="text-sm font-medium mb-1">Strategic Appeal</h4>
                  <p className="text-sm">{agent.analysis.strategic_appeal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Stickiness Score</span>
                    <span className="text-sm font-medium">{agent.analysis.stickiness_score}/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(agent.analysis.stickiness_score / 10) * 100}%`,
                        backgroundColor: agentColor
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Differentiation Clarity</span>
                    <span className="text-sm font-medium">{agent.analysis.differentiation_clarity}/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(agent.analysis.differentiation_clarity / 10) * 100}%`,
                        backgroundColor: agentColor
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-muted overflow-hidden">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Value Transformation</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 border-r md:border-b-0 border-b bg-red-50/30 dark:bg-red-950/10">
                <h4 className="font-medium mb-2 text-sm">Before</h4>
                <p className="text-sm">{agent.analysis.before_after?.before}</p>
              </div>
              <div className="p-4 bg-green-50/30 dark:bg-green-950/10">
                <h4 className="font-medium mb-2 text-sm">After</h4>
                <p className="text-sm">{agent.analysis.before_after?.after}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // For other agent types, create a cleaner generic layout
  return (
    <div className="space-y-4">
      {Object.entries(agent.analysis || {}).filter(([key]) => 
        !['score', 'reasoning'].includes(key)
      ).map(([key, value]) => {
        // Handle arrays specially
        if (Array.isArray(value)) {
          return (
            <Card key={key} className="border border-muted">
              <CardHeader className="py-3">
                <CardTitle className="text-md capitalize">{key.replace(/_/g, ' ')}</CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-2">
                  {value.map((item, i) => {
                    if (typeof item === 'string') {
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: agentColor }}></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      );
                    } else if (typeof item === 'object' && item !== null) {
                      return (
                        <div key={i} className="p-3 border rounded-md">
                          {Object.entries(item).map(([itemKey, itemValue]) => (
                            <div key={itemKey} className="flex justify-between text-sm py-1 border-b last:border-0">
                              <span className="font-medium capitalize">{itemKey.replace(/_/g, ' ')}:</span>
                              <span>{String(itemValue)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
          );
        }
        
        // Handle objects specially
        if (typeof value === 'object' && value !== null) {
          return (
            <Card key={key} className="border border-muted">
              <CardHeader className="py-3">
                <CardTitle className="text-md capitalize">{key.replace(/_/g, ' ')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="px-4 py-3">
                      <div className="font-medium capitalize text-sm mb-1">{subKey.replace(/_/g, ' ')}</div>
                      <div className="text-sm">{formatAnalysisValue(subValue)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        
        // Handle simple values
        return (
          <Card key={key} className="border border-muted">
            <CardHeader className="py-3 border-b">
              <CardTitle className="text-md capitalize">{key.replace(/_/g, ' ')}</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm">{String(value)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Helper functions
function formatAgentType(agentType: string): string {
  return agentType.replace(/_/g, ' ');
}

function formatAnalysisValue(value: any): React.ReactNode {
  if (typeof value === 'string') {
    return value;
  } 
  
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, i) => (
          <div key={i} className="text-sm">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </div>
        ))}
      </div>
    );
  }
  
  return JSON.stringify(value);
}

// Helper to format large numbers
function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
} 