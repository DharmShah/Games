# 🎮 Dharm's Game Hub

> A comprehensive collection of interactive games, coding tools, and educational applications built with modern web technologies and Python.

![Game Hub Screenshot](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Desktop-orange?style=flat-square)

---

## 📋 Table of Contents

- [🎮 About](#-about)
- [🎯 Projects](#-projects)
- [🛠️ Tech Stack](#-tech-stack)
- [📊 Architecture](#-architecture)
- [⚙️ Installation](#-installation)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎨 Features](#-features)
- [👤 Author](#-author)

---

## 🎮 About

**Dharm's Game Hub** is a collection of interactive gaming and educational experiences. It combines HTML/CSS/JavaScript games with a full-stack Python application for code conversion, alongside utility applications like a virtual cloth tester.

---

## 🎯 Projects

### 1. **Game Hub** (Main Landing Page)
   - Central hub for all games
   - Beautiful UI with Tailwind CSS
   - Easy navigation to all projects

### 2. **🕹️ Games Collection**

| Game | Description | Tech Stack |
|------|-------------|-----------|
| **3D Box** | Physics-based 3D object game | HTML, CSS, JavaScript, Three.js |
| **2048** | Slide & merge tiles puzzle game | HTML, CSS, JavaScript |
| **Tetris** | Classic block stacking game | HTML, CSS, JavaScript |
| **Number Path** | Swipe in ascending order puzzle | HTML, CSS, JavaScript |
| **Memory Match** | Flip cards to find matching pairs | HTML, CSS, JavaScript |
| **Rescuer Person** | Match candies to save character | HTML, CSS, JavaScript |
| **Starfall Arcade** | Neon shooter with drone waves | HTML, CSS, JavaScript, Canvas |
| **Snake Game** | Classic snake gameplay | Python with Pygame |
| **Word Puzzle (Crossword)** | Find words and discover category | HTML, CSS, JavaScript |
| **Learn Coding** | HTML + CSS + JS interactive practice | HTML, CSS, JavaScript |

### 3. **💻 Code Converter (Full-Stack App)**
   - **Backend**: FastAPI Python Server
   - **Frontend**: React + Vite
   - **Features**: Convert code between multiple programming languages
   - **API Integration**: OpenRouter API for AI-powered code conversion

### 4. **📱 Snapchat Cloth Tester**
   - Virtual T-shirt try-on using webcam
   - AR/Visual effects application
   - Browser-based utility

---

## 🛠️ Tech Stack

### **Frontend Technologies**
```
┌─────────────────────────────────────┐
│   Frontend Stack                    │
├─────────────────────────────────────┤
│ • React 19.1.0                      │
│ • Vite 7.0.4 (Build tool)          │
│ • Tailwind CSS                      │
│ • HTML5 Canvas API                  │
│ • CSS3 (Animations & Effects)       │
│ • Vanilla JavaScript (ES6+)         │
│ • Three.js (3D Graphics)            │
│ • Pygame (Python games)             │
└─────────────────────────────────────┘
```

### **Backend Technologies**
```
┌─────────────────────────────────────┐
│   Backend Stack                     │
├─────────────────────────────────────┤
│ • FastAPI 0.116.1                   │
│ • Python 3.x                        │
│ • Pydantic (Data validation)        │
│ • CORS Middleware                   │
│ • OpenRouter API Integration        │
│ • Uvicorn (ASGI server)            │
└─────────────────────────────────────┘
```

### **Development Tools**
```
┌─────────────────────────────────────┐
│   Development Tools                 │
├─────────────────────────────────────┤
│ • ESLint (Code linting)             │
│ • VS Code                           │
│ • Git/GitHub                        │
│ • npm/pip (Package management)      │
└─────────────────────────────────────┘
```

---

## 📊 Architecture

### **Overall Application Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                   DHARM'S GAME HUB                          │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌────────────┐  ┌────────────────┐  ┌───────────┐
    │   GAMES    │  │ CODE CONVERTER │  │   TOOLS   │
    └────────────┘  └────────────────┘  └───────────┘
        │                   │                   │
    ┌────────────┐  ┌──────────────┐+──┐  ┌───────────┐
    │ JavaScript │  │   Frontend   │   │  │ Snapchat  │
    │   Games    │  │  (React)     │   │  │ Cloth     │
    │            │  │  + Vite      │   │  │ Tester    │
    │ • 2048     │  │              │   │  └───────────┘
    │ • Tetris   │  └──────────────┘   │
    │ • Memory   │         │            │
    │ • Shooter  │         │ API Calls  │
    │ • etc.     │         │ (HTTP)     │
    │            │  ┌─────────────────┐│
    │ Python     │  │  Backend        ││
    │ Snake      │  │  FastAPI Server ││
    │            │  │  - Routes       ││
    └────────────┘  │  - AI Convert   ││
                    │  - CORS         ││
                    └─────────────────┘│
                           │           │
                    ┌──────────────────┐
                    │  OpenRouter API  │
                    │  (Code Conv.)    │
                    └──────────────────┘
```

### **Code Converter Architecture**

```
Frontend (React)
    ↓
[CodeConverter.js] → [CodeEditor] + [LanguageSelector]
    ↓ (HTTP POST)
Backend (FastAPI)
    ↓
[routes.py] → [openrouter.py] → [OpenRouter API]
    ↓
[AI Code Conversion Services]
    ↓ (Response)
[Frontend] → [OutputBox.jsx] → Display
```

---

## ⚙️ Installation

### **Prerequisites**
- **Node.js** (v18+) and npm
- **Python** (v3.8+) and pip
- **Git**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/Game.git
cd Game
```

### **2. Setup Code Converter Backend**
```bash
cd CodeConverter/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Create a .env file with your OpenRouter API key
echo OPENROUTER_API_KEY=your_api_key_here > .env

# Run the server
uvicorn app.main:app --reload --port 8000
```

### **3. Setup Code Converter Frontend**
```bash
cd CodeConverter/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **4. Run Standalone Games**
- Open any `.html` file in your browser to play individual games
- For Snake game: `python snakeGame.py`

---

## 🚀 Getting Started

### **Run Everything Locally**

1. **Start Backend (Terminal 1)**
   ```bash
   cd CodeConverter/backend
   source venv/bin/activate  # or venv\Scripts\activate (Windows)
   uvicorn app.main:app --reload
   ```

2. **Start Frontend (Terminal 2)**
   ```bash
   cd CodeConverter/frontend
   npm run dev
   ```

3. **Access Applications**
   - **Game Hub**: Open `index.html` in browser
   - **Code Converter**: Navigate to `http://localhost:5173`
   - **Individual Games**: Open any `.html` file directly

---

## 📁 Project Structure

```
Game/
├── README.md                          # This file
├── index.html                         # Main Game Hub landing page
│
├── 🎮 Games (Standalone HTML/JS)
├── 2048.html                          # 2048 game
├── 3DBox.html                         # 3D Box game
├── tetris.html                        # Tetris game
├── memoryGame.html                    # Memory card matching
├── memoryGame.js
├── numberPath.html                    # Number path puzzle
├── numberPath.js
├── rescuePerson.html                  # Rescue person game
├── shooter.html                       # Starfall arcade shooter
├── shooter.js
├── crossWord.html                     # Crossword puzzle
├── crossWord.js
├── codingGame.html                    # Learn coding interactive
├── game.js                            # Shared game utilities
│
├── 🐍 Python Games
├── snakeGame.py                       # Snake game with Pygame
│
├── 📊 Data Files
├── questions-html-css.json            # Quiz questions data
│
├── 💻 Code Converter (Full Stack)
├── CodeConverter/
│   ├── frontend/                      # React + Vite
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── main.jsx
│   │   │   ├── index.css
│   │   │   ├── components/
│   │   │   │   ├── CodeConverter.js
│   │   │   │   ├── CodeEditor.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── LanguageSelector.jsx
│   │   │   │   └── OutputBox.jsx
│   │   │   ├── pages/
│   │   │   │   └── Home.jsx
│   │   │   └── utils/
│   │   │       └── api.js
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── eslint.config.js
│   │   └── index.html
│   │
│   └── backend/                       # FastAPI Python
│       ├── requirements.txt
│       ├── app/
│       │   ├── __init__.py
│       │   ├── main.py
│       │   ├── api/
│       │   │   ├── __init__.py
│       │   │   └── routes.py
│       │   ├── services/
│       │   │   ├── __init__.py
│       │   │   └── openrouter.py
│       │   ├── config/
│       │   │   ├── __init__.py
│       │   │   └── settings.py
│       │   └── components/
│       │       └── convertCode.js
│       └── requirements.txt
│
├── 📱 Snapchat Cloth Tester
├── SnapchatClothTester/
│   ├── app.js
│   ├── visual.html
│   └── images/
│
└── .git/                              # Version control
```

---

## 🎨 Features

### **Game Hub Features**
- ✨ Beautiful responsive UI with Tailwind CSS
- 🎮 10+ playable games
- 📱 Mobile-friendly design
- 🎯 Easy navigation
- 🌈 Smooth animations

### **Code Converter Features**
- 🔄 Real-time code conversion
- 🤖 AI-powered by OpenRouter API
- 💻 Support for multiple programming languages
- 🎨 Beautiful syntax-highlighted code editor
- 📋 Copy/paste functionality
- ⚡ Fast API responses

### **Games Features**
- 🕹️ Classic and modern game mechanics
- 🏆 Score tracking
- 🎨 Engaging graphics and animations
- 📱 Responsive design
- ⌨️ Keyboard controls
- 🖱️ Mouse controls
- 🎯 Different difficulty levels

---

## 📦 Dependencies

### **Frontend**
- React 19.1.0
- React DOM 19.1.0
- Vite 7.0.4
- Tailwind CSS
- ESLint 9.30.1

### **Backend**
- FastAPI 0.116.1
- Pydantic (BaseModel validation)
- Python CORS Middleware
- Uvicorn (ASGI server)
- Annotated Types

### **Optional**
- Pygame (for Python Snake game)
- Three.js (for 3D graphics in games)

---

## 🔑 Environment Variables

### **Backend (.env)**
```
OPENROUTER_API_KEY=your_api_key_here
BACKEND_URL=http://localhost:8000
```

### **Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Deployment

### **Deploy Frontend**
- **Netlify**: Connect your GitHub repo for auto-deployment
- **Vercel**: Push to main branch for instant deployment
- **GitHub Pages**: Static hosting for games

### **Deploy Backend**
- **Railway**: Python + FastAPI support
- **Render**: Free tier available
- **Heroku**: Traditional Python hosting
- **DigitalOcean**: VPS or App Platform

---

## 📝 Usage Examples

### **Play a Game**
```bash
# Open in browser
open index.html    # macOS
start index.html   # Windows

# Or use a local server
python -m http.server 8000
# Navigate to http://localhost:8000
```

### **Use Code Converter**
1. Start both frontend and backend
2. Navigate to `http://localhost:5173`
3. Paste your code
4. Select source and target languages
5. Convert and copy the result

### **Run Snake Game**
```bash
python snakeGame.py
```

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ **Game Development**: Canvas API, Physics, Game Loops
- ✅ **Frontend**: React, Vite, Tailwind CSS
- ✅ **Backend**: FastAPI, REST APIs, CORS
- ✅ **Full-Stack**: Client-Server communication
- ✅ **API Integration**: Third-party AI services
- ✅ **UI/UX Design**: Interactive components
- ✅ **Project Structure**: Scalable architecture

---

## 🐛 Troubleshooting

### **Backend Issues**
- Ensure Python 3.8+ is installed
- Check CORS configuration in `main.py`
- Verify OpenRouter API key is valid
- Check if port 8000 is available

### **Frontend Issues**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+)
- Ensure Vite dev server is running

### **Game Issues**
- Disable browser extensions that might interfere
- Check browser console for JavaScript errors
- Ensure cookies/storage are enabled

---

## 📊 Tech Stack Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                     FULL TECH STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Layer          Backend Layer       External API   │
│  ─────────────          ──────────────       ────────────  │
│  • React 19.1           • FastAPI 0.116     • OpenRouter   │
│  • Vite 7.0             • Python 3.x        • Pydantic     │
│  • Tailwind CSS         • Uvicorn           • httpx        │
│  • Canvas API           • CORS              • aiohttp      │
│  • Three.js             • RESTful API       • async/await  │
│  • HTML5                • Pydantic Models                  │
│  • Vanilla JS           • Middleware                       │
│  • ESLint               • Error Handling                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingGame`)
3. Commit your changes (`git commit -m 'Add amazing game'`)
4. Push to the branch (`git push origin feature/AmazingGame`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Dharm Shah**
- GitHub: [@dharmashah](https://github.com)
- Portfolio: [Your Portfolio]
- Email: [your.email@example.com]

---

## 🙏 Acknowledgments

- **OpenRouter**: For AI-powered code conversion API
- **React**: For the amazing frontend framework
- **FastAPI**: For the modern Python web framework
- **Tailwind CSS**: For beautiful styling utilities
- **Vite**: For blazingly fast build tool
- Community feedback and contributors

---

## 📞 Support

If you have any questions or suggestions, please feel free to:
- Open an issue on GitHub
- Contact me directly
- Submit a pull request

---

## 🌟 Show Your Support

If you like this project, please consider giving it a ⭐ on GitHub!

```
Made with ❤️ by Dharm Shah
```

---

**Last Updated**: 2026    
**Status**: 🟢 Active & Maintained
