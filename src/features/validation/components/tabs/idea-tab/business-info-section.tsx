import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { FormSection } from "../../ui/form-section"

export function BusinessInfoSection() {
  const { control } = useFormContext()

  return (
    <FormSection title="Business Information">
      <FormField
        control={control}
        name="businessIdea"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Describe your business idea
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Textarea placeholder="What problem are you solving and how?" rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Website (Optional)</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  )
}
