import animate from "tailwindcss-animate";
import { setupInspiraUI } from "@inspira-ui/plugins";

export default {
  plugins: [animate, setupInspiraUI],
  theme: {
    extend: {
      colors: {
        primary: '#4ade80',
      }
    }
  }
}