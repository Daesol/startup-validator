"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { FormSection } from "../../ui/form-section"
import { CompetitorInput } from "../../ui/competitor-input"

export function EarlyStageSection({ addCompetitor, removeCompetitor }) {
  const { control, watch } = useFormContext()
  const competitors = watch("competitors") || []

  return (
    <div className="space-y-6">
      <FormSection title="Target Market">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Input placeholder="Describe your target audience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="monetizationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monetization Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="one-time">One-time fee</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Differentiation">
        <FormField
          control={control}
          name="differentiation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What makes this idea different?</FormLabel>
              <FormControl>
                <Textarea placeholder="Explain what makes your idea unique..." rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CompetitorInput competitors={competitors} onAdd={addCompetitor} onRemove={removeCompetitor} />
      </FormSection>
    </div>
  )
}
