# UI Refactor: Navigation and Summary Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the navigation to use explicit buttons for views/roles, swap header labels for better hierarchy, and add a dynamic summary card for city-specific service counts.

**Architecture:** Update the state management for navigation and roles to be synchronous, refactor the header component for layout changes, and add city-based data aggregation in the main App component.

**Tech Stack:** React (Vite), CSS-in-JS (inline styles).

---

### Task 1: Refactor Navigation and Role Switching

**Files:**
- Modify: `src/omnisalud-red-nacional.jsx`

- [ ] **Step 1: Update `tabsDef` to always include both views**

```javascript
  const tabsDef = [
    ["buscar", <><IconConsult size={16} /> Consultar</>],
    ["ajustes", <><IconSettings size={16} /> Ajustes</>],
  ];
```

- [ ] **Step 2: Update Nav Button `onClick` to handle role switching**

```javascript
          <nav style={{ display: "flex", gap: 4, height: "100%", alignItems: "center" }}>
            {tabsDef.map(([key, label]) => (
              <button key={key} onClick={() => {
                setTab(key);
                setRol(key === "buscar" ? "cliente" : "admin");
              }} style={{
                border: "none", cursor: "pointer", height: 40, padding: "0 16px",
                borderRadius: 8, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
                transition: "all .2s",
              }}>{label}</button>
            ))}
          </nav>
```

- [ ] **Step 3: Verification**
- Open the application.
- Verify that both "Consultar" and "Ajustes" buttons are visible in the header.
- Verify that clicking "Ajustes" changes the role to admin and shows the settings view.
- Verify that clicking "Consultar" changes the role to client and shows the search view.

- [ ] **Step 4: Commit**
```bash
git add src/omnisalud-red-nacional.jsx
git commit -m "refactor: update navigation to use explicit view buttons"
```

---

### Task 2: Header Refactor (Label Swap and Button Removal)

**Files:**
- Modify: `src/omnisalud-red-nacional.jsx`

- [ ] **Step 1: Swap portal title and "VISTA ACTIVA" positions**

```javascript
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase" }}>Vista Activa</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{rol === "admin" ? "Panel Administrativo" : "Portal de Consultas"}</div>
            </div>
            {/* Role toggle button will be removed in next step */}
          </div>
```

- [ ] **Step 2: Remove the role toggle button from the right side**

```javascript
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase" }}>Vista Activa</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{rol === "admin" ? "Panel Administrativo" : "Portal de Consultas"}</div>
            </div>
          </div>
```

- [ ] **Step 3: Verification**
- Verify that "VISTA ACTIVA" is now on top of the portal title.
- Verify that the "Ir a Gestión/Consulta" button on the far right is gone.

- [ ] **Step 4: Commit**
```bash
git add src/omnisalud-red-nacional.jsx
git commit -m "style: swap header labels and remove legacy role toggle button"
```

---

### Task 3: Implement Dynamic Summary Card

**Files:**
- Modify: `src/omnisalud-red-nacional.jsx`

- [ ] **Step 1: Add `servicesInCity` useMemo to calculate city-specific counts**

```javascript
  const servicesInCity = useMemo(() => {
    const currentCiudad = tab === "buscar" ? ciudad : adjCiudad;
    if (currentCiudad === "TODAS") return portafolio.length;
    return portafolio.filter(r => r.ciudad === currentCiudad).length;
  }, [portafolio, ciudad, adjCiudad, tab]);
```

- [ ] **Step 2: Add the new card to the summary section**

```javascript
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #eef1f6", textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 2 }}>
                  Servicios en {tab === "buscar" ? (ciudad === "TODAS" ? "Red" : ciudad) : (adjCiudad === "TODAS" ? "Red" : adjCiudad)}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0c2d6b" }}>{servicesInCity.toLocaleString()}</div>
              </div>
              <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid #eef1f6", textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", marginBottom: 2 }}>Ciudades</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1aab8a" }}>{totalCiudades}</div>
              </div>
              {/* ... other cards ... */}
            </div>
```

- [ ] **Step 3: Verification**
- Change the city in the search view and verify the "Servicios en [Ciudad]" card updates.
- Switch to "Ajustes" and change the city there; verify the card updates accordingly.
- Verify that if "Todas las ciudades" is selected, it shows "Servicios en Red" with the total count.

- [ ] **Step 4: Commit**
```bash
git add src/omnisalud-red-nacional.jsx
git commit -m "feat: add dynamic summary card for city-specific service counts"
```
