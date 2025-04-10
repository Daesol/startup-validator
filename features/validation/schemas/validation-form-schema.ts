import * as z from "zod"

// Create a schema for the form
export const validationFormSchema = z.object({
  // Idea tab
  businessIdea: z.string().min(1, "Business idea is required"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  businessType: z.string().min(1, "Business type is required"),
  businessStage: z.string().min(1, "Business stage is required"),

  // Details tab
  personalProblem: z.boolean().optional(),
  targetAudience: z.string().optional(),
  targetAudienceOther: z.string().optional(),
  charging: z.boolean().optional(),
  differentiation: z.string().optional(),
  competitors: z.array(z.string()).optional(),
  currentCompetitor: z.string().optional(),

  // Growth metrics
  userCount: z.string().optional(),
  userCountRange: z.string().optional(),
  mau: z.string().optional(),
  mauRange: z.string().optional(),
  monthlyRevenue: z.string().optional(),
  acquisitionChannel: z.string().optional(),
  revenueRange: z.string().optional(),
  pricingModel: z.string().optional(),
  pricingModelOther: z.string().optional(),
  cac: z.string().optional(),
  ltv: z.string().optional(),
  teamSize: z.string().optional(),
  raisedFunds: z.boolean().optional(),
  fundsRaised: z.string().optional(),
  investors: z.string().optional(),
  monetizationMethod: z.string().optional(),
  fundingStatus: z.string().optional(),

  // Team tab
  coFounderCount: z.string().optional(),
  teamMembers: z
    .array(
      z.object({
        person: z.string(),
        skills: z.array(z.string()),
      }),
    )
    .optional(),
  coFounderStatus: z.string().optional(),
  teamGaps: z.string().optional(),
})

export type ValidationFormValues = z.infer<typeof validationFormSchema>
