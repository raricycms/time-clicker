// UI管理模块
class UIManager {
    constructor() {
        this.isMenuOpen = false;
        this.isStatsOpen = false;
        this.isSettingsOpen = false;
        
        this.init();
    }
    
    init() {
        this.createMenu();
        this.setupEventListeners();
        this.setupTabs();
        this.startUIUpdates();
    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // 移除所有active类
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 添加active类到当前标签
                btn.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');
            });
        });
    }
    
    createMenu() {
        // 创建菜单按钮
        const menuButton = document.createElement('button');
        menuButton.id = 'menuButton';
        menuButton.innerHTML = '☰';
        menuButton.className = 'menu-button';
        menuButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 255, 255, 0.2);
            border: 2px solid #00ffff;
            border-radius: 50%;
            color: #00ffff;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        menuButton.addEventListener('click', () => this.toggleMenu());
        document.body.appendChild(menuButton);
        
        // 创建菜单面板
        const menuPanel = document.createElement('div');
        menuPanel.id = 'menuPanel';
        menuPanel.className = 'menu-panel';
        menuPanel.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 20px;
            z-index: 999;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        menuPanel.innerHTML = `
            <h3 style="color: #00ffff; margin-bottom: 20px; text-align: center;">游戏菜单</h3>
            <div class="menu-buttons">
                <button class="menu-item" id="statsButton">📊 统计信息</button>
                <button class="menu-item" id="settingsButton">⚙️ 设置</button>
                <button class="menu-item" id="exportUpgradeListButton">📑 导出升级清单</button>
                <button class="menu-item" id="exportButton">💾 导出存档</button>
                <button class="menu-item" id="importButton">📁 导入存档</button>
                <button class="menu-item" id="resetButton">🔄 重置游戏</button>
                <button class="menu-item" id="helpButton">❓ 帮助</button>
            </div>
        `;
        
        document.body.appendChild(menuPanel);
        
        // 添加菜单项样式
        const style = document.createElement('style');
        style.textContent = `
            .menu-item {
                display: block;
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid #00ffff;
                border-radius: 8px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .menu-item:hover {
                background: rgba(0, 255, 255, 0.3);
                transform: translateX(5px);
            }
            
            .menu-button:hover {
                background: rgba(0, 255, 255, 0.4);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // 菜单项点击事件
        document.getElementById('statsButton').addEventListener('click', () => this.showStats());
        document.getElementById('settingsButton').addEventListener('click', () => this.showSettings());
        document.getElementById('exportButton').addEventListener('click', () => this.exportSave());
        document.getElementById('exportUpgradeListButton').addEventListener('click', () => this.exportUpgradeListMarkdown());
        document.getElementById('importButton').addEventListener('click', () => this.importSave());
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        document.getElementById('helpButton').addEventListener('click', () => this.showHelp());
        
        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('#menuPanel') && !e.target.closest('#menuButton')) {
                this.closeMenu();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllPanels();
            }
        });
    }

    // 生成并复制“阈值翻倍升级 + 价格”的 Markdown 清单
    exportUpgradeListMarkdown() {
        const um = window.upgradesManager;
        if (!um) {
            window.game?.showNotification('升级系统未初始化', 'error');
            return;
        }
        // 分组：仅建筑升级（含固定与自动生成），按建筑归档
        const buildingMap = new Map();
        const buildingNames = {
            'alarm_clock': '闹钟',
            'graphics_card': '显卡',
            'cpu': 'CPU',
            'genshin_impact': '原神',
            'prism': '三棱镜',
            'time_resistor': '时间电阻',
            'grandmother_clock': '祖母钟',
            'schrodinger_box': '薛定谔的猫箱',
            'recursive_copier': '递归复制机',
            'js_console': 'JavaScript Console',
            'save_editor': '存档读取器',
            'fourth_wall_breaker': '第四面墙粉碎器',
            'real_time_machine': '真正的时光机'
        };
        um.upgrades.forEach(u => {
            if (u.type !== 'building' || !u.requiredBuilding || typeof u.requiredCount !== 'number') return;
            const arr = buildingMap.get(u.requiredBuilding) || [];
            arr.push(u);
            buildingMap.set(u.requiredBuilding, arr);
        });
        // 生成 Markdown
        let md = '# 阈值翻倍升级清单（自动导出）\n\n';
        buildingMap.forEach((list, buildingId) => {
            const display = buildingNames[buildingId] || buildingId;
            // 按数量升序
            list.sort((a, b) => a.requiredCount - b.requiredCount);
            md += `## ${display}（${buildingId}）\n`;
            md += '| 阈值 | 升级名称 | 价格 |\n|-----|----------|------|\n';
            list.forEach(u => {
                md += `| ${u.requiredCount} | ${u.name} | ${this.formatNumber(u.cost)} |\n`;
            });
            md += '\n';
        });
        // 复制到剪贴板
        this.copyToClipboard(md);
        window.game?.showNotification('升级清单已复制为 Markdown！', 'success');
    }

    copyToClipboard(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
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
    
    toggleMenu() {
        const menuPanel = document.getElementById('menuPanel');
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        const menuPanel = document.getElementById('menuPanel');
        menuPanel.style.transform = 'translateX(0)';
        this.isMenuOpen = true;
    }
    
    closeMenu() {
        const menuPanel = document.getElementById('menuPanel');
        menuPanel.style.transform = 'translateX(-100%)';
        this.isMenuOpen = false;
    }
    
    closeAllPanels() {
        this.closeMenu();
        this.closeStats();
        this.closeSettings();
    }
    
    showStats() {
        this.closeMenu();
        this.createStatsPanel();
    }
    
    createStatsPanel() {
        if (this.isStatsOpen) return;
        
        const game = window.game;
        const buildings = window.buildingsManager;
        const saveInfo = window.saveManager.getSaveInfo();
        
        const statsPanel = document.createElement('div');
        statsPanel.id = 'statsPanel';
        statsPanel.className = 'stats-panel';
        statsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            z-index: 1001;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;
        
        const totalBuildings = Object.values(buildings.buildingCounts).reduce((sum, count) => sum + count, 0);
        const playTime = Date.now() - game.gameStartTime;
        
        statsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #00ffff; margin: 0;">📊 游戏统计</h2>
                <button id="closeStats" style="background: none; border: none; color: #ff0000; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="stat-section">
                    <h3 style="color: #ff00ff; margin-bottom: 15px;">基础信息</h3>
                    <div class="stat-item">
                        <span class="stat-label">当前时间能量:</span>
                        <span class="stat-value">${game.formatNumber(game.timeEnergy)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">每秒产出:</span>
                        <span class="stat-value">${game.formatNumber(game.energyPerSecond)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">点击力量:</span>
                        <span class="stat-value">${game.formatNumber(game.clickPower)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">总点击次数:</span>
                        <span class="stat-value">${game.formatNumber(game.totalClicks)}</span>
                    </div>
                </div>
                
                <div class="stat-section">
                    <h3 style="color: #ff00ff; margin-bottom: 15px;">建筑信息</h3>
                    <div class="stat-item">
                        <span class="stat-label">总建筑数量:</span>
                        <span class="stat-value">${totalBuildings}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">建筑类型:</span>
                        <span class="stat-value">${Object.keys(buildings.buildingCounts).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前产出:</span>
                        <span class="stat-value">${game.formatNumber(buildings.totalProduction)}/秒</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">累计产量:</span>
                        <span class="stat-value">${game.formatNumber(game.totalEnergyEarned)}</span>
                    </div>
                </div>
                
                <div class="stat-section">
                    <h3 style="color: #ff00ff; margin-bottom: 15px;">游戏进度</h3>
                    <div class="stat-item">
                        <span class="stat-label">完成度:</span>
                        <span class="stat-value">${((game.timeEnergy / game.targetEnergy) * 100).toFixed(2)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">剩余能量:</span>
                        <span class="stat-value">${game.formatNumber(game.targetEnergy - game.timeEnergy)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">成就解锁:</span>
                        <span class="stat-value">${(game.achievements || new Set()).size}</span>
                    </div>
                </div>
                
                <div class="stat-section">
                    <h3 style="color: #ff00ff; margin-bottom: 15px;">时间统计</h3>
                    <div class="stat-item">
                        <span class="stat-label">游戏时间:</span>
                        <span class="stat-value">${game.formatTime(playTime)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">点击效率:</span>
                        <span class="stat-value">${(game.totalClicks / (playTime / 1000)).toFixed(2)}/秒</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最后保存:</span>
                        <span class="stat-value">${saveInfo ? new Date(saveInfo.saveTime).toLocaleString() : '未知'}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button id="refreshStats" style="
                    background: rgba(0, 255, 255, 0.2);
                    border: 1px solid #00ffff;
                    border-radius: 8px;
                    color: #00ffff;
                    padding: 10px 20px;
                    cursor: pointer;
                    margin-right: 10px;
                ">刷新统计</button>
                <button id="exportStats" style="
                    background: rgba(255, 0, 255, 0.2);
                    border: 1px solid #ff00ff;
                    border-radius: 8px;
                    color: #ff00ff;
                    padding: 10px 20px;
                    cursor: pointer;
                ">导出统计</button>
            </div>
        `;
        
        // 添加统计样式
        const statStyle = document.createElement('style');
        statStyle.textContent = `
            .stat-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 15px;
                border: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .stat-item {
                display: flex;
                justify-content: space-between;
                margin: 8px 0;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .stat-label {
                color: #cccccc;
            }
            
            .stat-value {
                color: #00ffff;
                font-weight: bold;
            }
        `;
        document.head.appendChild(statStyle);
        
        document.body.appendChild(statsPanel);
        this.isStatsOpen = true;
        
        // 关闭按钮事件
        document.getElementById('closeStats').addEventListener('click', () => this.closeStats());
        document.getElementById('refreshStats').addEventListener('click', () => {
            document.body.removeChild(statsPanel);
            this.isStatsOpen = false;
            this.showStats();
        });
        document.getElementById('exportStats').addEventListener('click', () => this.exportStats());
    }
    
    closeStats() {
        const statsPanel = document.getElementById('statsPanel');
        if (statsPanel) {
            document.body.removeChild(statsPanel);
            this.isStatsOpen = false;
        }
    }
    
    showSettings() {
        this.closeMenu();
        this.createSettingsPanel();
    }
    
    createSettingsPanel() {
        if (this.isSettingsOpen) return;
        
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settingsPanel';
        settingsPanel.className = 'settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 90vw;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #ff00ff;
            border-radius: 15px;
            padding: 30px;
            z-index: 1001;
            backdrop-filter: blur(10px);
        `;
        
        settingsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ff00ff; margin: 0;">⚙️ 游戏设置</h2>
                <button id="closeSettings" style="background: none; border: none; color: #ff0000; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
            <div class="setting-item">
                <label style="color: #cccccc; display: block; margin-bottom: 5px;">自动保存间隔 (秒):</label>
                <input type="number" id="autoSaveInterval" value="30" min="10" max="300" style="
                    width: 100%;
                    padding: 8px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #00ffff;
                    border-radius: 5px;
                    color: #ffffff;
                ">
            </div>
            
            <div class="setting-item">
                <label style="color: #cccccc; display: block; margin-bottom: 5px;">事件触发概率:</label>
                <input type="range" id="eventProbability" min="0" max="10" value="5" style="width: 100%;">
                <span id="eventProbabilityValue" style="color: #00ffff;">5%</span>
            </div>
            
            <div class="setting-item">
                <label style="color: #cccccc; display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="soundEnabled" checked style="margin-right: 8px;">
                    启用音效
                </label>
            </div>
            
            <div class="setting-item">
                <label style="color: #cccccc; display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="animationsEnabled" checked style="margin-right: 8px;">
                    启用动画效果
                </label>
            </div>
            
            <div class="setting-item">
                <label style="color: #cccccc; display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="notificationsEnabled" checked style="margin-right: 8px;">
                    启用通知
                </label>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button id="saveSettings" style="
                    background: rgba(0, 255, 0, 0.2);
                    border: 1px solid #00ff00;
                    border-radius: 8px;
                    color: #00ff00;
                    padding: 10px 20px;
                    cursor: pointer;
                    margin-right: 10px;
                ">保存设置</button>
                <button id="resetSettings" style="
                    background: rgba(255, 0, 0, 0.2);
                    border: 1px solid #ff0000;
                    border-radius: 8px;
                    color: #ff0000;
                    padding: 10px 20px;
                    cursor: pointer;
                ">重置设置</button>
            </div>
        `;
        
        document.body.appendChild(settingsPanel);
        this.isSettingsOpen = true;
        
        // 设置事件监听
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('eventProbability').addEventListener('input', (e) => {
            document.getElementById('eventProbabilityValue').textContent = e.target.value + '%';
        });
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
    }
    
    closeSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            document.body.removeChild(settingsPanel);
            this.isSettingsOpen = false;
        }
    }
    
    exportSave() {
        this.closeMenu();
        window.saveManager.exportSave();
    }
    
    importSave() {
        this.closeMenu();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                window.saveManager.importSave(file);
            }
        };
        input.click();
    }
    
    resetGame() {
        this.closeMenu();
        if (confirm('确定要重置游戏吗？这将删除所有进度！')) {
            if (confirm('再次确认：这将永久删除所有游戏数据！')) {
                window.saveManager.deleteSave();
                location.reload();
            }
        }
    }
    
    showHelp() {
        this.closeMenu();
        this.createHelpPanel();
    }
    
    createHelpPanel() {
        const helpPanel = document.createElement('div');
        helpPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #ffff00;
            border-radius: 15px;
            padding: 30px;
            z-index: 1001;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;
        
        helpPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ffff00; margin: 0;">❓ 游戏帮助</h2>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #ff0000; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
            <div style="color: #cccccc; line-height: 1.6;">
                <h3 style="color: #00ffff;">游戏目标</h3>
                <p>你的时光机坏了，需要收集1万亿点时间能量来修复它！</p>
                
                <h3 style="color: #00ffff;">基本玩法</h3>
                <ul>
                    <li>点击时光机收集时间能量</li>
                    <li>购买建筑自动产生能量</li>
                    <li>建筑会随着购买数量增加成本</li>
                    <li>解锁更多建筑类型</li>
                </ul>
                
                <h3 style="color: #00ffff;">快捷键</h3>
                <ul>
                    <li>空格键：点击时光机</li>
                    <li>Ctrl+S：手动保存游戏</li>
                    <li>ESC：关闭所有面板</li>
                </ul>
                
                <h3 style="color: #00ffff;">特殊事件</h3>
                <p>游戏中会随机触发时空事件，可能带来正面或负面影响：</p>
                <ul>
                    <li>时空风暴：建筑产出翻倍</li>
                    <li>时间加速：点击力量翻倍</li>
                    <li>能量爆发：获得大量能量</li>
                    <li>时间悖论：建筑暂时停止工作</li>
                </ul>
                
                <h3 style="color: #00ffff;">成就系统</h3>
                <p>完成特定目标解锁成就，获得成就感！</p>
                
                <h3 style="color: #00ffff;">存档系统</h3>
                <p>游戏会自动保存，你也可以手动导出/导入存档。</p>
            </div>
        `;
        
        document.body.appendChild(helpPanel);
    }
    
    saveSettings() {
        const settings = {
            autoSaveInterval: parseInt(document.getElementById('autoSaveInterval').value),
            eventProbability: parseInt(document.getElementById('eventProbability').value),
            soundEnabled: document.getElementById('soundEnabled').checked,
            animationsEnabled: document.getElementById('animationsEnabled').checked,
            notificationsEnabled: document.getElementById('notificationsEnabled').checked
        };
        
        localStorage.setItem('timeClickerSettings', JSON.stringify(settings));
        this.closeSettings();
        window.game.showNotification('设置已保存！', 'success');
    }
    
    resetSettings() {
        localStorage.removeItem('timeClickerSettings');
        this.closeSettings();
        window.game.showNotification('设置已重置！', 'success');
    }
    
    exportStats() {
        const game = window.game;
        const buildings = window.buildingsManager;
        const saveInfo = window.saveManager.getSaveInfo();
        
        const stats = {
            exportTime: new Date().toISOString(),
            gameStats: {
                timeEnergy: game.timeEnergy,
                energyPerSecond: game.energyPerSecond,
                clickPower: game.clickPower,
                totalClicks: game.totalClicks,
                playTime: Date.now() - game.gameStartTime,
                achievements: Array.from(game.achievements || []),
                buildings: buildings.buildingCounts,
                totalBuildings: Object.values(buildings.buildingCounts).reduce((sum, count) => sum + count, 0)
            }
        };
        
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `timeclicker_stats_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        window.game.showNotification('统计信息已导出！', 'success');
    }
    
    startUIUpdates() {
        // 定期更新UI元素
        setInterval(() => {
            this.updateFloatingElements();
        }, 100);
    }
    
    updateFloatingElements() {
        // 更新浮动元素的位置和状态
        const floatingElements = document.querySelectorAll('.energy-pop, .click-effect');
        floatingElements.forEach(element => {
            if (element.style.opacity === '0' || element.style.display === 'none') {
                element.remove();
            }
        });
    }
}

// 初始化UI管理器
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
    window.uiManager = uiManager; // 全局访问
});
