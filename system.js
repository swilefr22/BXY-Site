/**
 * Free Fire Priv System
 * Sistema de gerenciamento de usuários e opções
 */

class FFPrivSystem {
    constructor() {
        this.storageKey = 'ffPrivSystem';
        this.initializeSystem();
    }

    /**
     * Inicializa o sistema se não existir dados
     */
    initializeSystem() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                users: [],
                options: [
                    { id: 'color', name: 'Color Aimbot', icon: 'fas fa-palette', enabled: true },
                    { id: 'wallhack', name: 'Wallhack Visual', icon: 'fas fa-eye', enabled: true },
                    { id: 'crosshair', name: 'Precision Crosshair', icon: 'fas fa-crosshairs', enabled: true },
                    { id: 'esp', name: 'ESP System', icon: 'fas fa-shield-alt', enabled: true }
                ],
                adminSettings: {
                    adminPassword: 'admin123',
                    createdAt: new Date().toISOString()
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    /**
     * Obtém todos os dados do sistema
     */
    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    /**
     * Salva dados do sistema
     */
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    /**
     * Adiciona um novo usuário
     * @param {string} email - Email do usuário
     * @param {string} status - Status (ativo/inativo)
     * @returns {boolean} - True se adicionado com sucesso
     */
    addUser(email, status = 'ativo') {
        const data = this.getData();
        
        // Verificar se usuário já existe
        if (data.users.some(u => u.email === email)) {
            return false;
        }

        const newUser = {
            email: email,
            status: status,
            options: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastAccess: null
        };

        data.users.push(newUser);
        this.saveData(data);
        return true;
    }

    /**
     * Remove um usuário
     * @param {string} email - Email do usuário
     * @returns {boolean} - True se removido com sucesso
     */
    removeUser(email) {
        const data = this.getData();
        const index = data.users.findIndex(u => u.email === email);
        
        if (index > -1) {
            data.users.splice(index, 1);
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Obtém um usuário por email
     * @param {string} email - Email do usuário
     * @returns {object|null} - Dados do usuário ou null
     */
    getUserByEmail(email) {
        const data = this.getData();
        return data.users.find(u => u.email === email) || null;
    }

    /**
     * Obtém todos os usuários
     * @returns {array} - Array de usuários
     */
    getAllUsers() {
        const data = this.getData();
        return data.users;
    }

    /**
     * Atualiza o status de um usuário
     * @param {string} email - Email do usuário
     * @param {string} status - Novo status
     * @returns {boolean} - True se atualizado com sucesso
     */
    updateUserStatus(email, status) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email);
        
        if (user) {
            user.status = status;
            user.updatedAt = new Date().toISOString();
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Obtém as opções de um usuário
     * @param {string} email - Email do usuário
     * @returns {array} - Array com IDs das opções do usuário
     */
    getUserOptions(email) {
        const user = this.getUserByEmail(email);
        return user ? user.options : [];
    }

    /**
     * Atualiza as opções de um usuário
     * @param {string} email - Email do usuário
     * @param {array} optionIds - Array com IDs das opções
     * @returns {boolean} - True se atualizado com sucesso
     */
    updateUserOptions(email, optionIds) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email);
        
        if (user) {
            user.options = optionIds;
            user.updatedAt = new Date().toISOString();
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Adiciona uma opção a um usuário
     * @param {string} email - Email do usuário
     * @param {string} optionId - ID da opção
     * @returns {boolean} - True se adicionado com sucesso
     */
    addOptionToUser(email, optionId) {
        const user = this.getUserByEmail(email);
        if (user && !user.options.includes(optionId)) {
            user.options.push(optionId);
            this.updateUserOptions(email, user.options);
            return true;
        }
        return false;
    }

    /**
     * Remove uma opção de um usuário
     * @param {string} email - Email do usuário
     * @param {string} optionId - ID da opção
     * @returns {boolean} - True se removido com sucesso
     */
    removeOptionFromUser(email, optionId) {
        const user = this.getUserByEmail(email);
        if (user && user.options.includes(optionId)) {
            user.options = user.options.filter(o => o !== optionId);
            this.updateUserOptions(email, user.options);
            return true;
        }
        return false;
    }

    /**
     * Obtém todas as opções disponíveis
     * @returns {array} - Array de opções disponíveis
     */
    getAvailableOptions() {
        const data = this.getData();
        return data.options;
    }

    /**
     * Adiciona uma nova opção ao sistema
     * @param {object} option - Objeto com id, name, icon
     * @returns {boolean} - True se adicionado com sucesso
     */
    addOption(option) {
        const data = this.getData();
        
        if (!data.options.some(o => o.id === option.id)) {
            data.options.push({
                id: option.id,
                name: option.name,
                icon: option.icon || 'fas fa-star',
                enabled: true
            });
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Remove uma opção do sistema
     * @param {string} optionId - ID da opção
     * @returns {boolean} - True se removido com sucesso
     */
    removeOption(optionId) {
        const data = this.getData();
        const index = data.options.findIndex(o => o.id === optionId);
        
        if (index > -1) {
            data.options.splice(index, 1);
            // Remove também de todos os usuários
            data.users.forEach(user => {
                user.options = user.options.filter(o => o !== optionId);
            });
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Obtém uma opção pelo ID
     * @param {string} optionId - ID da opção
     * @returns {object|null} - Dados da opção ou null
     */
    getOptionById(optionId) {
        const data = this.getData();
        return data.options.find(o => o.id === optionId) || null;
    }

    /**
     * Ativa/desativa uma opção
     * @param {string} optionId - ID da opção
     * @param {boolean} enabled - Estado da opção
     * @returns {boolean} - True se atualizado com sucesso
     */
    toggleOption(optionId, enabled) {
        const data = this.getData();
        const option = data.options.find(o => o.id === optionId);
        
        if (option) {
            option.enabled = enabled;
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Registra o último acesso de um usuário
     * @param {string} email - Email do usuário
     * @returns {boolean} - True se atualizado com sucesso
     */
    recordUserAccess(email) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email);
        
        if (user) {
            user.lastAccess = new Date().toISOString();
            this.saveData(data);
            return true;
        }
        return false;
    }

    /**
     * Obtém estatísticas do sistema
     * @returns {object} - Objeto com estatísticas
     */
    getStats() {
        const data = this.getData();
        const totalUsers = data.users.length;
        const activeUsers = data.users.filter(u => u.status === 'ativo').length;
        const inactiveUsers = data.users.filter(u => u.status === 'inativo').length;
        const totalOptions = data.options.length;
        const enabledOptions = data.options.filter(o => o.enabled).length;

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalOptions,
            enabledOptions,
            averageOptionsPerUser: totalUsers > 0 
                ? (data.users.reduce((sum, u) => sum + u.options.length, 0) / totalUsers).toFixed(2)
                : 0
        };
    }

    /**
     * Exporta dados do sistema (para backup)
     * @returns {string} - JSON com todos os dados
     */
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    }

    /**
     * Importa dados do sistema (restaura backup)
     * @param {string} jsonData - JSON com dados
     * @returns {boolean} - True se importado com sucesso
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validar estrutura
            if (!data.users || !Array.isArray(data.users) || 
                !data.options || !Array.isArray(data.options)) {
                return false;
            }

            this.saveData(data);
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }

    /**
     * Reseta o sistema (limpa todos os dados)
     * @returns {boolean} - True se resetado com sucesso
     */
    resetSystem() {
        localStorage.removeItem(this.storageKey);
        this.initializeSystem();
        return true;
    }

    /**
     * Verifica se um usuário tem acesso a uma opção específica
     * @param {string} email - Email do usuário
     * @param {string} optionId - ID da opção
     * @returns {boolean} - True se tem acesso
     */
    userHasAccess(email, optionId) {
        const user = this.getUserByEmail(email);
        if (!user || user.status === 'inativo') {
            return false;
        }
        return user.options.includes(optionId);
    }

    /**
     * Obtém um relatório de usuários com uma opção específica
     * @param {string} optionId - ID da opção
     * @returns {array} - Array de usuários com acesso à opção
     */
    getUsersWithOption(optionId) {
        const data = this.getData();
        return data.users.filter(u => u.options.includes(optionId));
    }
}

// Exportar para uso em Node.js (se aplicável)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FFPrivSystem;
}
