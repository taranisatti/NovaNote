# NovaNote - Feature Explanations

This document provides detailed explanations of how each feature works in NovaNote.

## 📋 Base Features

### Add Task
- **How it works**: User types task text in the input field, selects a category, optionally sets a reminder, and clicks "Add" or presses Enter.
- **Implementation**: The `addTask()` function creates a task object with:
  - Unique ID (timestamp)
  - Task text
  - Category (auto-detected or user-selected)
  - Priority (auto-detected)
  - Completion status
  - Creation timestamp
  - Reminder time (if set)
- **Storage**: Task is added to the `tasks` array and saved to LocalStorage.

### Delete Task
- **How it works**: Click the trash icon on any task.
- **Implementation**: `deleteTask(id)` filters out the task from the `tasks` array and updates LocalStorage.

### Mark as Completed
- **How it works**: Click the checkbox next to a task.
- **Implementation**: `toggleComplete(id)` toggles the `completed` property and sets `completedAt` timestamp. Auto-clean mode may move it to archive immediately.

### Category Selection
- **How it works**: Select from dropdown (Work, Study, Personal) or choose "Custom" to enter a custom category.
- **Implementation**: Category is stored with each task. Custom categories are saved as-is.

### LocalStorage
- **How it works**: All data persists automatically using browser LocalStorage.
- **Implementation**: `saveData()` saves tasks, archive, theme, and settings. `loadData()` restores on page load.

### Search Bar
- **How it works**: Type in the search input to filter tasks in real-time.
- **Implementation**: `filterTasks()` searches task text and category, hiding non-matching items.

---

## 🤖 Advanced Features

### 1. Smart Priority Detector

**How it works:**
- Analyzes task text for keywords and patterns
- Assigns priority: High, Medium, or Low

**Detection Logic:**
```javascript
High Priority Keywords: urgent, asap, deadline, today, immediately, critical, important, exam, test, due
Medium Priority Keywords: tomorrow, soon, this week, project, meeting, appointment
Date Detection: Monday-Sunday, evening, morning → Medium priority
Default: Low priority
```

**Implementation:**
- `detectPriority(text)` function scans lowercase text
- Returns priority level immediately when task is added
- Priority badge displayed with color coding (red=high, yellow=medium, green=low)

**Auto-Category Detection:**
- Also detects category from keywords:
  - Work: work, office, meeting, project, client, deadline, presentation
  - Study: study, exam, test, homework, assignment, class, lecture
  - Personal: personal, family, friend, gym, exercise, shopping, grocery

---

### 2. Motivation Meter

**How it works:**
- Circular progress indicator showing completion percentage
- Updates in real-time as tasks are completed
- Displays motivational messages based on completion rate

**Calculation:**
```
Completion % = (Completed Tasks / Total Tasks) × 100
```

**Messages:**
- 100%: "🔥 On fire!"
- 70-99%: "✨ Small steps matter."
- 40-69%: "🌱 Growing consistency."
- 1-39%: "💪 Keep going!"
- 0%: "🌱 Start your journey!"

**Implementation:**
- SVG circle with stroke-dasharray animation
- `updateMotivationMeter()` recalculates on every task change
- Smooth animation using CSS transitions

---

### 3. Mood-Based Daily Quotes

**How it works:**
- User selects their current mood
- Displays an inspirational quote and playlist suggestion

**Moods Available:**
- 😊 Happy
- 😢 Sad
- 😰 Stressed
- 😴 Lazy
- 🚀 Productive

**Implementation:**
- `moodQuotes` object stores quotes and playlist suggestions
- `showMoodQuote(mood)` updates the quote card
- Each mood has a curated quote and music recommendation

**Quote Examples:**
- Happy: "Happiness is not something ready made. It comes from your own actions."
- Stressed: "You don't have to control your thoughts. You just have to stop letting them control you."

---

### 4. Pomodoro Timer

**How it works:**
- 25-minute focused work sessions
- Visual countdown with circular progress ring
- Start, pause, and reset controls

