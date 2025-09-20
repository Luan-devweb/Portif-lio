// Funções de autenticação para gerenciar tokens e estado de login

interface TokenData {
  value: string;
  expiresAt: number;
}

// Verifica se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const tokenJson = localStorage.getItem('adminToken');
  if (!tokenJson) return false;
  
  try {
    const tokenData: TokenData = JSON.parse(tokenJson);
    // Verifica se o token expirou
    return tokenData.expiresAt > Date.now();
  } catch (error) {
    // Se houver erro ao fazer parse do JSON, remove o token inválido
    localStorage.removeItem('adminToken');
    return false;
  }
};

// Salva o token de autenticação com expiração de 1 dia
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Define a expiração para 24 horas (1 dia) a partir de agora
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  
  const tokenData: TokenData = {
    value: token,
    expiresAt
  };
  
  localStorage.setItem('adminToken', JSON.stringify(tokenData));
};

// Remove o token de autenticação (logout)
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('adminToken');
};

// Obtém o token de autenticação
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const tokenJson = localStorage.getItem('adminToken');
  if (!tokenJson) return null;
  
  try {
    const tokenData: TokenData = JSON.parse(tokenJson);
    
    // Verifica se o token expirou
    if (tokenData.expiresAt <= Date.now()) {
      // Se expirou, remove o token e retorna null
      localStorage.removeItem('adminToken');
      return null;
    }
    
    return tokenData.value;
  } catch (error) {
    // Se houver erro ao fazer parse do JSON, remove o token inválido
    localStorage.removeItem('adminToken');
    return null;
  }
};