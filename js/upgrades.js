// 升级系统
class UpgradesManager {
    constructor() {
        this.upgrades = [
            // 建筑升级 - 拥有特定数量建筑后解锁
            {
                id: 'alarm_clock_upgrade_1',
                name: '铜制齿轮',
                description: '闹钟的产量翻倍',
                cost: 1000,
                requiredBuilding: 'alarm_clock',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('alarm_clock'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'alarm_clock_upgrade_2',
                name: '精密弹簧',
                description: '闹钟的产量再次翻倍',
                cost: 10000,
                requiredBuilding: 'alarm_clock',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('alarm_clock'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'alarm_clock_upgrade_3',
                name: '原子钟同步',
                description: '闹钟的产量再次翻倍',
                cost: 100000,
                requiredBuilding: 'alarm_clock',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('alarm_clock'),
                purchased: false,
                type: 'building'
            },
            
            {
                id: 'graphics_card_upgrade_1',
                name: '超频模式',
                description: '显卡的产量翻倍',
                cost: 11000,
                requiredBuilding: 'graphics_card',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('graphics_card'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'graphics_card_upgrade_2',
                name: '液冷散热',
                description: '显卡的产量再次翻倍',
                cost: 110000,
                requiredBuilding: 'graphics_card',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('graphics_card'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'graphics_card_upgrade_3',
                name: '量子计算核心',
                description: '显卡的产量再次翻倍',
                cost: 1100000,
                requiredBuilding: 'graphics_card',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('graphics_card'),
                purchased: false,
                type: 'building'
            },
            
            {
                id: 'cpu_upgrade_1',
                name: '多核处理',
                description: 'CPU的产量翻倍',
                cost: 120000,
                requiredBuilding: 'cpu',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('cpu'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'cpu_upgrade_2',
                name: '超线程技术',
                description: 'CPU的产量再次翻倍',
                cost: 1200000,
                requiredBuilding: 'cpu',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('cpu'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'cpu_upgrade_3',
                name: '神经网络芯片',
                description: 'CPU的产量再次翻倍',
                cost: 12000000,
                requiredBuilding: 'cpu',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('cpu'),
                purchased: false,
                type: 'building'
            },
            
            // 原神升级
            {
                id: 'genshin_upgrade_1',
                name: '启动优化',
                description: '原神的产量翻倍',
                cost: 14000000,
                requiredBuilding: 'genshin_impact',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('genshin_impact'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'genshin_upgrade_2',
                name: '内存优化',
                description: '原神的产量再次翻倍',
                cost: 140000000,
                requiredBuilding: 'genshin_impact',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('genshin_impact'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'genshin_upgrade_3',
                name: '云端同步',
                description: '原神的产量再次翻倍',
                cost: 1400000000,
                requiredBuilding: 'genshin_impact',
                requiredCount: 10,
                effect: () => this.doubleBuildingProduction('genshin_impact'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'genshin_upgrade_4',
                name: '元素共鸣',
                description: '原神的产量再次翻倍',
                cost: 14000000000,
                requiredBuilding: 'genshin_impact',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('genshin_impact'),
                purchased: false,
                type: 'building'
            },
            
            // 点击升级
            {
                id: 'click_upgrade_1',
                name: '更好的手指',
                description: '点击力量增加每秒产量的1%',
                cost: 100,
                effect: () => this.addClickPercentage(0.01),
                purchased: false,
                type: 'click'
            },
            {
                id: 'click_upgrade_2',
                name: '机械手套',
                description: '点击力量再增加每秒产量的1%',
                cost: 5000,
                effect: () => this.addClickPercentage(0.01),
                purchased: false,
                type: 'click'
            },
            {
                id: 'click_upgrade_3',
                name: '神经接口',
                description: '点击力量再增加每秒产量的1%',
                cost: 50000,
                effect: () => this.addClickPercentage(0.01),
                purchased: false,
                type: 'click'
            },
            {
                id: 'click_upgrade_4',
                name: '意念点击',
                description: '点击力量再增加每秒产量的2%',
                cost: 5000000,
                effect: () => this.addClickPercentage(0.02),
                purchased: false,
                type: 'click'
            },
            
            // 特殊组合升级
            {
                id: 'combo_cpu_gpu',
                name: 'CPU-GPU协同',
                description: 'CPU和显卡的产量都增加50%',
                cost: 500000,
                requiredBuildings: ['cpu', 'graphics_card'],
                requiredCounts: [1, 1],
                effect: () => {
                    this.addBuildingMultiplier('cpu', 0.5);
                    this.addBuildingMultiplier('graphics_card', 0.5);
                },
                purchased: false,
                type: 'combo'
            },
            {
                id: 'combo_genshin_cpu',
                name: '原神-CPU联动',
                description: '原神和CPU的产量都增加50%',
                cost: 5000000,
                requiredBuildings: ['genshin_impact', 'cpu'],
                requiredCounts: [3, 3],
                effect: () => {
                    this.addBuildingMultiplier('genshin_impact', 0.5);
                    this.addBuildingMultiplier('cpu', 0.5);
                },
                purchased: false,
                type: 'combo'
            },
            {
                id: 'combo_genshin_gpu',
                name: '原神-显卡联动',
                description: '原神和显卡的产量都增加50%',
                cost: 6000000,
                requiredBuildings: ['genshin_impact', 'graphics_card'],
                requiredCounts: [3, 3],
                effect: () => {
                    this.addBuildingMultiplier('genshin_impact', 0.5);
                    this.addBuildingMultiplier('graphics_card', 0.5);
                },
                purchased: false,
                type: 'combo'
            },
            {
                id: 'combo_genshin_trinity',
                name: '三位一体优化',
                description: '原神、CPU和显卡的产量都增加100%',
                cost: 50000000,
                requiredBuildings: ['genshin_impact', 'cpu', 'graphics_card'],
                requiredCounts: [5, 5, 5],
                effect: () => {
                    this.addBuildingMultiplier('genshin_impact', 1.0);
                    this.addBuildingMultiplier('cpu', 1.0);
                    this.addBuildingMultiplier('graphics_card', 1.0);
                },
                purchased: false,
                type: 'combo'
            },
            
            // 全局升级
            {
                id: 'global_efficiency',
                name: '系统优化',
                description: '所有建筑的产量增加10%',
                cost: 1000000,
                requiredProduction: 100, // 需要每秒产量达到100
                effect: () => this.addGlobalMultiplier(0.1),
                purchased: false,
                type: 'global'
            },
            {
                id: 'global_efficiency_2',
                name: '深度优化',
                description: '所有建筑的产量再增加20%',
                cost: 100000000,
                requiredProduction: 10000, // 需要每秒产量达到10000
                effect: () => this.addGlobalMultiplier(0.2),
                purchased: false,
                type: 'global'
            },
            
            // 递归升级
            {
                id: 'recursive_boost',
                name: '递归优化',
                description: '递归复制机的效率增长速度翻倍',
                cost: 10000000000000,
                requiredBuilding: 'recursive_copier',
                requiredCount: 10,
                effect: () => this.upgradeRecursive(),
                purchased: false,
                type: 'special'
            }
        ];
        
        // 升级效果追踪
        this.buildingMultipliers = {}; // 建筑倍率
        this.globalMultiplier = 1; // 全局倍率
        this.clickPercentage = 0; // 点击获得每秒产量的百分比
        this.recursiveBoost = 1; // 递归加成
        
        this.init();
    }
    
    init() {
        this.renderUpgrades();
    }
    
    renderUpgrades() {
        const upgradesGrid = document.getElementById('upgradesGrid');
        upgradesGrid.innerHTML = '';
        
        const availableUpgrades = this.getAvailableUpgrades();
        
        if (availableUpgrades.length === 0) {
            upgradesGrid.innerHTML = '<p style="color: #6c757d; text-align: center; grid-column: 1 / -1;">暂无可用升级</p>';
            return;
        }
        
        availableUpgrades.forEach(upgrade => {
            const canAfford = window.game && window.game.timeEnergy >= upgrade.cost;
            
            const upgradeCard = document.createElement('div');
            upgradeCard.className = `upgrade-card ${canAfford ? 'affordable' : ''}`;
            
            upgradeCard.innerHTML = `
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-cost">成本: ${this.formatNumber(upgrade.cost)}</div>
            `;
            
            upgradeCard.addEventListener('click', () => this.purchaseUpgrade(upgrade));
            upgradesGrid.appendChild(upgradeCard);
        });
    }
    
    getAvailableUpgrades() {
        const availableUpgrades = this.upgrades.filter(upgrade => {
            if (upgrade.purchased) return false;
            
            // 检查建筑要求
            if (upgrade.requiredBuilding) {
                const count = window.buildingsManager.getBuildingCount(upgrade.requiredBuilding);
                if (count < upgrade.requiredCount) return false;
            }
            
            // 检查多建筑要求
            if (upgrade.requiredBuildings) {
                for (let i = 0; i < upgrade.requiredBuildings.length; i++) {
                    const buildingId = upgrade.requiredBuildings[i];
                    const requiredCount = upgrade.requiredCounts[i];
                    const count = window.buildingsManager.getBuildingCount(buildingId);
                    if (count < requiredCount) return false;
                }
            }
            
            // 检查产量要求（针对全局升级）
            if (upgrade.requiredProduction) {
                const currentProduction = window.buildingsManager ? window.buildingsManager.totalProduction : 0;
                if (currentProduction < upgrade.requiredProduction) return false;
            }
            
            return true;
        });
        
        // 按价格排序
        return availableUpgrades.sort((a, b) => a.cost - b.cost);
    }
    
    purchaseUpgrade(upgrade) {
        if (window.game && window.game.timeEnergy >= upgrade.cost && !upgrade.purchased) {
            // 扣除能量
            window.game.timeEnergy -= upgrade.cost;
            
            // 标记为已购买
            upgrade.purchased = true;
            
            // 应用效果
            upgrade.effect();
            
            // 更新建筑产量
            window.buildingsManager.updateProduction();
            
            // 更新UI
            this.renderUpgrades();
            window.game.updateUI();
            
            // 显示购买通知
            window.game.showNotification(`购买了升级: ${upgrade.name}！`, 'success');
            
            // 保存游戏
            window.game.saveGame();
        } else {
            window.game.showNotification('无法购买此升级！', 'error');
        }
    }
    
    // 升级效果实现
    doubleBuildingProduction(buildingId) {
        if (!this.buildingMultipliers[buildingId]) {
            this.buildingMultipliers[buildingId] = 1;
        }
        this.buildingMultipliers[buildingId] *= 2;
    }
    
    addBuildingMultiplier(buildingId, multiplier) {
        if (!this.buildingMultipliers[buildingId]) {
            this.buildingMultipliers[buildingId] = 1;
        }
        this.buildingMultipliers[buildingId] += multiplier;
    }
    
    addGlobalMultiplier(multiplier) {
        this.globalMultiplier += multiplier;
    }
    
    addClickPercentage(percentage) {
        this.clickPercentage += percentage;
    }
    
    upgradeRecursive() {
        this.recursiveBoost *= 2;
    }
    
    // 获取建筑的总倍率
    getBuildingMultiplier(buildingId) {
        return (this.buildingMultipliers[buildingId] || 1) * this.globalMultiplier;
    }
    
    // 获取点击力量加成
    getClickBonus() {
        if (this.clickPercentage <= 0) return 0;
        return window.buildingsManager.totalProduction * this.clickPercentage;
    }
    
    // 获取递归加成
    getRecursiveMultiplier() {
        return this.recursiveBoost;
    }
    
    checkAvailableUpgrades() {
        this.renderUpgrades();
    }
    
    // 更新升级可购买状态
    updateAffordableStatus() {
        const upgradeCards = document.querySelectorAll('.upgrade-card');
        const availableUpgrades = this.getAvailableUpgrades();
        
        upgradeCards.forEach((card, index) => {
            if (availableUpgrades[index]) {
                const upgrade = availableUpgrades[index];
                const canAfford = window.game && window.game.timeEnergy >= upgrade.cost;
                
                if (canAfford) {
                    card.classList.add('affordable');
                } else {
                    card.classList.remove('affordable');
                }
            }
        });
    }
    
    formatNumber(num) {
        if (num >= 1e18) {
            return (num / 1e18).toFixed(2) + 'Qt';
        } else if (num >= 1e15) {
            return (num / 1e15).toFixed(2) + 'Qa';
        } else if (num >= 1e12) {
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
    
    // 保存数据
    getSaveData() {
        return {
            purchasedUpgrades: this.upgrades.filter(u => u.purchased).map(u => u.id),
            buildingMultipliers: this.buildingMultipliers,
            globalMultiplier: this.globalMultiplier,
            clickPercentage: this.clickPercentage,
            recursiveBoost: this.recursiveBoost
        };
    }
    
    // 加载数据
    loadData(data) {
        if (!data) return;
        
        // 恢复购买状态
        if (data.purchasedUpgrades) {
            data.purchasedUpgrades.forEach(upgradeId => {
                const upgrade = this.upgrades.find(u => u.id === upgradeId);
                if (upgrade) {
                    upgrade.purchased = true;
                }
            });
        }
        
        // 恢复升级效果
        this.buildingMultipliers = data.buildingMultipliers || {};
        this.globalMultiplier = data.globalMultiplier || 1;
        this.clickPercentage = data.clickPercentage || 0;
        this.recursiveBoost = data.recursiveBoost || 1;
        
        this.renderUpgrades();
    }
    
    // 重置升级
    resetUpgrades() {
        this.upgrades.forEach(upgrade => {
            upgrade.purchased = false;
        });
        this.buildingMultipliers = {};
        this.globalMultiplier = 1;
        this.clickPercentage = 0;
        this.recursiveBoost = 1;
        this.renderUpgrades();
    }
}

// 初始化升级管理器
let upgradesManager;
document.addEventListener('DOMContentLoaded', () => {
    upgradesManager = new UpgradesManager();
    window.upgradesManager = upgradesManager; // 全局访问
});
