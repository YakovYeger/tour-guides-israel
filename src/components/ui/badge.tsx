import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary border border-primary-200',
        primary: 'bg-primary-50 text-primary border border-primary-200',
        secondary: 'bg-secondary-50 text-secondary border border-secondary-200',
        accent: 'bg-accent-50 text-accent-dark border border-accent-200',
        success: 'bg-success-50 text-success border border-green-200',
        warning: 'bg-warning-50 text-warning-600 border border-amber-200',
        error: 'bg-error-50 text-error border border-red-200',
        outline: 'border border-border bg-transparent text-text-secondary',
        gold: 'bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-800 border border-amber-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }

