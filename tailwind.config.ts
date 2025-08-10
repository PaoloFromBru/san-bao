
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors:{ gold:"#C9A24A", teal:"#5DAAA3", ink:"#174E57" },
    borderRadius:{ xl2:"1.25rem" }, boxShadow:{ soft:"0 10px 30px rgba(0,0,0,0.06)" }
  }}, plugins:[]
} satisfies Config;
