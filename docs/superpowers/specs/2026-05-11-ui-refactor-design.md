# Design Specification: UI Refactor for Omnisalud Red Nacional

**Date:** 2026-05-11
**Topic:** UI Refactor - Navigation and Summary Cards

## Overview
The goal is to improve the navigation experience by replacing the single role-toggle button with explicit view buttons in the main navigation bar. Additionally, the header layout will be adjusted for better hierarchy, and a new dynamic summary card will be added to provide city-specific data.

## Proposed Changes

### 1. Navigation & Role Switching
- **Current State:** A single button on the far right toggles between `cliente` (Client) and `admin` (Administrator) roles. The navigation bar only shows one tab at a time.
- **New State:**
    - Remove the role-toggle button from the right side of the header.
    - The main `<nav>` in the header will now always display two buttons:
        - **Consultar**: When clicked, sets `rol` to `cliente` and `tab` to `buscar`.
        - **Ajustes**: When clicked, sets `rol` to `admin` and `tab` to `ajustes`.
    - Active state styling will apply to the button corresponding to the current role/tab.

### 2. Header Layout Adjustment
- **Current State:** The right side of the header displays the portal name (e.g., "Portal de Consultas") on top and "VISTA ACTIVA" on the bottom.
- **New State:** Swap these positions.
    - **Top:** "VISTA ACTIVA" (smaller, uppercase, muted color).
    - **Bottom:** Current role-based title (e.g., "Portal de Consultas" or "Panel Administrativo") (larger, bold, white).

### 3. Summary Cards
- **Current State:** Shows "Ciudades" and "Activos" (plus "Inactivos" for admins).
- **New State:** Add a new dynamic card.
    - **Label:** "Servicios en [Ciudad]" (where `[Ciudad]` is the currently selected city in the search or adjustment view).
    - **Value:** The total count of services (including active and inactive) belonging to that city.
    - **Behavior:** If "Todas las ciudades" is selected, the label should show "Servicios en Red" or "Servicios Totales".

## Implementation Plan (Conceptual)
- Modify `tabsDef` in `src/omnisalud-red-nacional.jsx` to be static or always include both options.
- Update the nav button `onClick` handlers to update both `rol` and `tab`.
- Adjust the JSX in the `<header>` to swap the title and "VISTA ACTIVA" label and remove the old toggle button.
- Implement a `useMemo` to calculate the service count for the active city.
- Add the new card to the summary grid.

## Verification
- Verify that clicking "Consultar" switches the view to search mode and updates the role.
- Verify that clicking "Ajustes" switches the view to management mode and updates the role.
- Verify the header labels are swapped correctly.
- Verify the dynamic card updates correctly when the city filter changes.
