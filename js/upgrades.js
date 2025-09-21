// 升级系统
class UpgradesManager {
    constructor() {
        this.upgrades = [
            // 建筑升级 - 拥有特定数量建筑后解锁
            {
                id: 'alarm_clock_upgrade_1',
                name: '铜制齿轮',
                description: '闹钟的产量翻倍',
                cost: 300,
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
                cost: 1000,
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
                cost: 5000,
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
                cost: 8000,
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
                cost: 30000,
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
                cost: 100000,
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
                cost: 30000,
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
                cost: 100000,
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
                cost: 1000000,
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
                cost: 1000000,
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
                cost: 10000000,
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
                cost: 100000000,
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
                cost: 1000000000,
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
                cost: 100000,
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
                cost: 1000000,
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
                cost: 1000000,
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
                cost: 5000000,
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
            
            // 三棱镜升级
            {
                id: 'prism_upgrade_1',
                name: '光谱分析',
                description: '三棱镜的产量翻倍',
                cost: 5000000,
                requiredBuilding: 'prism',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('prism'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'prism_upgrade_2',
                name: '彩虹强化',
                description: '三棱镜的产量再次翻倍',
                cost: 50000000,
                requiredBuilding: 'prism',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('prism'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'prism_upgrade_3',
                name: '全息投影',
                description: '三棱镜的产量再次翻倍',
                cost: 500000000,
                requiredBuilding: 'prism',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('prism'),
                purchased: false,
                type: 'building'
            },
            
            // 时间电阻升级
            {
                id: 'time_resistor_upgrade_1',
                name: '超导材料',
                description: '时间电阻的产量翻倍',
                cost: 100000000,
                requiredBuilding: 'time_resistor',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('time_resistor'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'time_resistor_upgrade_2',
                name: '量子隧道',
                description: '时间电阻的产量再次翻倍',
                cost: 1000000000,
                requiredBuilding: 'time_resistor',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('time_resistor'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'time_resistor_upgrade_3',
                name: '时空扭曲',
                description: '时间电阻的产量再次翻倍',
                cost: 10000000000,
                requiredBuilding: 'time_resistor',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('time_resistor'),
                purchased: false,
                type: 'building'
            },
            
            // 祖母钟升级
            {
                id: 'grandmother_clock_upgrade_1',
                name: '黄金齿轮',
                description: '祖母钟的产量翻倍',
                cost: 2000000000,
                requiredBuilding: 'grandmother_clock',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('grandmother_clock'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'grandmother_clock_upgrade_2',
                name: '水晶摆锤',
                description: '祖母钟的产量再次翻倍',
                cost: 20000000000,
                requiredBuilding: 'grandmother_clock',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('grandmother_clock'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'grandmother_clock_upgrade_3',
                name: '永动机制',
                description: '祖母钟的产量再次翻倍',
                cost: 200000000000,
                requiredBuilding: 'grandmother_clock',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('grandmother_clock'),
                purchased: false,
                type: 'building'
            },
            
            // 薛定谔的猫箱升级
            {
                id: 'schrodinger_box_upgrade_1',
                name: '观测优化',
                description: '薛定谔的猫箱的产量翻倍',
                cost: 50000000000,
                requiredBuilding: 'schrodinger_box',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('schrodinger_box'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'schrodinger_box_upgrade_2',
                name: '叠加增强',
                description: '薛定谔的猫箱的产量再次翻倍',
                cost: 500000000000,
                requiredBuilding: 'schrodinger_box',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('schrodinger_box'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'schrodinger_box_upgrade_3',
                name: '平行宇宙',
                description: '薛定谔的猫箱的产量再次翻倍',
                cost: 5000000000000,
                requiredBuilding: 'schrodinger_box',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('schrodinger_box'),
                purchased: false,
                type: 'building'
            },
            
            // 递归复制机升级
            {
                id: 'recursive_copier_upgrade_1',
                name: '复制优化',
                description: '递归复制机的产量翻倍',
                cost: 1500000000000,
                requiredBuilding: 'recursive_copier',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('recursive_copier'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'recursive_copier_upgrade_2',
                name: '自我进化',
                description: '递归复制机的产量再次翻倍',
                cost: 15000000000000,
                requiredBuilding: 'recursive_copier',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('recursive_copier'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'recursive_copier_upgrade_3',
                name: '无限递归',
                description: '递归复制机的产量再次翻倍',
                cost: 150000000000000,
                requiredBuilding: 'recursive_copier',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('recursive_copier'),
                purchased: false,
                type: 'building'
            },
            
            // JavaScript Console升级
            {
                id: 'js_console_upgrade_1',
                name: '代码优化',
                description: 'JavaScript Console的产量翻倍',
                cost: 50000000000000,
                requiredBuilding: 'js_console',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('js_console'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'js_console_upgrade_2',
                name: '编译加速',
                description: 'JavaScript Console的产量再次翻倍',
                cost: 500000000000000,
                requiredBuilding: 'js_console',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('js_console'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'js_console_upgrade_3',
                name: 'AI助手',
                description: 'JavaScript Console的产量再次翻倍',
                cost: 5000000000000000,
                requiredBuilding: 'js_console',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('js_console'),
                purchased: false,
                type: 'building'
            },
            
            // 存档读取器升级
            {
                id: 'save_editor_upgrade_1',
                name: '内存扩展',
                description: '存档读取器的产量翻倍',
                cost: 5000000000000000,
                requiredBuilding: 'save_editor',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('save_editor'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'save_editor_upgrade_2',
                name: '并行处理',
                description: '存档读取器的产量再次翻倍',
                cost: 50000000000000000,
                requiredBuilding: 'save_editor',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('save_editor'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'save_editor_upgrade_3',
                name: '时间线操控',
                description: '存档读取器的产量再次翻倍',
                cost: 500000000000000000,
                requiredBuilding: 'save_editor',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('save_editor'),
                purchased: false,
                type: 'building'
            },
            
            // 第四面墙粉碎器升级
            {
                id: 'fourth_wall_breaker_upgrade_1',
                name: '现实破碎',
                description: '第四面墙粉碎器的产量翻倍',
                cost: 500000000000000000,
                requiredBuilding: 'fourth_wall_breaker',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('fourth_wall_breaker'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'fourth_wall_breaker_upgrade_2',
                name: '维度穿越',
                description: '第四面墙粉碎器的产量再次翻倍',
                cost: 5000000000000000000,
                requiredBuilding: 'fourth_wall_breaker',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('fourth_wall_breaker'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'fourth_wall_breaker_upgrade_3',
                name: '元游戏掌控',
                description: '第四面墙粉碎器的产量再次翻倍',
                cost: 50000000000000000000,
                requiredBuilding: 'fourth_wall_breaker',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('fourth_wall_breaker'),
                purchased: false,
                type: 'building'
            },
            
            // 真正的时光机升级
            {
                id: 'real_time_machine_upgrade_1',
                name: '时空校准',
                description: '真正的时光机的产量翻倍',
                cost: 50000000000000000000,
                requiredBuilding: 'real_time_machine',
                requiredCount: 1,
                effect: () => this.doubleBuildingProduction('real_time_machine'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'real_time_machine_upgrade_2',
                name: '因果修正',
                description: '真正的时光机的产量再次翻倍',
                cost: 500000000000000000000,
                requiredBuilding: 'real_time_machine',
                requiredCount: 5,
                effect: () => this.doubleBuildingProduction('real_time_machine'),
                purchased: false,
                type: 'building'
            },
            {
                id: 'real_time_machine_upgrade_3',
                name: '完美修复',
                description: '真正的时光机的产量再次翻倍',
                cost: 5000000000000000000000,
                requiredBuilding: 'real_time_machine',
                requiredCount: 25,
                effect: () => this.doubleBuildingProduction('real_time_machine'),
                purchased: false,
                type: 'building'
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
        this.alarmSynergyTargets = {}; // 闹钟联动已解锁的目标建筑
        
        // 基于阈值自动生成更多“翻倍”升级
        this.generateBulkDoublingUpgrades();

        // 生成闹钟联动升级 & 新的组合升级
        this.generateAlarmSynergyUpgrades();
        this.generateAdditionalCombos();

        // 生成全局升级序列（从1K开始，每次价格×2，按周期赋予倍率）
        this.generateGlobalTieredUpgrades();

        this.init();
    }
    
    init() {
        this.renderUpgrades();
    }

    // 自动生成大量“翻倍”建筑升级（阈值：1,5,25,50,...,1000）
    generateBulkDoublingUpgrades() {
        const thresholds = [1, 5, 25, 50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000];
        // 参与自动生成的建筑（排除点击倍率与自动点击器）
        const buildingBaseCosts = {
            'alarm_clock': 50,
            'graphics_card': 500,
            'cpu': 3000,
            'genshin_impact': 50000,
            'prism': 1000000,
            'time_resistor': 20000000,
            'grandmother_clock': 400000000,
            'schrodinger_box': 10000000000,
            'recursive_copier': 300000000000,
            'js_console': 10000000000000,
            'save_editor': 100000000000000,
            'fourth_wall_breaker': 10000000000000000,
            'real_time_machine': 1000000000000000000
        };
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
        // 保留已存在的早期固定成本，避免破坏前期平衡
        const fixedCosts = {
            'alarm_clock': { 1: 300, 5: 1000, 25: 5000 },
            'graphics_card': { 1: 8000, 5: 30000, 25: 100000 },
            'cpu': { 1: 30000, 5: 100000, 25: 1000000 },
            'genshin_impact': { 1: 1000000, 5: 10000000, 10: 100000000, 25: 1000000000 },
            'prism': { 1: 5000000, 5: 50000000, 25: 500000000 },
            'time_resistor': { 1: 100000000, 5: 1000000000, 25: 10000000000 },
            'grandmother_clock': { 1: 2000000000, 5: 20000000000, 25: 200000000000 },
            'schrodinger_box': { 1: 50000000000, 5: 500000000000, 25: 5000000000000 },
            'recursive_copier': { 1: 1500000000000, 5: 15000000000000, 25: 150000000000000 },
            'js_console': { 1: 50000000000000, 5: 500000000000000, 25: 5000000000000000 },
            'save_editor': { 1: 5000000000000000, 5: 50000000000000000, 25: 500000000000000000 },
            'fourth_wall_breaker': { 1: 500000000000000000, 5: 5000000000000000000, 25: 50000000000000000000 },
            'real_time_machine': { 1: 50000000000000000000, 5: 500000000000000000000, 25: 5000000000000000000000 }
        };

        const hasExisting = (buildingId, count) => {
            return this.upgrades.some(u => u.type === 'building' && u.requiredBuilding === buildingId && u.requiredCount === count);
        };

        const computeCost = (buildingId, baseCost, count) => {
            const fixed = fixedCosts[buildingId]?.[count];
            if (fixed) return fixed;
            // 平滑通用公式（可微调）：baseCost * (count^1.15) * 6
            const cost = Math.floor(baseCost * Math.pow(count, 1.15) * 6);
            return Math.max(cost, baseCost * 2);
        };

        Object.keys(buildingBaseCosts).forEach(buildingId => {
            const baseCost = buildingBaseCosts[buildingId];
            thresholds.forEach(count => {
                // 跳过未在清单内的阈值（如 genshin 的10 已在 fixedCosts 中保留，不在本表）
                if (hasExisting(buildingId, count)) return;
                const id = `${buildingId}_auto_x${count}`;
                const name = this.getAutoUpgradeName(buildingId, buildingNames[buildingId], thresholds, count);
                const cost = computeCost(buildingId, baseCost, count);
                this.upgrades.push({
                    id,
                    name,
                    description: `${buildingNames[buildingId]}的产量翻倍`,
                    cost,
                    requiredBuilding: buildingId,
                    requiredCount: count,
                    effect: () => this.doubleBuildingProduction(buildingId),
                    purchased: false,
                    type: 'building'
                });
            });
        });
    }

    // 统一的自动命名：主题 + 阶段称号（更好听）
    getAutoUpgradeName(buildingId, displayName, thresholds, count) {
        const idx = Math.max(0, thresholds.indexOf(count));
        const stages = [
            '初鸣', '雅律', '匀速', '恒振', '报时', '回响', '谐振', '共鸣', '准点', '天文', '恒星', '星轨', '纪元', '子午', '恒时', '永昼', '永恒'
        ];
        const stage = stages[idx] || `阶段${idx + 1}`;
        const themes = {
            'alarm_clock': '时计校准',
            'graphics_card': '超频固件',
            'cpu': '微架构',
            'genshin_impact': '进程优化',
            'prism': '光谱精炼',
            'time_resistor': '超导调谐',
            'grandmother_clock': '机芯重铸',
            'schrodinger_box': '观测协议',
            'recursive_copier': '递归展开',
            'js_console': '编译链优化',
            'save_editor': '时间线重构',
            'fourth_wall_breaker': '元现实介入',
            'real_time_machine': '因果修复'
        };
        const theme = themes[buildingId] || `${displayName}升级`;
        return `${theme}·${stage}`;
    }

    // 生成“闹钟联动”升级：至少1个闹钟 + 10个目标建筑 → 解锁
    generateAlarmSynergyUpgrades() {
        const targets = [
            'graphics_card', 'cpu', 'genshin_impact', 'prism', 'time_resistor',
            'grandmother_clock', 'schrodinger_box', 'recursive_copier', 'js_console',
            'save_editor', 'fourth_wall_breaker', 'real_time_machine'
        ];
        const names = {
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
        const baseCosts = {
            'graphics_card': 500,
            'cpu': 3000,
            'genshin_impact': 50000,
            'prism': 1000000,
            'time_resistor': 20000000,
            'grandmother_clock': 400000000,
            'schrodinger_box': 10000000000,
            'recursive_copier': 300000000000,
            'js_console': 10000000000000,
            'save_editor': 100000000000000,
            'fourth_wall_breaker': 10000000000000000,
            'real_time_machine': 1000000000000000000
        };
        targets.forEach(target => {
            const id = `alarm_synergy_${target}`;
            // 避免重复添加
            if (this.upgrades.some(u => u.id === id)) return;
            const cost = baseCosts[target] * 4; // 定价：目标建筑基础价的4倍
            this.upgrades.push({
                id,
                name: `时计联动·${names[target]}`,
                description: `每个闹钟使${names[target]}产量+1%（与其它加成相乘）`,
                cost,
                requiredBuildings: ['alarm_clock', target],
                requiredCounts: [1, 10],
                effect: () => { this.alarmSynergyTargets[target] = true; },
                purchased: false,
                type: 'combo'
            });
        });
    }

    // 新增的组合升级示例
    generateAdditionalCombos() {
        const combos = [
            {
                id: 'combo_prism_resistor',
                name: '光电耦合',
                description: '三棱镜与时间电阻的产量各增加50%',
                cost: 50000000,
                requiredBuildings: ['prism', 'time_resistor'],
                requiredCounts: [5, 5],
                effect: () => {
                    this.addBuildingMultiplier('prism', 0.5);
                    this.addBuildingMultiplier('time_resistor', 0.5);
                },
                purchased: false,
                type: 'combo'
            },
            {
                id: 'combo_js_save',
                name: '回溯编译',
                description: 'JavaScript Console 与 存档读取器的产量各增加50%',
                cost: 50000000000000, // 5e13
                requiredBuildings: ['js_console', 'save_editor'],
                requiredCounts: [1, 1],
                effect: () => {
                    this.addBuildingMultiplier('js_console', 0.5);
                    this.addBuildingMultiplier('save_editor', 0.5);
                },
                purchased: false,
                type: 'combo'
            }
        ];
        combos.forEach(c => {
            if (!this.upgrades.some(u => u.id === c.id)) {
                this.upgrades.push(c);
            }
        });
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
        // 乘法叠加：传入0.1则表示×1.1，0.02表示×1.02
        this.globalMultiplier *= (1 + multiplier);
    }
    
    addClickPercentage(percentage) {
        this.clickPercentage += percentage;
    }
    
    upgradeRecursive() {
        this.recursiveBoost *= 2;
    }
    
    // 获取建筑的总倍率
    getBuildingMultiplier(buildingId) {
        return (this.buildingMultipliers[buildingId] || 1)
            * this.globalMultiplier
            * this.getAlarmSynergyMultiplier(buildingId);
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

    // 闹钟联动倍率：若已解锁对应目标，则每个闹钟提供+1%产量（乘法）
    getAlarmSynergyMultiplier(buildingId) {
        if (!this.alarmSynergyTargets[buildingId]) return 1;
        const alarmCount = window.buildingsManager ? window.buildingsManager.getBuildingCount('alarm_clock') : 0;
        if (!alarmCount) return 1;
        return 1 + 0.01 * alarmCount;
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
            recursiveBoost: this.recursiveBoost,
            alarmSynergyTargets: this.alarmSynergyTargets
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
        this.alarmSynergyTargets = data.alarmSynergyTargets || {};
        
        this.renderUpgrades();
    }

    // 自动生成全局升级：价格从1K起，每次×2；按序号mod 10决定倍率
    generateGlobalTieredUpgrades() {
        const startCost = 1000;
        const maxTiers = 120; // 可调整：生成120级
        for (let i = 0; i < maxTiers; i++) {
            const id = `global_tier_${i}`;
            if (this.upgrades.some(u => u.id === id)) continue;
            const cost = Math.floor(startCost * Math.pow(2, i));
            const mod = i % 10;
            let factor;
            if (mod === 0) factor = 1.10; // 约等于1K,1M,1B,1T节点
            else if (mod === 5) factor = 1.05;
            else if (mod === 2 || mod === 4 || mod === 6 || mod === 8) factor = 1.03;
            else factor = 1.02; // 1,3,7,9
            const name = this.getGlobalUpgradeName(i, factor, cost);
            this.upgrades.push({
                id,
                name,
                description: `所有建筑的产量×${factor.toFixed(2)}`,
                cost,
                effect: () => this.addGlobalMultiplier(factor - 1),
                purchased: false,
                type: 'global'
            });
        }
    }

    getGlobalUpgradeName(index, factor, cost) {
        const labels = {
            '1.10': '临界跃迁',
            '1.05': '相位进位',
            '1.03': '谐波整流',
            '1.02': '噪声抑制'
        };
        const key = factor.toFixed(2);
        const tag = labels[key] || '全局优化';
        return `${tag} · x${key}`;
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
