import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("markdownRescueDesktop", {
  isDesktop: true,
});
