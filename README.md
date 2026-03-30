# LinkedIn Profile MCP Server 🚀

<p align="center">
  <img src="https://img.shields.io/badge/MCP-Server-blue?style=for-the-badge&logo=anthropic" alt="MCP Server">
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/LinkedIn-API%20v2-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn API">
  <img src="https://img.shields.io/badge/Testing-Jest-C21325?style=for-the-badge&logo=jest" alt="Jest">
</p>

<p align="center">
  <b>Bilingual Documentation / Documentación Bilingüe</b><br>
  <a href="#english">English</a> • <a href="#español">Español</a>
</p>

---

<a name="english"></a>
## 🇺🇸 English Version

An intelligent bridge between **Claude** and **LinkedIn**. This MCP server empowers Claude to act as your high-level career consultant, capable of auditing your profile, optimizing your identity, and managing your professional content with real-time API access.

### 🏗 Architecture Overview

```mermaid
graph TD
    User((User)) <--> Claude[Claude AI]
    Claude <--> MCP[LinkedIn MCP Server]
    subgraph "Internal Logic"
        MCP --> Auth[OAuth 2.0 / Keytar]
        MCP --> Tools[40+ Professional Tools]
        MCP --> AI[AI-Assist Layer]
    end
    Tools <--> API[(LinkedIn API v2)]
    AI <--> Prompts[Strategic Templates]
```

### ✨ Key Features
- **Impact Audit**: Data-driven analysis of your profile's effectiveness.
- **Identity Control**: Precision updates for headlines and summaries.
- **Content Engine**: Direct posting of updates and articles.
- **Smart ATS**: Match your profile against specific job descriptions.
- **Security Hub**: Mandatory diff previews and encrypted token storage.

### 🚀 Quick Start

| Step | Action | Command |
| :--- | :--- | :--- |
| 1 | Clone | `git clone https://github.com/Thejosem4/linkedin-profile-mcp.git` |
| 2 | Install | `npm install` |
| 3 | Config | `cp .env.example .env` |
| 4 | Build | `npm run build` |
| 5 | Start | `npm start` |

---

<a name="español"></a>
## 🇪🇸 Versión en Español

Un puente inteligente entre **Claude** y **LinkedIn**. Este servidor MCP permite que Claude actúe como tu consultor de carrera de alto nivel, capaz de auditar tu perfil, optimizar tu identidad y gestionar tu contenido profesional con acceso en tiempo real a la API.

### 🏗 Vista General de la Arquitectura

```mermaid
graph TD
    User((Usuario)) <--> Claude[Claude AI]
    Claude <--> MCP[LinkedIn MCP Server]
    subgraph "Lógica Interna"
        MCP --> Auth[OAuth 2.0 / Keytar]
        MCP --> Tools[40+ Herramientas Prof.]
        MCP --> AI[Capa de Asistencia IA]
    end
    Tools <--> API[(API de LinkedIn v2)]
    AI <--> Prompts[Plantillas Estratégicas]
```

### ✨ Características Principales
- **Auditoría de Impacto**: Análisis basado en datos sobre la efectividad de tu perfil.
- **Control de Identidad**: Actualizaciones de precisión para titulares y extractos.
- **Motor de Contenido**: Publicación directa de actualizaciones y artículos.
- **ATS Inteligente**: Compara tu perfil contra descripciones de empleo específicas.
- **Hub de Seguridad**: Previsualización de cambios obligatoria y almacenamiento cifrado.

### 🚀 Inicio Rápido

| Paso | Acción | Comando |
| :--- | :--- | :--- |
| 1 | Clonar | `git clone https://github.com/Thejosem4/linkedin-profile-mcp.git` |
| 2 | Instalar | `npm install` |
| 3 | Configurar | `cp .env.example .env` |
| 4 | Compilar | `npm run build` |
| 5 | Iniciar | `npm start` |

---

## ⚙️ Configuration / Configuración (.env)

Detailed guide available in the [Setup Guide](docs/setup-oauth.md).
Guía detallada disponible en la [Guía de Configuración](docs/setup-oauth.md).

## 📚 Resources / Recursos
- [Tools Reference / Referencia de Herramientas](docs/tools-reference.md)
- [Contributing / Contribuir](CONTRIBUTING.md)
- [Changelog / Historial de Cambios](CHANGELOG.md)

## 📄 License / Licencia
MIT License © 2026 Thejosem4
