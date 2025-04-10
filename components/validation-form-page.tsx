"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const businessTypes = [
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "marketplace", label: "Marketplace" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "hardware", label: "Hardware" },
  { value: "consumer-product", label: "Consumer Product" },
  { value: "b2b-service", label: "B2B Service" },
  { value: "b2c-app", label: "B2C App" },
  { value: "other", label: "Other" },
]

const businessStages = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Launched" },
  { value: "startup", label: "Startup" },
  { value: "growth", label: "Growth" },
  { value: "funded", label: "Funded" },
]

const targetAudiences = [
  { value: "students", label: "Students" },
  { value: "freelancers", label: "Freelancers" },
  { value: "small-business", label: "Small Business Owners" },
  { value: "enterprises", label: "Enterprises" },
  { value: "developers", label: "Developers" },
  { value: "parents", label: "Parents" },
  { value: "gen-z", label: "Gen Z" },
  { value: "seniors", label: "Seniors" },
  { value: "general", label: "General Consumers" },
  { value: "other", label: "Other" },
]

const acquisitionChannels = [
  { value: "word-of-mouth", label: "Word of Mouth" },
  { value: "paid-ads", label: "Paid Ads" },
  { value: "seo", label: "SEO" },
  { value: "social-media", label: "Social Media" },
  { value: "content-marketing", label: "Content Marketing" },
  { value: "influencers", label: "Influencers" },
  { value: "cold-outreach", label: "Cold Outreach" },
  { value: "partnerships", label: "Partnerships" },
  { value: "app-stores", label: "App Stores" },
  { value: "other", label: "Other" },
]

const revenueRanges = [
  { value: "under-1k", label: "<$1k/month" },
  { value: "1k-10k", label: "$1k–$10k/month" },
  { value: "10k-50k", label: "$10k–$50k/month" },
  { value: "50k-100k", label: "$50k–$100k/month" },
  { value: "100k-plus", label: "$100k+/month" },
]

const pricingModels = [
  { value: "freemium", label: "Freemium" },
  { value: "subscription", label: "Subscription" },
  { value: "one-time", label: "One-time Payment" },
  { value: "pay-as-you-go", label: "Pay-as-you-go" },
  { value: "usage-based", label: "Usage-based" },
  { value: "licensing", label: "Licensing" },
  { value: "commission", label: "Commission" },
  { value: "advertising", label: "Advertising" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
]

const skillsets = {
  technical: [
    { value: "software-dev", label: "Software Dev" },
    { value: "ai-ml", label: "AI/ML" },
    { value: "backend", label: "Backend" },
    { value: "frontend", label: "Frontend" },
    { value: "mobile-dev", label: "Mobile Dev" },
  ],
  creative: [
    { value: "ui-ux", label: "UI/UX" },
    { value: "video-editing", label: "Video Editing" },
    { value: "copywriting", label: "Copywriting" },
  ],
  growth: [
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "seo", label: "SEO" },
    { value: "content-creation", label: "Content Creation" },
  ],
  ops: [
    { value: "fundraising", label: "Fundraising" },
    { value: "biz-dev", label: "Biz Dev" },
    { value: "product-management", label: "Product Management" },
    { value: "finance", label: "Finance" },
  ],
  other: [
    { value: "legal", label: "Legal" },
    { value: "community", label: "Community" },
    { value: "customer-support", label: "Customer Support" },
  ],
}

