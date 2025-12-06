// ===== Global State =====
let tasks = [];
let archivedTasks = [];
let currentTheme = 'space';
let isDarkMode = true;
let pomodoroInterval = null;
let pomodoroTimeLeft = 25 * 60; // 25 minutes in seconds
let pomodoroRunning = false;
let currentPomodoroTask = null;
let currentUser = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// ===== Authentication Functions =====
async function checkAuthentication() {
    if (!supabase) {
        showAuth();
        return;
    }
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && !error) {
            currentUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
            };
            await showApp();
            return;
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
    
    showAuth();
}

// Listen for auth state changes
if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            currentUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
            };
            showApp();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            tasks = [];
            archivedTasks = [];
            showAuth();
        }
    });
}

function showAuth() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    currentUser = null;
}

async function showApp() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    await loadData();
    initializeApp();
    setupEventListeners();
    updateMotivationMeter();
    updateAnalytics();
    checkReminders();
    setInterval(checkReminders, 60000); // Check every minute
    setInterval(() => {
        const autoClean = document.querySelector('input[name="autoClean"]:checked')?.value;
        if (autoClean === '24h') {
            renderTasks();
        }
    }, 3600000); // Check every hour for 24h auto-clean
    
    // Update user name display
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
    }
    
    // Setup real-time subscriptions
    setupRealtimeSubscriptions();
}

