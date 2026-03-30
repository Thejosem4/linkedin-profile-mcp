# LinkedIn Profile MCP Server 🚀

[English](#english) | [Español](#español)

---

<a name="english"></a>
## 🇺🇸 English Version

A Model Context Protocol (MCP) server designed to audit, optimize, and manage your LinkedIn profile through Claude. This server acts as your personal branding consultant, with direct access to LinkedIn's API to read your current profile and propose strategic improvements.

### ✨ Key Features
- **Comprehensive Profile Audit**: Analyze your headline, summary, and experience for impact and clarity.
- **Identity Management**: Update your headline and "About" section with character-limit validation.
- **Professional History**: Manage experiences, education, skills, and certifications.
- **Content Creation**: Post updates and articles directly from Claude.
- **AI-Assist Optimization**: ATS gap analysis and professional content generation without clichés.
- **Security First**: Mandatory `diff_preview` for every change and secure OS-level token storage.

### 🛠 Tech Stack
- **TypeScript & Node.js 20+**
- **@modelcontextprotocol/sdk**
- **LinkedIn API v2 (OAuth 2.0)**
- **Keytar** (Secure Credential Storage)
- **Jest** (Comprehensive Testing)

### 🚀 Quick Start

#### Prerequisites
- Node.js (v18 or higher)
- A LinkedIn Developer App (Client ID & Secret)

#### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Thejosem4/linkedin-profile-mcp.git
   cd linkedin-profile-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your LinkedIn credentials.
   ```bash
   cp .env.example .env
   ```

4. **Build & Test:**
   ```bash
   npm run build
   npm run test
   ```

#### Usage
Start the MCP server:
```bash
npm start
```
Connect it to your Claude Desktop or Claude Code client using the project path.

---

<a name="español"></a>
## 🇪🇸 Versión en Español

Un servidor de Model Context Protocol (MCP) diseñado para auditar, optimizar y gestionar tu perfil de LinkedIn a través de Claude. Este servidor actúa como tu consultor personal de marca, con acceso directo a la API de LinkedIn para leer tu perfil actual y proponer mejoras estratégicas.

### ✨ Características Principales
- **Auditoría Integral**: Analiza tu titular, extracto y experiencia para mejorar el impacto y la claridad.
- **Gestión de Identidad**: Actualiza tu titular y sección "Acerca de" con validación de límites de caracteres.
- **Historial Profesional**: Gestiona experiencias, educación, aptitudes y certificaciones.
- **Creación de Contenido**: Publica actualizaciones y artículos directamente desde Claude.
- **Optimización con IA**: Análisis de brechas ATS y generación de contenido profesional sin clichés.
- **Seguridad Ante Todo**: `diff_preview` obligatorio para cada cambio y almacenamiento seguro de tokens.

### 🛠 Stack Tecnológico
- **TypeScript & Node.js 20+**
- **@modelcontextprotocol/sdk**
- **LinkedIn API v2 (OAuth 2.0)**
- **Keytar** (Almacenamiento seguro de credenciales)
- **Jest** (Suite de pruebas completa)

### 🚀 Inicio Rápido

#### Requisitos Previos
- Node.js (v18 o superior)
- Una App en LinkedIn Developer (Client ID y Secret)

#### Instalación
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Thejosem4/linkedin-profile-mcp.git
   cd linkedin-profile-mcp
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura el Entorno:**
   Copia `.env.example` a `.env` y completa tus credenciales de LinkedIn.
   ```bash
   cp .env.example .env
   ```

4. **Compila y Prueba:**
   ```bash
   npm run build
   npm run test
   ```

#### Uso
Inicia el servidor MCP:
```bash
npm start
```
Conéctalo a tu cliente Claude Desktop o Claude Code usando la ruta del proyecto.

---

## 📚 Documentation / Documentación
- [Tools Reference / Referencia de Herramientas](docs/tools-reference.md)
- [OAuth Setup Guide / Guía de Configuración OAuth](docs/setup-oauth.md)
- [Contributing / Contribuir](CONTRIBUTING.md)

## 📄 License / Licencia
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
