import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600 mb-8">Você não tem permissão para acessar esta página.</p>
        <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
