"use client";

import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import { User, Settings } from 'lucide-react';
import { getAssetPath } from '@/lib/utils/paths';
import Button from '@/components/Button';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError('Invalid credentials');
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-orange-600 p-8 text-center">
          <div className="mx-auto w-32 h-24 flex items-center justify-center mb-4">
            <img src={getAssetPath('/logo.jpg')} alt="Logo Sonho Doce" className="h- w-auto object-contain rounded-lg border-2" />
          </div>
          <p className="text-orange-100 mt-6 text-lg">Sistema de Gestão</p>
        </div>

        <form onSubmit={handleSignIn} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="••••••••"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button variant="primary" className="w-full py-3 text-lg" type="submit">
            Entrar no Sistema
          </Button>
        </form>
      </div>
    </div>
  );
}
