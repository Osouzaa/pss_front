import { AxiosError } from "axios";

export function handleCadastroError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return "A requisição demorou demais. Verifique sua conexão e tente novamente.";
      }
      return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
    }

    const status = error.response.status;
    switch (status) {
      case 400:
        // Ex.: FRONT_URL não configurado / validação (class-validator)
        return "Dados inválidos. Verifique os campos e tente novamente.";

      case 409:
        // Ex.: E-mail já cadastrado
        return "Este e-mail já está cadastrado. Use outro e-mail ou faça login.";

      case 401:
        // Em cadastro normalmente não ocorre, mas pode existir se rota for protegida
        return "Você não tem autorização para realizar esta ação.";

      case 403:
        // Em cadastro geralmente não, mas se acontecer:
        return "Ação não permitida.";

      case 429:
        return "Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.";

      case 500:
        // Pode ser falha no banco, bcrypt, email SMTP etc.
        return "Erro interno ao criar a conta. Tente novamente mais tarde.";

      case 502:
      case 503:
      case 504:
        return "Serviço temporariamente indisponível. Tente novamente em instantes.";

      default:
        return "Não foi possível criar sua conta. Tente novamente.";
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
