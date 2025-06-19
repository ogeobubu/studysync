import * as React from "react"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "./button"

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { setIsOpen } = React.useContext(DropdownMenuContext)
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(prev => !prev)
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(prev => !prev)}
      className="flex items-center gap-1"
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  )
}

export function DropdownMenuContent({
  children,
  align = "start",
}: {
  children: React.ReactNode
  align?: "start" | "center" | "end"
}) {
  const { isOpen } = React.useContext(DropdownMenuContext)
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  }

  if (!isOpen) return null

  return (
    <div
      className={`absolute z-50 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignmentClasses[align]}`}
      role="menu"
      tabIndex={-1}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    onClick?.()
    setIsOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      role="menuitem"
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-100 my-1" />
}