**Implementation:**
- `openPomodoro(taskId)` opens modal for specific task
- `startPomodoro()` begins countdown from 25:00
- Interval updates every second, decrementing `pomodoroTimeLeft`
- SVG circle shows progress (stroke-dashoffset animation)
- When timer reaches 0, shows completion notification

**Features:**
- Task-specific: Each timer is associated with a task
- Pause/Resume: Can pause and continue
- Reset: Returns to 25:00
- Visual feedback: Progress ring fills as time passes

---

### 5. Task History (Archive)

**How it works:**
- Completed tasks can be moved to archive
- Separate page shows all archived tasks
- Can restore or permanently delete

**Auto-Archive:**
- Based on Auto-Clean settings:
  - Instant: Moves immediately when completed
  - 24 hours: Moves after 24 hours
  - Refresh: Moves on page refresh

**Implementation:**
- `archivedTasks` array stores completed tasks
- `moveToArchive(id)` transfers task from tasks to archive
- `restoreTask(id)` moves task back to active tasks
- `deleteFromArchive(id)` permanently removes from archive

**Archive Page:**
- Shows all archived tasks with completion date
- Restore button to bring back to active tasks
- Clear Archive button to delete all archived tasks

---

### 6. Analytics Dashboard

**How it works:**
- Comprehensive productivity insights with charts
- Real-time statistics
- Visual data representation

**Statistics Displayed:**
- Total Tasks: Count of all tasks
- Completed: Count of completed tasks
- In Progress: Count of incomplete tasks
- Completion Rate: Percentage of completed tasks

**Charts:**

1. **Daily Completion Chart (Bar Chart)**
   - Shows tasks completed per day for last 7 days
   - X-axis: Days of week
   - Y-axis: Number of tasks
   - Implementation: `updateDailyChart()` uses Chart.js

2. **Category Breakdown (Pie Chart)**
   - Shows distribution of tasks across categories
   - Each category gets a different color
   - Implementation: `updateCategoryChart()` counts tasks per category

3. **Productivity Trend (Line Chart)**
   - Shows productivity percentage over last 7 days
   - Calculates: (Completed / Total) × 100 per day
   - Smooth line with fill area
   - Implementation: `updateTrendChart()` tracks daily completion rates

**Update Frequency:**
- Updates automatically when tasks change
- Recalculates on page navigation to Analytics

---

### 7. Voice Input

**How it works:**
- Click microphone icon
- Speak your task
- Task is automatically added

**Implementation:**
- Uses Web Speech Recognition API
- `startVoiceInput()` creates SpeechRecognition instance
- Listens for speech and converts to text
- Populates task input field with transcript
- User can then add the task normally

**Browser Support:**
- Chrome/Edge: Full support
- Firefox: Limited support
- Safari: Varies by version
- Requires HTTPS or localhost

**Visual Feedback:**
- Microphone button pulses when listening
- Voice indicator modal shows "Listening..." message
- Button returns to normal when done

---

### 8. Dark/Light Mode Toggle

**How it works:**
- Click moon/sun icon in navigation
- Smoothly transitions between dark and light themes
- Preference saved in LocalStorage

**Implementation:**
- CSS variables control all colors
- `[data-theme="light"]` selector changes variable values
- `toggleDarkMode()` toggles `isDarkMode` flag and updates body attribute
- All colors transition smoothly using CSS transitions

**Default:**
- Dark mode is default (as per user preference)
- Light mode uses light backgrounds with dark text

---

### 9. Custom Background Themes

**How it works:**
- Go to Settings page
- Select from 6 theme options
- Theme applies immediately

**Available Themes:**
1. **Minimal**: Clean black and white
2. **Forest**: Green nature aesthetic
3. **Sunset**: Warm orange tones
4. **Space**: Deep blue cosmos (default)
5. **Lavender**: Purple elegance
6. **BTS Purple**: K-pop inspired purple

**Implementation:**
- Each theme has CSS variable overrides
- `[data-theme="themeName"]` selector changes accent colors
- `changeTheme(theme)` updates body attribute
- Theme persists in LocalStorage

