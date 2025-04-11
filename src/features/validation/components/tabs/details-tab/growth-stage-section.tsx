"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { FormSection } from "../../ui/form-section"
import { CompetitorInput } from "../../ui/competitor-input"

// Import constants
import { userCountRanges, mauRanges, revenueRanges, acquisitionChannels } from "@/features/validation/constants/metrics"

export function GrowthStageSection({ addCompetitor, removeCompetitor }) {
  const { control, watch } = useFormContext()
  const competitors = watch("competitors") || []

  return (
    <div className="space-y-6">
      <FormSection title="Growth Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="userCountRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Count</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userCountRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="mauRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MAU</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mauRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="revenueRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revenue</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {revenueRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Acquisition">
        <FormField
          control={control}
          name="acquisitionChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Acquisition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How users find you" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {acquisitionChannels.map((channel) => (
                    <SelectItem key={channel.value} value={channel.value}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <CompetitorInput competitors={competitors} onAdd={addCompetitor} onRemove={removeCompetitor} />
      </FormSection>
    </div>
  )
}
