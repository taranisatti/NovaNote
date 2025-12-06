# NovaNote - Smart Task Manager

A full-featured, modern To-Do List and Task Manager web application built with pure HTML, CSS, and JavaScript. No frameworks required!

![NovaNote](https://img.shields.io/badge/NovaNote-Task%20Manager-purple)

## ✨ Features

### Base Features
- ✅ Add, delete, and mark tasks as completed
- 🏷️ Category selection (Work, Study, Personal, Custom)
- 💾 LocalStorage for data persistence
- 🔍 Search bar to filter tasks

### Advanced Features

#### 1. 🤖 Smart Priority Detector
Automatically detects urgency and importance from task text:
- **High Priority**: Keywords like "urgent", "deadline", "today", "exam"
- **Medium Priority**: Keywords like "tomorrow", "project", "meeting"
- **Low Priority**: Default for other tasks
- Auto-categorizes tasks based on content

#### 2. 📊 Motivation Meter
A visual progress indicator that shows:
- Completion percentage with circular progress ring
- Dynamic motivational messages:
  - 🔥 "On fire!" (100% completion)
  - ✨ "Small steps matter" (70%+)
  - 🌱 "Growing consistency" (40%+)
  - 💪 "Keep going!" (1-39%)

#### 3. 😊 Mood-Based Daily Quotes
Select your mood and receive:
- Inspirational quotes tailored to your mood
- Curated playlist suggestions
- Moods: Happy, Sad, Stressed, Lazy, Productive

#### 4. ⏱️ Built-in Pomodoro Timer
- 25-minute focused work sessions
- Visual progress ring
- Start, pause, and reset controls
- Task-specific timer sessions

#### 5. 📁 Task History (Archive)
- Completed tasks automatically move to archive
- Restore or permanently delete archived tasks
- Clear archive option

#### 6. 📈 Analytics Dashboard
Comprehensive productivity insights:
- **Daily Completion Chart**: Bar chart showing tasks completed per day
- **Category Breakdown**: Pie chart of task distribution
- **Productivity Trend**: Line chart showing productivity over time
- Real-time statistics (Total, Completed, In Progress, Completion Rate)

#### 7. 🎤 Voice Input
- Add tasks using your voice
- Browser Speech Recognition API
- Visual listening indicator

#### 8. 🌓 Dark/Light Mode Toggle
- Smooth theme transitions
- Preference saved in LocalStorage
- Beautiful dark mode optimized for productivity

#### 9. 🎨 Custom Background Themes
Choose from 6 aesthetic themes:
- **Minimal**: Clean black and white
- **Forest**: Green nature vibes
- **Sunset**: Warm orange tones
- **Space**: Deep blue cosmos
- **Lavender**: Purple elegance
- **BTS Purple**: K-pop inspired purple theme

#### 10. 🧹 Auto-Clean Mode
Configure automatic task cleanup:
- Clear completed tasks instantly
- Clear after 24 hours
- Clear after page refresh
- Never auto-clear (default)

#### 11. 🔔 Task Reminders
- Set reminder times for tasks
- Browser notifications
- Automatic reminder checking

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or build tools required!

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/novanote.git
   cd novanote
   ```

2. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```

3. **Access the App**
   - Open your browser and navigate to `http://localhost:8000`
   - Or double-click `index.html` to open directly

## 📖 How to Use

### Adding Tasks
1. Type your task in the input field
2. Select a category (or create a custom one)
3. Optionally set a reminder time
4. Click "Add" or press Enter
5. The Smart Priority Detector will automatically assign priority

### Using Voice Input
1. Click the microphone icon
2. Speak your task clearly
3. The task will be automatically added

### Pomodoro Timer
1. Click the clock icon on any task
2. Start the 25-minute timer
3. Focus on your task
4. Take a break when the timer completes

### Viewing Analytics
1. Click "Analytics" in the navigation
2. View your productivity statistics
3. Check charts for insights

### Managing Archive
1. Completed tasks automatically move to archive
2. Click "Archive" in navigation to view
3. Restore tasks or delete permanently

### Changing Themes
1. Go to Settings
2. Select your preferred theme
3. Toggle dark/light mode with the moon/sun icon

## 🎨 Customization

### Adding Custom Categories
1. Select "Custom" from the category dropdown
2. Type your custom category name
3. It will be saved with your task

### Setting Reminders
1. When adding a task, use the datetime picker
2. Select your reminder date and time
3. Enable browser notifications when prompted
4. You'll receive a notification at the set time

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Full support including voice input)
- ✅ Firefox (Full support)
- ✅ Safari (Full support, voice input may vary)
- ✅ Opera (Full support)