**Visual Effect:**
- Background gradient opacity changes
- Accent colors (buttons, highlights) change
- Maintains dark/light mode preference

---

### 10. Auto-Clean Mode

**How it works:**
- Configure automatic cleanup of completed tasks
- Four options available

**Options:**

1. **Instant**
   - Completed tasks move to archive immediately
   - No delay, happens as soon as checkbox is checked
   - Implementation: `toggleComplete()` calls `moveToArchive()` if instant mode

2. **24 Hours**
   - Completed tasks move to archive after 24 hours
   - Checks completion timestamp
   - Implementation: `renderTasks()` filters tasks completed >24 hours ago
   - Periodic check runs every hour

3. **After Refresh**
   - Completed tasks move to archive when page refreshes
   - Happens on page load
   - Implementation: `renderTasks()` moves all completed tasks on render

4. **Never** (Default)
   - Completed tasks stay in task list
   - User manually manages archive

**Implementation Details:**
- Setting saved in LocalStorage
- Checked on task completion and page render
- 24-hour mode uses timestamp comparison

---

### 11. Task Reminders

**How it works:**
- Set reminder time when adding task
- Browser notification appears at set time
- Requires notification permission

**Implementation:**
- `reminderTime` stored with each task (datetime-local format)
- `scheduleReminder(task)` calculates time until reminder
- Uses `setTimeout()` to trigger notification
- `checkReminders()` runs every minute to catch missed reminders

**Notification Features:**
- Shows task text in notification body
- Uses task ID as tag to prevent duplicates
- Requires user to grant permission first

**Permission:**
- `requestNotificationPermission()` asks user for permission
- Works best on HTTPS (required for some browsers)
- Permission persists across sessions

**Reminder Checking:**
- Checks every minute for tasks with reminders
- Compares reminder time to current time
- Shows notification if within 1-minute window

---

## 🎨 UI/UX Features

### Smooth Animations
- **Fade In**: Pages fade in when switching
- **Slide In**: Tasks slide in when added
- **Hover Effects**: Buttons and cards lift on hover
- **Pulse**: Voice button pulses when listening
- **Progress Rings**: Smooth circular animations

### Responsive Design
- **Mobile**: Stacked layout, hidden text on small screens
- **Tablet**: Adjusted grid columns
- **Desktop**: Full multi-column layout
- **Breakpoints**: 480px, 768px, 1024px

### Color System
- **CSS Variables**: All colors defined as variables
- **Theme Support**: Variables change per theme
- **Accessibility**: High contrast in dark mode
- **Gradients**: Accent colors use gradients

---

## 🔧 Technical Implementation

### Data Flow
1. User action (add, complete, delete)
2. Update JavaScript state (arrays)
3. Save to LocalStorage
4. Re-render UI
5. Update analytics/motivation meter

### State Management
- **Global Variables**: `tasks`, `archivedTasks`, `currentTheme`, `isDarkMode`
- **No Framework**: Pure JavaScript, no state management library
- **Reactive Updates**: Functions update all dependent UI elements

### Performance
- **LocalStorage**: Fast, synchronous storage
- **Chart Updates**: Only when Analytics page is viewed
- **Efficient Rendering**: Only re-renders changed sections
- **Debouncing**: Search filters in real-time (could be debounced for large lists)

### Browser APIs Used
- **LocalStorage API**: Data persistence
- **Web Speech API**: Voice recognition
- **Notification API**: Task reminders
- **Chart.js (CDN)**: Analytics charts

---

## 🚀 Future Enhancement Ideas

1. **Task Dependencies**: Link tasks together
2. **Subtasks**: Break down tasks into smaller items
3. **Due Dates**: Calendar view with deadlines
4. **Recurring Tasks**: Repeat daily/weekly/monthly
5. **Tags**: Multiple tags per task
6. **Export/Import**: JSON or CSV export
7. **Cloud Sync**: Optional cloud backup
8. **Collaboration**: Share tasks with others
9. **Mobile App**: Native iOS/Android app
10. **Offline Mode**: Service Worker for offline access

---

This document explains the inner workings of each feature. For usage instructions, see README.md.

