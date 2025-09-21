// 建筑系统
class BuildingsManager {
    constructor() {
        this.buildings = [
            {
                id: 'manual_extractor',
                name: '手动提取器',
                description: '一个简单的手动装置，让你的每次点击都更有效率',
                baseCost: 15,
                baseProduction: 1.02, // 改为2%的乘法加成
                icon: '👆',
                unlocked: true,
                type: 'click_multiplier' // 特殊类型：点击倍率
            },
            {
                id: 'auto_clicker',
                name: '自动点击臂',
                description: '机械臂模拟点击行为，每十秒自动点击一次',
                baseCost: 15,
                baseProduction: 0, // 特殊：每10秒自动点击
                icon: '🦾',
                unlocked: true,
                type: 'auto_clicker'
            },
            {
                id: 'alarm_clock',
                name: '闹钟',
                description: '古老而可靠的机械装置，每秒咔哒一下，获取一点能量',
                baseCost: 50,
                baseProduction: 1,
                icon: '⏰',
                unlocked: true,
                type: 'normal'
            },
            {
                id: 'graphics_card',
                name: '显卡',
                description: '通过计算复杂的哈希值，从数字世界中挖出时间能量',
                baseCost: 500,
                baseProduction: 8,
                icon: '🎮',
                unlocked: true,
                type: 'normal'
            },
            {
                id: 'cpu',
                name: 'CPU',
                description: 'CPU内部的晶体管快速刷新，每次状态改变都获得微量能量',
                baseCost: 3000,
                baseProduction: 47,
                icon: '💻',
                unlocked: true,
                type: 'normal'
            },
            {
                id: 'genshin_impact',
                name: '原神',
                description: '原神在后台运行，优化整个系统性能，同时产生时间能量',
                baseCost: 50000,
                baseProduction: 260,
                icon: '🎲',
                unlocked: false,
                type: 'normal' // 改为普通建筑
            },
            {
                id: 'prism',
                name: '三棱镜',
                description: '分解光谱，每个光子的波长变化都被转换为时间能量',
                baseCost: 500000,
                baseProduction: 1400,
                icon: '🔻',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'time_resistor',
                name: '时间电阻',
                description: '特制电阻器，每个通过的电子都在时空中留下痕迹，产生能量',
                baseCost: 5000000,
                baseProduction: 7800,
                icon: '⚡',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'grandmother_clock',
                name: '祖母钟',
                description: '古老的钟摆制造时间悖论，从因果循环中提取能量',
                baseCost: 75000000,
                baseProduction: 44000,
                icon: '🕰️',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'schrodinger_box',
                name: '薛定谔的猫箱',
                description: '量子叠加态的猫在箱中波动，每次观测都产生大量能量',
                baseCost: 1000000000,
                baseProduction: 260000,
                icon: '📦',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'recursive_copier',
                name: '递归复制机',
                description: '自我复制的机器，复制数量越多，单个机器效率越高',
                baseCost: 15000000000,
                baseProduction: 1600000,
                icon: '♾️',
                unlocked: false,
                type: 'recursive' // 特殊类型：数量影响产量
            },
            {
                id: 'js_console',
                name: 'JavaScript Console',
                description: '通过修改现实的代码，直接从虚无中创造时间能量',
                baseCost: 200000000000,
                baseProduction: 10000000,
                icon: '💻',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'save_editor',
                name: '存档读取器',
                description: '能够读取并修改时间线本身，从平行现实中获取能量',
                baseCost: 3000000000000,
                baseProduction: 65000000,
                icon: '💾',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'fourth_wall_breaker',
                name: '第四面墙粉碎器',
                description: '打破游戏与现实的界限，从玩家的注意力中汲取能量',
                baseCost: 50000000000000,
                baseProduction: 430000000,
                icon: '🧱',
                unlocked: false,
                type: 'normal'
            },
            {
                id: 'real_time_machine',
                name: '真正的时光机',
                description: '这就是你要修复的时光机本身，现在它开始自我修复了',
                baseCost: 1000000000000000,
                baseProduction: 2900000000,
                icon: '🚀',
                unlocked: false,
                type: 'normal'
            }
        ];
        
        this.buildingCounts = {};
        this.totalProduction = 0;
        this.buyAmount = 1; // 购买数量：1, 10, 50, 100
        
        this.init();
    }
    
    init() {
        this.setupBuyAmountSelector();
        this.renderBuildings();
        this.updateProduction();
    }
    
