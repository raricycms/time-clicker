// 游戏核心逻辑
class TimeClickerGame {
    constructor() {
        this.timeEnergy = 0;
        this.energyPerSecond = 0;
        this.clickPower = 1;
        this.totalClicks = 0;
        this.manualClicks = 0; // 只计算手动点击
        this.gameStartTime = Date.now();
        this.targetEnergy = 1e12; // 1万亿点时间能量
        
        // 游戏状态
        this.isGameActive = true;
        this.lastSaveTime = Date.now();
        
        // 点击相关
        this.clickMultiplier = 1;
        this.autoClickerInterval = null;
        
        // 成就系统
        this.achievements = new Set();
        
        // 初始化游戏
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startGameLoop();
        this.updateUI();
        
        // 测试localStorage是否可用
        this.testLocalStorage();
        
        // 延迟加载存档，等待其他组件初始化完成
        setTimeout(() => {
            this.loadGame();
        }, 200);
    }
    
    setupEventListeners() {
        // 时光机点击事件（左键和右键）
        const timeMachine = document.getElementById('timeMachine');
        timeMachine.addEventListener('click', (e) => this.handleTimeMachineClick(e));
        timeMachine.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleTimeMachineClick(e);
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 页面可见性变化时自动保存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGame();
            }
        });
        
        // 页面卸载时保存
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        // 禁用右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    handleTimeMachineClick(event) {
        if (!this.isGameActive) return;
        
        // 计算点击力量（包含升级效果）
        const clickPower = this.getClickPower();
        
        // 添加点击能量
        this.addEnergy(clickPower);
        this.totalClicks++;
        this.manualClicks++; // 手动点击计数
        
        // 创建点击效果
        this.createClickEffect(event, clickPower);
        
        // 更新UI
        this.updateUI();
        
        // 检查成就
        this.checkClickAchievements();
        
        // 触发点击动画
        this.animateTimeMachine();
    }
    
    handleKeyPress(event) {
        // 空格键点击时光机
        if (event.code === 'Space') {
            event.preventDefault();
            const timeMachine = document.getElementById('timeMachine');
            timeMachine.click();
        }
        
        // Ctrl+S 手动保存
        if (event.ctrlKey && event.code === 'KeyS') {
            event.preventDefault();
            this.saveGame();
            this.showNotification('游戏已保存！', 'success');
        }
    }
    
    addEnergy(amount) {
        this.timeEnergy += amount;
        
        // 检查是否达到目标
        if (this.timeEnergy >= this.targetEnergy) {
            this.completeGame();
        }
    }
    
    createClickEffect(event, amount) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 创建能量数字弹出效果
        this.createEnergyPop(x, y, amount);
    }
    
    createEnergyPop(x, y, amount) {
        const energyPop = document.createElement('div');
        energyPop.className = 'click-effect';
        energyPop.textContent = `+${this.formatNumber(amount)}`;
        energyPop.style.position = 'absolute';
        energyPop.style.left = x + 'px';
        energyPop.style.top = y + 'px';
        energyPop.style.pointerEvents = 'none';
        energyPop.style.zIndex = '1000';
        
        const container = document.querySelector('.time-machine-container');
        container.appendChild(energyPop);
        
        setTimeout(() => {
            if (container.contains(energyPop)) {
                container.removeChild(energyPop);
            }
        }, 600);
    }
    
    animateTimeMachine() {
        const timeMachine = document.getElementById('timeMachine');
        
        timeMachine.style.transform = 'scale(0.95)';
        setTimeout(() => {
            timeMachine.style.transform = 'scale(1)';
        }, 100);
    }
    
    startGameLoop() {
        setInterval(() => {
            if (this.isGameActive) {
                this.gameLoop();
            }
        }, 1000); // 每秒更新一次
    }
    
    gameLoop() {
        // 自动产生能量
        if (this.energyPerSecond > 0) {
            this.addEnergy(this.energyPerSecond);
        }
        
        // 更新UI
        this.updateUI();
        
        // 更新建筑可购买状态
        if (window.buildingsManager) {
            window.buildingsManager.updateAffordableStatus();
        }
        
        // 更新升级可购买状态
        if (window.upgradesManager) {
            window.upgradesManager.updateAffordableStatus();
        }
        
        // 自动保存（每10秒）
        if (Date.now() - this.lastSaveTime > 10000) {
            this.saveGame();
            this.lastSaveTime = Date.now();
        }
    }
    
    updateUI() {
        // 更新时间能量显示
        const timeEnergyElement = document.getElementById('timeEnergy');
        timeEnergyElement.textContent = this.formatNumber(this.timeEnergy);
        timeEnergyElement.classList.add('number-count');
        setTimeout(() => timeEnergyElement.classList.remove('number-count'), 300);
        
        // 更新每秒产出显示
        const energyPerSecondElement = document.getElementById('energyPerSecond');
        energyPerSecondElement.textContent = this.formatNumber(this.energyPerSecond);
        
        // 更新点击力量显示
        const clickPowerElement = document.getElementById('clickPower');
        clickPowerElement.textContent = this.formatNumber(this.getClickPower());
        
        // 更新进度条
        this.updateProgressBar();
        
        // 更新时光机状态
        this.updateTimeMachineStatus();
    }
    
    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const progress = Math.min((this.timeEnergy / this.targetEnergy) * 100, 100);
        progressFill.style.width = progress + '%';
        progressText.textContent = progress.toFixed(2) + '%';
        
        // 根据进度改变颜色
        if (progress < 25) {
            progressFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        } else if (progress < 50) {
            progressFill.style.background = 'linear-gradient(90deg, #ff6600, #ffff00)';
        } else if (progress < 75) {
            progressFill.style.background = 'linear-gradient(90deg, #ffff00, #00ff00)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #00ff00, #00ffff)';
        }
    }
    
    updateTimeMachineStatus() {
        // 时光机状态更新（简化版）
        const timeMachine = document.getElementById('timeMachine');
        
        if (this.timeEnergy >= this.targetEnergy) {
            timeMachine.style.background = 'linear-gradient(145deg, #28a745, #20c997)';
        } else if (this.timeEnergy >= this.targetEnergy * 0.5) {
            timeMachine.style.background = 'linear-gradient(145deg, #ffc107, #fd7e14)';
        } else {
            timeMachine.style.background = 'linear-gradient(145deg, #007bff, #0056b3)';
        }
    }
    
    checkClickAchievements() {
        // 点击次数成就（使用手动点击计数）
        if (this.manualClicks === 100) {
            this.unlockAchievement('首次百击', '手动点击时光机100次');
        } else if (this.manualClicks === 1000) {
            this.unlockAchievement('千击大师', '手动点击时光机1000次');
        } else if (this.manualClicks === 10000) {
            this.unlockAchievement('万击传说', '手动点击时光机10000次');
        }
        
        // 能量成就
        if (this.timeEnergy >= 1000 && !this.achievements.has('千能收集者')) {
            this.unlockAchievement('千能收集者', '收集1000点时间能量');
        } else if (this.timeEnergy >= 1000000 && !this.achievements.has('百万能量')) {
            this.unlockAchievement('百万能量', '收集100万点时间能量');
        }
    }
    
    getClickPower() {
        let clickPower = this.clickPower * this.clickMultiplier;
        
        // 添加升级系统的点击加成
        if (window.upgradesManager) {
            clickPower += window.upgradesManager.getClickBonus();
        }
        
        return Math.max(0.01, clickPower);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    unlockAchievement(name, description) {
        if (!this.achievements) this.achievements = new Set();
        if (this.achievements.has(name)) return;
        
        this.achievements.add(name);
        this.showNotification(`🏆 成就解锁: ${name}`, 'success');
        
        // 更新成就显示
        this.updateAchievementsDisplay();
    }
    
    updateAchievementsDisplay() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        achievementsGrid.innerHTML = '';
        
        const allAchievements = [
            { name: '首次百击', description: `手动点击时光机100次 (${this.manualClicks}/100)`, unlocked: this.achievements?.has('首次百击') },
            { name: '千击大师', description: `手动点击时光机1000次 (${this.manualClicks}/1000)`, unlocked: this.achievements?.has('千击大师') },
            { name: '万击传说', description: `手动点击时光机10000次 (${this.manualClicks}/10000)`, unlocked: this.achievements?.has('万击传说') },
            { name: '千能收集者', description: '收集1000点时间能量', unlocked: this.achievements?.has('千能收集者') },
            { name: '百万能量', description: '收集100万点时间能量', unlocked: this.achievements?.has('百万能量') }
        ];
        
        allAchievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            achievementsGrid.appendChild(card);
        });
    }
    
    completeGame() {
        this.isGameActive = false;
        this.showNotification('🎉 恭喜！时光机修复完成！', 'success');
        
        // 解锁最终成就
        this.unlockAchievement('时光修复师', '成功修复时光机');
        
        // 显示完成画面
        setTimeout(() => {
            alert('🎉 恭喜你成功修复了时光机！\n\n你收集了 ' + this.formatNumber(this.timeEnergy) + ' 点时间能量！\n总点击次数: ' + this.totalClicks + '\n游戏时间: ' + this.formatTime(Date.now() - this.gameStartTime));
        }, 2000);
    }
    
    formatNumber(num) {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(2) + 'T';
        } else if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        } else if (num >= 10) {
            return num.toFixed(1);
        } else if (num >= 1) {
            return num.toFixed(2);
        } else {
            return num.toFixed(3);
        }
    }
    
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}小时${minutes % 60}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds % 60}秒`;
        } else {
            return `${seconds}秒`;
        }
    }
    
    testLocalStorage() {
        try {
            const testKey = 'timeClickerTest';
            const testValue = 'test';
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                console.log('localStorage 可用');
            } else {
                console.error('localStorage 测试失败');
                this.showNotification('存储功能不可用', 'error');
            }
        } catch (error) {
            console.error('localStorage 不可用:', error);
            this.showNotification('存储功能被禁用', 'error');
        }
    }
    
    saveGame() {
        try {
            const saveData = {
                // 游戏基本信息
                version: '2.0.0',
                saveTime: Date.now(),
                
                // 游戏状态
                timeEnergy: this.timeEnergy,
                energyPerSecond: this.energyPerSecond,
                clickPower: this.clickPower,
                totalClicks: this.totalClicks,
                manualClicks: this.manualClicks,
                gameStartTime: this.gameStartTime,
                isGameActive: this.isGameActive,
                clickMultiplier: this.clickMultiplier,
                
                // 成就系统
                achievements: Array.from(this.achievements || []),
                
                // 建筑系统
                buildings: window.buildingsManager ? window.buildingsManager.getBuildingData() : {},
                
                // 升级系统
                upgrades: window.upgradesManager ? window.upgradesManager.getSaveData() : null
            };
            
            localStorage.setItem('timeClickerSave', JSON.stringify(saveData));
            console.log('游戏已保存');
        } catch (error) {
            console.error('保存游戏失败:', error);
        }
    }
    
    loadGame() {
        try {
            const saveData = localStorage.getItem('timeClickerSave');
            if (!saveData) {
                console.log('没有找到存档');
                return;
            }
            
            const data = JSON.parse(saveData);
            
            // 恢复游戏状态
            this.timeEnergy = data.timeEnergy || 0;
            this.energyPerSecond = data.energyPerSecond || 0;
            this.clickPower = data.clickPower || 1;
            this.totalClicks = data.totalClicks || 0;
            this.manualClicks = data.manualClicks || 0;
            this.gameStartTime = data.gameStartTime || Date.now();
            this.isGameActive = data.isGameActive !== false;
            this.clickMultiplier = data.clickMultiplier || 1;
            
            // 恢复成就
            this.achievements = new Set(data.achievements || []);
            
            // 恢复建筑
            if (data.buildings && window.buildingsManager) {
                window.buildingsManager.loadBuildings(data.buildings);
            }
            
            // 恢复升级
            if (data.upgrades && window.upgradesManager) {
                window.upgradesManager.loadData(data.upgrades);
            }
            
            // 重新计算产量
            if (window.buildingsManager) {
                window.buildingsManager.updateProduction();
            }
            
            // 更新UI
            this.updateUI();
            this.updateAchievementsDisplay();
            
            console.log('游戏存档已加载', data);
            this.showNotification(`存档已加载 - 能量: ${this.formatNumber(this.timeEnergy)}`, 'success');
        } catch (error) {
            console.error('加载存档失败:', error);
            this.showNotification('存档加载失败', 'error');
        }
    }
}

// 初始化游戏
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new TimeClickerGame();
    window.game = game; // 全局访问
});
