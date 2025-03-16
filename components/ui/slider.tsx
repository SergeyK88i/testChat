"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, defaultValue, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value, 10)
      if (onValueChange) {
        onValueChange([value])
      }
    }

    return (
      <div className={cn("relative w-full", className)}>
        <input
          type="range"
          ref={ref}
          defaultValue={defaultValue?.[0]}
          onChange={handleChange}
          className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer"
          style={{
            // Стилизация для разных браузеров
            WebkitAppearance: "none",
            appearance: "none",
          }}
          {...props}
        />
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: hsl(var(--primary));
            border: 2px solid white;
            cursor: pointer;
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: hsl(var(--primary));
            border: 2px solid white;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  },
)

Slider.displayName = "Slider"

export { Slider }

