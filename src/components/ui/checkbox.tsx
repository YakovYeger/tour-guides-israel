import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-md border-2 border-gray-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-white',
      'transition-colors',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      {props.checked === 'indeterminate' ? (
        <Minus className="h-3.5 w-3.5" />
      ) : (
        <Check className="h-3.5 w-3.5" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Checkbox with label
interface CheckboxWithLabelProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: string
  description?: string
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ className, label, description, id, ...props }, ref) => {
  const inputId = id || React.useId()

  return (
    <div className="flex items-start gap-3">
      <Checkbox ref={ref} id={inputId} className={className} {...props} />
      <div className="flex flex-col">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
})
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

export { Checkbox, CheckboxWithLabel }