async function handleSignup(event) {
    event.preventDefault();
    
    if (!supabase) {
        showAuthMessage('Supabase not configured. Please check setup.', 'error');
        return;
    }
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }
    
    try {
        showAuthMessage('Creating account...', 'success');
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) {
            showAuthMessage(error.message || 'Error creating account', 'error');
            return;
        }
        
        if (data.user) {
            showAuthMessage('Account created successfully! Please check your email to verify your account.', 'success');
            
            // Auto login if email confirmation is disabled
            if (data.session) {
                currentUser = {
                    id: data.user.id,
                    email: data.user.email,
                    name: name
                };
                setTimeout(() => {
                    showApp();
                }, 1500);
            } else {
                // Email confirmation required
                setTimeout(() => {
                    switchAuth('login');
                    showAuthMessage('Please check your email and click the confirmation link to sign in.', 'success');
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAuthMessage('An error occurred. Please try again.', 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    if (!supabase) {
        showAuthMessage('Supabase not configured. Please check setup.', 'error');
        return;
    }
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    
    try {
        showAuthMessage('Signing in...', 'success');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showAuthMessage(error.message || 'Invalid email or password', 'error');
            return;
        }
        
        if (data.user && data.session) {
            currentUser = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User'
            };
            showAuthMessage('Login successful!', 'success');
            
            setTimeout(() => {
                showApp();
            }, 500);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage('An error occurred. Please try again.', 'error');
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        if (supabase) {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Logout error:', error);
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        
        currentUser = null;
        tasks = [];
        archivedTasks = [];
        showAuth();
        
        // Clear forms
        document.getElementById('loginFormElement').reset();
        document.getElementById('signupFormElement').reset();
        document.getElementById('authMessage').style.display = 'none';
    }
}

function switchAuth(type) {
    document.getElementById('loginForm').classList.toggle('active', type === 'login');
    document.getElementById('signupForm').classList.toggle('active', type === 'signup');
    document.getElementById('authMessage').style.display = 'none';
    
    // Clear forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('signupFormElement').reset();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showAuthMessage(message, type) {
    const messageEl = document.getElementById('authMessage');
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// ===== Data Management =====
async function loadData() {
    if (!currentUser || !supabase) {
        // Fallback to localStorage if Supabase not configured
        loadDataLocalStorage();
        return;
    }
    
    try {
        // Load tasks
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('archived', false)
            .order('created_at', { ascending: false });
        
        if (tasksError) {
            console.error('Error loading tasks:', tasksError);
            tasks = [];
        } else {
            tasks = tasksData || [];
        }
        
        // Load archived tasks
        const { data: archiveData, error: archiveError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('archived', true)
            .order('completed_at', { ascending: false });
        
        if (archiveError) {
            console.error('Error loading archive:', archiveError);
            archivedTasks = [];
        } else {
            archivedTasks = archiveData || [];
        }
        
        // Load user settings
        const { data: settingsData, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error loading settings:', settingsError);
        }
        
        if (settingsData) {
            currentTheme = settingsData.theme || 'space';
            isDarkMode = settingsData.dark_mode !== false;
            if (settingsData.auto_clean) {
                const radio = document.querySelector(`input[name="autoClean"][value="${settingsData.auto_clean}"]`);
                if (radio) radio.checked = true;
            }
        } else {
            // Default settings
            currentTheme = 'space';
            isDarkMode = true;
            // Create default settings
            await saveSettings();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        loadDataLocalStorage(); // Fallback
    }
}

function loadDataLocalStorage() {
    // Fallback to localStorage if Supabase fails
    const userKey = `novanote_tasks_${currentUser?.email || 'default'}`;
    const archiveKey = `novanote_archive_${currentUser?.email || 'default'}`;
    const settingsKey = `novanote_settings_${currentUser?.email || 'default'}`;
    
    const savedTasks = localStorage.getItem(userKey);
    const savedArchive = localStorage.getItem(archiveKey);
    const savedSettings = localStorage.getItem(settingsKey);
    
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedArchive) archivedTasks = JSON.parse(savedArchive);
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        currentTheme = settings.theme || 'space';
        isDarkMode = settings.darkMode !== false;
        if (settings.autoClean) {
            const radio = document.querySelector(`input[name="autoClean"][value="${settings.autoClean}"]`);
            if (radio) radio.checked = true;
        }
    } else {
        currentTheme = 'space';
        isDarkMode = true;
    }
}

async function saveData() {
    if (!currentUser) return;
    
    if (!supabase) {
        // Fallback to localStorage
        saveDataLocalStorage();
        return;
    }
    
    try {
        await saveSettings();
    } catch (error) {
        console.error('Error saving data:', error);
        saveDataLocalStorage(); // Fallback
    }
}

function saveDataLocalStorage() {
    const userKey = `novanote_tasks_${currentUser?.email || 'default'}`;
    const archiveKey = `novanote_archive_${currentUser?.email || 'default'}`;
    const settingsKey = `novanote_settings_${currentUser?.email || 'default'}`;
    
    localStorage.setItem(userKey, JSON.stringify(tasks));
    localStorage.setItem(archiveKey, JSON.stringify(archivedTasks));
    
    const autoClean = document.querySelector('input[name="autoClean"]:checked')?.value;
    const settings = {
        theme: currentTheme,
        darkMode: isDarkMode,
        autoClean: autoClean || 'never'
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

async function saveSettings() {
    if (!currentUser || !supabase) return;
    
    const autoClean = document.querySelector('input[name="autoClean"]:checked')?.value;
    
    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: currentUser.id,
            theme: currentTheme,
            dark_mode: isDarkMode,
            auto_clean: autoClean || 'never',
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        });
    
    if (error) {
        console.error('Error saving settings:', error);
    }
}

// ===== Real-time Subscriptions =====
let tasksSubscription = null;

function setupRealtimeSubscriptions() {
    if (!supabase || !currentUser) return;
    
    // Clean up existing subscription
    if (tasksSubscription) {
        supabase.removeChannel(tasksSubscription);
    }
    
    // Subscribe to tasks changes
    tasksSubscription = supabase
        .channel('tasks-changes')
        .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'tasks',
                filter: `user_id=eq.${currentUser.id}`
            }, 
            (payload) => {
                console.log('Task change:', payload);
                handleRealtimeTaskChange(payload);
            }
        )
        .subscribe();
}

function handleRealtimeTaskChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT') {
        // New task added
        if (!newRecord.archived) {
            tasks.unshift(newRecord);
        } else {
            archivedTasks.unshift(newRecord);
        }
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    } else if (eventType === 'UPDATE') {
        // Task updated
        if (newRecord.archived) {
            tasks = tasks.filter(t => t.id !== newRecord.id);
            if (!archivedTasks.find(t => t.id === newRecord.id)) {
                archivedTasks.unshift(newRecord);
            } else {
                const index = archivedTasks.findIndex(t => t.id === newRecord.id);
                if (index !== -1) archivedTasks[index] = newRecord;
            }
        } else {
            archivedTasks = archivedTasks.filter(t => t.id !== newRecord.id);
            const index = tasks.findIndex(t => t.id === newRecord.id);
            if (index !== -1) {
                tasks[index] = newRecord;
            } else {
                tasks.unshift(newRecord);
            }
        }
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    } else if (eventType === 'DELETE') {
        // Task deleted
        tasks = tasks.filter(t => t.id !== oldRecord.id);
        archivedTasks = archivedTasks.filter(t => t.id !== oldRecord.id);
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    }
}

// ===== Initialize App =====
function initializeApp() {
    // Set theme
    document.body.setAttribute('data-theme', currentTheme);
    if (!isDarkMode) {
        document.body.setAttribute('data-theme', 'light');
    }
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // Set active theme button
    document.querySelectorAll('.theme-option').forEach(btn => {
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        }
    });
    
    // Render tasks
    renderTasks();
    renderArchive();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.page));
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
    
    // Add task
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Category select
    document.getElementById('categorySelect').addEventListener('change', (e) => {
        const customInput = document.getElementById('customCategory');
        if (e.target.value === 'Custom') {
            customInput.style.display = 'block';
        } else {
            customInput.style.display = 'none';
        }
    });
    
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterTasks(e.target.value);
    });
    
    // Voice input
    document.getElementById('voiceBtn').addEventListener('click', startVoiceInput);
    
    // Mood buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => showMoodQuote(btn.dataset.mood));
    });
    
    // Pomodoro
    document.getElementById('startPomodoroBtn').addEventListener('click', startPomodoro);
    document.getElementById('pausePomodoroBtn').addEventListener('click', pausePomodoro);
    document.getElementById('resetPomodoroBtn').addEventListener('click', resetPomodoro);
    document.getElementById('closePomodoroBtn').addEventListener('click', closePomodoro);
    
    // Settings
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
    });
    
    document.querySelectorAll('input[name="autoClean"]').forEach(radio => {
        radio.addEventListener('change', saveData);
    });
    
    document.getElementById('enableNotificationsBtn').addEventListener('click', requestNotificationPermission);
    
    // Archive
    document.getElementById('clearArchiveBtn').addEventListener('click', clearArchive);
}

