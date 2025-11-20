import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  price: z.coerce.number().positive('Preço deve ser maior que zero').max(99999.99, 'Preço muito alto'),
  stock: z.coerce.number().int('Estoque deve ser um número inteiro').min(0, 'Estoque não pode ser negativo'),
  category: z.enum(['Pães', 'Doces', 'Salgados', 'Bolos', 'Bebidas'], {
    errorMap: () => ({ message: 'Categoria inválida' })
  }),
  image: z.string().optional().default('🍞')
});

export type ProductFormData = z.infer<typeof productSchema>;

