// 存档系统
class SaveManager {
    constructor() {
        this.saveKey = 'timeClickerSave';
        this.autoSaveInterval = 30000; // 30秒自动保存
        this.lastSaveTime = 0;
        
        this.init();
    }
    
    init() {
        this.startAutoSave();
        this.setupSaveListeners();
    }
    
    startAutoSave() {
        setInterval(() => {
            if (this.shouldAutoSave()) {
                this.saveGame();
            }
        }, this.autoSaveInterval);
    }
    
    setupSaveListeners() {
        // 页面卸载时保存
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        // 页面隐藏时保存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGame();
            }
        });
        
        // 键盘快捷键保存 (Ctrl+S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.code === 'KeyS') {
                e.preventDefault();
                this.saveGame();
                this.showSaveNotification('游戏已保存！');
            }
        });
    }
    
    shouldAutoSave() {
        const now = Date.now();
        return now - this.lastSaveTime > this.autoSaveInterval;
    }
    
    saveGame() {
        try {
            const saveData = this.createSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.lastSaveTime = Date.now();
            
            console.log('游戏已保存');
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            this.showSaveNotification('保存失败！', 'error');
            return false;
        }
    }
    
    createSaveData() {
        const game = window.game;
        const buildings = window.buildingsManager;
        const upgrades = window.upgradesManager;
        
        return {
            // 游戏基本信息
            version: '2.0.0',
            saveTime: Date.now(),
            
            // 游戏状态
            timeEnergy: game.timeEnergy,
            energyPerSecond: game.energyPerSecond,
            clickPower: game.clickPower,
            totalClicks: game.totalClicks,
            gameStartTime: game.gameStartTime,
            isGameActive: game.isGameActive,
            clickMultiplier: game.clickMultiplier,
            
            // 成就系统
            achievements: Array.from(game.achievements || []),
            
            // 建筑系统
            buildings: buildings.getBuildingData(),
            
            // 升级系统
            upgrades: upgrades ? upgrades.getSaveData() : null,
            
            // 统计信息
            statistics: this.getStatistics()
        };
    }
    
    loadGame() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                console.log('没有找到存档，开始新游戏');
                return false;
            }
            
            const data = JSON.parse(saveData);
            this.applySaveData(data);
            
            console.log('游戏存档已加载');
            this.showSaveNotification('存档已加载');
            return true;
        } catch (error) {
            console.error('加载存档失败:', error);
            this.showSaveNotification('存档加载失败！', 'error');
            return false;
        }
    }
    
    applySaveData(data) {
        const game = window.game;
        const buildings = window.buildingsManager;
        const upgrades = window.upgradesManager;
        
        // 恢复游戏状态
        game.timeEnergy = data.timeEnergy || 0;
        game.energyPerSecond = data.energyPerSecond || 0;
        game.clickPower = data.clickPower || 1;
        game.totalClicks = data.totalClicks || 0;
        game.gameStartTime = data.gameStartTime || Date.now();
        game.isGameActive = data.isGameActive !== false;
        game.clickMultiplier = data.clickMultiplier || 1;
        
        // 恢复成就
        game.achievements = new Set(data.achievements || []);
        
        // 恢复建筑
        if (data.buildings) {
            buildings.loadBuildings(data.buildings);
        }
        
        // 恢复升级
        if (data.upgrades && upgrades) {
            upgrades.loadData(data.upgrades);
        }
        
        // 重新计算产量
        buildings.updateProduction();
        
        // 更新UI
        game.updateUI();
        game.updateAchievementsDisplay();
    }
    
    getStatistics() {
        const game = window.game;
        const buildings = window.buildingsManager;
        
        return {
            totalPlayTime: Date.now() - game.gameStartTime,
            totalClicks: game.totalClicks,
            totalBuildings: Object.values(buildings.buildingCounts).reduce((sum, count) => sum + count, 0),
            highestEnergy: Math.max(game.timeEnergy, this.getHighestEnergy()),
            achievementsUnlocked: (game.achievements || new Set()).size,
            lastSaveTime: this.lastSaveTime
        };
    }
    
    getHighestEnergy() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                return data.statistics?.highestEnergy || 0;
            }
        } catch (error) {
            console.error('获取最高能量记录失败:', error);
        }
        return 0;
    }
    
    exportSave() {
        try {
            const saveData = this.createSaveData();
            const exportData = {
                ...saveData,
                exportTime: Date.now(),
                exportVersion: '1.0.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `timeclicker_save_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            
            this.showSaveNotification('存档已导出！');
            return true;
        } catch (error) {
            console.error('导出存档失败:', error);
            this.showSaveNotification('导出失败！', 'error');
            return false;
        }
    }
    
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // 验证存档格式
                    if (!this.validateSaveData(data)) {
                        throw new Error('无效的存档格式');
                    }
                    
                    // 备份当前存档
                    this.backupCurrentSave();
                    
                    // 应用新存档
                    this.applySaveData(data);
                    
                    this.showSaveNotification('存档已导入！');
                    resolve(true);
                } catch (error) {
                    console.error('导入存档失败:', error);
                    this.showSaveNotification('导入失败：' + error.message, 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };
            
            reader.readAsText(file);
        });
    }
    
    validateSaveData(data) {
        return data && 
               typeof data.timeEnergy === 'number' &&
               typeof data.energyPerSecond === 'number' &&
               typeof data.clickPower === 'number' &&
               Array.isArray(data.achievements);
    }
    
    backupCurrentSave() {
        try {
            const currentSave = localStorage.getItem(this.saveKey);
            if (currentSave) {
                localStorage.setItem(this.saveKey + '_backup', currentSave);
            }
        } catch (error) {
            console.error('备份存档失败:', error);
        }
    }
    
    restoreBackup() {
        try {
            const backupSave = localStorage.getItem(this.saveKey + '_backup');
            if (backupSave) {
                localStorage.setItem(this.saveKey, backupSave);
                this.loadGame();
                this.showSaveNotification('已恢复备份存档！');
                return true;
            } else {
                this.showSaveNotification('没有找到备份存档！', 'error');
                return false;
            }
        } catch (error) {
            console.error('恢复备份失败:', error);
            this.showSaveNotification('恢复备份失败！', 'error');
            return false;
        }
    }
    
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            this.showSaveNotification('存档已删除！', 'warning');
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            this.showSaveNotification('删除存档失败！', 'error');
            return false;
        }
    }
    
    getSaveInfo() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                return {
                    version: data.version,
                    saveTime: data.saveTime,
                    timeEnergy: data.timeEnergy,
                    totalClicks: data.totalClicks,
                    achievements: data.achievements?.length || 0,
                    buildings: Object.values(data.buildings?.counts || {}).reduce((sum, count) => sum + count, 0)
                };
            }
        } catch (error) {
            console.error('获取存档信息失败:', error);
        }
        return null;
    }
    
    showSaveNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : type === 'warning' ? '#ffff00' : '#00ffff'};
            color: #000;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// 初始化存档管理器
let saveManager;
document.addEventListener('DOMContentLoaded', () => {
    saveManager = new SaveManager();
    window.saveManager = saveManager; // 全局访问
});
