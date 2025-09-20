import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Aqui você implementaria a verificação real de credenciais
    // Este é apenas um exemplo simples para teste
    if (email === 'admin@example.com' && password === 'senha123') {
      return NextResponse.json({
        success: true,
        admin: {
          id: 'admin-123',
          email: email
        }
      });
    }

    // Credenciais inválidas
    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}