    setupBuyAmountSelector() {
        const buyAmountBtns = document.querySelectorAll('.buy-amount-btn');
        buyAmountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有active类
                buyAmountBtns.forEach(b => b.classList.remove('active'));
                // 添加active类到当前按钮
                btn.classList.add('active');
                // 更新购买数量
                this.buyAmount = parseInt(btn.dataset.amount);
                // 重新渲染建筑以更新价格显示
                this.renderBuildings();
            });
        });
    }
    
    renderBuildings() {
        const buildingsGrid = document.getElementById('buildingsGrid');
        buildingsGrid.innerHTML = '';
        
        this.buildings.forEach(building => {
            if (!building.unlocked) return;
            
            const count = this.buildingCounts[building.id] || 0;
            const cost = this.getBulkCost(building, this.buyAmount);
            const canAfford = window.game && window.game.timeEnergy >= cost;
            
            const buildingCard = document.createElement('div');
            buildingCard.className = `building-card ${canAfford ? 'affordable' : ''}`;
            
            let productionText = '';
            if (building.type === 'click_multiplier') {
                productionText = `点击×${building.baseProduction.toFixed(2)}倍`;
            } else if (building.type === 'auto_clicker') {
                productionText = '每10秒自动点击1次';
            } else if (building.type === 'recursive') {
                const actualProduction = this.getActualProduction(building);
                productionText = `${this.formatNumber(actualProduction)}/秒`;
            } else if (building.type === 'normal') {
                const actualProduction = this.getActualProduction(building);
                productionText = `${this.formatNumber(actualProduction)}/秒`;
            }
            
            buildingCard.innerHTML = `
                <div class="building-header">
                    <div class="building-name">
                        <span class="building-icon">${building.icon}</span>
                        ${building.name}
                    </div>
                    <div class="building-count">${count}</div>
                </div>
                <div class="building-description">${building.description}</div>
                <div class="building-stats">
                    <div class="building-cost">
                        ${this.buyAmount > 1 ? `${this.buyAmount}个: ` : '成本: '}${this.formatNumber(cost)}
                    </div>
                    <div class="building-production">${productionText}</div>
                </div>
            `;
            
            // 左键购买，右键查看详情
            buildingCard.addEventListener('click', () => this.purchaseBuilding(building));
            buildingCard.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showBuildingDetails(building);
            });
            
            // 添加详情按钮
            const detailsBtn = document.createElement('button');
            detailsBtn.textContent = 'ℹ️';
            detailsBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.7;
                padding: 2px;
            `;
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBuildingDetails(building);
            });
            
            buildingCard.style.position = 'relative';
            buildingCard.appendChild(detailsBtn);
            buildingsGrid.appendChild(buildingCard);
        });
    }
    
    purchaseBuilding(building) {
        const cost = this.getBulkCost(building, this.buyAmount);
        
        if (window.game && window.game.timeEnergy >= cost) {
            // 扣除能量
            window.game.timeEnergy -= cost;
            
            // 增加建筑数量
            this.buildingCounts[building.id] = (this.buildingCounts[building.id] || 0) + this.buyAmount;
            
            // 更新产出
            this.updateProduction();
            
            // 更新UI
            this.renderBuildings();
            window.game.updateUI();
            
            // 购买动画
            const buildingCard = event.currentTarget;
            buildingCard.classList.add('building-purchase');
            setTimeout(() => buildingCard.classList.remove('building-purchase'), 300);
            
            // 显示购买通知
            const message = this.buyAmount === 1 
                ? `购买了 ${building.name}！` 
                : `购买了 ${this.buyAmount} 个 ${building.name}！`;
            window.game.showNotification(message, 'success');
            
            // 检查解锁新建筑
            this.checkUnlocks();
            
            // 检查升级
            if (window.upgradesManager) {
                window.upgradesManager.checkAvailableUpgrades();
            }
            
            // 保存游戏
            window.game.saveGame();
        } else {
            window.game.showNotification('时间能量不足！', 'error');
        }
    }
    
    getBuildingCost(building) {
        const count = this.buildingCounts[building.id] || 0;
        return Math.floor(building.baseCost * Math.pow(1.15, count));
    }
    
    // 计算批量购买成本
    getBulkCost(building, amount) {
        const currentCount = this.buildingCounts[building.id] || 0;
        let totalCost = 0;
        
        for (let i = 0; i < amount; i++) {
            const cost = Math.floor(building.baseCost * Math.pow(1.15, currentCount + i));
            totalCost += cost;
        }
        
        return totalCost;
    }
    
    getRecursiveProduction(building) {
        const count = this.buildingCounts[building.id] || 0;
        if (count === 0) return 0;
        
        // 递归复制机：数量越多，单个效率越高
        const multiplier = 1 + (count - 1) * 0.01; // 每个额外的复制机增加1%效率
        return building.baseProduction * multiplier;
    }
    
    // 获取建筑的实际产量（包含升级效果）
    getActualProduction(building) {
        let production = building.baseProduction;
        
        if (building.type === 'recursive') {
            production = this.getRecursiveProduction(building);
        }
        
        // 应用升级效果
        if (window.upgradesManager) {
            production *= window.upgradesManager.getBuildingMultiplier(building.id);
            
            // 特殊：递归加成
            if (building.id === 'recursive_copier') {
                production *= window.upgradesManager.getRecursiveMultiplier();
            }
        }
        
        return production;
    }
    
    updateProduction() {
        this.totalProduction = 0;
        let clickMultiplier = 1;
        
        this.buildings.forEach(building => {
            const count = this.buildingCounts[building.id] || 0;
            if (count === 0) return;
            
            if (building.type === 'click_multiplier') {
                // 手动提取器增加点击效率（乘法加成）
                clickMultiplier *= Math.pow(building.baseProduction, count);
            } else if (building.type === 'recursive') {
                // 递归复制机
                let production = this.getRecursiveProduction(building);
                
                // 应用升级效果
                if (window.upgradesManager) {
                    production *= window.upgradesManager.getBuildingMultiplier(building.id);
                    // 特殊：递归加成
                    if (building.id === 'recursive_copier') {
                        production *= window.upgradesManager.getRecursiveMultiplier();
                    }
                }
                
                this.totalProduction += count * production;
            } else if (building.type === 'normal') {
                // 普通建筑（包括原神）
                let production = building.baseProduction;
                
                // 应用升级效果
                if (window.upgradesManager) {
                    production *= window.upgradesManager.getBuildingMultiplier(building.id);
                }
                
                this.totalProduction += count * production;
            }
            // auto_clicker 在游戏主循环中处理
        });
        
        // 应用全局倍率（包括升级）
        if (window.upgradesManager) {
            this.totalProduction *= window.upgradesManager.globalMultiplier;
        }
        
        // 更新游戏中的数值
        if (window.game) {
            window.game.energyPerSecond = this.totalProduction;
            window.game.clickMultiplier = clickMultiplier;
            
            // 设置自动点击器
            this.setupAutoClickers();
        }
    }
    
    setupAutoClickers() {
        const autoClickerCount = this.buildingCounts['auto_clicker'] || 0;
        
        if (autoClickerCount > 0 && !window.game.autoClickerInterval) {
            window.game.autoClickerInterval = setInterval(() => {
                if (window.game) {
                    // 每个自动点击器每10秒点击一次
                    for (let i = 0; i < autoClickerCount; i++) {
                        window.game.addEnergy(window.game.getClickPower());
                    }
                    
                    // 静默工作，不显示通知
                }
            }, 10000); // 10秒
        } else if (autoClickerCount === 0 && window.game.autoClickerInterval) {
            clearInterval(window.game.autoClickerInterval);
            window.game.autoClickerInterval = null;
        }
    }
    
    checkUnlocks() {
        const totalBuildings = Object.values(this.buildingCounts).reduce((sum, count) => sum + count, 0);
        const energy = window.game ? window.game.timeEnergy : 0;
        
        // 根据总建筑数量和能量解锁新建筑
        const unlockConditions = [
            { index: 5, condition: totalBuildings >= 5 }, // 原神
            { index: 6, condition: energy >= 100000 }, // 三棱镜
            { index: 7, condition: totalBuildings >= 10 }, // 时间电阻
            { index: 8, condition: energy >= 1000000 }, // 祖母钟
            { index: 9, condition: totalBuildings >= 15 }, // 薛定谔的猫箱
            { index: 10, condition: energy >= 1e9 }, // 递归复制机
            { index: 11, condition: totalBuildings >= 25 }, // JS Console
            { index: 12, condition: energy >= 1e12 }, // 存档读取器
            { index: 13, condition: totalBuildings >= 40 }, // 第四面墙粉碎器
            { index: 14, condition: energy >= 1e15 } // 真正的时光机
        ];
        
        unlockConditions.forEach(({ index, condition }) => {
            if (condition && !this.buildings[index].unlocked) {
                this.buildings[index].unlocked = true;
                window.game.showNotification(`🔓 新建筑解锁: ${this.buildings[index].name}`, 'success');
                this.renderBuildings();
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
    
    getBuildingData() {
        return {
            counts: this.buildingCounts,
            totalProduction: this.totalProduction
        };
    }
    
    loadBuildings(data) {
        if (data && data.counts) {
            this.buildingCounts = data.counts;
            this.updateProduction();
            this.renderBuildings();
        }
    }
    
    // 重置所有建筑
    resetBuildings() {
        this.buildingCounts = {};
        this.totalProduction = 0;
        this.updateProduction();
        this.renderBuildings();
    }
    
    // 获取特定类型建筑的数量
    getBuildingCountByType(type) {
        let count = 0;
        this.buildings.forEach(building => {
            if (building.type === type) {
                count += this.buildingCounts[building.id] || 0;
            }
        });
        return count;
    }
    
    // 获取特定建筑的数量
    getBuildingCount(buildingId) {
        return this.buildingCounts[buildingId] || 0;
    }
    
    // 更新建筑可购买状态
    updateAffordableStatus() {
        const buildingCards = document.querySelectorAll('.building-card');
        buildingCards.forEach((card, index) => {
            const building = this.buildings.filter(b => b.unlocked)[index];
            if (building) {
                const cost = this.getBulkCost(building, this.buyAmount);
                const canAfford = window.game && window.game.timeEnergy >= cost;
                
                if (canAfford) {
                    card.classList.add('affordable');
                } else {
                    card.classList.remove('affordable');
                }
            }
        });
    }
    
    // 显示建筑详情
    showBuildingDetails(building) {
        const count = this.buildingCounts[building.id] || 0;
        const actualProduction = this.getActualProduction(building);
        const totalProduction = count * actualProduction;
        
        // 计算总产出（估算）
        const totalLifetimeProduction = this.getTotalLifetimeProduction(building.id);
        
        const detailsPanel = document.createElement('div');
        detailsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-width: 90vw;
            background: white;
            border: 2px solid #007bff;
            border-radius: 12px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: #333;
        `;
        
        detailsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007bff;">${building.icon} ${building.name}</h3>
                <button id="closeDetails" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #dc3545;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p style="color: #6c757d; line-height: 1.5;">${building.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0 0 5px 0; color: #495057;">拥有数量</h4>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #007bff;">${count}</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0 0 5px 0; color: #495057;">单体产量</h4>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #28a745;">
                        ${building.type === 'click_multiplier' ? `×${building.baseProduction.toFixed(2)}` : 
                          building.type === 'auto_clicker' ? '每10秒1次' : 
                          this.formatNumber(actualProduction) + '/秒'}
                    </p>
                </div>
                
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0 0 5px 0; color: #495057;">总产量</h4>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #17a2b8;">
                        ${building.type === 'click_multiplier' ? '点击倍率' : 
                          building.type === 'auto_clicker' ? `${count}次/10秒` : 
                          this.formatNumber(totalProduction) + '/秒'}
                    </p>
                </div>
                
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <h4 style="margin: 0 0 5px 0; color: #495057;">累计产出</h4>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #6f42c1;">
                        ${this.formatNumber(totalLifetimeProduction)}
                    </p>
                </div>
            </div>
            
            <div style="background: #e7f3ff; padding: 10px; border-radius: 6px; border-left: 4px solid #007bff;">
                <h4 style="margin: 0 0 5px 0; color: #495057;">下一个建筑成本</h4>
                <p style="margin: 0; font-weight: bold; color: #007bff;">
                    ${this.formatNumber(this.getBuildingCost(building))}
                </p>
            </div>
        `;
        
        document.body.appendChild(detailsPanel);
        
        // 关闭按钮事件
        document.getElementById('closeDetails').addEventListener('click', () => {
            document.body.removeChild(detailsPanel);
        });
        
        // 点击外部关闭
        detailsPanel.addEventListener('click', (e) => {
            if (e.target === detailsPanel) {
                document.body.removeChild(detailsPanel);
            }
        });
    }
    
    // 获取建筑累计产出（估算）
    getTotalLifetimeProduction(buildingId) {
        // 这里可以实现更复杂的统计，目前返回简单估算
        const count = this.buildingCounts[buildingId] || 0;
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building || building.type === 'click_multiplier' || building.type === 'auto_clicker') {
            return 0;
        }
        
        const actualProduction = this.getActualProduction(building);
        const gameTime = (Date.now() - (window.game?.gameStartTime || Date.now())) / 1000;
        return count * actualProduction * gameTime * 0.5; // 粗略估算
    }
}

// 初始化建筑管理器
let buildingsManager;
document.addEventListener('DOMContentLoaded', () => {
    buildingsManager = new BuildingsManager();
    window.buildingsManager = buildingsManager; // 全局访问
});