// ===== Page Navigation =====
function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${page}Page`).classList.add('active');
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    if (page === 'analytics') {
        updateAnalytics();
    }
}

// ===== Task Management =====
async function addTask() {
    if (!currentUser) return;
    
    const input = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const customCategory = document.getElementById('customCategory');
    const reminderTime = document.getElementById('reminderTime');
    
    const text = input.value.trim();
    if (!text) return;
    
    const category = categorySelect.value === 'Custom' 
        ? customCategory.value.trim() || 'Custom'
        : categorySelect.value;
    
    // Smart Priority Detection
    const priority = detectPriority(text);
    const autoCategory = detectCategory(text);
    
    const taskData = {
        user_id: currentUser.id,
        text: text,
        category: autoCategory || category,
        priority: priority,
        completed: false,
        archived: false,
        reminder_time: reminderTime.value || null,
        created_at: new Date().toISOString(),
        completed_at: null
    };
    
    // Clear input
    input.value = '';
    customCategory.value = '';
    reminderTime.value = '';
    customCategory.style.display = 'none';
    categorySelect.value = 'Personal';
    
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([taskData])
                .select()
                .single();
            
            if (error) {
                console.error('Error adding task:', error);
                // Fallback to local storage
                addTaskLocalStorage(taskData);
            } else {
                // Task added via Supabase, real-time will update UI
                if (data.reminder_time) {
                    scheduleReminder(data);
                }
            }
        } catch (error) {
            console.error('Error adding task:', error);
            addTaskLocalStorage(taskData);
        }
    } else {
        // Fallback to localStorage
        addTaskLocalStorage(taskData);
    }
}

function addTaskLocalStorage(taskData) {
    const task = {
        id: Date.now(),
        ...taskData,
        createdAt: taskData.created_at,
        reminderTime: taskData.reminder_time
    };
    tasks.push(task);
    saveDataLocalStorage();
    renderTasks();
    updateMotivationMeter();
    
    if (task.reminderTime) {
        scheduleReminder(task);
    }
}

function detectPriority(text) {
    const lowerText = text.toLowerCase();
    
    // High priority keywords
    const highPriorityKeywords = ['urgent', 'asap', 'deadline', 'today', 'immediately', 'critical', 'important', 'exam', 'test', 'due'];
    if (highPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'high';
    }
    
    // Medium priority keywords
    const mediumPriorityKeywords = ['tomorrow', 'soon', 'this week', 'project', 'meeting', 'appointment'];
    if (mediumPriorityKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'medium';
    }
    
    // Date detection
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (days.some(day => lowerText.includes(day))) {
        return 'medium';
    }
    
    return 'low';
}

function detectCategory(text) {
    const lowerText = text.toLowerCase();
    
    const workKeywords = ['work', 'office', 'meeting', 'project', 'client', 'deadline', 'presentation'];
    const studyKeywords = ['study', 'exam', 'test', 'homework', 'assignment', 'class', 'lecture', 'exam'];
    const personalKeywords = ['personal', 'family', 'friend', 'gym', 'exercise', 'shopping', 'grocery'];
    
    if (workKeywords.some(keyword => lowerText.includes(keyword))) return 'Work';
    if (studyKeywords.some(keyword => lowerText.includes(keyword))) return 'Study';
    if (personalKeywords.some(keyword => lowerText.includes(keyword))) return 'Personal';
    
    return null;
}

async function deleteTask(id) {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', currentUser.id);
            
            if (error) {
                console.error('Error deleting task:', error);
                deleteTaskLocalStorage(id);
            }
            // Real-time will update UI
        } catch (error) {
            console.error('Error deleting task:', error);
            deleteTaskLocalStorage(id);
        }
    } else {
        deleteTaskLocalStorage(id);
    }
}

function deleteTaskLocalStorage(id) {
    tasks = tasks.filter(task => task.id !== id);
    archivedTasks = archivedTasks.filter(task => task.id !== id);
    saveDataLocalStorage();
    renderTasks();
    renderArchive();
    updateMotivationMeter();
    updateAnalytics();
}

async function toggleComplete(id) {
    const task = tasks.find(t => t.id === id) || archivedTasks.find(t => t.id === id);
    if (!task) return;
    
    const newCompleted = !task.completed;
    const completedAt = newCompleted ? new Date().toISOString() : null;
    
    // Auto-clean if enabled
    const autoClean = document.querySelector('input[name="autoClean"]:checked')?.value;
    if (autoClean === 'instant' && newCompleted) {
        await moveToArchive(id);
        return;
    }
    
    if (supabase) {
        try {
            const updateData = {
                completed: newCompleted,
                completed_at: completedAt,
                updated_at: new Date().toISOString()
            };
            
            const { error } = await supabase
                .from('tasks')
                .update(updateData)
                .eq('id', id)
                .eq('user_id', currentUser.id);
            
            if (error) {
                console.error('Error updating task:', error);
                toggleCompleteLocalStorage(id);
            }
            // Real-time will update UI
        } catch (error) {
            console.error('Error updating task:', error);
            toggleCompleteLocalStorage(id);
        }
    } else {
        toggleCompleteLocalStorage(id);
    }
}

function toggleCompleteLocalStorage(id) {
    const task = tasks.find(t => t.id === id) || archivedTasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveDataLocalStorage();
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    }
}

async function moveToArchive(id) {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    archived: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', currentUser.id);
            
            if (error) {
                console.error('Error archiving task:', error);
                moveToArchiveLocalStorage(id);
            }
            // Real-time will update UI
        } catch (error) {
            console.error('Error archiving task:', error);
            moveToArchiveLocalStorage(id);
        }
    } else {
        moveToArchiveLocalStorage(id);
    }
}

function moveToArchiveLocalStorage(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        archivedTasks.push(task);
        tasks = tasks.filter(t => t.id !== id);
        saveDataLocalStorage();
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    }
}

async function restoreTask(id) {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    archived: false,
                    completed: false,
                    completed_at: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', currentUser.id);
            
            if (error) {
                console.error('Error restoring task:', error);
                restoreTaskLocalStorage(id);
            }
            // Real-time will update UI
        } catch (error) {
            console.error('Error restoring task:', error);
            restoreTaskLocalStorage(id);
        }
    } else {
        restoreTaskLocalStorage(id);
    }
}

function restoreTaskLocalStorage(id) {
    const task = archivedTasks.find(t => t.id === id);
    if (task) {
        task.completed = false;
        task.completedAt = null;
        tasks.push(task);
        archivedTasks = archivedTasks.filter(t => t.id !== id);
        saveDataLocalStorage();
        renderTasks();
        renderArchive();
        updateMotivationMeter();
        updateAnalytics();
    }
}

function filterTasks(searchTerm) {
    const taskItems = document.querySelectorAll('.task-item');
    const term = searchTerm.toLowerCase();
    
    taskItems.forEach(item => {
        const text = item.querySelector('.task-text').textContent.toLowerCase();
        const category = item.querySelector('.task-category')?.textContent.toLowerCase() || '';
        const matches = text.includes(term) || category.includes(term);
        item.style.display = matches ? 'flex' : 'none';
    });
}

// ===== Render Functions =====
function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    // Auto-clean based on settings
    const autoClean = document.querySelector('input[name="autoClean"]:checked')?.value;
    if (autoClean === 'refresh') {
        const completedTasks = tasks.filter(t => t.completed);
        completedTasks.forEach(task => {
            if (!archivedTasks.find(a => a.id === task.id)) {
                archivedTasks.push(task);
            }
        });
        tasks = tasks.filter(t => !t.completed);
        saveData();
    } else if (autoClean === '24h') {
        const now = new Date();
        const completedTasks = tasks.filter(t => {
            if (!t.completed || !t.completedAt) return false;
            const completedDate = new Date(t.completedAt);
            const hoursSinceCompletion = (now - completedDate) / (1000 * 60 * 60);
            return hoursSinceCompletion >= 24;
        });
        completedTasks.forEach(task => {
            if (!archivedTasks.find(a => a.id === task.id)) {
                archivedTasks.push(task);
            }
        });
        tasks = tasks.filter(t => {
            if (!t.completed || !t.completedAt) return true;
            const completedDate = new Date(t.completedAt);
            const hoursSinceCompletion = (now - completedDate) / (1000 * 60 * 60);
            return hoursSinceCompletion < 24;
        });
        saveData();
    }
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks yet. Add one to get started!</p>
            </div>
        `;
        return;
    }
    
    taskList.innerHTML = tasks.map(task => {
        const createdAt = task.created_at || task.createdAt;
        const reminderTime = task.reminder_time || task.reminderTime;
        return `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleComplete(${task.id})">
            <div class="task-content">
                <div class="task-header">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="task-category">${escapeHtml(task.category)}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    ${reminderTime ? `<i class="fas fa-bell"></i> ${formatDate(reminderTime)}` : ''}
                    <i class="fas fa-clock"></i> ${formatDate(createdAt)}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn pomodoro-btn" onclick="openPomodoro(${task.id})" title="Start Pomodoro">
                    <i class="fas fa-clock"></i>
                </button>
                <button class="task-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

function renderArchive() {
    const archiveList = document.getElementById('archiveList');
    
    if (archivedTasks.length === 0) {
        archiveList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-archive"></i>
                <p>No archived tasks yet.</p>
            </div>
        `;
        return;
    }
    
    archiveList.innerHTML = archivedTasks.map(task => {
        const completedAt = task.completed_at || task.completedAt;
        return `
        <div class="task-item completed">
            <input type="checkbox" class="task-checkbox" checked disabled>
            <div class="task-content">
                <div class="task-header">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="task-category">${escapeHtml(task.category)}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    <i class="fas fa-check-circle"></i> Completed: ${formatDate(completedAt)}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn" onclick="restoreTask(${task.id})" title="Restore">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="task-btn delete-btn" onclick="deleteFromArchive(${task.id})" title="Delete Permanently">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

async function deleteFromArchive(id) {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', currentUser.id);
            
            if (error) {
                console.error('Error deleting archived task:', error);
                deleteFromArchiveLocalStorage(id);
            }
            // Real-time will update UI
        } catch (error) {
            console.error('Error deleting archived task:', error);
            deleteFromArchiveLocalStorage(id);
        }
    } else {
        deleteFromArchiveLocalStorage(id);
    }
}

function deleteFromArchiveLocalStorage(id) {
    archivedTasks = archivedTasks.filter(t => t.id !== id);
    saveDataLocalStorage();
    renderArchive();
}

async function clearArchive() {
    if (confirm('Are you sure you want to clear all archived tasks?')) {
        if (supabase && currentUser) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('user_id', currentUser.id)
                    .eq('archived', true);
                
                if (error) {
                    console.error('Error clearing archive:', error);
                    clearArchiveLocalStorage();
                } else {
                    archivedTasks = [];
                    renderArchive();
                }
            } catch (error) {
                console.error('Error clearing archive:', error);
                clearArchiveLocalStorage();
            }
        } else {
            clearArchiveLocalStorage();
        }
    }
}

function clearArchiveLocalStorage() {
    archivedTasks = [];
    saveDataLocalStorage();
    renderArchive();
}

// ===== Motivation Meter =====
function updateMotivationMeter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const progressCircle = document.getElementById('motivationProgress');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    document.getElementById('motivationPercent').textContent = `${percent}%`;
    
    // Update message
    const messageEl = document.getElementById('motivationMessage');
    if (percent === 100 && totalTasks > 0) {
        messageEl.textContent = '🔥 On fire!';
    } else if (percent >= 70) {
        messageEl.textContent = '✨ Small steps matter.';
    } else if (percent >= 40) {
        messageEl.textContent = '🌱 Growing consistency.';
    } else if (percent > 0) {
        messageEl.textContent = '💪 Keep going!';
    } else {
        messageEl.textContent = '🌱 Start your journey!';
    }
}

// ===== Mood Quotes =====
const moodQuotes = {
    happy: {
        quote: "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
        playlist: "🎵 Try: 'Happy Vibes' playlist on Spotify"
    },
    sad: {
        quote: "The way I see it, if you want the rainbow, you gotta put up with the rain. - Dolly Parton",
        playlist: "🎵 Try: 'Chill & Relax' playlist to lift your mood"
    },
    stressed: {
        quote: "You don't have to control your thoughts. You just have to stop letting them control you. - Dan Millman",
        playlist: "🎵 Try: 'Calm Meditation' playlist for stress relief"
    },
    lazy: {
        quote: "The way to get started is to quit talking and begin doing. - Walt Disney",
        playlist: "🎵 Try: 'Energy Boost' playlist to get motivated"
    },
    productive: {
        quote: "Productivity is never an accident. It is always the result of a commitment to excellence. - Paul J. Meyer",
        playlist: "🎵 Try: 'Focus & Flow' playlist for deep work"
    }
};

function showMoodQuote(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
    
    const quoteData = moodQuotes[mood];
    document.getElementById('quoteText').textContent = quoteData.quote;
    document.getElementById('playlistSuggestion').textContent = quoteData.playlist;
}

// ===== Pomodoro Timer =====
function openPomodoro(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentPomodoroTask = task;
    document.getElementById('pomodoroTaskName').textContent = task.text;
    document.getElementById('pomodoroModal').classList.add('active');
    resetPomodoro();
}

function closePomodoro() {
    document.getElementById('pomodoroModal').classList.remove('active');
    pausePomodoro();
}

function startPomodoro() {
    if (pomodoroRunning) return;
    
    pomodoroRunning = true;
    document.getElementById('startPomodoroBtn').style.display = 'none';
    document.getElementById('pausePomodoroBtn').style.display = 'inline-flex';
    
    pomodoroInterval = setInterval(() => {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
        
        if (pomodoroTimeLeft <= 0) {
            completePomodoro();
        }
    }, 1000);
}

function pausePomodoro() {
    pomodoroRunning = false;
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    document.getElementById('startPomodoroBtn').style.display = 'inline-flex';
    document.getElementById('pausePomodoroBtn').style.display = 'none';
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroTimeLeft = 25 * 60;
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    document.getElementById('pomodoroTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const progressCircle = document.getElementById('pomodoroProgress');
    const totalTime = 25 * 60;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - ((totalTime - pomodoroTimeLeft) / totalTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function completePomodoro() {
    pausePomodoro();
    alert('🎉 Pomodoro complete! Great work!');
    resetPomodoro();
}

// ===== Analytics =====
function updateAnalytics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('completionRate').textContent = `${rate}%`;
    
    // Update charts
    updateDailyChart();
    updateCategoryChart();
    updateTrendChart();
}

function updateDailyChart() {
    const ctx = document.getElementById('dailyChart');
    if (!ctx) return;
    
    // Get last 7 days
    const last7Days = [];
    const completedPerDay = [0, 0, 0, 0, 0, 0, 0];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const dateStr = date.toDateString();
        tasks.forEach(task => {
            const completedAt = task.completed_at || task.completedAt;
            if (task.completed && completedAt) {
                const completedDate = new Date(completedAt).toDateString();
                if (completedDate === dateStr) {
                    completedPerDay[6 - i]++;
                }
            }
        });
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Tasks Completed',
                data: completedPerDay,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categories = {};
    tasks.forEach(task => {
        categories[task.category] = (categories[task.category] || 0) + 1;
    });
    
    const colors = [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
    ];
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: colors.slice(0, Object.keys(categories).length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // Get last 7 days productivity
    const last7Days = [];
    const productivity = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const dateStr = date.toDateString();
        const dayTasks = tasks.filter(task => {
            const createdAt = task.created_at || task.createdAt;
            const taskDate = new Date(createdAt).toDateString();
            return taskDate === dateStr;
        });
        const dayCompleted = dayTasks.filter(task => task.completed).length;
        const dayRate = dayTasks.length > 0 ? (dayCompleted / dayTasks.length) * 100 : 0;
        productivity.push(Math.round(dayRate));
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Productivity %',
                data: productivity,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===== Voice Input =====
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceIndicator = document.getElementById('voiceIndicator');
    
    voiceBtn.classList.add('listening');
    voiceIndicator.style.display = 'block';
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('taskInput').value = transcript;
        voiceBtn.classList.remove('listening');
        voiceIndicator.style.display = 'none';
    };
    
    recognition.onerror = () => {
        voiceBtn.classList.remove('listening');
        voiceIndicator.style.display = 'none';
        alert('Voice recognition error. Please try again.');
    };
    
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
        voiceIndicator.style.display = 'none';
    };
    
    recognition.start();
}

// ===== Theme Management =====
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const themeToggle = document.getElementById('themeToggle');
    
    if (isDarkMode) {
        document.body.removeAttribute('data-theme');
        document.body.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    saveData();
}

function changeTheme(theme) {
    currentTheme = theme;
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    if (isDarkMode) {
        document.body.setAttribute('data-theme', theme);
    }
    
    saveData();
}

// ===== Reminders =====
function scheduleReminder(task) {
    if (!task.reminderTime) return;
    
    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    
    if (reminderDate <= now) {
        showNotification(task);
        return;
    }
    
    const timeUntilReminder = reminderDate.getTime() - now.getTime();
    setTimeout(() => {
        showNotification(task);
    }, timeUntilReminder);
}

function checkReminders() {
    tasks.forEach(task => {
        if (task.reminderTime && !task.completed) {
            const reminderDate = new Date(task.reminderTime);
            const now = new Date();
            
            // Check if reminder time is within the current minute
            if (Math.abs(reminderDate.getTime() - now.getTime()) < 60000) {
                showNotification(task);
            }
        }
    });
}

function showNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('NovaNote Reminder', {
            body: `Don't forget: ${task.text}`,
            icon: 'https://via.placeholder.com/64',
            tag: `task-${task.id}`
        });
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert('Notifications enabled! You will receive reminders for your tasks.');
            } else {
                alert('Notifications were denied. You can enable them in your browser settings.');
            }
        });
    } else {
        alert('This browser does not support notifications.');
    }
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return '';
    }
}

// Make functions globally accessible
window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;
window.openPomodoro = openPomodoro;
window.restoreTask = restoreTask;
window.deleteFromArchive = deleteFromArchive;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.switchAuth = switchAuth;
window.togglePassword = togglePassword;

