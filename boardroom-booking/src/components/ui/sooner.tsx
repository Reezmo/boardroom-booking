"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-800 group-[.toaster]:border-emerald-200 group-[.toaster]:shadow-lg group-[.toaster]:shadow-emerald-100/50 group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-gray-600",
          actionButton: "group-[.toast]:bg-emerald-500 group-[.toast]:text-white group-[.toast]:hover:bg-emerald-600 group-[.toast]:rounded-lg group-[.toast]:font-medium",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-lg",
          closeButton: "group-[.toast]:bg-emerald-50 group-[.toast]:text-emerald-600 group-[.toast]:border-emerald-200 group-[.toast]:hover:bg-emerald-100",
          title: "group-[.toast]:text-gray-900 group-[.toast]:font-semibold",
          success: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-emerald-50 group-[.toast]:to-teal-50 group-[.toast]:border-emerald-300 group-[.toast]:text-emerald-800",
          error: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-red-50 group-[.toast]:to-rose-50 group-[.toast]:border-red-300 group-[.toast]:text-red-800",
          warning: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-amber-50 group-[.toast]:to-yellow-50 group-[.toast]:border-amber-300 group-[.toast]:text-amber-800",
          info: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-50 group-[.toast]:to-sky-50 group-[.toast]:border-blue-300 group-[.toast]:text-blue-800",
          loading: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-gray-50 group-[.toast]:to-slate-50 group-[.toast]:border-gray-300 group-[.toast]:text-gray-800",
        },
      }}
      style={
        {
          "--normal-bg": "rgb(255, 255, 255)",
          "--normal-text": "rgb(31, 41, 55)",
          "--normal-border": "rgb(167, 243, 208)",
          "--success-bg": "linear-gradient(to right, rgb(236, 253, 245), rgb(240, 253, 250))",
          "--success-text": "rgb(6, 95, 70)",
          "--error-bg": "linear-gradient(to right, rgb(254, 242, 242), rgb(255, 241, 242))",
          "--error-text": "rgb(153, 27, 27)",
          "--warning-bg": "linear-gradient(to right, rgb(255, 251, 235), rgb(254, 249, 195))",
          "--warning-text": "rgb(146, 64, 14)",
          "--info-bg": "linear-gradient(to right, rgb(239, 246, 255), rgb(240, 249, 255))",
          "--info-text": "rgb(30, 64, 175)",
        } as React.CSSProperties
      }
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      {...props}
    />
  )
}

export { Toaster }