export function ValidationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("idea")
  const [formData, setFormData] = useState({
    // Idea tab
    businessIdea: "",
    website: "",
    businessStage: "",
    businessType: "",

    // Details tab
    personalProblem: false,
    targetAudience: "",
    targetAudienceOther: "",
    charging: false,
    differentiation: "",
    competitors: [] as string[],
    currentCompetitor: "",

    // Growth metrics
    userCount: "",
    mau: "",
    monthlyRevenue: "",
    acquisitionChannel: "",
    revenueRange: "",
    pricingModel: "",
    pricingModelOther: "",
    cac: "",
    ltv: "",
    teamSize: "",
    raisedFunds: false,
    fundsRaised: "",
    investors: "",

    // Team tab
    coFounderCount: "0",
    teamMembers: [{ person: "You", skills: [] as string[] }],
  })

  const [currentSkill, setCurrentSkill] = useState("")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addCompetitor = () => {
    if (formData.currentCompetitor.trim()) {
      setFormData((prev) => ({
        ...prev,
        competitors: [...prev.competitors, prev.currentCompetitor.trim()],
        currentCompetitor: "",
      }))
    }
  }

  const removeCompetitor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index),
    }))
  }

  const addSkill = (personIndex: number) => {
    if (currentSkill) {
      setFormData((prev) => {
        const updatedTeamMembers = [...prev.teamMembers]
        if (!updatedTeamMembers[personIndex].skills.includes(currentSkill)) {
          updatedTeamMembers[personIndex].skills.push(currentSkill)
        }
        return { ...prev, teamMembers: updatedTeamMembers }
      })
      setCurrentSkill("")
    }
  }

  const removeSkill = (personIndex: number, skillIndex: number) => {
    setFormData((prev) => {
      const updatedTeamMembers = [...prev.teamMembers]
      updatedTeamMembers[personIndex].skills = updatedTeamMembers[personIndex].skills.filter((_, i) => i !== skillIndex)
      return { ...prev, teamMembers: updatedTeamMembers }
    })
  }

  const updateCoFounderCount = (count: string) => {
    const numCount = Number.parseInt(count)
    handleInputChange("coFounderCount", count)

    setFormData((prev) => {
      const currentCount = prev.teamMembers.length
      let updatedTeamMembers = [...prev.teamMembers]

      if (numCount + 1 > currentCount) {
        // Add new team members
        for (let i = currentCount; i < numCount + 1; i++) {
          if (i === 0) {
            updatedTeamMembers.push({ person: "You", skills: [] })
          } else {
            updatedTeamMembers.push({ person: `Co-founder ${i}`, skills: [] })
          }
        }
      } else if (numCount + 1 < currentCount) {
        // Remove excess team members
        updatedTeamMembers = updatedTeamMembers.slice(0, numCount + 1)
      }

      return { ...prev, teamMembers: updatedTeamMembers }
    })
  }

  const handleNext = () => {
    if (activeTab === "idea") setActiveTab("details")
    else if (activeTab === "details") setActiveTab("team")
  }

  const handleBack = () => {
    if (activeTab === "details") setActiveTab("idea")
    else if (activeTab === "team") setActiveTab("details")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
    alert("Form submitted successfully! Check console for data.")
    router.push("/")
  }

  const isEarlyStage = ["idea", "prototype"].includes(formData.businessStage)
  const isGrowthStage = ["mvp", "launched"].includes(formData.businessStage)
  const isLateStage = ["startup", "growth", "funded"].includes(formData.businessStage)

  const renderDetailsContent = () => {
    if (isEarlyStage) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="personalProblem" className="text-base">
              Is this solving a problem you personally experienced?
            </Label>
            <Switch
              id="personalProblem"
              checked={formData.personalProblem}
              onCheckedChange={(checked) => handleInputChange("personalProblem", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Select
              value={formData.targetAudience}
              onValueChange={(value) => handleInputChange("targetAudience", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                {targetAudiences.map((audience) => (
                  <SelectItem key={audience.value} value={audience.value}>
                    {audience.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.targetAudience === "other" && (
              <Input
                placeholder="Specify your target audience"
                value={formData.targetAudienceOther}
                onChange={(e) => handleInputChange("targetAudienceOther", e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="charging" className="text-base">
              Do you plan to charge money for this?
            </Label>
            <Switch
              id="charging"
              checked={formData.charging}
              onCheckedChange={(checked) => handleInputChange("charging", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="differentiation">What makes this idea different?</Label>
            <Textarea
              id="differentiation"
              placeholder="Explain what makes your idea unique..."
              value={formData.differentiation}
              onChange={(e) => handleInputChange("differentiation", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>List any known competitors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add competitor"
                value={formData.currentCompetitor}
                onChange={(e) => handleInputChange("currentCompetitor", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
              />
              <Button type="button" onClick={addCompetitor} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.competitors.map((competitor, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {competitor}
                  <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeCompetitor(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    } else if (isGrowthStage) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userCount">User Count</Label>
            <Input
              id="userCount"
              type="number"
              placeholder="Total number of users"
              value={formData.userCount}
              onChange={(e) => handleInputChange("userCount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mau">Monthly Active Users (MAU)</Label>
            <Input
              id="mau"
              type="number"
              placeholder="Monthly active users"
              value={formData.mau}
              onChange={(e) => handleInputChange("mau", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
            <Input
              id="monthlyRevenue"
              type="number"
              placeholder="Monthly revenue in USD"
              value={formData.monthlyRevenue}
              onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisitionChannel">User Acquisition Channels</Label>
            <Select
              value={formData.acquisitionChannel}
              onValueChange={(value) => handleInputChange("acquisitionChannel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary acquisition channel" />
              </SelectTrigger>
              <SelectContent>
                {acquisitionChannels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>List any known competitors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add competitor"
                value={formData.currentCompetitor}
                onChange={(e) => handleInputChange("currentCompetitor", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
              />
              <Button type="button" onClick={addCompetitor} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.competitors.map((competitor, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {competitor}
                  <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeCompetitor(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    } else if (isLateStage) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mau">Monthly Active Users (MAU)</Label>
            <Input
              id="mau"
              type="number"
              placeholder="Monthly active users"
              value={formData.mau}
              onChange={(e) => handleInputChange("mau", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueRange">Revenue Range</Label>
            <Select value={formData.revenueRange} onValueChange={(value) => handleInputChange("revenueRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select value={formData.pricingModel} onValueChange={(value) => handleInputChange("pricingModel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {pricingModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.pricingModel === "other" && (
              <Input
                placeholder="Specify your pricing model"
                value={formData.pricingModelOther}
                onChange={(e) => handleInputChange("pricingModelOther", e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
              <Input
                id="cac"
                type="number"
                placeholder="Optional"
                value={formData.cac}
                onChange={(e) => handleInputChange("cac", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ltv">Lifetime Value (LTV)</Label>
              <Input
                id="ltv"
                type="number"
                placeholder="Optional"
                value={formData.ltv}
                onChange={(e) => handleInputChange("ltv", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              placeholder="Total number of team members"
              value={formData.teamSize}
              onChange={(e) => handleInputChange("teamSize", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="raisedFunds" className="text-base">
              Have you raised funds?
            </Label>
            <Switch
              id="raisedFunds"
              checked={formData.raisedFunds}
              onCheckedChange={(checked) => handleInputChange("raisedFunds", checked)}
            />
          </div>

          {formData.raisedFunds && (
            <div className="space-y-2">
              <Label htmlFor="fundsRaised">Total funds raised ($)</Label>
              <Input
                id="fundsRaised"
                type="number"
                placeholder="Amount in USD"
                value={formData.fundsRaised}
                onChange={(e) => handleInputChange("fundsRaised", e.target.value)}
              />
            </div>
          )}

          {formData.raisedFunds && (
            <div className="space-y-2">
              <Label htmlFor="investors">Any investors or accelerators involved?</Label>
              <Input
                id="investors"
                placeholder="E.g., Y Combinator, Sequoia, etc."
                value={formData.investors}
                onChange={(e) => handleInputChange("investors", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>List any known competitors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add competitor"
                value={formData.currentCompetitor}
                onChange={(e) => handleInputChange("currentCompetitor", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
              />
              <Button type="button" onClick={addCompetitor} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.competitors.map((competitor, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {competitor}
                  <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removeCompetitor(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Please select a business stage in the Idea tab first.</p>
      </div>
    )
  }

  const getAllSkills = () => {
    const allSkills: { value: string; label: string; category: string }[] = []

    Object.entries(skillsets).forEach(([category, skills]) => {
      skills.forEach((skill) => {
        allSkills.push({
          ...skill,
          category,
        })
      })
    })

    return allSkills
  }

  const allSkills = getAllSkills()

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="idea">Idea</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="idea" className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="businessIdea">Describe your business idea</Label>
              <Textarea
                id="businessIdea"
                placeholder="What problem are you solving and how?"
                value={formData.businessIdea}
                onChange={(e) => handleInputChange("businessIdea", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (if any)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessStage">Business Stage</Label>
              <Select
                value={formData.businessStage}
                onValueChange={(value) => handleInputChange("businessStage", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business stage" />
                </SelectTrigger>
                <SelectContent>
                  {businessStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.businessType
                      ? businessTypes.find((type) => type.value === formData.businessType)?.label
                      : "Select business type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search business type..." />
                    <CommandList>
                      <CommandEmpty>No business type found.</CommandEmpty>
                      <CommandGroup>
                        {businessTypes.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={(currentValue) => {
                              handleInputChange(
                                "businessType",
                                currentValue === formData.businessType ? "" : currentValue,
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.businessType === type.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {type.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>

          <TabsContent value="details" className="py-4">
            {renderDetailsContent()}
          </TabsContent>

          <TabsContent value="team" className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="coFounderCount">How many co-founders?</Label>
              <Select value={formData.coFounderCount} onValueChange={updateCoFounderCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of co-founders" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {Number.parseInt(formData.coFounderCount) > 4 && (
                <p className="text-sm text-amber-500 mt-1">
                  YC suggests that too many early co-founders may slow decision-making.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {formData.teamMembers.map((member, personIndex) => (
                <Card key={personIndex} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{member.person}</h4>
                      {personIndex > 0 && (
                        <Input
                          value={member.person}
                          onChange={(e) => {
                            const updatedTeamMembers = [...formData.teamMembers]
                            updatedTeamMembers[personIndex].person = e.target.value
                            handleInputChange("teamMembers", updatedTeamMembers)
                          }}
                          className="w-40"
                          placeholder="Name"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Skillset</Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Select skills
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search skills..." />
                              <CommandList>
                                <CommandEmpty>No skill found.</CommandEmpty>
                                <CommandGroup>
                                  <div className="p-2 text-sm font-medium text-muted-foreground">Technical</div>
                                  {skillsets.technical.map((skill) => (
                                    <CommandItem
                                      key={skill.value}
                                      value={skill.value}
                                      onSelect={(value) => {
                                        setCurrentSkill(value)
                                        addSkill(personIndex)
                                      }}
                                    >
                                      {skill.label}
                                    </CommandItem>
                                  ))}
                                  <div className="p-2 text-sm font-medium text-muted-foreground">Creative</div>
                                  {skillsets.creative.map((skill) => (
                                    <CommandItem
                                      key={skill.value}
                                      value={skill.value}
                                      onSelect={(value) => {
                                        setCurrentSkill(value)
                                        addSkill(personIndex)
                                      }}
                                    >
                                      {skill.label}
                                    </CommandItem>
                                  ))}
                                  <div className="p-2 text-sm font-medium text-muted-foreground">Growth</div>
                                  {skillsets.growth.map((skill) => (
                                    <CommandItem
                                      key={skill.value}
                                      value={skill.value}
                                      onSelect={(value) => {
                                        setCurrentSkill(value)
                                        addSkill(personIndex)
                                      }}
                                    >
                                      {skill.label}
                                    </CommandItem>
                                  ))}
                                  <div className="p-2 text-sm font-medium text-muted-foreground">Ops & Biz</div>
                                  {skillsets.ops.map((skill) => (
                                    <CommandItem
                                      key={skill.value}
                                      value={skill.value}
                                      onSelect={(value) => {
                                        setCurrentSkill(value)
                                        addSkill(personIndex)
                                      }}
                                    >
                                      {skill.label}
                                    </CommandItem>
                                  ))}
                                  <div className="p-2 text-sm font-medium text-muted-foreground">Other</div>
                                  {skillsets.other.map((skill) => (
                                    <CommandItem
                                      key={skill.value}
                                      value={skill.value}
                                      onSelect={(value) => {
                                        setCurrentSkill(value)
                                        addSkill(personIndex)
                                      }}
                                    >
                                      {skill.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.skills.map((skill, skillIndex) => {
                          const skillObj = allSkills.find((s) => s.value === skill)
                          return (
                            <Badge key={skillIndex} variant="secondary" className="px-3 py-1">
                              {skillObj?.label || skill}
                              <X
                                className="ml-2 h-3 w-3 cursor-pointer"
                                onClick={() => removeSkill(personIndex, skillIndex)}
                              />
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          {activeTab !== "idea" ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
          )}

          {activeTab !== "team" ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Card>
  )
}
