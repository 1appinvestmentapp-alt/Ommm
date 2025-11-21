import { User, Plan, Transaction, Investment, Role, TransactionType, TransactionStatus } from '../types';

const KEYS = {
  USERS: 'apso_users',
  PLANS: 'apso_plans',
  TRANSACTIONS: 'apso_transactions',
  INVESTMENTS: 'apso_investments',
  CURRENT_USER: 'apso_current_user'
};

// Initial Data Seeding
const seedData = () => {
  // We force update plans to match the new requirements
  const newPlans: Plan[] = [
    { id: 'p1', name: 'PLAN A', cost: 590, dailyReturn: 80, durationDays: 45, description: 'Starter Income Plan' },
    { id: 'p2', name: 'PLAN B', cost: 2200, dailyReturn: 400, durationDays: 45, description: 'Growth Income Plan' },
    { id: 'p3', name: 'PLAN C', cost: 5500, dailyReturn: 1100, durationDays: 45, description: 'Silver Income Plan' },
    { id: 'p4', name: 'PLAN D', cost: 11000, dailyReturn: 2400, durationDays: 45, description: 'Gold Income Plan' },
    { id: 'p5', name: 'PLAN E', cost: 25000, dailyReturn: 5800, durationDays: 45, description: 'Platinum Income Plan' },
    { id: 'p6', name: 'PLAN F', cost: 50000, dailyReturn: 12500, durationDays: 45, description: 'Diamond Income Plan' },
    { id: 'p7', name: 'PLAN G', cost: 90000, dailyReturn: 25000, durationDays: 45, description: 'Executive Income Plan' },
    { id: 'p8', name: 'PLAN H', cost: 150000, dailyReturn: 45000, durationDays: 45, description: 'VIP Income Plan' },
  ];
  
  // Always update plans to ensure new structure is visible immediately
  localStorage.setItem(KEYS.PLANS, JSON.stringify(newPlans));

  if (!localStorage.getItem(KEYS.USERS)) {
    const admin: User = {
      id: 'admin1',
      fullName: 'System Admin',
      phone: '0000000000',
      password: 'admin',
      balance: 1000000,
      role: Role.ADMIN,
      joinedDate: new Date().toISOString()
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([admin]));
  }
};

seedData();

// --- Users ---
export const getUsers = (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getUserById = (id: string): User | undefined => getUsers().find(u => u.id === id);

// --- Team Logic ---
export const getTeamMembers = (userId: string) => {
  const allUsers = getUsers();
  const safeUserId = userId.trim(); // Ensure no whitespace issues
  
  // Level 1: Directly referred by userId (robust check)
  const level1 = allUsers.filter(u => u.referredBy && u.referredBy.trim() === safeUserId);
  
  // Level 2: Referred by users in Level 1
  const level1Ids = level1.map(u => u.id);
  const level2 = allUsers.filter(u => u.referredBy && level1Ids.includes(u.referredBy.trim()));
  
  // Level 3: Referred by users in Level 2
  const level2Ids = level2.map(u => u.id);
  const level3 = allUsers.filter(u => u.referredBy && level2Ids.includes(u.referredBy.trim()));

  return { 
    1: level1, 
    2: level2, 
    3: level3 
  };
};

export const getUserStats = (userId: string) => {
    const txs = getTransactions().filter(t => t.userId === userId && t.status === TransactionStatus.APPROVED);
    const totalDeposit = txs.filter(t => t.type === TransactionType.DEPOSIT).reduce((sum, t) => sum + t.amount, 0);
    const totalWithdraw = txs.filter(t => t.type === TransactionType.WITHDRAWAL).reduce((sum, t) => sum + t.amount, 0);
    return { totalDeposit, totalWithdraw };
};

// --- Plans ---
export const getPlans = (): Plan[] => JSON.parse(localStorage.getItem(KEYS.PLANS) || '[]');
export const savePlans = (plans: Plan[]) => localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));

// --- Transactions ---
export const getTransactions = (): Transaction[] => JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
export const addTransaction = (tx: Transaction) => {
  const txs = getTransactions();
  txs.unshift(tx);
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
};
export const updateTransactionStatus = (id: string, status: TransactionStatus) => {
  const txs = getTransactions();
  const txIndex = txs.findIndex(t => t.id === id);
  if (txIndex > -1) {
    txs[txIndex].status = status;
    // If approved, handle money logic
    if (status === TransactionStatus.APPROVED) {
        const tx = txs[txIndex];
        const user = getUserById(tx.userId);
        if (user) {
            if (tx.type === TransactionType.DEPOSIT) {
                user.balance += tx.amount;
            } else if (tx.type === TransactionType.WITHDRAWAL) {
                 // Balance deduction logic usually handled at request or approval. 
                 // Here we assume balance was already checked at request but deducted here for finality
                 user.balance -= tx.amount; 
            }
            saveUser(user);
        }
    }
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
  }
};

// --- Investments ---
export const getInvestments = (): Investment[] => JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || '[]');
export const addInvestment = (inv: Investment) => {
    const all = getInvestments();
    all.push(inv);
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(all));
};

// --- Auth Helper ---
export const getCurrentSession = (): User | null => {
    const stored = localStorage.getItem(KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
};

export const setSession = (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
};