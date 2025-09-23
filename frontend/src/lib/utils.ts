import { clsx, type ClassValue } from "clsx"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let ActiveProject={};

const setActiveProject = (temp) => {
  ActiveProject = temp;
}
export {ActiveProject,setActiveProject}