**Note**: Voice input requires HTTPS or localhost. For production, use HTTPS.

## 🌐 Deployment

### GitHub Pages

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/novanote.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch and "/ (root)" folder
   - Click Save
   - Your app will be live at `https://yourusername.github.io/novanote`

### Netlify

1. **Drag and Drop**
   - Go to [Netlify](https://www.netlify.com)
   - Sign up/login
   - Drag your project folder to the deploy area
   - Your app is live!

2. **Git Integration**
   - Connect your GitHub repository
   - Netlify will auto-deploy on every push

3. **Custom Domain** (Optional)
   - Add your custom domain in Netlify settings
   - Configure DNS as instructed

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Your app will be deployed instantly

### Other Options
- **Surge.sh**: `surge ./`
- **Firebase Hosting**: Use Firebase CLI
- **AWS S3**: Upload to S3 bucket with static hosting

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Variables, Flexbox, Grid
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Chart.js**: For analytics charts (CDN)
- **Font Awesome**: Icons (CDN)
- **Google Fonts**: Inter font family

### Data Storage
- **LocalStorage**: All tasks, settings, and preferences
- **No Backend Required**: Everything runs client-side
- **Privacy First**: Your data never leaves your browser

### File Structure
```
novanote/
├── index.html      # Main HTML structure
├── styles.css      # All styling and themes
├── script.js       # Application logic
└── README.md       # This file
```

## 🎯 Feature Explanations

### Smart Priority Detector
Uses keyword matching and pattern recognition:
- Scans task text for urgency indicators
- Detects date references (days of week, time references)
- Assigns priority levels automatically
- Can be manually adjusted if needed

### Motivation Meter Algorithm
- Calculates: (Completed Tasks / Total Tasks) × 100
- Updates in real-time as tasks are completed
- Provides visual feedback with circular progress
- Motivational messages change based on completion rate

### Pomodoro Timer
- 25-minute work sessions (standard Pomodoro technique)
- Visual countdown with circular progress
- Pause/resume functionality
- Automatic completion notification

### Analytics Engine
- Tracks task creation and completion dates
- Calculates daily productivity metrics
- Generates visual charts using Chart.js
- Updates automatically when tasks change

### Voice Recognition
- Uses Web Speech API
- Converts speech to text
- Automatically populates task input
- Works best in Chrome/Edge browsers

## 🐛 Troubleshooting

### Voice Input Not Working
- Ensure you're on HTTPS or localhost
- Grant microphone permissions
- Try a different browser (Chrome recommended)

### Notifications Not Showing
- Check browser notification permissions
- Enable notifications in browser settings
- Some browsers block notifications on HTTP (use HTTPS)

### Charts Not Displaying
- Check internet connection (Chart.js loads from CDN)
- Clear browser cache
- Try refreshing the page

### Data Not Persisting
- Check if LocalStorage is enabled in browser
- Clear browser cache and try again
- Ensure cookies are enabled

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💡 Future Enhancements

Potential features for future versions:
- Task due dates with calendar view
- Task dependencies and subtasks
- Team collaboration features
- Export/import functionality
- Mobile app version
- Cloud sync option

## 📧 Support

For questions or support:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Font Awesome for icons
- Google Fonts for typography
- Web Speech API for voice recognition
- Browser Notification API for reminders

---

**Made with ❤️ for productivity enthusiasts**

*Start organizing your life with NovaNote today!*

