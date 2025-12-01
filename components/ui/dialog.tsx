import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => onOpenChange?.(false)}
            />

            {/* Dialog */}
            <div
                ref={ref}
                className={cn(
                    "relative z-50 w-full max-w-lg bg-card border rounded-lg shadow-premium-lg animate-scaleIn",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    )
})
Dialog.displayName = "Dialog"

const DialogHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-2xl font-serif font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
DialogContent.displayName = "DialogContent"

const DialogFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center justify-end gap-3 p-6 pt-0", className)}
        {...props}
    />
))
DialogFooter.displayName = "DialogFooter"

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter }
