/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        session: import('./auth').Session | null;
        user: import('./auth').User | null;
    }
}
