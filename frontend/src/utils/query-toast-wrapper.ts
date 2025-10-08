import { toast } from "@/components/ui/use-toast"; 


interface ToastOptions {
    title?: string;
    description: string;
    variant?: "default" | "destructive";
}

// Opções para o nosso wrapper
interface RequestOptions {
    loadingMessage: string;
    successMessage: string;
    errorMessage: string;
}

/**
 * Envolve uma função assíncrona com lógica de notificação centralizada (Toast do shadcn/ui).
 * @param asyncFn A função assíncrona a ser executada.
 * @param options Mensagens e configurações do toast.
 * @returns O resultado da função assíncrona em caso de sucesso.
 */
export async function withToast<T>(
    asyncFn: () => Promise<T>,
    options: RequestOptions
): Promise<T> {
    const { loadingMessage, successMessage, errorMessage } = options;
    
    // NOTA: O Toast do shadcn não tem um estado de 'loading' com ID de atualização.
    // Usamos console.log/Toast temporário para o carregamento e disparamos o toast final.
    console.log(`[Requisição] ${loadingMessage}`);
    
    try {
        const result = await asyncFn();
        
        // Dispara o toast de SUCESSO
        toast({
            title: "Sucesso!",
            description: successMessage,
            variant: "default",
        });
        
        return result;
    } catch (error) {
        let finalErrorMessage = errorMessage;

        // Tenta extrair a mensagem de erro do corpo da resposta Axios
        if (error && (error as any).response && (error as any).response.data) {
             // Adapte esta lógica se o seu backend retornar erros em um formato diferente
             finalErrorMessage = (error as any).response.data.message || (error as any).response.data.detail || errorMessage;
        }

        // Dispara o toast de FALHA (geralmente destructive no shadcn)
        toast({
            title: "Erro na Operação",
            description: finalErrorMessage,
            variant: "destructive",
        });
        
        // Lança o erro novamente para que o useMutation/useQuery o capture
        throw error; 
    }
}