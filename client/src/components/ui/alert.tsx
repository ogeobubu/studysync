import { ReactNode, createContext, useContext } from "react";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// Context to pass alert type
const AlertContext = createContext<"info" | "success" | "warning" | "error">("info");

// Icons and styles for different types
const iconMap = {
  info: <Info className="h-5 w-5 text-blue-600" />,
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  error: <XCircle className="h-5 w-5 text-red-600" />,
};

const wrapperStyleMap = {
  info: "bg-blue-50 border border-blue-200 text-blue-800",
  success: "bg-green-50 border border-green-200 text-green-800",
  warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
  error: "bg-red-50 border border-red-200 text-red-800",
};

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  children: ReactNode;
  className?: string;
}

export const Alert = ({ type = "info", children, className = "" }: AlertProps) => {
  return (
    <AlertContext.Provider value={type}>
      <div className={`rounded-lg p-4 flex items-start gap-3 ${wrapperStyleMap[type]} ${className}`}>
        <div className="mt-1 shrink-0">{iconMap[type]}</div>
        <div className="space-y-1">{children}</div>
      </div>
    </AlertContext.Provider>
  );
};

export const AlertTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-sm font-semibold leading-tight">{children}</h3>
);

export const AlertDescription = ({ children }: { children: ReactNode }) => {
  const type = useContext(AlertContext);
  const textColor = {
    info: "text-blue-700",
    success: "text-green-700",
    warning: "text-yellow-700",
    error: "text-red-700",
  }[type];

  return <p className={`text-sm ${textColor}`}>{children}</p>;
};