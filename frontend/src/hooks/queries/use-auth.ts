import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateMagicLink, EmailRequest, Result, register, RegisterRequest } from '@/src/api/auth/auth-requests';

export const useMagicLinkMutation = (
    setIsSubmitted: (state: boolean) => void,
    setIsLoading: (state: boolean) => void
) => {
    return useMutation({
        mutationFn: (data: EmailRequest) => generateMagicLink(data),

        onSuccess: (data: Result<void>) => {
            setIsLoading(false);

            if (data.isSuccess) {
                toast.success('Link enviado! Cheque seu email. 📧');
                setIsSubmitted(true);
            } else {
                toast.error(data.error || 'Erro desconhecido ao enviar o link.');
            }
        },

        onError: (error: Error) => {
            setIsLoading(false);
            toast.error('Ocorreu um erro na conexão. Tente novamente.');
        },
    });
};

export const useRegisterMutation = (
    setIsSuccess: (state: boolean) => void,
    setCreatedEmail: (email: string) => void
) => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),

        onMutate: (variables) => {
             setCreatedEmail(variables.emailAdmin);
        },

        onSuccess: (data: Result<any>) => {

            if (data.isSuccess) {
                toast.success('Link enviado! Cheque seu email. 📧');
                setIsSuccess(true);
            } else {
                toast.error(data.error || 'Erro desconhecido ao enviar o link.');
            }
        },

        onError: (error: Error) => {
            toast.error('Ocorreu um erro na conexão. Tente novamente.');
            console.error("Erro na mutação:", error);
        },
    });
};