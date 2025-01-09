/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    session: {
      data: {
        user?: {
          // Add any user properties you need
        }
      }
    }
  }
}