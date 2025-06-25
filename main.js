document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    // ... (all existing DOM elements) ...
    const apiKeySetupPopup = document.getElementById('api-key-setup');
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const skipApiKeyBtn = document.getElementById('skip-api-key-btn');
    const configApiKeyBtn = document.getElementById('config-api-key-btn');
    const geminiStatusDisplay = document.getElementById('gemini-status');
    const quizLoadingIndicator = document.getElementById('quiz-loading-indicator');

    const onboardingOverlay = document.getElementById('onboarding-overlay');
    const welcomePopup = document.getElementById('welcome-popup');
    const namePopup = document.getElementById('name-popup');
    // MODIFIED: Replace avatarPopup with chienTuongPopup
    const chienTuongPopup = document.getElementById('chien-tuong-popup');
    const agePopup = document.getElementById('age-popup');
    const startOnboardingBtn = document.getElementById('start-onboarding-btn');
    // MODIFIED: Replace avatarSelection with chienTuongSelection
    const chienTuongSelection = document.querySelector('.chien-tuong-selection');
    const confirmChienTuongBtn = document.getElementById('confirm-chien-tuong-btn'); // NEW
    const studentNameInput = document.getElementById('student-name-input');
    const submitNameBtn = document.getElementById('submit-name-btn');
    const studentAgeSelect = document.getElementById('student-age-select');
    const submitAgeBtn = document.getElementById('submit-age-btn');

    const appContainer = document.getElementById('app-container');
    const userAvatarDisplay = document.getElementById('user-avatar-display');
    const userNameDisplay = document.getElementById('user-name-display');
    const userTitleDisplay = document.getElementById('user-title-display');
    const userPointsDisplay = document.getElementById('user-points-display');
    const logoutBtn = document.getElementById('logout-btn');
    const sarahChatName = document.getElementById('sarah-chat-name');
    const sarahChatMessage = document.getElementById('sarah-chat-message');

    const mainNav = document.getElementById('main-nav');
    const screens = document.querySelectorAll('.screen');

    // Dashboard
    const dailyTaskProgress = document.getElementById('daily-task-progress');
    const dailyTaskStatus = document.getElementById('daily-task-status');
    const dailyTasksList = document.getElementById('daily-tasks-list');

    // Learning
    const quizSetsTodayDisplay = document.getElementById('quiz-sets-today');
    const quizSetsTodayParagraph = document.getElementById('quiz-sets-today-p');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizArea = document.getElementById('quiz-area');
    const questionText = document.getElementById('question-text');
    const questionTranslation = document.getElementById('question-translation');
    const optionsContainer = document.getElementById('options-container');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizTimerDisplay = document.getElementById('quiz-time-left');
    const quizTimerContainer = document.getElementById('quiz-timer-container');


    // Mini-game
    const miniGameArea = document.getElementById('mini-game-area');
    const miniGameQuestionText = document.getElementById('mini-game-question-text');
    const miniGameOptionsContainer = document.getElementById('mini-game-options-container');
    const miniGameFeedback = document.getElementById('mini-game-feedback');
    const miniGameTimerDisplay = document.getElementById('mini-game-time-left');
    const miniGameTimerContainer = document.getElementById('mini-game-timer-container');
    let currentMiniGameQuestion = null;

    // Store
    const storeTabs = document.querySelectorAll('.tab-button');
    const storeTabContents = document.querySelectorAll('.tab-content');
    const petsStoreTab = document.getElementById('pets-store');
    const accessoriesStoreTab = document.getElementById('accessories-store');
    const skillsStoreTab = document.getElementById('skills-store');
    const careItemsStoreTab = document.getElementById('care-items-store');
    const spinCountDisplay = document.getElementById('spin-count');
    const spinWheelBtn = document.getElementById('spin-wheel-btn');
    const spinResultDisplay = document.getElementById('spin-result');

    // Achievements
    const chienTuongAvatar = document.getElementById('chien-tuong-avatar');
    const chienTuongStarsContainer = document.getElementById('chien-tuong-stars-container');
    const chienTuongLevelName = document.getElementById('chien-tuong-level-name');
    const chienTuongChienLucValue = document.getElementById('chien-luc-value'); // For Combat Power
    const chienTuongUpgradeEffectContainer = document.getElementById('chien-tuong-upgrade-effect-container');
    // Statistics elements
    const statsQuizSetsToday = document.getElementById('stats-quiz-sets-today');
    const statsDailyTasksCompleted = document.getElementById('stats-daily-tasks-completed');
    const statsPetsOwnedCount = document.getElementById('stats-pets-owned-count');
    const statsTitlesUnlockedCount = document.getElementById('stats-titles-unlocked-count');
    // Leaderboard elements
    const leaderboardList = document.getElementById('leaderboard-list');
    const currentUserRankInfo = document.getElementById('current-user-rank-info');


    // Collections
    const ownedPetsCollection = document.getElementById('owned-pets-collection');
    const ownedAccessoriesCollection = document.getElementById('owned-accessories-collection');
    const ownedSkillsCollection = document.getElementById('owned-skills-collection');
    const unlockedTitlesCollection = document.getElementById('unlocked-titles-collection');

    // Settings
    const fontSelect = document.getElementById('font-select');
    const themeSelect = document.getElementById('theme-select');
    const resetDataBtn = document.getElementById('reset-data-btn');
    const rewardCodeInput = document.getElementById('reward-code-input');
    const submitRewardCodeBtn = document.getElementById('submit-reward-code-btn');


    // General Popup
    const generalPopupOverlay = document.getElementById('general-popup-overlay');
    const generalPopupTitle = document.getElementById('general-popup-title');
    const generalPopupMessageContainer = document.getElementById('general-popup-message-container');
    const generalPopupConfirmBtn = document.getElementById('general-popup-confirm-btn');
    const generalPopupCancelBtn = document.getElementById('general-popup-cancel-btn');

    // --- GEMINI API & STATE ---
    let GEMINI_API_KEY = null;
    let useMockQuestions = true;

    // --- GAME DATA & STATE ---
    const QUIZ_SET_SIZE = 15;
    const MAX_RECENT_QUIZ_QUESTIONS = 10 * QUIZ_SET_SIZE;
    const MINI_GAME_QUESTIONS_POOL_SIZE = 3;
    const MAX_RECENT_MINI_GAME_QUESTIONS = Math.min(9, MINI_GAME_QUESTIONS_POOL_SIZE * 2);
    const PET_HEALTH_DECAY_RATE_PER_HOUR = 5;
    const MAX_EQUIPPED_ACCESSORIES_PER_PET = 3;
    const MAX_EQUIPPED_SKILLS_PER_PET = 3;
    const MAX_ITEMS_PER_TYPE = 5; // For accessories and skills

    let currentUserName = null; // Stores the name of the currently logged-in user

    let initialUserData = {
        name: '',
        age: 0,
        avatar: 'Images/avatar1.png', // Default, will be overridden by Chien Tuong selection
        chienTuongElement: '', // NEW: To store the selected element (moc, kim, thuy, hoa, tho)
        points: 0,
        quizScorePoints: 0, // Points specifically from correct quiz answers for "Chiến lực"
        titles: [],
        currentTitle: '',
        chienTuongStars: 0, // Current star level of the Warlord
        pets: [],
        inventory: {
            accessories: [],
            skills: [],
            careItems: [] // MODIFIED: Was { food: 0, water: 0 }, now an array of {id, quantity}
        },
        dailyTasks: [],
        completedTasksToday: 0,
        lastTaskCompletionTime: 0,
        quizSetsToday: 0,
        lastQuizQuestions: [],
        lastLoginDate: null,
        luckySpins: 0,
        settings: { font: "'Montserrat', sans-serif", theme: "default" },
        recentQuizQuestionTexts: [],
        recentMiniGameQuestionTexts: [],
        usedRewardCodes: [], // To track used one-time reward codes
    };
    let userData = JSON.parse(JSON.stringify(initialUserData));

    // Variables for Chien Tuong selection process
    let selectedChienTuongAvatarPath = null;
    let selectedChienTuongElement = null;


    const REWARD_CODES = {
        "emyeubame": { points: 999, oneTime: true },
        "cogiaosarah": { points: 999, oneTime: true },
        "giadinh": { points: 1999, oneTime: true },
        "nghihe": { points: 2999, oneTime: true },
        "hanhphuc": { points: 3999, oneTime: true },
        "thanhcong": { points: 4999, oneTime: true },
        "cogang": { points: 5999, oneTime: true },
        "tet2026": { points: 6999, oneTime: true },
        "bamelanhat": { points: 7999, oneTime: true },
        "yangpeaksun": { points: 999999, oneTime: true },
        "vuive": { points: 8999, oneTime: true }
    };

    const ALL_DAILY_TASKS = [
        { id: 'help_mom', text: "Hãy giúp mẹ một việc nhà" },
        { id: 'read_book', text: "Hãy đọc một đoạn thơ yêu thích" },
        { id: 'exercise', text: "Hãy tập thể dục 5 phút" },
        { id: 'love_dad', text: "Hãy nói 1 câu yêu thương với Ba của bạn" },
        { id: 'love_mom', text: "Hãy nói 1 câu yêu thương với Mẹ của bạn" },
        { id: 'story_mom', text: "Hãy kể cho Mẹ nghe 1 câu chuyện vui ở lớp" },
        { id: 'kiss_mom', text: "Hãy hôn Mẹ và nói Con Yêu Mẹ" },
        { id: 'clean_room', text: "Dọn dẹp góc học tập của em" },
        { id: 'water_plants', text: "Tưới cây giúp ba mẹ" },
        { id: 'learn_new_word', text: "Học một từ mới tiếng Anh" }
    ];

    const ALL_TITLES = {
        level1: [
            { id: 'Cui_bap_title', name: 'Cùi bắp', conditionPetId: 'bao_thu_pet', autoUnlock: true, stars: 1 },
            { id: 'bao_thu', name: 'Báo thủ', conditionPetTier: 2, autoUnlock: true, stars: 2 },
            { id: 'Be_ngoan_me', name: 'Bé ngoan của Mẹ', conditionPetTier: 3, autoUnlock: true, stars: 3 },
            { id: 'cuc_vang_me', name: 'Cục vàng của Mẹ', conditionPetTier: 4, autoUnlock: true, stars: 4 },
            { id: 'cuc_hot_xoan_me', name: 'Cục hột xoàn của Mẹ', conditionAllPetsOwnedByTier: 4, autoUnlock: true, stars: 5 }
        ],
        level2: [ // Assuming grade level 2 titles map to similar star progression
            { id: 'Cui_bap_title_c2', name: 'Cùi bắp', conditionPetId: 'bao_thu_pet', autoUnlock: true, stars: 1 }, // Tier 1 pet as condition
            { id: 'bao_thu_l2', name: 'Báo thủ (Cấp 2)', conditionPetTier: 2, autoUnlock: true, stars: 2 }, // Using a distinct ID for clarity
            { id: 'hoc_sinh_gioi', name: 'Học sinh giỏi', conditionPetTier: 3, autoUnlock: true, stars: 3 },
            { id: 'hoc_sinh_xuat_sac', name: 'Học sinh xuất sắc', conditionPetTier: 4, autoUnlock: true, stars: 4 },
            { id: 'Thien_tai', name: 'Thiên tài', conditionAllPetsOwnedByTier: 4, autoUnlock: true, stars: 5 }
        ]
    };
    const STORE_ITEMS = {
        pets: [
            { id: 'bao_thu_pet', name: 'Báo thủ', price: 300, tier: 1, pieces: 1, maxPieces: 1, icon: 'Images/Pets/bao_thu_pet.png', unlockCondition: () => true },
            { id: 'dog_pet', name: 'Chó', pricePerPiece: 500, tier: 2, pieces: 0, maxPieces: 2, icon: 'Images/Pets/dog_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(1) },
            { id: 'cat_pet', name: 'Mèo', pricePerPiece: 600, tier: 2, pieces: 0, maxPieces: 2, icon: 'Images/Pets/cat_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(1) },
            { id: 'chicken_pet', name: 'Gà', pricePerPiece: 700, tier: 2, pieces: 0, maxPieces: 2, icon: 'Images/Pets/chicken_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(1) },
            { id: 'pig_pet', name: 'Heo', pricePerPiece: 800, tier: 2, pieces: 0, maxPieces: 2, icon: 'Images/Pets/pig_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(1) },
            { id: 'nemo_pet', name: 'Cá Nemo', pricePerPiece: 1000, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/nemo_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'octopus_pet', name: 'Bạch Tuộc', pricePerPiece: 1200, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/octopus_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'shark_pet', name: 'Cá Mập', pricePerPiece: 1400, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/shark_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'jellyfish_pet', name: 'Sứa', pricePerPiece: 1600, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/jellyfish_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'dolphin_pet', name: 'Cá Heo', pricePerPiece: 1800, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/dolphin_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'whale_pet', name: 'Cá Voi', pricePerPiece: 2000, tier: 3, pieces: 0, maxPieces: 4, icon: 'Images/Pets/whale_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(2) },
            { id: 'tralala_pet', name: 'Tralalero Tralala', pricePerPiece: 3000, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/tralala_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'bombardiro_pet', name: 'Bombardiro Crocodilo', pricePerPiece: 3200, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/bombardiro_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'tungtung_pet', name: 'Tung Tung Tung Sahur', pricePerPiece: 3400, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/tungtung_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'lirili_pet', name: 'Lirilì Larilà', pricePerPiece: 3600, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/lirili_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'ballerina_pet', name: 'Ballerina Cappuccina', pricePerPiece: 3800, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/ballerina_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'orcalero_pet', name: 'Orcalero Orcala', pricePerPiece: 4000, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/orcalero_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'cappuccino_assassino_pet', name: 'Cappuccino Assassino', pricePerPiece: 4500, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/cappuccino_assassino_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
            { id: 'boneca_ambalabu_pet', name: 'Boneca Ambalabu', pricePerPiece: 5000, tier: 4, pieces: 0, maxPieces: 4, icon: 'Images/Pets/boneca_ambalabu_pet.png', unlockCondition: () => checkAllPetsOwnedByTier(3) },
        ],
        accessories: [
            { id: 'hat_accessory', name: 'Mũ Thời Trang', price: 1000, icon: '👒', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.15 },
            { id: 'shoes_accessory', name: 'Giày Xịn', price: 1500, icon: '👟', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.20 },
            { id: 'backpack_accessory', name: 'Balo Con Cóc', price: 2000, icon: '🎒', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.10 },
            { id: 'crown_accessory', name: 'Vương Miện', price: 3000, icon: '👑', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.25 },
            { id: 'sword_accessory', name: 'Kiếm Báu', price: 2500, icon: '⚔️', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.18 },
            { id: 'gun_accessory', name: 'Súng Nước', price: 1800, icon: '🔫', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.12 },
            { id: 'iron_armor_accessory', name: 'Áo Giáp Sắt', price: 3200, icon: '🛡️', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.25 },
            { id: 'shield_accessory', name: 'Khiên Bảo Vệ', price: 2800, icon: '💠', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.22 },
        ],
        skills: [
            { id: 'tornado_skill', name: 'Lốc Xoáy', price: 5000, icon: '🌪️', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.25 },
            { id: 'volcano_skill', name: 'Núi Lửa', price: 3000, icon: '🌋', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.30 },
            { id: 'tsunami_skill', name: 'Sóng Thần', price: 4000, icon: '🌊', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.28 },
            { id: 'rain_skill', name: 'Mưa Rào', price: 2200, icon: '🌧️', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.22 },
            { id: 'storm_skill', name: 'Bão Tố', price: 5000, icon: '⛈️', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.35 },
            { id: 'thunder_skill', name: 'Sấm Sét', price: 5500, icon: '⚡', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.25 },
            { id: 'gale_skill', name: 'Gió Lốc', price: 4800, icon: '💨', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.26 },
            { id: 'stealth_skill', name: 'Ẩn Thân', price: 6000, icon: '👻', unlockCondition: () => checkFirstPetOwnedByTier(2), healthDecayReduction: 0.20 },
        ],
        careItems: [
            // Tier 1 (Bao Thu)
            { id: 'keo_ho_lo_food', name: 'Kẹo hồ lô', price: 60, icon: '🍡', type: 'food', tier: 1, healthRestore: 25, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'kem_food', name: 'Kem', price: 70, icon: '🍦', type: 'food', tier: 1, healthRestore: 25, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'coca_cola_drink', name: 'Coca cola', price: 60, icon: '🥤', type: 'drink', tier: 1, healthRestore: 25, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'pepsi_drink', name: 'Pepsi', price: 60, icon: '🥤', type: 'drink', tier: 1, healthRestore: 25, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            // Tier 2 (Thú nuôi ở nhà)
            { id: 'keo_mut_food', name: 'Kẹo mút', price: 80, icon: '🍭', type: 'food', tier: 2, healthRestore: 30, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'banh_quy_food', name: 'Bánh quy', price: 90, icon: '🍪', type: 'food', tier: 2, healthRestore: 30, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'sting_drink', name: 'Sting', price: 80, icon: '⚡️', type: 'drink', tier: 2, healthRestore: 30, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'seven_up_drink', name: '7up', price: 80, icon: '🍹', type: 'drink', tier: 2, healthRestore: 30, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            // Tier 3 (Sinh vật biển)
            { id: 'banh_mi_food', name: 'Bánh mì', price: 100, icon: '🍞', type: 'food', tier: 3, healthRestore: 35, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'com_food', name: 'Cơm', price: 110, icon: '🍚', type: 'food', tier: 3, healthRestore: 35, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'nuoc_mia_drink', name: 'Nước mía', price: 100, icon: '🧉', type: 'drink', tier: 3, healthRestore: 35, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } }, // Icon placeholder
            { id: 'tra_sua_drink', name: 'Trà sữa', price: 120, icon: '🧋', type: 'drink', tier: 3, healthRestore: 35, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            // Tier 4 (Brainrot)
            { id: 'bun_food', name: 'Bún', price: 130, icon: '🍜', type: 'food', tier: 4, healthRestore: 40, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'pho_food', name: 'Phở', price: 140, icon: '🍲', type: 'food', tier: 4, healthRestore: 40, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
            { id: 'nuoc_loc_drink', name: 'Nước lọc', price: 10, icon: '💧', type: 'drink', tier: 4, healthRestore: 20, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } }, // Basic item
            { id: 'nuoc_dua_drink', name: 'Nước dừa', price: 150, icon: '🥥', type: 'drink', tier: 4, healthRestore: 40, unlockCondition: function() { return checkFirstPetOwnedByTier(this.tier); } },
        ]
    };

    let currentQuizSet = [];
    let currentQuestionIndex = 0;
    let currentScore = 0;
    const MAX_QUIZ_SETS_PER_DAY = 20;
    const COOLDOWN_MINUTES = 3;

    // Timers
    let quizTimerInterval = null;
    let quizTimeRemaining = 60;
    const QUIZ_TIME_LIMIT = 60;

    let miniGameTimerInterval = null;
    let miniGameTimeRemaining = 30;
    const MINI_GAME_TIME_LIMIT = 30;

    // --- HELPER FUNCTIONS ---
    const getUserDataKey = (userName) => `hocCungCoSarahData_${userName.trim().toLowerCase()}`;

    const saveUserData = (userName) => {
        if (!userName) {
            console.error("Cannot save user data: userName is null or empty.");
            return;
        }
        localStorage.setItem(getUserDataKey(userName), JSON.stringify(userData));
    };

    const loadUserData = (userName) => {
        if (!userName) {
            console.error("Cannot load user data: userName is null or empty.");
            return false;
        }
        const dataKey = getUserDataKey(userName);
        const data = localStorage.getItem(dataKey);

        if (data) {
            try {
                const parsedData = JSON.parse(data);
                const mergedData = {
                    ...JSON.parse(JSON.stringify(initialUserData)), 
                    ...parsedData,
                    chienTuongElement: parsedData.chienTuongElement || initialUserData.chienTuongElement, 
                    quizScorePoints: parsedData.quizScorePoints || 0,
                    chienTuongStars: parsedData.chienTuongStars || 0,
                    inventory: {
                        ...initialUserData.inventory,
                        ...(parsedData.inventory || {}),
                        // MODIFIED: Handle new careItems structure
                        careItems: (typeof parsedData.inventory?.careItems === 'object' && !Array.isArray(parsedData.inventory?.careItems))
                                   ? [] // Convert old object format (e.g. {food:0, water:0}) to new array format
                                   : (Array.isArray(parsedData.inventory?.careItems)
                                      ? parsedData.inventory.careItems.map(ci => ({ id: ci.id, quantity: ci.quantity || 0 })) // Ensure structure has id and quantity
                                      : []), // Default to empty array if missing or malformed
                        accessories: Array.isArray(parsedData.inventory?.accessories) ?
                                     parsedData.inventory.accessories.map(acc => ({...acc, isEquipped: acc.isEquipped || false, equippedTo: acc.equippedTo || null}))
                                     : [],
                        skills: Array.isArray(parsedData.inventory?.skills) ?
                                parsedData.inventory.skills.map(skill => ({...skill, isEquipped: skill.isEquipped || false, equippedTo: skill.equippedTo || null}))
                                : []
                    },
                    pets: Array.isArray(parsedData.pets) ? parsedData.pets.map(p => ({
                        ...(initialUserData.pets.find(ip => ip.id === p.id) || {}),
                        ...p,
                        equippedAccessories: Array.isArray(p.equippedAccessories) ? p.equippedAccessories : [],
                        equippedSkills: Array.isArray(p.equippedSkills) ? p.equippedSkills : [],
                        health: p.health !== undefined ? p.health : 100,
                        lastHealthUpdateTime: p.lastHealthUpdateTime !== undefined ? p.lastHealthUpdateTime : Date.now(),
                    })) : [],
                    settings: {
                        ...initialUserData.settings,
                        ...(parsedData.settings || {})
                    },
                    usedRewardCodes: Array.isArray(parsedData.usedRewardCodes) ? parsedData.usedRewardCodes : [],
                };

                userData = mergedData;

                if (typeof userData.avatar !== 'string' || userData.avatar.trim() === '' || (!userData.avatar.startsWith('Images/') && !userData.avatar.startsWith('https://placehold.co'))) userData.avatar = initialUserData.avatar;
                if (typeof userData.chienTuongElement !== 'string') userData.chienTuongElement = initialUserData.chienTuongElement;
                if (!userData.settings) userData.settings = { ...initialUserData.settings };
                if (userData.settings.font === undefined) userData.settings.font = initialUserData.settings.font;
                if (userData.settings.theme === undefined) userData.settings.theme = initialUserData.settings.theme;
                if (userData.luckySpins === undefined) userData.luckySpins = 0;
                if (userData.lastLoginDate === undefined) userData.lastLoginDate = null;
                if (userData.quizSetsToday === undefined) userData.quizSetsToday = 0;
                if (userData.quizScorePoints === undefined) userData.quizScorePoints = 0;
                if (!Array.isArray(userData.lastQuizQuestions)) userData.lastQuizQuestions = [];
                if (!Array.isArray(userData.recentQuizQuestionTexts)) userData.recentQuizQuestionTexts = [];
                if (!Array.isArray(userData.recentMiniGameQuestionTexts)) userData.recentMiniGameQuestionTexts = [];
                if (!Array.isArray(userData.usedRewardCodes)) userData.usedRewardCodes = [];
                if (!userData.name) userData.name = userName;
                if (userData.chienTuongStars === undefined) userData.chienTuongStars = 0;

                userData.pets.forEach(p => {
                    const storePet = STORE_ITEMS.pets.find(sp => sp.id === p.id);
                    if (storePet) {
                        if (p.maxPieces === undefined) p.maxPieces = storePet.maxPieces;
                        if (p.icon === undefined) p.icon = storePet.icon;
                        if (p.tier === undefined) p.tier = storePet.tier;
                    }
                });
                userData.inventory.accessories.forEach(acc => {
                    const storeAcc = STORE_ITEMS.accessories.find(sa => sa.id === acc.id);
                    if (storeAcc) {
                        if (acc.icon === undefined) acc.icon = storeAcc.icon;
                        if (acc.healthDecayReduction === undefined) acc.healthDecayReduction = storeAcc.healthDecayReduction || 0;
                        if (acc.uniqueId === undefined) acc.uniqueId = `${acc.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                    }
                });
                userData.inventory.skills.forEach(skill => {
                    const storeSkill = STORE_ITEMS.skills.find(ss => ss.id === skill.id);
                    if (storeSkill) {
                        if (skill.icon === undefined) skill.icon = storeSkill.icon;
                        if (skill.healthDecayReduction === undefined) skill.healthDecayReduction = storeSkill.healthDecayReduction || 0;
                        if (skill.uniqueId === undefined) skill.uniqueId = `${skill.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                    }
                });
                return true;
            } catch (error) {
                console.error(`Error parsing user data for ${userName} from localStorage:`, error);
                userData = JSON.parse(JSON.stringify(initialUserData));
                userData.name = userName;
                return false;
            }
        }
        userData = JSON.parse(JSON.stringify(initialUserData));
        userData.name = userName;
        return false;
    };


    const getTodayDateString = () => { const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; };
    const showGeneralPopup = (title, message, onConfirm, showCancel = false) => {
        generalPopupTitle.textContent = title;
        generalPopupMessageContainer.innerHTML = message;
        generalPopupOverlay.classList.remove('hidden');
        generalPopupConfirmBtn.onclick = () => { if (onConfirm) onConfirm(); generalPopupOverlay.classList.add('hidden'); };
        if (showCancel) { generalPopupCancelBtn.classList.remove('hidden'); generalPopupCancelBtn.onclick = () => generalPopupOverlay.classList.add('hidden'); }
        else { generalPopupCancelBtn.classList.add('hidden'); }
    };
    const showFireworks = (isCorrect) => {
        const effect = document.createElement('div');
        effect.className = 'fireworks-effect';
        effect.textContent = isCorrect ? '🎉✨🎊' : '😟';
        document.body.appendChild(effect);
        setTimeout(() => { if (document.body.contains(effect)) document.body.removeChild(effect); }, 1000);
    };

    // --- API KEY HANDLING ---
    const promptForApiKey = () => { apiKeySetupPopup.classList.remove('hidden'); geminiApiKeyInput.value = GEMINI_API_KEY || ''; };
    saveApiKeyBtn.addEventListener('click', () => {
        const key = geminiApiKeyInput.value.trim();
        if (key) {
            GEMINI_API_KEY = key; useMockQuestions = false;
            localStorage.setItem('geminiApiKey', key);
            geminiStatusDisplay.textContent = "Đang sử dụng Gemini API."; geminiStatusDisplay.style.color = "green";
            apiKeySetupPopup.classList.add('hidden');
        } else { showGeneralPopup("Lỗi", "Vui lòng nhập API Key."); }
    });
    skipApiKeyBtn.addEventListener('click', () => {
        useMockQuestions = true; GEMINI_API_KEY = null;
        localStorage.removeItem('geminiApiKey');
        geminiStatusDisplay.textContent = "Đang sử dụng câu hỏi mẫu (API Key không được cung cấp hoặc chọn bỏ qua)."; geminiStatusDisplay.style.color = "orange";
        apiKeySetupPopup.classList.add('hidden');
    });
    configApiKeyBtn.addEventListener('click', promptForApiKey);

    // --- ONBOARDING & LOGIN LOGIC ---
    const initOnboarding = () => {
        onboardingOverlay.classList.remove('hidden');
        welcomePopup.classList.remove('hidden'); welcomePopup.classList.add('active');
        [namePopup, chienTuongPopup, agePopup].forEach(p => { p.classList.add('hidden'); p.classList.remove('active'); });

        if (chienTuongSelection) {
            chienTuongSelection.querySelectorAll('.chien-tuong-card.selected').forEach(card => card.classList.remove('selected'));
        }
        if (confirmChienTuongBtn) {
            confirmChienTuongBtn.classList.add('hidden');
        }
        selectedChienTuongAvatarPath = null;
        selectedChienTuongElement = null;

        if (studentNameInput) studentNameInput.value = '';
        if (studentAgeSelect) studentAgeSelect.selectedIndex = 0;
    };

    startOnboardingBtn.addEventListener('click', () => {
        welcomePopup.classList.remove('active'); welcomePopup.classList.add('hidden');
        namePopup.classList.remove('hidden'); namePopup.classList.add('active');
        if (studentNameInput) studentNameInput.focus();
    });

    submitNameBtn.addEventListener('click', () => {
        const enteredName = studentNameInput.value.trim();
        if (!enteredName) {
            showGeneralPopup("Thông báo", "Vui lòng nhập tên của em nhé!");
            return;
        }

        if (loadUserData(enteredName)) {
            currentUserName = enteredName;
            finishLogin();
        } else {
            currentUserName = enteredName;
            namePopup.classList.remove('active'); namePopup.classList.add('hidden');
            chienTuongPopup.classList.remove('hidden'); chienTuongPopup.classList.add('active');
            chienTuongSelection.querySelectorAll('.chien-tuong-card.selected').forEach(card => card.classList.remove('selected'));
            confirmChienTuongBtn.classList.add('hidden');
            selectedChienTuongAvatarPath = null;
            selectedChienTuongElement = null;
        }
    });

    chienTuongSelection.addEventListener('click', (e) => {
        const card = e.target.closest('.chien-tuong-card');
        if (card && card.dataset.avatar && card.dataset.element) {
            chienTuongSelection.querySelectorAll('.chien-tuong-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedChienTuongAvatarPath = card.dataset.avatar;
            selectedChienTuongElement = card.dataset.element;
            confirmChienTuongBtn.classList.remove('hidden');
        }
    });

    confirmChienTuongBtn.addEventListener('click', () => {
        if (selectedChienTuongAvatarPath && selectedChienTuongElement) {
            userData.avatar = selectedChienTuongAvatarPath;
            userData.chienTuongElement = selectedChienTuongElement;

            chienTuongPopup.classList.remove('active'); chienTuongPopup.classList.add('hidden');
            agePopup.classList.remove('hidden'); agePopup.classList.add('active');
        } else {
            showGeneralPopup("Thông báo", "Vui lòng chọn một Chiến tướng trước khi tiếp tục.");
        }
    });


    submitAgeBtn.addEventListener('click', () => {
        userData.age = parseInt(studentAgeSelect.value);
        userData.lastLoginDate = getTodayDateString();
        generateDailyTasks();
        userData.chienTuongStars = 0;
        userData.quizScorePoints = 0;

        const gradeLevel = userData.age <= 10 ? 'level1' : 'level2';
        if (ALL_TITLES[gradeLevel]) {
            userData.titles = ALL_TITLES[gradeLevel].map(t => ({ ...t, unlocked: false, autoUnlock: t.autoUnlock === undefined ? false : t.autoUnlock }));
        } else {
            userData.titles = [];
        }

        localStorage.setItem('lastActiveUserName', currentUserName);
        saveUserData(currentUserName);

        onboardingOverlay.classList.add('hidden');
        appContainer.classList.remove('hidden');

        applySettings();
        updateDashboardUI();
        checkAndUnlockAchievements();
        switchScreen('dashboard');

        if (!GEMINI_API_KEY && useMockQuestions) {
            setTimeout(promptForApiKey, 500);
        }
    });

    const finishLogin = () => {
        localStorage.setItem('lastActiveUserName', currentUserName);
        onboardingOverlay.classList.add('hidden');
        appContainer.classList.remove('hidden');
        checkDailyLogin();
        updateAllPetsHealth();
        applySettings();
        updateDashboardUI();
        checkAndUnlockAchievements();
        switchScreen('dashboard');
    };


    // --- APP INITIALIZATION & UI UPDATES ---
    const updateDashboardUI = () => {
        if (!userData || !userData.name) {
            console.warn("updateDashboardUI called with invalid userData.");
            return;
        }
        if (userAvatarDisplay) {
             userAvatarDisplay.src = userData.avatar || initialUserData.avatar;
             userAvatarDisplay.classList.remove('moc-border', 'kim-border', 'thuy-border', 'hoa-border', 'tho-border');
             if (userData.chienTuongElement) {
                 userAvatarDisplay.classList.add(`${userData.chienTuongElement}-border`);
             }
        }
        userNameDisplay.textContent = userData.name;
        userTitleDisplay.textContent = userData.currentTitle || "Chưa có danh hiệu";
        userTitleDisplay.classList.toggle('title-badge', !!userData.currentTitle);
        userPointsDisplay.textContent = userData.points;
        if (sarahChatName) sarahChatName.textContent = userData.name;

        dailyTasksList.innerHTML = '';
        if (userData.dailyTasks && userData.dailyTasks.length > 0) {
            userData.dailyTasks.forEach(task => {
                const taskCard = document.createElement('div'); taskCard.classList.add('task-card');
                if (task.completed) taskCard.classList.add('completed');
                taskCard.innerHTML = `<p>${task.icon || '📌'} ${task.text}</p>`;
                taskCard.dataset.taskId = task.id;
                if (!task.completed) taskCard.addEventListener('click', () => handleTaskClick(task.id));
                dailyTasksList.appendChild(taskCard);
            });
            const progressPercent = userData.dailyTasks.length > 0 ? (userData.completedTasksToday / userData.dailyTasks.length) * 100 : 0;
            dailyTaskProgress.style.width = `${progressPercent}%`;
            dailyTaskStatus.textContent = `Hoàn thành: ${userData.completedTasksToday}/${userData.dailyTasks.length}`;
        } else {
            dailyTaskStatus.textContent = "Không có nhiệm vụ hôm nay."; dailyTaskProgress.style.width = '0%';
        }
        quizSetsTodayDisplay.textContent = userData.quizSetsToday;
    };

    const switchScreen = (screenId) => {
        screens.forEach(screen => screen.classList.add('hidden'));
        const activeScreen = document.getElementById(`${screenId}-screen`);
        if (activeScreen) activeScreen.classList.remove('hidden');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.nav-btn[data-screen="${screenId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        if (screenId === 'store') renderStore();
        if (screenId === 'achievements') renderAchievements();
        if (screenId === 'collections') {
            updateAllPetsHealth();
            renderCollections();
        }
    };
    mainNav.addEventListener('click', (e) => { if (e.target.classList.contains('nav-btn')) switchScreen(e.target.dataset.screen); });

    logoutBtn.addEventListener('click', () => {
        showGeneralPopup("Xác nhận", "Em có chắc muốn đăng xuất không? Em sẽ quay lại màn hình đăng nhập.", () => {
            localStorage.removeItem('lastActiveUserName');
            currentUserName = null;
            userData = JSON.parse(JSON.stringify(initialUserData));
            appContainer.classList.add('hidden');
            initOnboarding();
        }, true);
    });

    // --- DAILY TASKS ---
    const generateDailyTasks = () => {
        const shuffledTasks = [...ALL_DAILY_TASKS].sort(() => 0.5 - Math.random());
        userData.dailyTasks = shuffledTasks.slice(0, 5).map(task => ({...task, completed: false, icon: getRandomIcon() }));
        userData.completedTasksToday = 0;
    };
    const getRandomIcon = () => { const icons = ['🎯', '✨', '📚', '💪', '💖', '🎉', '🏡', '🌱', '💡']; return icons[Math.floor(Math.random() * icons.length)]; }
    const handleTaskClick = (taskId) => {
        const task = userData.dailyTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            const now = Date.now();
            if (userData.lastTaskCompletionTime && (now - userData.lastTaskCompletionTime) < (COOLDOWN_MINUTES * 60 * 1000)) {
                const timeLeft = Math.ceil((COOLDOWN_MINUTES * 60 * 1000 - (now - userData.lastTaskCompletionTime)) / 1000);
                showGeneralPopup("Thông báo", `Em cần đợi ${timeLeft} giây nữa để hoàn thành nhiệm vụ tiếp theo.`); return;
            }
            showGeneralPopup("Xác nhận", `Em đã hoàn thành nhiệm vụ: "${task.text}" chưa?`, () => {
                task.completed = true; userData.completedTasksToday++; userData.points += 50;
                userData.lastTaskCompletionTime = Date.now(); showFireworks(true);
                updateDashboardUI(); saveUserData(currentUserName);
            }, true);
        }
    };

    // --- LEARNING MODULE (QUIZ) ---
    const MOCK_QUESTIONS_L1_5 = [ /* ... existing mock questions ... */ ];
    const MOCK_QUESTIONS_L6_9 = [ /* ... existing mock questions ... */ ];
    const MOCK_QUESTIONS_L1_FROM_DOCS = [ /* ... */ ];
    const MOCK_QUESTIONS_L1_FROM_DOCS_PART2 = [ /* ... */ ];
    const MOCK_QUESTIONS_L3_FROM_DOCS = [ /* ... */ ];
    const MOCK_QUESTIONS_L4_FROM_DOCS = [ /* ... */ ];
        MOCK_QUESTIONS_L1_5.push(
        { question: "2 + 3 = ?", icon: "➕", options: ["4", "5", "6", "7"], correct_index: 1, explanation: "2 cộng 3 bằng 5." },
        { question: "Từ nào sau đây viết đúng chính tả?", icon: "✍️", options: ["con Chó", "con chó", "Con Chó", "concho"], correct_index: 1, explanation: "Danh từ chung 'chó' viết thường." },
        { question: "What is 'apple' in Vietnamese?", icon: "🍎", vietnamese_translation: "Dịch sang tiếng Việt", options: ["Quả chuối", "Quả táo", "Quả cam", "Quả xoài"], correct_index: 1, explanation: "'Apple' nghĩa là 'Quả táo'." },
        { question: "Mặt trời mọc ở hướng nào?", icon: "☀️", options: ["Tây", "Nam", "Đông", "Bắc"], correct_index: 2, explanation: "Mặt trời mọc ở hướng Đông và lặn ở hướng Tây." },
        { question: "Trong các số 10, 25, 12, 7, số nào lớn nhất?", icon: "🔢", options: ["10", "25", "12", "7"], correct_index: 1, explanation: "So sánh các số, 25 là số lớn nhất." },
        { question: "Con vật nào kêu 'meo meo'?", icon: "🐱", options: ["Con chó", "Con gà", "Con mèo", "Con vịt"], correct_index: 2, explanation: "Con mèo kêu 'meo meo'." },
        { question: "How many fingers are on one hand?", icon: "🖐️", vietnamese_translation: "Một bàn tay có mấy ngón?", options: ["3", "4", "5", "6"], correct_index: 2, explanation: "One hand has 5 fingers." },
        { question: "Màu của lá cây thường là gì?", icon: "🌿", options: ["Màu đỏ", "Màu xanh lá", "Màu vàng", "Màu tím"], correct_index: 1, explanation: "Lá cây thường có màu xanh lá do chất diệp lục." },
        { question: "5 - 2 = ?", icon: "➖", options: ["1", "2", "3", "4"], correct_index: 2, explanation: "5 trừ 2 bằng 3." },
        { question: "What is 'water' in Vietnamese?", icon: "💧", vietnamese_translation: "Dịch sang tiếng Việt", options: ["Nước", "Lửa", "Đất", "Không khí"], correct_index: 0, explanation: "'Water' nghĩa là 'Nước'." },
        { question: "Hình nào có 3 cạnh?", icon: "🔺", options: ["Hình tròn", "Hình vuông", "Hình tam giác", "Hình chữ nhật"], correct_index: 2, explanation: "Hình tam giác có 3 cạnh." },
        { question: "Thủ đô của Việt Nam là gì?", icon: "🇻🇳", options: ["Đà Nẵng", "TP. Hồ Chí Minh", "Hải Phòng", "Hà Nội"], correct_index: 3, explanation: "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam." },
        { question: "1 tuần có mấy ngày?", icon: "📅", options: ["5 ngày", "6 ngày", "7 ngày", "8 ngày"], correct_index: 2, explanation: "Một tuần có 7 ngày." },
        { question: "What sound does a dog make?", icon: "🐶", vietnamese_translation: "Chó kêu như thế nào?", options: ["Moo", "Oink", "Woof", "Meow"], correct_index: 2, explanation: "Dogs typically make a 'woof' sound." },
        { question: "Số liền sau của số 9 là số nào?", icon: "#️⃣", options: ["7", "8", "10", "11"], correct_index: 2, explanation: "Số liền sau của 9 là 10." }
    );
    MOCK_QUESTIONS_L6_9.push(
        { question: "Giải phương trình: 2x - 5 = 3", icon: "📐", options: ["x = 1", "x = 2", "x = 3", "x = 4"], correct_index: 3, explanation: "2x = 3 + 5 => 2x = 8 => x = 4." },
        { question: "Tác phẩm 'Truyện Kiều' của tác giả nào?", icon: "📜", options: ["Nguyễn Du", "Hồ Xuân Hương", "Nguyễn Trãi", "Bà Huyện Thanh Quan"], correct_index: 0, explanation: "'Truyện Kiều' là kiệt tác của đại thi hào Nguyễn Du." },
        { question: "What is the capital of France?", icon: "🇫🇷", vietnamese_translation: "Thủ đô của Pháp là gì?", options: ["London", "Berlin", "Paris", "Rome"], correct_index: 2, explanation: "Paris is the capital of France." },
        { question: "Nước (H2O) được cấu tạo từ những nguyên tố nào?", icon: "🧪", options: ["Hydro & Oxy", "Hydro & Carbon", "Oxy & Nito", "Carbon & Nito"], correct_index: 0, explanation: "Nước được cấu tạo từ 2 nguyên tử Hydro và 1 nguyên tử Oxy." },
        { question: "Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?", icon: "🏛️", options: ["Năm 40 SCN", "Năm 938 SCN", "Năm 1288 SCN", "Năm 1789 SCN"], correct_index: 0, explanation: "Cuộc khởi nghĩa Hai Bà Trưng bùng nổ vào mùa xuân năm 40 SCN." },
        { question: "Dãy núi nào được coi là 'nóc nhà của Đông Dương'?", icon: "⛰️", options: ["Dãy Hoàng Liên Sơn", "Dãy Trường Sơn", "Dãy An-pơ", "Dãy Himalaya"], correct_index: 0, explanation: "Dãy Hoàng Liên Sơn có đỉnh Fansipan, được mệnh danh là nóc nhà Đông Dương." },
        { question: "Tính diện tích hình tròn có bán kính R = 5cm (lấy π ≈ 3.14)?", icon: "🟢", options: ["15.7 cm²", "31.4 cm²", "78.5 cm²", "25 cm²"], correct_index: 2, explanation: "Diện tích hình tròn S = πR² = 3.14 * 5² = 3.14 * 25 = 78.5 cm²." },
        { question: "Ai là tác giả của bài thơ 'Qua Đèo Ngang'?", icon: "✍️", options: ["Hồ Xuân Hương", "Bà Huyện Thanh Quan", "Đoàn Thị Điểm", "Nguyễn Du"], correct_index: 1, explanation: "Bài thơ 'Qua Đèo Ngang' là một tác phẩm nổi tiếng của Bà Huyện Thanh Quan." },
        { question: "Choose the correct past tense of 'go'.", icon: "🗣️", vietnamese_translation: "Chọn dạng quá khứ đúng của động từ 'go'.", options: ["goed", "gone", "went", "going"], correct_index: 2, explanation: "The past tense of 'go' is 'went'." },
        { question: "Đơn vị đo lực trong hệ SI là gì?", icon: "⚖️", options: ["Joule (J)", "Watt (W)", "Newton (N)", "Pascal (Pa)"], correct_index: 2, explanation: "Newton (N) là đơn vị đo lực trong Hệ đo lường quốc tế (SI)." },
        { question: "Kim loại nào sau đây có tính dẫn điện tốt nhất?", icon: "🔩", options: ["Vàng (Au)", "Bạc (Ag)", "Đồng (Cu)", "Nhôm (Al)"], correct_index: 1, explanation: "Bạc (Ag) là kim loại dẫn điện tốt nhất, sau đó đến Đồng, Vàng, Nhôm." },
        { question: "Quá trình cây xanh sử dụng ánh sáng mặt trời để tổng hợp chất hữu cơ gọi là gì?", icon: "🌿", options: ["Hô hấp", "Quang hợp", "Trao đổi chất", "Sinh sản"], correct_index: 1, explanation: "Quang hợp là quá trình cây xanh tổng hợp chất hữu cơ từ CO2 và nước, sử dụng năng lượng ánh sáng mặt trời." },
        { question: "Kết quả của phép tính (-5) * (-4) + 10 là gì?", icon: "✖️", options: ["-30", "10", "30", "-10"], correct_index: 2, explanation: "(-5) * (-4) = 20. Sau đó 20 + 10 = 30." },
        { question: "Ngày Quốc khánh của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là ngày nào?", icon: "🇻🇳", options: ["30/4", "1/5", "2/9", "19/8"], correct_index: 2, explanation: "Ngày 2 tháng 9 hàng năm là ngày Quốc khánh của Việt Nam, kỷ niệm ngày Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập." },
        { question: "Which word is an adjective: 'quickly', 'run', 'beautiful', 'house'?", icon: "🎨", vietnamese_translation: "Từ nào sau đây là tính từ?", options: ["quickly (nhanh chóng - trạng từ)", "run (chạy - động từ)", "beautiful (đẹp - tính từ)", "house (ngôi nhà - danh từ)"], correct_index: 2, explanation: "'Beautiful' describes a noun, so it is an adjective." }
    );
    MOCK_QUESTIONS_L1_FROM_DOCS.push(
        { question: "Số gồm 3 chục và 7 đơn vị là số nào?", icon: "🔢", options: ["30", "37", "70", "73"], correct_index: 1, explanation: "3 chục là 30, 7 đơn vị là 7. Vậy số đó là 30 + 7 = 37." },
        { question: "Trong dãy số: 57, 58, 59, ?, 61, 62. Số còn thiếu là số nào?", icon: "🤔", options: ["56", "60", "63", "50"], correct_index: 1, explanation: "Dãy số tăng dần, mỗi số hơn số liền trước 1 đơn vị. Vậy sau 59 là 60." },
        { question: "Điền số thích hợp vào chỗ trống: 13 + ? = 17", icon: "➕", options: ["2", "3", "4", "5"], correct_index: 2, explanation: "Để tìm số còn thiếu, ta lấy 17 - 13 = 4." },
        { question: "Sắp xếp các số 32, 26, 50, 37 theo thứ tự tăng dần:", icon: "📊", options: ["50, 37, 32, 26", "26, 32, 37, 50", "26, 37, 32, 50", "32, 26, 37, 50"], correct_index: 1, explanation: "Tăng dần nghĩa là từ bé đến lớn. So sánh các số: 26 < 32 < 37 < 50." },
        { question: "Lan cắt một sợi dây dài 10 cm thành 2 đoạn bằng nhau. Độ dài mỗi đoạn dây là bao nhiêu?", icon: "📏", options: ["3cm", "4cm", "5cm", "6cm"], correct_index: 2, explanation: "Chia sợi dây 10cm thành 2 đoạn bằng nhau, mỗi đoạn dài 10 : 2 = 5cm." },
        { question: "Tính: 15 + 4 = ?", icon: "➕", options: ["17", "18", "19", "20"], correct_index: 2, explanation: "15 cộng 4 bằng 19." },
        { question: "Tính: 29 - 17 = ?", icon: "➖", options: ["10", "11", "12", "13"], correct_index: 2, explanation: "29 trừ 17 bằng 12." },
        { question: "Số liền sau số 99 là số nào?", icon: "#️⃣", options: ["98", "100", "90", "101"], correct_index: 1, explanation: "Số liền sau của một số là số lớn hơn nó 1 đơn vị. Vậy liền sau 99 là 100." },
        { question: "Số lớn nhất có 2 chữ số giống nhau là số nào?", icon: "🔝", options: ["88", "90", "99", "11"], correct_index: 2, explanation: "Số có hai chữ số giống nhau lớn nhất là 99." },
        { question: "Số bé nhất có 2 chữ số khác nhau là số nào?", icon: "🔽", options: ["10", "11", "01", "12"], correct_index: 0, explanation: "Số bé nhất có 2 chữ số khác nhau là 10 (chữ số hàng chục là 1, hàng đơn vị là 0)." },
        { question: "Trong từ 'bà ba', âm đầu của tiếng 'ba' thứ hai là gì?", icon: "🗣️", options: ["b", "a", "à", "Không có"], correct_index: 0, explanation: "Tiếng 'ba' có âm đầu là 'b', vần 'a'." },
        { question: "Chọn từ đúng để điền vào chỗ trống: 'Bà ... bé.' (theo bài học Luyện đọc 1)", icon: "👶", options: ["yêu", "bế", "cho", "hát"], correct_index: 1, explanation: "Trong sách Luyện đọc 1, có câu 'Bà bế bé'." },
        { question: "Trong bài 'Cô có cá, có cả cà', cô có những gì?", icon: "🥕", options: ["Cá và Kẹo", "Cả và Cò", "Cá và Cà", "Cò và Cá"], correct_index: 2, explanation: "Theo bài đọc, cô có cá và có cả cà." },
        { question: "Tiếng 'đi' ghép với tiếng 'đò' tạo thành từ nào?", icon: "🛶", options: ["đò đi", "đi đò", "đò đò", "đi đi"], correct_index: 1, explanation: "Ghép 'đi' với 'đò' ta được từ 'đi đò', nghĩa là di chuyển bằng đò." },
        { question: "Chữ 'ph' trong từ 'cà phê' được đọc là gì?", icon: "☕", options: ["pờ hờ", "phờ", "giờ", "bờ"], correct_index: 1, explanation: "Chữ ghép 'ph' được đọc là 'phờ'." }
    );
    MOCK_QUESTIONS_L1_FROM_DOCS_PART2.push(
        { question: "Số liền sau của số tròn chục nhỏ nhất là số nào? (Số tròn chục nhỏ nhất là 10)", icon: "➡️", options: ["9", "10", "11", "12"], correct_index: 2, explanation: "Số tròn chục nhỏ nhất có hai chữ số là 10. Số liền sau của 10 là 11." },
        { question: "Phép tính nào sau đây đúng? a. 33 – 14 + 1 = 30", icon: "✔️", options: ["Đúng", "Sai"], correct_index: 1, explanation: "33 - 14 + 1 = 19 + 1 = 20. Vậy phép tính đã cho là Sai." },
        { question: "Tổng lớn nhất của hai số có một chữ số khác nhau là bao nhiêu?", icon: "➕", options: ["16", "17", "18", "19"], correct_index: 1, explanation: "Hai số có một chữ số khác nhau lớn nhất là 9 và 8. Tổng của chúng là 9 + 8 = 17." },
        { question: "Nếu ngày 19 tháng 10 là thứ ba thì ngày 11 tháng 10 là thứ mấy?", icon: "📅", options: ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm"], correct_index: 0, explanation: "Ngày 19/10 là thứ ba. Lùi lại 7 ngày (1 tuần) là ngày 12/10 cũng là thứ ba. Vậy ngày 11/10 là thứ hai." },
        { question: "Nhà Minh nuôi 3 chục con gà và 15 con vịt. Số vịt kém số gà là bao nhiêu con?", icon: "🐔", options: ["5", "10", "15", "20"], correct_index: 2, explanation: "3 chục con gà là 30 con gà. Số vịt kém số gà là 30 - 15 = 15 con." },
        { question: "21 giờ là khoảng thời gian vào lúc nào?", icon: "🌙", options: ["Buổi sáng", "Buổi chiều", "Buổi tối", "Ban đêm"], correct_index: 2, explanation: "21 giờ tương đương với 9 giờ tối." },
        { question: "Tính: 83 - 28 = ?", icon: "➖", options: ["55", "65", "45", "53"], correct_index: 0, explanation: "83 - 28 = 55." },
        { question: "Điền dấu thích hợp: 42 lít + 8 lít ... 50 lít", icon: "⚖️", options: [">", "<", "="], correct_index: 2, explanation: "42 lít + 8 lít = 50 lít. Vậy 50 lít = 50 lít." },
        { question: "Lớp 2A có 34 học sinh, lớp 2B có 29 học sinh. Tổng số học sinh của hai lớp là bao nhiêu?", icon: "🧑‍🤝‍🧑", options: ["53", "55", "59", "63"], correct_index: 3, explanation: "Tổng số học sinh là 34 + 29 = 63 học sinh." },
        { question: "An có 29 cái kẹo, mẹ cho An thêm 5 cái kẹo. Hỏi An có tất cả bao nhiêu cái kẹo?", icon: "🍬", options: ["24", "34", "44", "35"], correct_index: 1, explanation: "An có tất cả 29 + 5 = 34 cái kẹo." },
        { question: "Trên sân có 18 con vịt và 14 con gà. Hỏi trên sân có tất cả bao nhiêu con gà và vịt?", icon: "🦆", options: ["31", "32", "33", "34"], correct_index: 1, explanation: "Tổng số gà và vịt là 18 + 14 = 32 con." },
        { question: "Tìm số lớn nhất có hai chữ số mà tổng hai chữ số bằng 11.", icon: "🔝", options: ["83", "92", "29", "74"], correct_index: 1, explanation: "Các số có hai chữ số mà tổng bằng 11: 29, 38, 47, 56, 65, 74, 83, 92. Số lớn nhất là 92." },
        { question: "Viết số gồm 5 chục và 3 đơn vị.", icon: "✍️", options: ["35", "503", "53", "5.3"], correct_index: 2, explanation: "5 chục là 50, 3 đơn vị là 3. Số đó là 53." },
        { question: "Số 45 thay đổi thế nào nếu xóa bỏ chữ số 5?", icon: "✂️", options: ["Giảm 5 đơn vị", "Còn lại số 4", "Giảm 40 đơn vị", "Không thay đổi"], correct_index: 1, explanation: "Xóa chữ số 5 (hàng đơn vị) của số 45 thì còn lại số 4 (giá trị là 4 chục đã mất đi hàng đơn vị)." },
        { question: "Tìm số có hai chữ số mà tổng hai chữ số bằng 5 và hiệu hai chữ số cũng bằng 5.", icon: "🤔", options: ["50", "23", "41", "32"], correct_index: 0, explanation: "Số đó là 50 (5+0=5, 5-0=5)." },
        { question: "Tìm số tiếp theo trong dãy: 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, ...?", icon: "🔄", options: ["1", "2", "3", "4"], correct_index: 2, explanation: "Quy luật là lặp lại chuỗi 1, 2, 3, 4. Sau 1, 2 sẽ là 3." },
        { question: "Tìm số ở ô có dấu ? sao cho tổng 3 số ở 3 ô liền nhau bằng 15: [3] [7] [?] [_] [_]", icon: "🧩", options: ["3", "4", "5", "6"], correct_index: 2, explanation: "Ô thứ ba: 3 + 7 + ? = 15 => ? = 15 - 10 = 5." },
        { question: "Từ các chữ số 2, 0, 3 lập thành các số có 3 chữ số. Số chẵn lớn nhất là số nào?", icon: "🔢", options: ["320", "302", "230", "203"], correct_index: 0, explanation: "Các số chẵn lập được: 320, 302, 230, 200. Số chẵn lớn nhất là 320." }
    );
    MOCK_QUESTIONS_L3_FROM_DOCS.push(
        { question: "Có 8 bao gạo đựng tất cả 448 kg gạo. Hỏi 1 bao gạo nặng bao nhiêu kg?", icon: "⚖️", options: ["50 kg", "56 kg", "60 kg", "48 kg"], correct_index: 1, explanation: "Để tìm số kg gạo trong 1 bao, ta lấy tổng số kg chia cho số bao: 448 : 8 = 56 kg." },
        { question: "Một cửa hàng có 6 thùng nước mắm như nhau chứa tổng cộng 54 lít. Mỗi thùng chứa bao nhiêu lít?", icon: "🏺", options: ["7 lít", "8 lít", "9 lít", "10 lít"], correct_index: 2, explanation: "Mỗi thùng chứa số lít nước mắm là: 54 : 6 = 9 lít." },
        { question: "Lúc đầu có 5 xe tải chở tổng cộng 210 bao đường. Mỗi xe tải chở bao nhiêu bao đường (biết các xe chở số bao bằng nhau)?", icon: "🚚", options: ["40 bao", "42 bao", "45 bao", "50 bao"], correct_index: 1, explanation: "Mỗi xe tải chở số bao đường là: 210 : 5 = 42 bao." },
        { question: "An có 64 viên bi chia đều thành 8 hộp. Mỗi hộp có bao nhiêu viên bi?", icon: "🔮", options: ["6 viên", "7 viên", "8 viên", "9 viên"], correct_index: 2, explanation: "Mỗi hộp có số viên bi là: 64 : 8 = 8 viên." },
        { question: "Nếu 5 gói kẹo như nhau có 40 viên. Vậy 1 gói kẹo có bao nhiêu viên?", icon: "🍬", options: ["6 viên", "7 viên", "8 viên", "9 viên"], correct_index: 2, explanation: "Một gói kẹo có số viên là: 40 : 5 = 8 viên." },
        { question: "Huệ xếp 9 chiếc thuyền mất 36 phút. Hỏi Huệ xếp 1 chiếc thuyền mất bao nhiêu phút (thời gian xếp mỗi thuyền như nhau)?", icon: "⏳", options: ["3 phút", "4 phút", "5 phút", "6 phút"], correct_index: 1, explanation: "Thời gian Huệ xếp 1 chiếc thuyền là: 36 : 9 = 4 phút." },
        { question: "Một bao gạo có 42 kg, người ta lấy ra 1/6 số gạo trong bao. Hỏi người ta đã lấy ra bao nhiêu kg gạo?", icon: "🌾", options: ["6 kg", "7 kg", "8 kg", "9 kg"], correct_index: 1, explanation: "Số kg gạo đã lấy ra là: 42 : 6 = 7 kg." },
        { question: "Tấm vải xanh dài 18 m, tấm vải đỏ dài bằng 1/3 tấm vải xanh. Tấm vải đỏ dài bao nhiêu mét?", icon: "🧵", options: ["3 m", "6 m", "9 m", "5 m"], correct_index: 1, explanation: "Độ dài tấm vải đỏ là: 18 : 3 = 6 m." },
        { question: "Số 306 đọc là gì?", icon: "🗣️", options: ["Ba mươi sáu", "Ba trăm linh sáu", "Ba trăm sáu mươi", "Sáu trăm linh ba"], correct_index: 1, explanation: "Số 306 được đọc là Ba trăm linh sáu." },
        { question: "Tìm x biết: X - 192 = 301", icon: "❓", options: ["109", "493", "503", "483"], correct_index: 1, explanation: "X = 301 + 192 = 493." },
        { question: "Who is this? (Hình ảnh: mẹ)", icon: "👩", vietnamese_translation: "Đây là ai? (Hình ảnh: mẹ)", options: ["This is my father.", "This is my mother.", "This is my sister.", "This is my brother."], correct_index: 1, explanation: "Câu trả lời phù hợp với hình ảnh người mẹ là 'This is my mother.'" },
        { question: "What is your name?", icon: "📛", vietnamese_translation: "Tên của bạn là gì?", options: ["My name is Phong.", "I am fine, thank you.", "This is a pen.", "I am eight."], correct_index: 0, explanation: "Câu hỏi 'What is your name?' dùng để hỏi tên." },
        { question: "How old are you?", icon: "🎂", vietnamese_translation: "Bạn bao nhiêu tuổi?", options: ["I'm fine.", "My name is Linda.", "I'm eight years old.", "This is my school."], correct_index: 2, explanation: "Câu hỏi 'How old are you?' dùng để hỏi tuổi." },
        { question: "Is this your school?", icon: "🏫", vietnamese_translation: "Đây có phải trường của bạn không?", options: ["Yes, it is.", "No, I am.", "It's a big school.", "My name is Nam."], correct_index: 0, explanation: "Câu trả lời phù hợp cho câu hỏi Yes/No về trường học." },
        { question: "What colour is your pen? (Hình ảnh: bút màu xanh)", icon: "🖊️", vietnamese_translation: "Bút của bạn màu gì? (Hình ảnh: bút màu xanh)", options: ["It's red.", "It's a pen.", "It's blue.", "Yes, it is."], correct_index: 2, explanation: "Câu hỏi về màu sắc của cây bút." },
        { question: "What do you do at break time?", icon: "🤸", vietnamese_translation: "Bạn làm gì vào giờ ra chơi?", options: ["I play chess.", "It's a book.", "My name is Quan.", "I'm nine."], correct_index: 0, explanation: "Hỏi về hoạt động trong giờ giải lao." },
        { question: "Are these your friends?", icon: "🧑‍🤝‍🧑", vietnamese_translation: "Đây có phải là bạn của bạn không?", options: ["Yes, they are.", "No, it isn't.", "This is my father.", "I like robots."], correct_index: 0, explanation: "Câu hỏi về bạn bè (số nhiều)." },
        { question: "Where's your book?", icon: "📚", vietnamese_translation: "Quyển sách của bạn đâu?", options: ["It's on the table.", "It's a big book.", "I have two books.", "My name is Hoa."], correct_index: 0, explanation: "Hỏi về vị trí của quyển sách." },
        { question: "How many balls do you have? (Hình ảnh: 3 quả bóng)", icon: "⚽", vietnamese_translation: "Bạn có bao nhiêu quả bóng? (Hình ảnh: 3 quả bóng)", options: ["I have one.", "I have two.", "I have three.", "I have four."], correct_index: 2, explanation: "Hỏi về số lượng đồ vật." },
        { question: "What is grandmother doing? (Hình ảnh: bà đang đan len)", icon: "👵", vietnamese_translation: "Bà đang làm gì? (Hình ảnh: bà đang đan len)", options: ["She is sleeping.", "She is knitting.", "She is cooking.", "She is reading."], correct_index: 1, explanation: "Dựa vào hình ảnh, bà đang đan len (knitting)." }
    );
    MOCK_QUESTIONS_L4_FROM_DOCS.push(
        { question: "Điền dấu thích hợp vào chỗ chấm: 23476 ... 32467", icon: "↔️", options: ["<", ">", "="], correct_index: 0, explanation: "Số 23476 có ít chữ số hơn và giá trị ở hàng chục nghìn nhỏ hơn số 32467, nên 23476 < 32467." },
        { question: "Một nhà máy trong 4 ngày sản xuất được 680 ti vi. Hỏi trong 1 ngày nhà máy đó sản xuất được bao nhiêu chiếc ti vi (biết số ti vi mỗi ngày như nhau)?", icon: "📺", options: ["150 chiếc", "160 chiếc", "170 chiếc", "180 chiếc"], correct_index: 2, explanation: "Trong 1 ngày, nhà máy sản xuất được: 680 : 4 = 170 chiếc ti vi." },
        { question: "Số 'ba mươi nghìn không trăm linh bảy' viết là:", icon: "✍️", options: ["300 007", "30 007", "3 007", "30 070"], correct_index: 1, explanation: "Ba mươi nghìn là 30000, không trăm linh bảy là 007. Ghép lại là 30 007." },
        { question: "Số lớn nhất gồm 5 chữ số khác nhau là:", icon: "🔝", options: ["99999", "98765", "98756", "10234"], correct_index: 1, explanation: "Để số là lớn nhất, các chữ số từ hàng cao đến hàng thấp phải lớn nhất có thể và khác nhau: 9, 8, 7, 6, 5. Vậy số đó là 98765." },
        { question: "Viết số: Bảy trăm năm mươi.", icon: "📝", options: ["705", "750", "570", "70050"], correct_index: 1, explanation: "Bảy trăm năm mươi được viết là 750." },
        { question: "Số liền sau số 999 999 là:", icon: "➡️", options: ["1 000 000", "999 998", "10 000 000", "999 990"], correct_index: 0, explanation: "Số liền sau của 999 999 là 999 999 + 1 = 1 000 000 (một triệu)." },
        { question: "Viết số gồm: 2 trăm nghìn, 5 trăm, 3 chục, 9 đơn vị.", icon: "🔢", options: ["250390", "200539", "2539", "205309"], correct_index: 1, explanation: "2 trăm nghìn = 200000; 5 trăm = 500; 3 chục = 30; 9 đơn vị = 9. Tổng là 200000 + 500 + 30 + 9 = 200539." },
        { question: "Tìm x biết x là số tròn chục và 91 > x > 68.", icon: "🔍", options: ["70, 80, 90", "70, 80", "60, 70, 80", "80, 90"], correct_index: 1, explanation: "Các số tròn chục lớn hơn 68 và nhỏ hơn 91 là 70, 80." },
        { question: "Đổi: 4 kg 300g = ... g", icon: "⚖️", options: ["430g", "4300g", "4030g", "700g"], correct_index: 1, explanation: "4 kg = 4000g. Vậy 4 kg 300g = 4000g + 300g = 4300g." },
        { question: "152 phút = ... giờ ... phút. Số cần điền vào chỗ chấm lần lượt là:", icon: "⏰", options: ["1 giờ 52 phút", "2 giờ 32 phút", "15 giờ 2 phút", "2 giờ 22 phút"], correct_index: 1, explanation: "152 phút = 120 phút + 32 phút = 2 giờ 32 phút." },
        { question: "Nếu a = 6 thì giá trị của biểu thức 7543 x a là:", icon: "✖️", options: ["45248", "45058", "42358", "45258"], correct_index: 3, explanation: "7543 x 6 = 45258." },
        { question: "Chu vi hình chữ nhật có chiều dài 16 cm, chiều rộng 12 cm là:", icon: "📏", options: ["28 cm", "56 cm", "192 cm", "40 cm"], correct_index: 1, explanation: "Chu vi hình chữ nhật = (dài + rộng) x 2 = (16 + 12) x 2 = 28 x 2 = 56 cm." },
        { question: "Trong câu: \"Chị Nhà Trò đã bé nhỏ lại gầy yếu quá, người bự những phấn, như mới lột.\", từ nào là tính từ?", icon: "🎨", options: ["Nhà Trò, người", "bé nhỏ, gầy yếu", "lột, mặc", "phấn, cánh"], correct_index: 1, explanation: "'Bé nhỏ' và 'gầy yếu' là các từ chỉ đặc điểm, tính chất, nên là tính từ." },
        { question: "Câu \"Tôi đến gần, chị Nhà Trò vẫn khóc.\" thuộc mẫu câu nào?", icon: "❓", options: ["Ai là gì?", "Ai làm gì?", "Ai thế nào?", "Không thuộc mẫu nào"], correct_index: 1, explanation: "Câu này kể về hành động của 'Tôi' (đến gần) và 'chị Nhà Trò' (vẫn khóc), thuộc mẫu Ai làm gì?" },
        { question: "Trạng ngữ trong câu \"Đêm nay anh đứng gác ở trại.\" chỉ gì?", icon: "🕰️", options: ["Nơi chốn", "Thời gian", "Nguyên nhân", "Mục đích"], correct_index: 1, explanation: "Cụm từ 'Đêm nay' trả lời cho câu hỏi Khi nào?, chỉ thời gian diễn ra sự việc." },
        { question: "Từ nào sau đây là từ ghép: lon ton, lấp lánh, xanh tươi, học tập?", icon: "🧩", options: ["lon ton", "lấp lánh", "xanh tươi", "học tập"], correct_index: 3, explanation: "'Học tập' là từ ghép có nghĩa tổng hợp từ hai tiếng có nghĩa. 'lon ton', 'lấp lánh' là từ láy. 'xanh tươi' là từ ghép đẳng lập." },
        { question: "Trong câu \"Mặt trời mới nhô cao Cho trẻ con nhìn rõ\", động từ là:", icon: "🏃", options: ["Mặt trời, trẻ con", "mới, rõ", "nhô, nhìn", "cao, cho"], correct_index: 2, explanation: "'Nhô' và 'nhìn' là các từ chỉ hoạt động, trạng thái của sự vật." },
        { question: "Câu nào sau đây là câu hỏi?: \"Nhà Hoa có một vườn cây rất rộng lớn?\"", icon: "🤔", options: ["Đúng, vì có dấu chấm hỏi", "Sai, đây là câu kể", "Sai, đây là câu cảm", "Đúng, vì hỏi về đặc điểm"], correct_index: 0, explanation: "Câu có từ để hỏi (ngầm hiểu 'có...không?') và kết thúc bằng dấu chấm hỏi, dùng để hỏi." },
        { question: "Chủ ngữ trong câu \"Tô Hiến Thành làm quan triều Lý, nổi tiếng là người chính trực.\" là:", icon: "👤", options: ["Tô Hiến Thành", "quan triều Lý", "người chính trực", "nổi tiếng"], correct_index: 0, explanation: "Bộ phận trả lời cho câu hỏi 'Ai làm quan triều Lý, nổi tiếng là người chính trực?' là 'Tô Hiến Thành'." },
        { question: "Từ \"tham lam\" trong câu chuyện về vua Mi-đát là loại từ gì?", icon: "😠", options: ["Danh từ", "Động từ", "Tính từ", "Trạng từ"], correct_index: 2, explanation: "'Tham lam' chỉ tính chất, đặc điểm của vua Mi-đát, nên là tính từ." },
        { question: "Trong câu \"Trăng tròn như mắt cá\", sự vật nào được so sánh với trăng?", icon: "🌕", options: ["Mắt", "Cá", "Mắt cá", "Biển xanh"], correct_index: 2, explanation: "Trăng được so sánh với 'mắt cá' về hình dáng tròn." },
        { question: "Bộ phận gạch chân trong câu: \"<u>Một hôm</u>, qua một vùng cỏ xước xanh dài, tôi chợt nghe tiếng khóc tỉ tê.\" là gì?", icon: "📍", options: ["Chủ ngữ", "Vị ngữ", "Trạng ngữ chỉ thời gian", "Trạng ngữ chỉ nơi chốn"], correct_index: 2, explanation: "Cụm từ 'Một hôm' trả lời cho câu hỏi Khi nào?, chỉ thời gian." }
    );

    const constructGeminiPrompt = (grade) => {
        let gradeLevelText;
        let subjectDistribution;

        if (grade >= 1 && grade <= 9) { 
            gradeLevelText = `lớp ${grade}`;
        } else if (grade === 10) {
            gradeLevelText = `lớp 10`;
        } else if (grade === 11) {
            gradeLevelText = `lớp 11`;
        } else if (grade === 12) {
            gradeLevelText = `lớp 12`;
        } else {
            gradeLevelText = `cấp độ ${grade}`;
        }

        if (grade === 1 || grade === 2) { 
            subjectDistribution = `Toán (4 câu), Tiếng Việt (4 câu), Tự nhiên và Xã hội (3 câu), Đạo đức (2 câu), Tiếng Anh cơ bản (2 câu). Tổng cộng ${QUIZ_SET_SIZE} câu.`;
        } else if (grade === 3) { 
            subjectDistribution = `Toán (4 câu), Tiếng Việt (4 câu), Tự nhiên và Xã hội (2 câu), Đạo đức (1 câu), Tin học (2 câu), Tiếng Anh (2 câu). Tổng cộng ${QUIZ_SET_SIZE} câu.`;
        } else if (grade === 4 || grade === 5) { 
            subjectDistribution = `Toán (4 câu), Tiếng Việt (3 câu), Khoa học (2 câu), Lịch sử và Địa lý (2 câu), Đạo đức (1 câu), Tin học (1 câu), Tiếng Anh (2 câu). Tổng cộng ${QUIZ_SET_SIZE} câu.`;
        } else if (grade >= 6 && grade <= 9) { 
            subjectDistribution = `Toán (3 câu), Ngữ Văn (3 câu), Tiếng Anh (3 câu), Khoa học Tự nhiên (bao gồm Lý, Hóa, Sinh - 3 câu tổng cộng), Lịch sử và Địa lý (2 câu), Giáo dục công dân (1 câu). Tổng cộng ${QUIZ_SET_SIZE} câu.`;
        } else {
            subjectDistribution = `Toán (5 câu), Tiếng Việt/Ngữ Văn (5 câu), Tiếng Anh (3 câu), Kiến thức chung (2 câu). Tổng cộng ${QUIZ_SET_SIZE} câu.`;
        }

        return `Tạo một bộ đề gồm ${QUIZ_SET_SIZE} câu hỏi trắc nghiệm cho học sinh ${gradeLevelText} tại Việt Nam.\nPhân bổ câu hỏi theo các môn học sau: ${subjectDistribution}\nYêu cầu:\n- Mỗi câu hỏi phải có 4 đáp án. Chỉ MỘT đáp án đúng.\n- Ba đáp án còn lại phải khác biệt rõ ràng với đáp án đúng và khác biệt với nhau, đồng thời phải là những lựa chọn hợp lý nhưng sai. TRÁNH tạo ra các đáp án sai giống hệt nhau hoặc giống hệt đáp án đúng.\n- Câu hỏi tiếng Anh phải có trường "vietnamese_translation" để dịch đề bài sang tiếng Việt (không dịch các lựa chọn đáp án).\n- Cố gắng sử dụng một emoji phù hợp cho trường "icon" của mỗi câu hỏi.\n- Cung cấp giải thích ("explanation") cho mỗi câu hỏi. Giải thích phải rõ ràng và dựa trên kiến thức.\n- Câu hỏi phải mang tính khách quan, có đáp án đúng duy nhất dựa trên kiến thức phổ thông hoặc kiến thức được dạy trong chương trình học.\n- TRÁNH các câu hỏi phụ thuộc vào tình huống thực tế tại thời điểm trả lời (ví dụ: "Thời tiết hôm nay thế nào?", "Bây giờ là mấy giờ?") hoặc các câu hỏi dựa trên ý kiến cá nhân không có cơ sở kiến thức rõ ràng.\n- TRÁNH các câu hỏi mà đáp án đúng có thể thay đổi tùy theo ngữ cảnh không được cung cấp trong câu hỏi.\n- Trả về kết quả dưới dạng một mảng JSON. Mỗi phần tử trong mảng là một đối tượng JSON có cấu trúc sau:\n  {"question": "Nội dung câu hỏi...", "icon": "emoji_phù_hợp", "vietnamese_translation": "Bản dịch tiếng Việt nếu là câu hỏi tiếng Anh, nếu không thì để trống hoặc null", "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], "correct_index": số_thứ_tự_đáp_án_đúng_từ_0_đến_3, "explanation": "Giải thích chi tiết cho đáp án..."}\nVí dụ một câu hỏi tiếng Anh TỐT:\n{"question": "What color is the sky on a sunny day?", "icon": "☀️", "vietnamese_translation": "Bầu trời màu gì vào một ngày nắng?", "options": ["Blue", "Green", "Red", "Yellow"], "correct_index": 0, "explanation": "The sky is blue due to Rayleigh scattering of sunlight in the atmosphere."}\nVí dụ một câu hỏi tiếng Việt TỐT:\n{"question": "Trong các số sau, số nào là số chẵn: 3, 5, 8, 9?", "icon": "🔢", "vietnamese_translation": null, "options": ["3", "5", "8", "9"], "correct_index": 2, "explanation": "Số chẵn là số chia hết cho 2. Trong các số trên, 8 là số chẵn."}\nVí dụ một câu hỏi XẤU (cần tránh):\n{"question": "Câu nào sau đây đúng?", "icon": "❓", "options": ["Trời đang mưa.", "Trời đang nắng.", "Bây giờ là buổi sáng.", "Tôi đang vui."], "correct_index": 0, "explanation": "Đáp án phụ thuộc vào thực tế."}\nHãy đảm bảo toàn bộ phản hồi CHỈ LÀ MẢNG JSON, không có bất kỳ văn bản giới thiệu hay giải thích nào khác bên ngoài mảng JSON đó.\nCác câu hỏi không được lặp lại trong cùng một bộ đề.\n`;
    };

    async function callGeminiAPI(prompt) {  if (!GEMINI_API_KEY) throw new Error("API Key for Gemini is not set.");
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        try {
            const response = await fetch(API_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { "temperature": 0.7, "topP": 1.0, "maxOutputTokens": 8192, "responseMimeType": "application/json" } }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Gemini API Error Response:", data);
                throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}. Details: ${JSON.stringify(data.error?.message || data)}`);
            }
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const rawJsonString = data.candidates[0].content.parts[0].text;
                try { return JSON.parse(rawJsonString.trim()); }
                catch (e) { console.error("Failed to parse JSON response from Gemini. Error:", e, "Raw string:", rawJsonString); throw new Error(`Gemini response was not valid JSON. ${e.message}.`); }
            } else {
                console.error("Invalid response structure from Gemini:", data);
                if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === "SAFETY") throw new Error("Gemini API: Content generation blocked due to safety ratings.");
                if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === "OTHER") throw new Error("Gemini API: Content generation stopped for other reasons.");
                throw new Error("No content generated or unexpected response structure from Gemini.");
            }
        } catch (error) { console.error("Error calling Gemini API:", error); throw error; }}
    const generateQuizSet = async (age) => {    const grade = age - 5;
        const recentTextsNormalized = new Set(userData.recentQuizQuestionTexts.map(text => text.trim().toLowerCase()));
        let finalQuizSet = [];

        if (useMockQuestions || !GEMINI_API_KEY) {
            quizLoadingIndicator.classList.add('hidden');
            geminiStatusDisplay.textContent = "Đang sử dụng câu hỏi mẫu..."; geminiStatusDisplay.style.color = "orange";

            let mockSetBase;
            if (grade === 4) {
                 mockSetBase = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L6_9.slice(0,QUIZ_SET_SIZE/3)];
            } else if (grade === 3) {
                 mockSetBase = [...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2];
            } else if (grade >= 1 && grade <= 2) {
                mockSetBase = [...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2];
            } else if (grade === 5) {
                 mockSetBase = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L6_9];
            } else {
                mockSetBase = MOCK_QUESTIONS_L6_9;
            }

            let nonRecentMocks = mockSetBase.filter(q => !recentTextsNormalized.has(q.question.trim().toLowerCase()));
            nonRecentMocks.sort(() => 0.5 - Math.random());
            finalQuizSet = nonRecentMocks.slice(0, QUIZ_SET_SIZE);

            if (finalQuizSet.length < QUIZ_SET_SIZE) {
                const currentSetTexts = new Set(finalQuizSet.map(q => q.question.trim().toLowerCase()));
                let recentMocksToConsider = mockSetBase.filter(q => recentTextsNormalized.has(q.question.trim().toLowerCase()) && !currentSetTexts.has(q.question.trim().toLowerCase()));
                recentMocksToConsider.sort(() => 0.5 - Math.random());
                finalQuizSet.push(...recentMocksToConsider.slice(0, QUIZ_SET_SIZE - finalQuizSet.length));
            }
            if (finalQuizSet.length < QUIZ_SET_SIZE) {
                 const currentSetTexts = new Set(finalQuizSet.map(q => q.question.trim().toLowerCase()));
                 let anyMocksToConsider = mockSetBase.filter(q => !currentSetTexts.has(q.question.trim().toLowerCase()));
                 anyMocksToConsider.sort(() => 0.5 - Math.random());
                 finalQuizSet.push(...anyMocksToConsider.slice(0, QUIZ_SET_SIZE - finalQuizSet.length));
            }
            while (finalQuizSet.length < QUIZ_SET_SIZE && mockSetBase.length > 0) {
                 finalQuizSet.push(mockSetBase[Math.floor(Math.random() * mockSetBase.length)]);
            }
            finalQuizSet = finalQuizSet.slice(0, QUIZ_SET_SIZE);

            userData.lastQuizQuestions = finalQuizSet;
            saveUserData(currentUserName);
            return finalQuizSet;
        }

        quizLoadingIndicator.classList.remove('hidden'); quizArea.classList.add('hidden'); startQuizBtn.disabled = true;
        try {
            const prompt = constructGeminiPrompt(grade);
            let questionsFromAPI = await callGeminiAPI(prompt);
            if (!Array.isArray(questionsFromAPI)) throw new Error("Gemini API did not return an array of questions.");
            if (questionsFromAPI.length === 0) throw new Error("Gemini returned an empty array of questions.");

            const validatedAndFilteredQuestions = []; const currentSetQuestionTexts = new Set();
            for (const q_raw of questionsFromAPI) {
                let q = {...q_raw};
                if (typeof q.question !== 'string' || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index > 3) { console.warn("Invalid API Q struct:", q); continue; }
                const optionTexts = new Set(q.options.map(opt => String(opt).trim().toLowerCase())); if (optionTexts.size < q.options.length) { console.warn("API Q duplicate opts:", q); continue; }
                const correctOptText = String(q.options[q.correct_index]).trim().toLowerCase();
                let hasIdenticalDistractor = false;
                for(let i=0; i < q.options.length; i++) { if (i !== q.correct_index && String(q.options[i]).trim().toLowerCase() === correctOptText) { hasIdenticalDistractor = true; break; }}
                if (hasIdenticalDistractor) { console.warn("API Q identical distractor:", q); continue; }
                const questionTextNormalized = q.question.trim().toLowerCase();
                if (currentSetQuestionTexts.has(questionTextNormalized) || recentTextsNormalized.has(questionTextNormalized)) { console.warn("API Q duplicate/recent:", q.question); continue; }
                currentSetQuestionTexts.add(questionTextNormalized);
                validatedAndFilteredQuestions.push({ ...q, icon: q.icon || '❓', explanation: q.explanation || 'Không có giải thích.', vietnamese_translation: q.vietnamese_translation || '' });
            }
            finalQuizSet = validatedAndFilteredQuestions;

            if (finalQuizSet.length < QUIZ_SET_SIZE) {
                console.warn(`API gave ${finalQuizSet.length} unique Qs. Padding...`);
                let mockSource;
                if (grade === 4) { mockSource = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L6_9.slice(0,QUIZ_SET_SIZE/3)]; }
                else if (grade === 3) { mockSource = [...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2]; }
                else if (grade >= 1 && grade <= 2) { mockSource = [...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2]; }
                else if (grade === 5) { mockSource = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L6_9]; }
                else { mockSource = MOCK_QUESTIONS_L6_9; }

                let needed = QUIZ_SET_SIZE - finalQuizSet.length;
                const currentAPISetTexts = new Set(finalQuizSet.map(q => q.question.trim().toLowerCase()));
                let paddingMocks = mockSource.filter(q => !recentTextsNormalized.has(q.question.trim().toLowerCase()) && !currentAPISetTexts.has(q.question.trim().toLowerCase()));
                paddingMocks.sort(() => 0.5 - Math.random());
                finalQuizSet.push(...paddingMocks.slice(0, needed));

                if (finalQuizSet.length < QUIZ_SET_SIZE) {
                    needed = QUIZ_SET_SIZE - finalQuizSet.length;
                    let morePaddingMocks = mockSource.filter(q => !currentAPISetTexts.has(q.question.trim().toLowerCase()) && !finalQuizSet.some(fq => fq.question.trim().toLowerCase() === q.question.trim().toLowerCase()));
                    morePaddingMocks.sort(() => 0.5 - Math.random());
                    finalQuizSet.push(...morePaddingMocks.slice(0, needed));
                }
            }
            finalQuizSet = finalQuizSet.slice(0, QUIZ_SET_SIZE);
             while (finalQuizSet.length < QUIZ_SET_SIZE && MOCK_QUESTIONS_L1_5.length > 0) {
                let mockSrc;
                if (grade === 4) { mockSrc = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L6_9.slice(0,QUIZ_SET_SIZE/3)]; }
                else if (grade === 3) { mockSrc = [...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2];}
                else if (grade >= 1 && grade <= 2) { mockSrc = [...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2]; }
                else if (grade === 5) { mockSrc = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L6_9]; }
                else { mockSrc = MOCK_QUESTIONS_L6_9;}
                finalQuizSet.push(mockSrc[Math.floor(Math.random() * mockSrc.length)]);
            }
            finalQuizSet = finalQuizSet.slice(0, QUIZ_SET_SIZE);

            if (finalQuizSet.length === 0) throw new Error("No valid questions could be assembled.");
            geminiStatusDisplay.textContent = "Bộ đề được tạo bởi Gemini API."; geminiStatusDisplay.style.color = "green";
            userData.lastQuizQuestions = finalQuizSet; saveUserData(currentUserName); return finalQuizSet;
        } catch (error) {
            console.error("Failed to generate quiz from Gemini:", error);
            showGeneralPopup("Lỗi tạo đề", `Không thể tạo bộ đề từ Gemini: ${error.message}. Sử dụng bộ đề đã lưu/câu hỏi mẫu.`);
            geminiStatusDisplay.textContent = `Lỗi Gemini: ${error.message}. Dùng câu hỏi mẫu/cũ.`; geminiStatusDisplay.style.color = "red";
            if (userData.lastQuizQuestions && userData.lastQuizQuestions.length >= QUIZ_SET_SIZE) return userData.lastQuizQuestions;

            let mockSetBase;
            if (grade === 4) { mockSetBase = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L6_9.slice(0,QUIZ_SET_SIZE/3)]; }
            else if (grade === 3) { mockSetBase = [...MOCK_QUESTIONS_L3_FROM_DOCS, ...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2]; }
            else if (grade >= 1 && grade <= 2) { mockSetBase = [...MOCK_QUESTIONS_L1_5, ...MOCK_QUESTIONS_L1_FROM_DOCS, ...MOCK_QUESTIONS_L1_FROM_DOCS_PART2]; }
            else if (grade === 5) { mockSetBase = [...MOCK_QUESTIONS_L4_FROM_DOCS, ...MOCK_QUESTIONS_L6_9]; }
            else { mockSetBase = MOCK_QUESTIONS_L6_9; }

            let nonRecentMocks = mockSetBase.filter(q => !recentTextsNormalized.has(q.question.trim().toLowerCase()));
            nonRecentMocks.sort(() => 0.5 - Math.random());
            finalQuizSet = nonRecentMocks.slice(0, QUIZ_SET_SIZE);
            if (finalQuizSet.length < QUIZ_SET_SIZE) {
                 finalQuizSet.push(...[...mockSetBase].sort(() => 0.5 - Math.random()).slice(0, QUIZ_SET_SIZE - finalQuizSet.length));
            }
            finalQuizSet = finalQuizSet.slice(0, QUIZ_SET_SIZE);
            while (finalQuizSet.length < QUIZ_SET_SIZE && mockSetBase.length > 0) {
                 finalQuizSet.push(mockSetBase[Math.floor(Math.random() * mockSetBase.length)]);
            }
            finalQuizSet = finalQuizSet.slice(0, QUIZ_SET_SIZE);
            return finalQuizSet;
        } finally { quizLoadingIndicator.classList.add('hidden'); startQuizBtn.disabled = false; }};
    const startNewQuiz = async () => {  if (userData.quizSetsToday >= MAX_QUIZ_SETS_PER_DAY) { showGeneralPopup("Thông báo", "Em đã hoàn thành đủ số bộ đề cho hôm nay rồi. Hãy quay lại vào ngày mai nhé!"); return; }
        try {
            currentQuizSet = await generateQuizSet(userData.age);
            if (!currentQuizSet || currentQuizSet.length === 0) {
                showGeneralPopup("Lỗi", "Không có câu hỏi nào được tải. Vui lòng thử lại hoặc kiểm tra API Key.");
                quizArea.classList.add('hidden'); startQuizBtn.classList.remove('hidden');
                if(quizTimerContainer) quizTimerContainer.classList.add('hidden');
                if (quizSetsTodayParagraph) quizSetsTodayParagraph.classList.remove('hidden');
                if (geminiStatusDisplay) geminiStatusDisplay.classList.remove('hidden'); return;
            }
             if (currentQuizSet.length < QUIZ_SET_SIZE && currentQuizSet.length > 0) {
                showGeneralPopup("Thông báo", `Bộ đề này chỉ có ${currentQuizSet.length} câu do không đủ câu hỏi duy nhất. Chúng tôi đang cải thiện!`);
            }
            currentQuestionIndex = 0; currentScore = 0;
            quizArea.classList.remove('hidden'); miniGameArea.classList.add('hidden');
            startQuizBtn.classList.add('hidden'); nextQuestionBtn.classList.add('hidden');
            quizFeedback.textContent = '';
            if (quizSetsTodayParagraph) quizSetsTodayParagraph.classList.add('hidden');
            if (geminiStatusDisplay) geminiStatusDisplay.classList.add('hidden');
            displayCurrentQuestion();
        } catch (error) {
            console.error("Error starting new quiz:", error);
            quizArea.classList.add('hidden'); startQuizBtn.classList.remove('hidden');
            if(quizTimerContainer) quizTimerContainer.classList.add('hidden');
            if (quizSetsTodayParagraph) quizSetsTodayParagraph.classList.remove('hidden');
            if (geminiStatusDisplay) geminiStatusDisplay.classList.remove('hidden');
        }};
    const handleQuizTimeUp = () => {         if (quizTimerInterval) clearInterval(quizTimerInterval); quizTimerInterval = null;
        if (!currentQuizSet || currentQuizSet.length === 0 || !currentQuizSet[currentQuestionIndex]) return;
        const q = currentQuizSet[currentQuestionIndex];
        optionsContainer.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.classList.add('disabled'); btn.removeEventListener('click', handleAnswerSelection);
            if (index === q.correct_index) btn.classList.add('correct');
        });
        quizFeedback.innerHTML = `<span class="sad-face">😟 Hết giờ rồi!</span> Đáp án đúng là: ${q.options[q.correct_index]}. ${q.explanation || ''}`;
        showFireworks(false); nextQuestionBtn.classList.remove('hidden');
        if(quizTimerContainer) quizTimerContainer.classList.add('hidden');};
    const displayCurrentQuestion = () => {         if (quizTimerInterval) clearInterval(quizTimerInterval);
        if (currentQuestionIndex < currentQuizSet.length) {
            const q = currentQuizSet[currentQuestionIndex];
            questionText.innerHTML = `${q.icon || '❓'} ${q.question}`;
            questionTranslation.textContent = q.vietnamese_translation || '';
            questionTranslation.classList.toggle('hidden', !q.vietnamese_translation);
            optionsContainer.innerHTML = '';
            q.options.forEach((option, index) => {
                const button = document.createElement('button'); button.classList.add('option-btn');
                button.textContent = option; button.dataset.index = index;
                button.addEventListener('click', handleAnswerSelection); optionsContainer.appendChild(button);
            });
            nextQuestionBtn.classList.add('hidden'); quizFeedback.textContent = '';
            quizTimeRemaining = QUIZ_TIME_LIMIT;
            if(quizTimerDisplay) quizTimerDisplay.textContent = quizTimeRemaining;
            if(quizTimerContainer) quizTimerContainer.classList.remove('hidden');
            quizTimerInterval = setInterval(() => {
                quizTimeRemaining--; if(quizTimerDisplay) quizTimerDisplay.textContent = quizTimeRemaining;
                if (quizTimeRemaining <= 0) handleQuizTimeUp();
            }, 1000);
        } else { finishQuiz(); }};
    const handleAnswerSelection = (e) => {
        if (quizTimerInterval) clearInterval(quizTimerInterval); quizTimerInterval = null;
        if(quizTimerContainer) quizTimerContainer.classList.add('hidden');
        if (!currentQuizSet || currentQuizSet.length === 0 || !currentQuizSet[currentQuestionIndex]) return;

        const selectedIndex = parseInt(e.target.dataset.index);
        const q = currentQuizSet[currentQuestionIndex];
        const correct = selectedIndex === q.correct_index;

        optionsContainer.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.classList.add('disabled'); btn.removeEventListener('click', handleAnswerSelection);
            if (index === q.correct_index) btn.classList.add('correct');
            else if (index === selectedIndex && !correct) btn.classList.add('incorrect');
        });

        if (correct) {
            currentScore++;
            userData.points += 10; 
            userData.quizScorePoints = (userData.quizScorePoints || 0) + 10; 
            quizFeedback.innerHTML = `<span class="fireworks">🎉 Chính xác!</span> ${q.explanation || ''}`;
            showFireworks(true);
        } else {
            quizFeedback.innerHTML = `<span class="sad-face">😟 Sai rồi!</span> Đáp án đúng là: ${q.options[q.correct_index]}. ${q.explanation || ''}`;
            showFireworks(false);
        }
        updateDashboardUI(); 
        nextQuestionBtn.classList.remove('hidden');
    };
    nextQuestionBtn.addEventListener('click', () => {         if (quizTimerInterval) clearInterval(quizTimerInterval); quizTimerInterval = null;
        if(quizTimerContainer) quizTimerContainer.classList.add('hidden');
        currentQuestionIndex++; displayCurrentQuestion();});
    const finishQuiz = () => {         if (quizTimerInterval) clearInterval(quizTimerInterval); quizTimerInterval = null;
        if(quizTimerContainer) quizTimerContainer.classList.add('hidden');
        if (quizSetsTodayParagraph) quizSetsTodayParagraph.classList.remove('hidden');
        if (geminiStatusDisplay) geminiStatusDisplay.classList.remove('hidden');

        if (currentQuizSet && currentQuizSet.length > 0) {
            currentQuizSet.forEach(q => { const qText = q.question.trim(); if (!userData.recentQuizQuestionTexts.includes(qText)) userData.recentQuizQuestionTexts.unshift(qText); });
            userData.recentQuizQuestionTexts = userData.recentQuizQuestionTexts.slice(0, MAX_RECENT_QUIZ_QUESTIONS);
        }

        let message = `Em đã hoàn thành bộ đề! Điểm: ${currentScore}/${currentQuizSet.length || QUIZ_SET_SIZE}.`;
        if (currentQuizSet.length > 0 && currentScore === currentQuizSet.length) {
            userData.points += (currentQuizSet.length * 10);
            message += ` Xuất sắc! Em được nhân đôi điểm thưởng!`;
            showGeneralPopup("Chúc mừng!", message, () => { quizArea.classList.add('hidden'); startQuizBtn.classList.remove('hidden'); startMiniGame(); });
        } else {
             showGeneralPopup("Hoàn thành!", message, () => { quizArea.classList.add('hidden'); startQuizBtn.classList.remove('hidden'); });
        }

        userData.quizSetsToday++;
        quizSetsTodayDisplay.textContent = userData.quizSetsToday;

        if (userData.quizSetsToday > 0 && userData.quizSetsToday % 2 === 0) {
            userData.luckySpins = (userData.luckySpins || 0) + 1;
            showGeneralPopup("Phần thưởng!", "Chúc mừng! Em nhận được 1 lượt Vòng Quay May Mắn vì đã hoàn thành 2 bộ đề!");
        }
        updateDashboardUI(); saveUserData(currentUserName);};
    startQuizBtn.addEventListener('click', startNewQuiz);

    // --- MINI GAME ---
    const MINI_GAME_QUESTIONS = [ { question: "Nước nào có tên tiếng Anh là 'China'?", options: ["Nhật Bản", "Hàn Quốc", "Trung Quốc", "Thái Lan"], correct_index: 2, answer_translation: "Trung Quốc" },
        { question: "'Việt Nam' thuộc châu lục nào?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"], correct_index: 0, answer_translation: "Châu Á"},
        { question: "Thủ đô của 'Japan' (Nhật Bản) là gì?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correct_index: 2, answer_translation: "Tokyo"}];
    const handleMiniGameTimeUp = () => {         if (miniGameTimerInterval) clearInterval(miniGameTimerInterval); miniGameTimerInterval = null;
        if (!currentMiniGameQuestion) return;
        miniGameOptionsContainer.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        miniGameFeedback.innerHTML = `<span class="sad-face">😟 Hết giờ rồi!</span> Đáp án đúng là: ${currentMiniGameQuestion.options[currentMiniGameQuestion.correct_index]}.`;
        showFireworks(false); updateDashboardUI(); saveUserData(currentUserName);
        setTimeout(() => { miniGameArea.classList.add('hidden'); if(miniGameTimerContainer) miniGameTimerContainer.classList.add('hidden'); }, 5000);};
    const startMiniGame = () => {         if (miniGameTimerInterval) clearInterval(miniGameTimerInterval);
        const recentMiniTextsNormalized = new Set(userData.recentMiniGameQuestionTexts.map(text => text.trim().toLowerCase()));
        let availableMiniGameQs = MINI_GAME_QUESTIONS.filter(q => !recentMiniTextsNormalized.has(q.question.trim().toLowerCase()));
        if (availableMiniGameQs.length === 0) { console.warn("All mini-game Qs recent. Picking from full pool."); availableMiniGameQs = [...MINI_GAME_QUESTIONS]; }
        currentMiniGameQuestion = availableMiniGameQs[Math.floor(Math.random() * availableMiniGameQs.length)];
        if (!currentMiniGameQuestion && MINI_GAME_QUESTIONS.length > 0) currentMiniGameQuestion = MINI_GAME_QUESTIONS[Math.floor(Math.random() * MINI_GAME_QUESTIONS.length)];
        if (!currentMiniGameQuestion) { showGeneralPopup("Lỗi", "Không thể tải câu hỏi mini-game."); miniGameArea.classList.add('hidden'); if(miniGameTimerContainer) miniGameTimerContainer.classList.add('hidden'); return; }

        miniGameArea.classList.remove('hidden'); miniGameQuestionText.textContent = currentMiniGameQuestion.question;
        miniGameOptionsContainer.innerHTML = '';
        currentMiniGameQuestion.options.forEach((opt, idx) => {
            const btn = document.createElement('button'); btn.classList.add('option-btn'); btn.textContent = opt;
            btn.onclick = () => handleMiniGameAnswer(idx === currentMiniGameQuestion.correct_index, currentMiniGameQuestion);
            miniGameOptionsContainer.appendChild(btn);
        });
        miniGameFeedback.textContent = ''; miniGameTimeRemaining = MINI_GAME_TIME_LIMIT;
        if (miniGameTimerDisplay) miniGameTimerDisplay.textContent = miniGameTimeRemaining;
        if (miniGameTimerContainer) miniGameTimerContainer.classList.remove('hidden');
        miniGameTimerInterval = setInterval(() => {
            miniGameTimeRemaining--; if (miniGameTimerDisplay) miniGameTimerDisplay.textContent = miniGameTimeRemaining;
            if (miniGameTimeRemaining <= 0) handleMiniGameTimeUp();
        }, 1000);};
    const handleMiniGameAnswer = (isCorrect, question, timeUp = false) => {         if (miniGameTimerInterval) clearInterval(miniGameTimerInterval); miniGameTimerInterval = null;
        if(miniGameTimerContainer) miniGameTimerContainer.classList.add('hidden');
        if (question && question.question) {
            const qText = question.question.trim();
            if (!userData.recentMiniGameQuestionTexts.includes(qText)) userData.recentMiniGameQuestionTexts.unshift(qText);
            userData.recentMiniGameQuestionTexts = userData.recentMiniGameQuestionTexts.slice(0, MAX_RECENT_MINI_GAME_QUESTIONS);
        }
        miniGameOptionsContainer.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        if (timeUp) { miniGameFeedback.innerHTML = `<span class="sad-face">😟 Hết giờ rồi!</span> Đáp án đúng là: ${question.options[question.correct_index]}.`; showFireworks(false); }
        else if (isCorrect) {
            miniGameFeedback.innerHTML = `<span class="fireworks">🎉 Tuyệt vời!</span> Em nhận được 1 mảnh ghép thú cưng ngẫu nhiên!`;
            const randomPet = STORE_ITEMS.pets.find(p => p.maxPieces > 1 && (!userData.pets.find(up => up.id === p.id) || (userData.pets.find(up => up.id === p.id) && !userData.pets.find(up => up.id === p.id).owned && userData.pets.find(up => up.id === p.id).pieces < p.maxPieces)));
            if (randomPet) { addPetPiece(randomPet.id); miniGameFeedback.innerHTML += `<br>Em nhận được 1 mảnh ghép của ${randomPet.name}!`; }
            else { userData.points += 100; miniGameFeedback.innerHTML += `<br>Em được thưởng 100 điểm! (Không tìm thấy mảnh ghép phù hợp)`; }
            showFireworks(true);
        } else { miniGameFeedback.innerHTML = `<span class="sad-face">😟 Tiếc quá!</span> Đáp án đúng là: ${question.options[question.correct_index]}.`; showFireworks(false); }
        updateDashboardUI(); saveUserData(currentUserName);
        setTimeout(() => { miniGameArea.classList.add('hidden'); }, 5000);};

    // --- STORE & GAMIFICATION ---
    const getHighestTierWithAnyOwnedPet = () => { 
        let maxTier = 0;
        if (userData && userData.pets) {
            userData.pets.forEach(userPet => {
                if (userPet.owned) {
                    const storePet = STORE_ITEMS.pets.find(sp => sp.id === userPet.id);
                    if (storePet && storePet.tier > maxTier) {
                        maxTier = storePet.tier;
                    }
                }
            });
        }
        return maxTier;
    };

    const getHighestTierWithAllPetsOwned = () => {
        let maxTier = 0;
        if (userData && userData.pets) {
            const maxPossibleTier = Math.max(...STORE_ITEMS.pets.map(p => p.tier), 0);
            for (let i = 1; i <= maxPossibleTier; i++) {
                if (checkAllPetsOwnedByTier(i)) {
                    maxTier = i;
                } else {
                    break; 
                }
            }
        }
        return maxTier;
    };


    const checkAllPetsOwnedByTier = (tier) => {
        const petsOfTier = STORE_ITEMS.pets.filter(p => p.tier === tier);
        if (petsOfTier.length === 0) {
           return tier > 0;
        }
        return petsOfTier.every(p => {
            const userPet = userData.pets.find(up => up.id === p.id);
            return userPet && userPet.owned;
        });
    };
    const checkFirstPetOwnedByTier = (tier) => { return userData.pets.some(p => { const storePet = STORE_ITEMS.pets.find(sp => sp.id === p.id); return storePet && storePet.tier === tier && p.owned; }); };
    const equipItemToPet = (itemUniqueId, itemType, petId) => {         const pet = userData.pets.find(p => p.id === petId && p.owned);
        if (!pet) {
            showGeneralPopup("Lỗi", "Không tìm thấy thú cưng này hoặc em chưa sở hữu nó.");
            return false;
        }

        const itemInInventory = userData.inventory[itemType === 'accessory' ? 'accessories' : 'skills']
            .find(invItem => invItem.uniqueId === itemUniqueId);

        if (!itemInInventory || itemInInventory.isEquipped) { 
            showGeneralPopup("Lỗi", "Vật phẩm không tồn tại trong kho hoặc đã được trang bị cho thú cưng khác.");
            return false;
        }

        const targetEquipArray = itemType === 'accessory' ? pet.equippedAccessories : pet.equippedSkills;
        const maxEquipped = itemType === 'accessory' ? MAX_EQUIPPED_ACCESSORIES_PER_PET : MAX_EQUIPPED_SKILLS_PER_PET;

        if (targetEquipArray.length >= maxEquipped) {
            showGeneralPopup("Giới hạn trang bị", `${pet.name} đã trang bị đủ ${maxEquipped} ${itemType === 'accessory' ? 'phụ kiện' : 'kỹ năng'}.`);
            return false;
        }

        targetEquipArray.push(itemUniqueId);
        itemInInventory.isEquipped = true; 
        itemInInventory.equippedTo = petId; 

        const storeItem = STORE_ITEMS[itemType === 'accessory' ? 'accessories' : 'skills'].find(i => i.id === itemInInventory.id);
        showGeneralPopup("Thành công", `Đã gắn ${storeItem.name} cho ${pet.name}!`);
        saveUserData(currentUserName);
        if (document.getElementById('collections-screen').classList.contains('active')) renderCollections(); 
        if (document.getElementById('store-screen').classList.contains('active')) renderStore(); 
        return true;};

    const renderStoreCategory = (tabElement, items, type) => {
        tabElement.innerHTML = '';

        if (type === 'pet') {
            const highestTierFullyCompleted = getHighestTierWithAllPetsOwned();
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('store-item');
                let detailsHtml = '';
                const userPet = userData.pets.find(p => p.id === item.id);
                const isOwned = userPet && userPet.owned;

                if (item.tier > highestTierFullyCompleted + 1 && !(highestTierFullyCompleted === 0 && item.tier === 2) && item.tier !==1) {
                    return; 
                }
                 if (item.tier === 1 && item.id !== 'bao_thu_pet' && !item.unlockCondition()){ 
                 }

                let iconHtmlToRender;
                let displayName = item.name;
                let displayPriceText;
                let buttonText;
                let canBuy = true;
                let currentPriceForButton = item.pricePerPiece || item.price;

                if (isOwned) {
                    iconHtmlToRender = item.icon && item.icon.includes('/') ?
                               `<img src="${item.icon}" alt="${item.name}" class="item-icon">` :
                               `<div class="item-icon emoji-icon">${item.icon || '🐾'}</div>`;
                    buttonText = "Đã sở hữu";
                    canBuy = false;
                    itemDiv.classList.add('owned-pet-in-store');
                    displayPriceText = item.maxPieces > 1 ? `${item.pricePerPiece} 🌟/mảnh` : `${item.price} 🌟`;
                     if (item.maxPieces > 1) { 
                        detailsHtml += `<p>(${userPet?.pieces || 0}/${item.maxPieces} mảnh)</p>`;
                    }
                } else { 
                    if (item.unlockCondition()) { 
                        displayName = item.name;
                        if (item.tier > 1) {
                            iconHtmlToRender = `<div class="item-icon emoji-icon">❓</div>`;
                        } else {
                            iconHtmlToRender = item.icon && item.icon.includes('/') ?
                                          `<img src="${item.icon}" alt="${item.name}" class="item-icon">` :
                                          `<div class="item-icon emoji-icon">${item.icon || '🐾'}</div>`;
                        }

                        if (item.maxPieces > 1) {
                            currentPriceForButton = item.pricePerPiece;
                            displayPriceText = `${currentPriceForButton} 🌟/mảnh`;
                            buttonText = `Mua mảnh (${currentPriceForButton} 🌟)`;
                            canBuy = userData.points >= currentPriceForButton;
                            detailsHtml += `<p>(${userPet?.pieces || 0}/${item.maxPieces} mảnh)</p>`;
                        } else {
                            currentPriceForButton = item.price;
                            displayPriceText = `${currentPriceForButton} 🌟`;
                            buttonText = `Mua (${currentPriceForButton} 🌟)`;
                            canBuy = userData.points >= currentPriceForButton;
                        }
                    } else { 
                        itemDiv.classList.add('mystery-pet');
                        iconHtmlToRender = `<div class="item-icon emoji-icon">❓</div>`;
                        displayName = "Thú Cưng Bí Ẩn";
                        displayPriceText = "??? 🌟";
                        buttonText = "Khám Phá Sau";
                        canBuy = false;
                        const previousTier = item.tier - 1;
                        if (previousTier > 0) {
                            detailsHtml += `<p style="font-size:0.8em;">Yêu cầu: Sưu tập đủ thú cưng cấp ${previousTier}</p>`;
                        } else if (item.tier === 1 && item.id !== 'bao_thu_pet') { 
                            detailsHtml += `<p style="font-size:0.8em;">Yêu cầu đặc biệt</p>`;
                        }
                         itemDiv.classList.add('locked'); 
                    }
                }

                itemDiv.innerHTML = `
                    ${iconHtmlToRender}
                    <h4>${displayName}</h4>
                    ${detailsHtml}
                    <p>Giá: ${displayPriceText}</p>
                    <p style="font-size:0.8em;">Cấp: ${item.tier}</p>
                    <button class="buy-btn" data-id="${item.id}" data-type="pet" data-price="${currentPriceForButton}" ${canBuy ? '' : 'disabled'}>
                        ${buttonText}
                    </button>`;
                tabElement.appendChild(itemDiv);
            });
        } else if (type === 'careItem') { // MODIFIED for new care items
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('store-item');

                const isUnlocked = item.unlockCondition ? item.unlockCondition.call(item) : checkFirstPetOwnedByTier(item.tier); // Use .call(item) to set 'this' context

                let iconHtmlToRender = item.icon && item.icon.includes('/') ?
                                     `<img src="${item.icon}" alt="${item.name}" class="item-icon">` :
                                     `<div class="item-icon emoji-icon">${item.icon || '🎁'}</div>`;
                
                if (!isUnlocked) {
                    itemDiv.classList.add('locked');
                    iconHtmlToRender = `<div class="item-icon emoji-icon">🔒</div>`;
                     itemDiv.innerHTML = `${iconHtmlToRender}
                                         <h4>${item.name}</h4>
                                         <p style="font-size:0.8em;">Cấp ${item.tier} yêu cầu thú cưng cấp ${item.tier}.</p>
                                         <button class="buy-btn" disabled>Chưa mở khóa</button>`;
                    tabElement.appendChild(itemDiv);
                    return; 
                }
                
                const inventoryItem = userData.inventory.careItems.find(ci => ci.id === item.id);
                const ownedQuantity = inventoryItem ? inventoryItem.quantity : 0;
                let currentPrice = item.price;
                let buttonText = `Mua (${currentPrice} 🌟)`;
                let canBuy = userData.points >= currentPrice;

                itemDiv.innerHTML = `
                    ${iconHtmlToRender}
                    <h4>${item.name}</h4>
                    <p style="font-size:0.8em;">Loại: ${item.type === 'food' ? 'Thức ăn' : 'Nước uống'}</p>
                    <p style="font-size:0.8em;">Dùng cho Cấp ${item.tier}+</p>
                    <p>Hồi phục: +${item.healthRestore || 0} SN</p>
                    <p>Đã có: ${ownedQuantity}</p>
                    <p>Giá: ${currentPrice} 🌟</p>
                    <button class="buy-btn" data-id="${item.id}" data-type="careItem" data-price="${currentPrice}" ${canBuy ? '' : 'disabled'}>
                        ${buttonText}
                    </button>`;
                tabElement.appendChild(itemDiv);
            });

        } else { // For accessories, skills
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('store-item');
                let detailsHtml = ''; 

                const baseIconHtml = item.icon && item.icon.includes('/') ?
                                 `<img src="${item.icon}" alt="${item.name}" class="item-icon">` :
                                 `<div class="item-icon emoji-icon">${item.icon || '🎁'}</div>`;
                let iconHtmlToRender = baseIconHtml;
                let currentPrice = item.price;
                let buttonText;
                let canBuy = true;

                if (!item.unlockCondition()) {
                    itemDiv.classList.add('locked');
                    iconHtmlToRender = `<div class="item-icon emoji-icon">${item.icon && item.icon.includes('/') ? '🔒' : (item.icon && !item.icon.startsWith('Images/') ? item.icon : '🔒')}</div>`;
                     itemDiv.innerHTML = `${iconHtmlToRender}
                                         <h4>${item.name}</h4>
                                         <p style="font-size:0.8em;">Cần mở khóa điều kiện trước.</p>
                                         <button class="buy-btn" disabled>Chưa mở khóa</button>`;
                    tabElement.appendChild(itemDiv);
                    return; 
                }

                if (type === 'accessory' || type === 'skill') {
                    const collection = type === 'accessory' ? userData.inventory.accessories : userData.inventory.skills;
                    const ownedCount = collection.filter(invItem => invItem.id === item.id).length;
                    detailsHtml += `<p>Đã có: ${ownedCount}/${MAX_ITEMS_PER_TYPE}</p>`;
                    if (ownedCount >= MAX_ITEMS_PER_TYPE) {
                        buttonText = "Đã mua tối đa";
                        canBuy = false;
                    } else {
                        buttonText = `Mua (${currentPrice} 🌟)`;
                        canBuy = userData.points >= currentPrice;
                    }
                } 

                if (item.healthDecayReduction) {
                    detailsHtml += `<p style="font-size:0.8em; color:green;">Giảm ${item.healthDecayReduction * 100}% hao SN</p>`;
                }

                itemDiv.innerHTML = `
                    ${iconHtmlToRender}
                    <h4>${item.name}</h4>
                    ${detailsHtml}
                    <p>Giá: ${currentPrice} 🌟</p>
                    <button class="buy-btn" data-id="${item.id}" data-type="${type}" data-price="${currentPrice}" ${canBuy ? '' : 'disabled'}>
                        ${buttonText}
                    </button>`;
                tabElement.appendChild(itemDiv);
            });
        }

        tabElement.querySelectorAll('.buy-btn:not([data-type="pet_mystery"])').forEach(button => {
            button.addEventListener('click', handleBuyItem);
        });
    };


    const handleBuyItem = (e) => {
        const itemId = e.target.dataset.id;
        const itemType = e.target.dataset.type;

        if (itemType === 'pet') {
            const storePet = STORE_ITEMS.pets.find(p => p.id === itemId);
            let userPet = userData.pets.find(p => p.id === itemId);

            if (userPet && userPet.owned) {
                showGeneralPopup("Thông báo", `Em đã sở hữu ${storePet.name} rồi.`);
                return;
            }

            if (storePet.maxPieces === 1) { 
                const cost = storePet.price;
                if (userData.points >= cost) {
                    userData.points -= cost;
                    if (!userPet) {
                        userPet = { id: itemId, name: storePet.name, tier: storePet.tier, pieces: storePet.maxPieces, maxPieces: storePet.maxPieces, owned: true, icon: storePet.icon, health: 100, lastFedTime: 0, lastWateredTime: 0, lastHealthUpdateTime: Date.now(), equippedAccessories: [], equippedSkills: [] };
                        userData.pets.push(userPet);
                    } else { 
                        userPet.owned = true; userPet.pieces = storePet.maxPieces; userPet.health = 100; userPet.lastHealthUpdateTime = Date.now();
                    }
                    showGeneralPopup("Thú Cưng Mới!", `Chúc mừng! Em đã sở hữu ${storePet.name}!`);
                    checkAndUnlockAchievements();
                } else {
                    showGeneralPopup("Không đủ điểm", `Em không đủ điểm 🌟 để mua ${storePet.name}.`); return;
                }
            } else { 
                const piecePrice = storePet.pricePerPiece;
                const maxCanBuyWithPoints = Math.floor(userData.points / piecePrice);
                if (maxCanBuyWithPoints === 0) {
                    showGeneralPopup("Không đủ điểm", `Em không đủ điểm 🌟 để mua mảnh ${storePet.name}.`); return;
                }
                let currentPieces = userPet ? userPet.pieces : 0;
                let maxPiecesNeeded = storePet.maxPieces - currentPieces;
                if (maxPiecesNeeded <= 0) { showGeneralPopup("Thông báo", `Em đã có đủ mảnh cho ${storePet.name} rồi.`); return; }
                const actualMaxCanBuy = Math.min(maxCanBuyWithPoints, maxPiecesNeeded, 50); 
                if (actualMaxCanBuy <= 0) { showGeneralPopup("Thông báo", `Không thể mua thêm mảnh ${storePet.name}.`); return; }

                showGeneralPopup(
                    `Mua mảnh ${storePet.name}`,
                    `Em muốn mua bao nhiêu mảnh ${storePet.name}? (Tối đa: ${actualMaxCanBuy})<br>
                     Giá mỗi mảnh: ${piecePrice} 🌟<br>
                     <input type="number" id="buy-quantity-input" value="1" min="1" max="${actualMaxCanBuy}" style="margin-top:10px; padding:5px; width:60px;">`,
                    () => {
                        const quantityInput = document.getElementById('buy-quantity-input');
                        const quantity = parseInt(quantityInput.value);
                        if (isNaN(quantity) || quantity < 1 || quantity > actualMaxCanBuy) {
                            showGeneralPopup("Số lượng không hợp lệ", `Vui lòng nhập số lượng từ 1 đến ${actualMaxCanBuy}.`); return;
                        }
                        const totalCost = quantity * piecePrice;
                        if (userData.points >= totalCost) {
                            userData.points -= totalCost;
                            if (!userPet) {
                                userPet = { id: itemId, name: storePet.name, tier: storePet.tier, pieces: 0, maxPieces: storePet.maxPieces, owned: false, icon: storePet.icon, health: 100, lastFedTime: 0, lastWateredTime: 0, lastHealthUpdateTime: Date.now(), equippedAccessories: [], equippedSkills: [] };
                                userData.pets.push(userPet);
                            }
                            userPet.pieces += quantity;
                            if (userPet.pieces >= storePet.maxPieces) {
                                userPet.owned = true; userPet.pieces = storePet.maxPieces; userPet.health = 100; userPet.lastHealthUpdateTime = Date.now();
                                showGeneralPopup("Thú Cưng Mới!", `Chúc mừng! Em đã ghép thành công ${storePet.name}!`);
                                checkAndUnlockAchievements();
                            } else {
                                showGeneralPopup("Mua Mảnh Ghép Thành Công!", `Em đã mua ${quantity} mảnh ghép cho ${storePet.name}.`);
                            }
                            updateDashboardUI(); renderStore(); saveUserData(currentUserName);
                        } else {
                            showGeneralPopup("Không đủ điểm", "Em không đủ điểm 🌟 để mua số lượng này.");
                        }
                    }, true
                );
                return; 
            }
        } else if (itemType === 'accessory' || itemType === 'skill') {
            const collection = itemType === 'accessory' ? userData.inventory.accessories : userData.inventory.skills;
            const storeItemDef = STORE_ITEMS[itemType === 'accessory' ? 'accessories' : 'skills'].find(i => i.id === itemId);
            const itemPrice = storeItemDef.price;
            const ownedCount = collection.filter(invItem => invItem.id === itemId).length;

            if (ownedCount >= MAX_ITEMS_PER_TYPE) {
                showGeneralPopup("Tối đa", `Em đã sở hữu tối đa ${MAX_ITEMS_PER_TYPE} ${storeItemDef.name} rồi.`); return;
            }
            const maxCanAfford = Math.floor(userData.points / itemPrice);
            const maxAllowedToBuy = MAX_ITEMS_PER_TYPE - ownedCount;
            const actualMaxCanBuy = Math.min(maxCanAfford, maxAllowedToBuy, MAX_ITEMS_PER_TYPE); 

            if (actualMaxCanBuy <= 0) {
                showGeneralPopup("Không thể mua", "Em không đủ điểm hoặc đã đạt giới hạn sở hữu cho vật phẩm này."); return;
            }

            showGeneralPopup(
                `Mua ${storeItemDef.name}`,
                `Em muốn mua bao nhiêu ${storeItemDef.name}? (Tối đa: ${actualMaxCanBuy})<br>
                 Giá mỗi cái: ${itemPrice} 🌟<br>
                 Đã có: ${ownedCount}/${MAX_ITEMS_PER_TYPE}<br>
                 <input type="number" id="buy-quantity-input" value="1" min="1" max="${actualMaxCanBuy}" style="margin-top:10px; padding:5px; width:60px;">`,
                () => {
                    const quantityInput = document.getElementById('buy-quantity-input');
                    const quantity = parseInt(quantityInput.value);
                    if (isNaN(quantity) || quantity < 1 || quantity > actualMaxCanBuy) {
                        showGeneralPopup("Số lượng không hợp lệ", `Vui lòng nhập số lượng từ 1 đến ${actualMaxCanBuy}.`); return;
                    }
                    const totalCost = quantity * itemPrice;
                    if (userData.points >= totalCost) {
                        userData.points -= totalCost;
                        for (let i = 0; i < quantity; i++) {
                            const uniqueId = `${itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${i}`;
                            collection.push({
                                id: itemId, uniqueId: uniqueId, name: storeItemDef.name, icon: storeItemDef.icon,
                                healthDecayReduction: storeItemDef.healthDecayReduction || 0,
                                isEquipped: false, equippedTo: null
                            });
                        }
                        showGeneralPopup("Mua Thành Công!", `Em đã mua ${quantity} ${storeItemDef.name}.`);
                        updateDashboardUI(); renderStore(); saveUserData(currentUserName);
                    } else {
                        showGeneralPopup("Không đủ điểm", "Em không đủ điểm 🌟 để mua số lượng này.");
                    }
                }, true
            );
            return; 
        } else if (itemType === 'careItem') { // MODIFIED for new care items
            const storeItemDef = STORE_ITEMS.careItems.find(ci => ci.id === itemId);
            const itemPrice = storeItemDef.price;
            const maxCanBuyWithPoints = Math.floor(userData.points / itemPrice);
            if (maxCanBuyWithPoints === 0) {
                showGeneralPopup("Không đủ điểm", `Em không đủ điểm 🌟 để mua ${storeItemDef.name}.`); return;
            }
            const actualMaxCanBuy = Math.min(maxCanBuyWithPoints, 50); // Limit to 50 items per transaction
            
            let inventoryItem = userData.inventory.careItems.find(ci => ci.id === itemId);
            const currentQuantityInInventory = inventoryItem ? inventoryItem.quantity : 0;

            showGeneralPopup(
                `Mua ${storeItemDef.name}`,
                `Em muốn mua bao nhiêu ${storeItemDef.name}? (Tối đa: ${actualMaxCanBuy})<br>
                 Giá mỗi cái: ${itemPrice} 🌟<br>
                 Đã có: ${currentQuantityInInventory}<br>
                 <input type="number" id="buy-quantity-input" value="1" min="1" max="${actualMaxCanBuy}" style="margin-top:10px; padding:5px; width:60px;">`,
                () => {
                    const quantityInput = document.getElementById('buy-quantity-input');
                    const quantityToBuy = parseInt(quantityInput.value);
                    if (isNaN(quantityToBuy) || quantityToBuy < 1 || quantityToBuy > actualMaxCanBuy) {
                        showGeneralPopup("Số lượng không hợp lệ", `Vui lòng nhập số lượng từ 1 đến ${actualMaxCanBuy}.`); return;
                    }
                    const totalCost = quantityToBuy * itemPrice;
                    if (userData.points >= totalCost) {
                        userData.points -= totalCost;
                        if (!inventoryItem) {
                            inventoryItem = { id: itemId, quantity: 0 };
                            userData.inventory.careItems.push(inventoryItem);
                        }
                        inventoryItem.quantity += quantityToBuy;
                        showGeneralPopup("Mua Thành Công!", `Em đã mua ${quantityToBuy} ${storeItemDef.name}.`);
                        updateDashboardUI(); renderStore(); saveUserData(currentUserName);
                    } else {
                        showGeneralPopup("Không đủ điểm", "Em không đủ điểm 🌟 để mua số lượng này.");
                    }
                }, true
            );
            return; 
        }
        updateDashboardUI();
        renderStore();
        saveUserData(currentUserName);
    };
    const renderStore = () => { renderStoreCategory(petsStoreTab, STORE_ITEMS.pets, 'pet'); renderStoreCategory(accessoriesStoreTab, STORE_ITEMS.accessories, 'accessory'); renderStoreCategory(skillsStoreTab, STORE_ITEMS.skills, 'skill'); renderStoreCategory(careItemsStoreTab, STORE_ITEMS.careItems, 'careItem'); updateSpinUI(); };
    storeTabs.forEach(tab => { tab.addEventListener('click', () => { storeTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); storeTabContents.forEach(content => content.classList.remove('active')); document.getElementById(tab.dataset.tab).classList.add('active'); }); });
    const addPetPiece = (petId) => {         const storePet = STORE_ITEMS.pets.find(p => p.id === petId); if (!storePet || storePet.maxPieces <= 1) return;
        let userPet = userData.pets.find(p => p.id === petId);
        if (!userPet) {
            userPet = { id: petId, name: storePet.name, tier: storePet.tier, pieces: 0, maxPieces: storePet.maxPieces, owned: false, icon: storePet.icon, health: 100, lastFedTime: 0, lastWateredTime: 0, lastHealthUpdateTime: Date.now(), equippedAccessories: [], equippedSkills: [] };
            userData.pets.push(userPet);
        }
        if (!userPet.owned && userPet.pieces < storePet.maxPieces) {
            userPet.pieces++;
            if (userPet.pieces >= storePet.maxPieces) {
                userPet.owned = true; userPet.health = 100; userPet.lastHealthUpdateTime = Date.now();
                showGeneralPopup("Thú Cưng Mới!", `Chúc mừng! Em đã ghép thành công ${storePet.name} từ mảnh ghép!`);
                checkAndUnlockAchievements();
            }
            saveUserData(currentUserName); if(document.getElementById('store-screen') && document.getElementById('store-screen').classList.contains('active')){ renderStore(); }
        }};
    const updateSpinUI = () => { spinCountDisplay.textContent = userData.luckySpins || 0; spinWheelBtn.disabled = !(userData.luckySpins > 0); };
    spinWheelBtn.addEventListener('click', () => {         if (userData.luckySpins > 0) {
            userData.luckySpins--; spinResultDisplay.textContent = "Đang quay...";
            setTimeout(() => {
                const rewards = [ { type: 'points', value: 50, text: "50 điểm 🌟" }, { type: 'points', value: 100, text: "100 điểm 🌟" }, { type: 'pet_piece', text: "1 mảnh ghép thú cưng ngẫu nhiên" }, { type: 'accessory', text: "1 phụ kiện ngẫu nhiên" }, ];
                const randomReward = rewards[Math.floor(Math.random() * rewards.length)]; let rewardText = `Chúc mừng! Em đã trúng: ${randomReward.text}!`;
                if (randomReward.type === 'points') { userData.points += randomReward.value; }
                else if (randomReward.type === 'pet_piece') {
                    const availablePetsForPieces = STORE_ITEMS.pets.filter(p => p.maxPieces > 1 && (!userData.pets.find(up => up.id === p.id || (up.id === p.id && !up.owned))));
                    if (availablePetsForPieces.length > 0) { const petToGetPiece = availablePetsForPieces[Math.floor(Math.random() * availablePetsForPieces.length)]; addPetPiece(petToGetPiece.id); rewardText = `Chúc mừng! Em trúng 1 mảnh ghép của ${petToGetPiece.name}!`; }
                    else { userData.points += 50; rewardText = "Em trúng 50 điểm 🌟 (không có mảnh ghép phù hợp)!"; }
                } else if (randomReward.type === 'accessory') {
                    const unownedAccessories = STORE_ITEMS.accessories.filter(acc => acc.unlockCondition() &&
                        (userData.inventory.accessories.filter(ua => ua.id === acc.id).length < MAX_ITEMS_PER_TYPE) );
                    if (unownedAccessories.length > 0) {
                        const accToGet = unownedAccessories[Math.floor(Math.random() * unownedAccessories.length)];
                        const uniqueId = `${accToGet.id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                        userData.inventory.accessories.push({ id: accToGet.id, uniqueId: uniqueId, name: accToGet.name, icon: accToGet.icon, healthDecayReduction: accToGet.healthDecayReduction || 0, isEquipped: false, equippedTo: null });
                        rewardText = `Chúc mừng! Em trúng phụ kiện: ${accToGet.name}!`;
                    } else { userData.points += 70; rewardText = "Em trúng 70 điểm 🌟 (không có phụ kiện phù hợp hoặc đã đủ số lượng)!"; }
                }
                spinResultDisplay.textContent = rewardText; updateDashboardUI(); updateSpinUI(); saveUserData(currentUserName);
            }, 1500);
        }});
    const checkDailyLogin = () => {         const today = getTodayDateString();
        if (userData.lastLoginDate !== today) {
            userData.lastLoginDate = today; userData.quizSetsToday = 0; generateDailyTasks();
            const loginPoints = 50 + Math.floor(Math.random() * 51); userData.points += loginPoints;
            showGeneralPopup("Chào mừng trở lại!", `Chúc mừng ${userData.name}! Em nhận được ${loginPoints} điểm 🌟 đăng nhập hôm nay!`);
            updateAllPetsHealth();
            saveUserData(currentUserName);
        }};

    // --- ACHIEVEMENTS & CHIEN TUONG ---
    const getChienTuongMaxStars = () => {
        let maxStars = 0;
        if (userData && userData.titles) {
            userData.titles.forEach(title => {
                if (title.unlocked && title.stars > maxStars) {
                    maxStars = title.stars;
                }
            });
        }
        return maxStars;
    };

    const renderChienTuong = (starsToDisplay, animateNewStars = false, oldStars = 0) => {
        if (chienTuongAvatar && userData.avatar) chienTuongAvatar.src = userData.avatar;

        if (chienTuongStarsContainer) {
            chienTuongStarsContainer.innerHTML = ''; 
            for (let i = 0; i < 5; i++) {
                const starSpan = document.createElement('span');
                starSpan.classList.add('star');
                starSpan.textContent = '☆'; 

                if (i < starsToDisplay) {
                    starSpan.textContent = '★'; 
                    setTimeout(() => starSpan.classList.add('visible'), (animateNewStars && i >= oldStars) ? (i - oldStars) * 150 : 0);

                    if (animateNewStars && i >= oldStars) {
                        setTimeout(() => {
                            starSpan.classList.add('upgrading');
                            setTimeout(() => starSpan.classList.remove('upgrading'), 700); 
                        }, (i - oldStars) * 150 + 50); 
                    }
                }
                chienTuongStarsContainer.appendChild(starSpan);
            }
        }

        if (chienTuongLevelName) {
            const gradeLevelKey = userData.age <= 10 ? 'level1' : 'level2';
            const relevantTitles = ALL_TITLES[gradeLevelKey] || [];
            const highestUnlockedTitles = userData.titles.filter(t => t.unlocked && t.stars === starsToDisplay);
            let displayTitle = null;
            if (highestUnlockedTitles.length > 0) {
                highestUnlockedTitles.sort((a,b) => (relevantTitles.findIndex(x => x.id === a.id)) - (relevantTitles.findIndex(x => x.id === b.id)));
                displayTitle = highestUnlockedTitles[0];
            }
            chienTuongLevelName.textContent = displayTitle ? displayTitle.name : (starsToDisplay > 0 ? `${starsToDisplay} Sao` : 'Chưa có');
        }

        if (chienTuongChienLucValue) {
            const quizPoints = userData.quizScorePoints || 0;
            chienTuongChienLucValue.textContent = quizPoints;
            chienTuongChienLucValue.style.color = '';
            chienTuongChienLucValue.style.backgroundColor = '';
            chienTuongChienLucValue.style.padding = '2px 6px'; 
            chienTuongChienLucValue.style.borderRadius = '4px'; 

            if (quizPoints < 1000) {
                chienTuongChienLucValue.style.color = 'white';
                chienTuongChienLucValue.style.backgroundColor = '#555';
            } else if (quizPoints < 10000) {
                chienTuongChienLucValue.style.color = 'green';
                 chienTuongChienLucValue.style.backgroundColor = 'transparent'; 
            } else if (quizPoints < 100000) {
                chienTuongChienLucValue.style.color = 'blue';
                 chienTuongChienLucValue.style.backgroundColor = 'transparent';
            } else { 
                chienTuongChienLucValue.style.color = 'purple';
                 chienTuongChienLucValue.style.backgroundColor = 'transparent';
            }
        }
    };

    const triggerChienTuongParticleEffect = () => {
        if (!chienTuongUpgradeEffectContainer || !chienTuongAvatar) return;
        chienTuongUpgradeEffectContainer.innerHTML = ''; 

        const numParticles = 25;
        const avatarRect = chienTuongAvatar.getBoundingClientRect();
        const containerRect = chienTuongUpgradeEffectContainer.getBoundingClientRect();

        const centerX = avatarRect.left - containerRect.left + avatarRect.width / 2;
        const centerY = avatarRect.top - containerRect.top + avatarRect.height / 2;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('star-particle');

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;

            const angle = Math.random() * 2 * Math.PI;
            const distance = 60 + Math.random() * 120; 
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.animationDelay = `${Math.random() * 0.3}s`; 

            chienTuongUpgradeEffectContainer.appendChild(particle);
            setTimeout(() => {
                if (chienTuongUpgradeEffectContainer.contains(particle)) {
                    chienTuongUpgradeEffectContainer.removeChild(particle);
                }
            }, 1300); 
        }
    };


    const checkAndUnlockAchievements = () => {
        const gradeLevelKey = userData.age <= 10 ? 'level1' : 'level2';
        let newAchievementUnlockedThisCheck = false;

        if (!Array.isArray(userData.titles) || userData.titles.length === 0 ||
            (userData.titles[0] && ALL_TITLES[gradeLevelKey] && !ALL_TITLES[gradeLevelKey].find(t => t.id === userData.titles[0].id))) {
            if (ALL_TITLES[gradeLevelKey]) {
                const currentTitlesFromStorage = userData.titles || [];
                userData.titles = ALL_TITLES[gradeLevelKey].map(t => {
                    const existingTitle = currentTitlesFromStorage.find(ut => ut.id === t.id);
                    return { ...t, unlocked: existingTitle ? existingTitle.unlocked : false, autoUnlock: t.autoUnlock === undefined ? false : t.autoUnlock };
                });
            } else {
                userData.titles = [];
            }
             newAchievementUnlockedThisCheck = true; 
        }

        const previousChienTuongStars = userData.chienTuongStars || 0;

        userData.titles.forEach(title => {
            if (!title.unlocked) {
                let shouldUnlock = false;
                if (title.conditionPetId) { const pet = userData.pets.find(p => p.id === title.conditionPetId && p.owned); if (pet) shouldUnlock = true; }
                else if (title.conditionPetTier) { if (checkFirstPetOwnedByTier(title.conditionPetTier)) shouldUnlock = true; }
                else if (title.conditionAllPetsOwnedByTier) { if(checkAllPetsOwnedByTier(title.conditionAllPetsOwnedByTier)) shouldUnlock = true; }

                if (shouldUnlock && title.autoUnlock) {
                    title.unlocked = true;
                    if (!userData.currentTitle || (ALL_TITLES[gradeLevelKey].find(t => t.name === userData.currentTitle)?.stars || 0) < title.stars) {
                         userData.currentTitle = title.name; 
                    }
                    showGeneralPopup("Thành Tích Mới!", `🎉 Chúc mừng! Em đã mở khóa danh hiệu: "${title.name}" (${title.stars} sao) 🎉`);
                    showFireworks(true);
                    newAchievementUnlockedThisCheck = true;
                }
            }
        });

        const newMaxStars = getChienTuongMaxStars();

        if (newMaxStars > previousChienTuongStars) {
            userData.chienTuongStars = newMaxStars;
            if (document.getElementById('achievements-screen').classList.contains('active')) {
                renderChienTuong(newMaxStars, true, previousChienTuongStars);
                triggerChienTuongParticleEffect();
            }
            showGeneralPopup("Chiến Tướng Thăng Cấp!", `🌟 Chúc mừng! Chiến Tướng của em đã đạt ${newMaxStars} sao! 🌟`);
            newAchievementUnlockedThisCheck = true;
        }

        if (newAchievementUnlockedThisCheck) {
            updateDashboardUI();
            if (document.getElementById('achievements-screen').classList.contains('active')) {
                 renderAchievements(); 
            }
            if (document.getElementById('collections-screen').classList.contains('active')) {
                renderCollections();
            }
            saveUserData(currentUserName);
        }
    };

    const renderLeaderboard = () => {
        if (!leaderboardList || !currentUserRankInfo) return;

        leaderboardList.innerHTML = '';
        currentUserRankInfo.innerHTML = '';
        const allPlayers = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('hocCungCoSarahData_')) {
                try {
                    const playerDataString = localStorage.getItem(key);
                    const playerData = JSON.parse(playerDataString);
                    if (playerData && typeof playerData.name === 'string' && typeof playerData.quizScorePoints === 'number') {
                        allPlayers.push({
                            name: playerData.name,
                            chienLuc: playerData.quizScorePoints
                        });
                    }
                } catch (e) {
                    console.warn(`Could not parse player data for key ${key}:`, e);
                }
            }
        }

        allPlayers.sort((a, b) => b.chienLuc - a.chienLuc);

        const top10 = allPlayers.slice(0, 10);
        let currentUserInTop10 = false;
        let currentUserRank = -1;

        top10.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${player.name} - ${player.chienLuc} Chiến lực`;
            if (player.name.toLowerCase() === currentUserName.toLowerCase()) {
                li.classList.add('current-user-leaderboard');
                currentUserInTop10 = true;
                currentUserRank = index + 1;
            }
            leaderboardList.appendChild(li);
        });

        if (top10.length === 0) {
            leaderboardList.innerHTML = '<li>Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!</li>';
        }


        if (!currentUserInTop10) {
            const userRankIndex = allPlayers.findIndex(p => p.name.toLowerCase() === currentUserName.toLowerCase());
            if (userRankIndex !== -1) {
                currentUserRank = userRankIndex + 1;
                 currentUserRankInfo.innerHTML = `Thứ hạng của em: <strong>#${currentUserRank}</strong> với ${userData.quizScorePoints} Chiến lực.`;
            } else {
                 currentUserRankInfo.innerHTML = `Em chưa có mặt trên bảng xếp hạng. Cố gắng hơn nhé!`;
            }
        } else {
            currentUserRankInfo.innerHTML = `Em đang ở hạng <strong>#${currentUserRank}</strong> trong Top 10!`;
        }
         if (allPlayers.length > 10 && top10.length < 10) {
        } else if (allPlayers.length <= 10 && allPlayers.length > 0 && top10.length < allPlayers.length) {
        }


    };

    const renderAchievements = () => {
        const gradeLevelKey = userData.age <= 10 ? 'level1' : 'level2';
        if (!userData.titles || userData.titles.length === 0 ||
            (userData.titles[0] && ALL_TITLES[gradeLevelKey] && !ALL_TITLES[gradeLevelKey].find(t => t.id === userData.titles[0].id))) {
            if (ALL_TITLES[gradeLevelKey]) {
                const currentTitlesFromStorage = userData.titles || [];
                userData.titles = ALL_TITLES[gradeLevelKey].map(t => {
                     const existingTitle = currentTitlesFromStorage.find(ut => ut.id === t.id);
                     return { ...t, unlocked: existingTitle ? existingTitle.unlocked : false, autoUnlock: t.autoUnlock === undefined ? false : t.autoUnlock };
                });
                saveUserData(currentUserName);
            } else {
                userData.titles = [];
            }
        }
        renderChienTuong(userData.chienTuongStars);
        if (statsQuizSetsToday) statsQuizSetsToday.textContent = userData.quizSetsToday;
        if (statsDailyTasksCompleted) statsDailyTasksCompleted.textContent = userData.completedTasksToday;
        if (statsPetsOwnedCount) statsPetsOwnedCount.textContent = userData.pets.filter(p => p.owned).length;
        if (statsTitlesUnlockedCount) statsTitlesUnlockedCount.textContent = userData.titles.filter(t => t.unlocked).length;
        renderLeaderboard();
    };


    // --- PET HEALTH & CARE ---
    const updatePetHealth = (pet) => {         const now = Date.now();
        if (!pet.lastHealthUpdateTime) pet.lastHealthUpdateTime = now;

        let currentDecayRate = PET_HEALTH_DECAY_RATE_PER_HOUR;
        let totalReduction = 0;

        pet.equippedAccessories.forEach(accUniqueId => {
            const accessory = userData.inventory.accessories.find(invAcc => invAcc.uniqueId === accUniqueId);
            if (accessory && accessory.healthDecayReduction) {
                totalReduction += accessory.healthDecayReduction;
            }
        });
        pet.equippedSkills.forEach(skillUniqueId => {
            const skill = userData.inventory.skills.find(invSkill => invSkill.uniqueId === skillUniqueId);
            if (skill && skill.healthDecayReduction) {
                totalReduction += skill.healthDecayReduction;
            }
        });

        totalReduction = Math.min(totalReduction, 0.8);
        currentDecayRate = PET_HEALTH_DECAY_RATE_PER_HOUR * (1 - totalReduction);

        const hoursPassed = (now - pet.lastHealthUpdateTime) / (1000 * 60 * 60);
        const healthDecrease = Math.floor(hoursPassed * currentDecayRate);

        if (healthDecrease > 0) {
            pet.health = Math.max(0, pet.health - healthDecrease);
            pet.lastHealthUpdateTime = now - ((hoursPassed - Math.floor(hoursPassed)) * (1000 * 60 * 60));
        }
        return pet.health;};
    const updateAllPetsHealth = () => {         let changed = false;
        userData.pets.forEach(pet => {
            if (pet.owned) {
                const oldHealth = pet.health;
                updatePetHealth(pet);
                if (pet.health !== oldHealth) changed = true;
            }
        });
        if (changed) saveUserData(currentUserName);};
    const getPetHealthStatusText = (health) => {         if (health <= 20) return "Ngất xỉu 😵";
        if (health <= 40) return "Đuối lắm rồi 😩";
        if (health <= 60) return "Mệt quá 😥";
        if (health <= 80) return "Hơi mệt 😕";
        return "Sung mãn 💪";};
    
    const handleCarePet = (petId, careType) => {
        const pet = userData.pets.find(p => p.id === petId);
        if (!pet || !pet.owned) return;

        const petStoreInfo = STORE_ITEMS.pets.find(sp => sp.id === pet.id);
        if (!petStoreInfo) return;
        const petTier = petStoreInfo.tier;

        const suitableItemsInInventory = [];
        userData.inventory.careItems.forEach(invItem => {
            if (invItem.quantity > 0) {
                const storeItemDef = STORE_ITEMS.careItems.find(si => si.id === invItem.id);
                if (storeItemDef && storeItemDef.type === careType && storeItemDef.tier <= petTier) {
                    suitableItemsInInventory.push({ ...storeItemDef, inventoryQuantity: invItem.quantity });
                }
            }
        });

        if (suitableItemsInInventory.length === 0) {
            showGeneralPopup("Hết đồ dùng!", `Em không có ${careType === 'food' ? 'thức ăn' : 'nước uống'} phù hợp cho ${pet.name} trong kho.`);
            return;
        }

        let optionsHtml = suitableItemsInInventory.map(item =>
            `<option value="${item.id}">${item.name} (${item.icon}) - Hiện có: ${item.inventoryQuantity} - HS: +${item.healthRestore}</option>`
        ).join('');

        showGeneralPopup(
            `Chăm sóc ${pet.name}`,
            `Chọn ${careType === 'food' ? 'thức ăn' : 'nước uống'} cho ${pet.name}:<br>
             <select id="care-item-select" style="margin-top:10px; padding:5px; width:90%;">${optionsHtml}</select>`,
            () => {
                const selectedItemId = document.getElementById('care-item-select').value;
                if (!selectedItemId) return;

                const selectedStoreItem = suitableItemsInInventory.find(i => i.id === selectedItemId);
                const invEntry = userData.inventory.careItems.find(i => i.id === selectedItemId);

                if (invEntry && invEntry.quantity > 0) {
                    invEntry.quantity--;
                    if (invEntry.quantity <= 0) {
                        userData.inventory.careItems = userData.inventory.careItems.filter(i => i.id !== selectedItemId);
                    }
                    pet.health = Math.min(100, pet.health + (selectedStoreItem.healthRestore || 0));
                    pet.lastHealthUpdateTime = Date.now(); 
                    if (careType === 'food') pet.lastFedTime = Date.now();
                    else if (careType === 'drink') pet.lastWateredTime = Date.now();

                    showGeneralPopup("Chăm sóc thành công!", `${pet.name} đã được ${careType === 'food' ? 'cho ăn' : 'cho uống'}. Sức khỏe tăng!`);
                    saveUserData(currentUserName);
                    if (document.getElementById('collections-screen').classList.contains('active')) renderCollections();
                    if (document.getElementById('store-screen').classList.contains('active')) renderStore(); 
                } else {
                    showGeneralPopup("Lỗi", "Vật phẩm đã chọn không còn trong kho.");
                }
            }, true
        );
    };

    // --- COLLECTIONS ---
    const renderCollections = () => {         if (!ownedPetsCollection || !ownedAccessoriesCollection || !ownedSkillsCollection || !unlockedTitlesCollection) {
            console.error("One or more collection DOM elements are missing.");
            return;
        }
        ownedPetsCollection.innerHTML = '';
        ownedAccessoriesCollection.innerHTML = '';
        ownedSkillsCollection.innerHTML = '';
        unlockedTitlesCollection.innerHTML = '';

        const userOwnedPets = userData.pets.filter(p => p.owned);
        if (userOwnedPets.length > 0) {
            userOwnedPets.forEach(pet => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('collection-item', 'pet-collection-item');
                const petStoreInfo = STORE_ITEMS.pets.find(sp => sp.id === pet.id);
                const petTier = petStoreInfo ? petStoreInfo.tier : 0;

                const petIcon = pet.icon || petStoreInfo?.icon || '🐾';
                let iconHtml = petIcon ? (petIcon.includes('/') ? `<img src="${petIcon}" alt="${pet.name}" class="item-icon">` : `<div class="item-icon emoji-icon">${petIcon}</div>`) : `<div class="item-icon emoji-icon">🐾</div>`;
                const healthStatusText = getPetHealthStatusText(pet.health);
                const healthBarColor = pet.health > 80 ? 'green' : pet.health > 60 ? '#9ACD32' : pet.health > 40 ? 'orange' : pet.health > 20 ? '#FF6347' : 'red';

                let equippedItemsHtml = '<div class="equipped-items-display" style="font-size:0.8em; margin-top:5px;">';
                if (pet.equippedAccessories.length > 0) {
                    equippedItemsHtml += '<p><strong>Phụ kiện:</strong> ';
                    pet.equippedAccessories.forEach(accUniqueId => {
                        const invAcc = userData.inventory.accessories.find(a => a.uniqueId === accUniqueId);
                        if (invAcc) {
                             const storeAcc = STORE_ITEMS.accessories.find(sa => sa.id === invAcc.id);
                             if(storeAcc) equippedItemsHtml += `${storeAcc.icon || ''}${storeAcc.name} `;
                        }
                    });
                    equippedItemsHtml += '</p>';
                }
                if (pet.equippedSkills.length > 0) {
                    equippedItemsHtml += '<p><strong>Kỹ năng:</strong> ';
                     pet.equippedSkills.forEach(skillUniqueId => {
                        const invSkill = userData.inventory.skills.find(s => s.uniqueId === skillUniqueId);
                         if (invSkill) {
                            const storeSkill = STORE_ITEMS.skills.find(ss => ss.id === invSkill.id);
                            if(storeSkill) equippedItemsHtml += `${storeSkill.icon || ''}${storeSkill.name} `;
                         }
                    });
                    equippedItemsHtml += '</p>';
                }
                equippedItemsHtml += '</div>';

                const totalFoodCount = userData.inventory.careItems
                    .filter(invItem => {
                        const si = STORE_ITEMS.careItems.find(s => s.id === invItem.id);
                        return si && si.type === 'food' && si.tier <= petTier && invItem.quantity > 0;
                    })
                    .reduce((sum, invItem) => sum + invItem.quantity, 0) || 0;

                const totalDrinkCount = userData.inventory.careItems
                    .filter(invItem => {
                        const si = STORE_ITEMS.careItems.find(s => s.id === invItem.id);
                        return si && si.type === 'drink' && si.tier <= petTier && invItem.quantity > 0;
                    })
                    .reduce((sum, invItem) => sum + invItem.quantity, 0) || 0;

                 itemDiv.innerHTML = `
                    ${iconHtml}
                    <h4>${pet.name}</h4>
                    <div class="pet-health-bar-container">
                        <div class="pet-health-bar" style="width: ${pet.health}%; background-color: ${healthBarColor};"></div>
                    </div>
                    <p class="pet-health-text">Sức khỏe: ${pet.health}% (${healthStatusText})</p>
                    ${equippedItemsHtml}
                    <div class="pet-care-actions">
                        <button class="care-btn feed-btn" data-pet-id="${pet.id}" ${totalFoodCount > 0 ? '' : 'disabled'}>
                            🍖 (${totalFoodCount})
                        </button>
                        <button class="care-btn water-btn" data-pet-id="${pet.id}" ${totalDrinkCount > 0 ? '' : 'disabled'}>
                            💧 (${totalDrinkCount})
                        </button>
                    </div>
                `;
                ownedPetsCollection.appendChild(itemDiv);
            });
            ownedPetsCollection.querySelectorAll('.feed-btn').forEach(btn => btn.addEventListener('click', (e) => handleCarePet(e.target.dataset.petId, 'food')));
            ownedPetsCollection.querySelectorAll('.water-btn').forEach(btn => btn.addEventListener('click', (e) => handleCarePet(e.target.dataset.petId, 'drink')));
        } else {
            ownedPetsCollection.innerHTML = '<p>Em chưa sở hữu thú cưng nào.</p>';
        }

        if (userData.inventory.accessories.length > 0) {
            userData.inventory.accessories.forEach(acc => {
                const itemDiv = document.createElement('div'); itemDiv.classList.add('collection-item', 'accessory-collection-item');
                let iconHtml = acc.icon ? (acc.icon.includes('/') ? `<img src="${acc.icon}" alt="${acc.name}" class="item-icon">` : `<div class="item-icon emoji-icon">${acc.icon}</div>`) : `<div class="item-icon emoji-icon">🎀</div>`;
                let statusText = acc.isEquipped ? `(Đã gắn cho ${userData.pets.find(p=>p.id === acc.equippedTo)?.name || 'N/A'})` : '';
                itemDiv.innerHTML = `
                    ${iconHtml}
                    <h4>${acc.name} ${statusText}</h4>
                    ${!acc.isEquipped ? `<button class="equip-item-btn small-btn" data-item-unique-id="${acc.uniqueId}" data-item-type="accessory">Gắn cho Pet</button>` : ''}
                `;
                ownedAccessoriesCollection.appendChild(itemDiv);
            });
        } else { ownedAccessoriesCollection.innerHTML = '<p>Em chưa có phụ kiện nào trong kho.</p>'; }

        if (userData.inventory.skills.length > 0) {
            userData.inventory.skills.forEach(skill => {
                const itemDiv = document.createElement('div'); itemDiv.classList.add('collection-item', 'skill-collection-item');
                let iconHtml = skill.icon ? (skill.icon.includes('/') ? `<img src="${skill.icon}" alt="${skill.name}" class="item-icon">` : `<div class="item-icon emoji-icon">${skill.icon}</div>`) : `<div class="item-icon emoji-icon">✨</div>`;
                let statusText = skill.isEquipped ? `(Đã gắn cho ${userData.pets.find(p=>p.id === skill.equippedTo)?.name || 'N/A'})` : '';
                itemDiv.innerHTML = `
                    ${iconHtml}
                    <h4>${skill.name} ${statusText}</h4>
                    ${!skill.isEquipped ? `<button class="equip-item-btn small-btn" data-item-unique-id="${skill.uniqueId}" data-item-type="skill">Gắn cho Pet</button>` : ''}
                `;
                ownedSkillsCollection.appendChild(itemDiv);
            });
        } else { ownedSkillsCollection.innerHTML = '<p>Em chưa học kỹ năng nào.</p>'; }

        const handleEquipButtonClickInCollection = (e) => {
            const itemUniqueId = e.target.dataset.itemUniqueId;
            const itemType = e.target.dataset.itemType;
            const ownedPets = userData.pets.filter(p => p.owned);

            if (ownedPets.length === 0) {
                showGeneralPopup("Thông báo", "Em cần sở hữu một thú cưng trước khi gắn vật phẩm.");
                return;
            }
            let petOptionsHtml = ownedPets.map(p => {
                const currentEquippedCount = itemType === 'accessory' ? p.equippedAccessories.length : p.equippedSkills.length;
                const maxEquipped = itemType === 'accessory' ? MAX_EQUIPPED_ACCESSORIES_PER_PET : MAX_EQUIPPED_SKILLS_PER_PET;
                const isDisabled = currentEquippedCount >= maxEquipped;
                return `<option value="${p.id}" ${isDisabled ? 'disabled' : ''}>${p.name} (${currentEquippedCount}/${maxEquipped})</option>`;
            }).join('');

            showGeneralPopup(
                `Gắn ${itemType === 'accessory' ? 'Phụ Kiện' : 'Kỹ Năng'}`,
                `Em muốn gắn vật phẩm này cho thú cưng nào?<br><select id="pet-equip-select-collection" style="margin-top:10px; padding:5px; width:80%;">${petOptionsHtml}</select>`,
                () => {
                    const selectedPetId = document.getElementById('pet-equip-select-collection').value;
                    if (selectedPetId) equipItemToPet(itemUniqueId, itemType, selectedPetId);
                }, true
            );
        };
        ownedAccessoriesCollection.querySelectorAll('.equip-item-btn').forEach(btn => btn.addEventListener('click', handleEquipButtonClickInCollection));
        ownedSkillsCollection.querySelectorAll('.equip-item-btn').forEach(btn => btn.addEventListener('click', handleEquipButtonClickInCollection));


        const userUnlockedTitles = userData.titles.filter(t => t.unlocked);
        if (userUnlockedTitles.length > 0) {
            userUnlockedTitles.forEach(title => {
                const itemDiv = document.createElement('div'); itemDiv.classList.add('collection-item', 'title-collection-item');
                itemDiv.innerHTML = `<h4>${title.name} ${userData.currentTitle === title.name ? '(Đang dùng)' : ''} (${title.stars}★)</h4>`;
                unlockedTitlesCollection.appendChild(itemDiv);
            });
        } else { unlockedTitlesCollection.innerHTML = '<p>Em chưa mở khóa danh hiệu nào.</p>'; }};

    // --- SETTINGS ---
    const applySettings = () => {         document.body.style.fontFamily = userData.settings.font; fontSelect.value = userData.settings.font;
        document.body.classList.remove('theme-blue', 'theme-green', 'theme-yellow');
        let primaryColor, secondaryColor, accentColor, cardBg, buttonBg, buttonHoverBg;
        switch(userData.settings.theme) {
            case 'blue': primaryColor = '#E0F7FA'; secondaryColor = '#B2EBF2'; accentColor = '#80DEEA'; cardBg = '#FFFFFF'; buttonBg = '#4DD0E1'; buttonHoverBg = '#26C6DA'; break;
            case 'green': primaryColor = '#E8F5E9'; secondaryColor = '#C8E6C9'; accentColor = '#A5D6A7'; cardBg = '#FFFFFF'; buttonBg = '#81C784'; buttonHoverBg = '#66BB6A'; break;
            case 'yellow': primaryColor = '#FFFDE7'; secondaryColor = '#FFF9C4'; accentColor = '#FFF59D'; cardBg = '#FFFFFF'; buttonBg = '#FFEE58'; buttonHoverBg = '#FFEB3B'; break;
            default: primaryColor = '#FFB6C1'; secondaryColor = '#FFDAB9'; accentColor = '#ADD8E6'; cardBg = '#FFF0F5'; buttonBg = '#FFA07A'; buttonHoverBg = '#FA8072'; break;
        }
        document.documentElement.style.setProperty('--primary-color', primaryColor); document.documentElement.style.setProperty('--secondary-color', secondaryColor); document.documentElement.style.setProperty('--accent-color', accentColor); document.documentElement.style.setProperty('--card-bg', cardBg); document.documentElement.style.setProperty('--button-bg', buttonBg); document.documentElement.style.setProperty('--button-hover-bg', buttonHoverBg);
        themeSelect.value = userData.settings.theme;};
    fontSelect.addEventListener('change', (e) => { userData.settings.font = e.target.value; applySettings(); saveUserData(currentUserName); });
    themeSelect.addEventListener('change', (e) => { userData.settings.theme = e.target.value; applySettings(); saveUserData(currentUserName); });

    resetDataBtn.addEventListener('click', () => {
        if (!currentUserName || !userData.name) {
            showGeneralPopup("Lỗi", "Không có người dùng nào đang đăng nhập để xóa dữ liệu.");
            return;
        }
        showGeneralPopup(
            "Cảnh Báo!",
            `Em có chắc muốn xóa toàn bộ dữ liệu cho tài khoản '${userData.name}' và làm lại từ đầu không? Hành động này không thể hoàn tác.`,
            () => {
                localStorage.removeItem(getUserDataKey(currentUserName));
                localStorage.removeItem('lastActiveUserName');
                currentUserName = null;
                userData = JSON.parse(JSON.stringify(initialUserData));
                window.location.reload();
            },
            true
        );
    });

    submitRewardCodeBtn.addEventListener('click', () => {
        const code = rewardCodeInput.value.trim().toLowerCase();
        if (!code) {
            showGeneralPopup("Thông báo", "Vui lòng nhập mã khen thưởng.");
            return;
        }

        const reward = REWARD_CODES[code];

        if (reward) {
            if (reward.oneTime && userData.usedRewardCodes.includes(code)) {
                showGeneralPopup("Thông báo", `Mã "${code}" đã được sử dụng rồi.`);
            } else {
                userData.points += reward.points;
                if (reward.oneTime) {
                    if (!userData.usedRewardCodes) userData.usedRewardCodes = [];
                    userData.usedRewardCodes.push(code);
                }
                rewardCodeInput.value = '';
                showGeneralPopup("Thành công!", `🎉 Chúc mừng! Em nhận được ${reward.points} điểm thưởng từ mã "${code}"! 🎉`);
                showFireworks(true);
                updateDashboardUI();
                saveUserData(currentUserName);
            }
        } else {
            showGeneralPopup("Mã không hợp lệ", `Mã "${code}" không đúng hoặc không tồn tại.`);
        }
    });


    // --- INITIAL APP LOAD ---
    const initApp = () => {
        const lastActive = localStorage.getItem('lastActiveUserName');
        const persistedApiKey = localStorage.getItem('geminiApiKey');
        if (persistedApiKey) {
            GEMINI_API_KEY = persistedApiKey;
            useMockQuestions = false;
            if (geminiStatusDisplay) { geminiStatusDisplay.textContent = "Đang sử dụng Gemini API (đã lưu)."; geminiStatusDisplay.style.color = "green"; }
        } else {
            useMockQuestions = true;
            if (geminiStatusDisplay) { geminiStatusDisplay.textContent = "Nhập API Key để dùng Gemini hoặc dùng câu hỏi mẫu."; geminiStatusDisplay.style.color = "orange"; }
        }


        if (lastActive && loadUserData(lastActive)) {
            currentUserName = lastActive;
            finishLogin();
        } else {
            localStorage.removeItem('lastActiveUserName');
            currentUserName = null;
            userData = JSON.parse(JSON.stringify(initialUserData));
            initOnboarding();
        }
    };

    initApp();
});